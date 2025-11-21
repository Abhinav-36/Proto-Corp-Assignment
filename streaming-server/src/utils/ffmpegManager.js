import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { config } from '../config/index.js';

// Store FFmpeg processes
const ffmpegProcesses = new Map();
// Store pending start callbacks for synchronization
const pendingStarts = new Map();

/**
 * Calculate the next segment boundary time
 * Returns the timestamp when the next segment should start
 */
function getNextSegmentBoundary() {
  const segmentDuration = parseFloat(config.streaming.segmentDuration);
  const now = Date.now();
  const segmentMs = segmentDuration * 1000;
  // Round up to the next segment boundary
  return Math.ceil(now / segmentMs) * segmentMs;
}

/**
 * Start FFmpeg process for a stream with synchronized segment boundaries
 */
export function startFFmpegStream(streamId) {
  // Resolve to absolute path to ensure consistent file locations
  const streamDir = resolve(config.streaming.hlsOutputDir, streamId);
  
  // Create stream directory
  if (!existsSync(streamDir)) {
    mkdirSync(streamDir, { recursive: true });
    console.log(`[${streamId}] Created output directory: ${streamDir}`);
  }

  // Use absolute paths to ensure files are written to the correct location
  const playlistPath = resolve(streamDir, 'index.m3u8');
  const segmentPattern = resolve(streamDir, 'segment_%03d.ts');

  // Calculate delay to next segment boundary for synchronization
  const nextBoundary = getNextSegmentBoundary();
  const delay = Math.max(0, nextBoundary - Date.now());
  
  console.log(`[${streamId}] Scheduling start at segment boundary (${delay}ms delay)`);

  // Store the start function to execute at the boundary
  const startAtBoundary = () => {
    console.log(`[${streamId}] Starting FFmpeg at synchronized boundary...`);

    // FFmpeg command to convert RTSP to HLS with synchronized timestamps
    const ffmpegArgs = [
      '-rtsp_transport', 'tcp',           // Use TCP for RTSP (more reliable)
      '-i', config.streaming.rtspSource,  // Input RTSP stream
      '-c:v', 'libx264',                  // Video codec
      '-c:a', 'aac',                      // Audio codec
      '-preset', 'veryfast',              // Encoding preset
      '-tune', 'zerolatency',             // Low latency tuning
      '-f', 'hls',                        // Output format
      '-hls_time', config.streaming.segmentDuration,      // Segment duration in seconds
      '-hls_list_size', config.streaming.playlistSize,    // Number of segments in playlist
      '-hls_flags', 'delete_segments+independent_segments+program_date_time', // Auto-delete old segments + timestamps
      '-hls_segment_type', 'mpegts',      // Segment type
      '-hls_segment_filename', segmentPattern, // Segment filename pattern (absolute path)
      '-start_number', '0',               // Start segment number
      '-hls_allow_cache', '0',            // Disable caching
      playlistPath                        // Output playlist (absolute path)
    ];

    console.log(`[${streamId}] Starting FFmpeg process...`);
    console.log(`[${streamId}] Output directory: ${streamDir}`);
    console.log(`[${streamId}] Playlist path: ${playlistPath}`);
    console.log(`[${streamId}] Segment pattern: ${segmentPattern}`);
    console.log(`[${streamId}] Command: ${config.streaming.ffmpegPath} ${ffmpegArgs.join(' ')}`);

    const ffmpeg = spawn(config.streaming.ffmpegPath, ffmpegArgs, {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // Log FFmpeg output
    ffmpeg.stdout.on('data', (data) => {
      console.log(`[${streamId}] FFmpeg stdout: ${data.toString().trim()}`);
    });

    ffmpeg.stderr.on('data', (data) => {
      const message = data.toString().trim();
      // FFmpeg logs to stderr, filter out non-error messages
      if (message.includes('error') || message.includes('Error') || message.includes('Failed')) {
        console.error(`[${streamId}] FFmpeg error: ${message}`);
      } else {
        console.log(`[${streamId}] FFmpeg: ${message}`);
      }
    });

    ffmpeg.on('close', (code) => {
      console.log(`[${streamId}] FFmpeg process exited with code ${code}`);
      ffmpegProcesses.delete(streamId);
      pendingStarts.delete(streamId);
      
      // Restart if not manually stopped
      if (code !== 0 && code !== null) {
        console.log(`[${streamId}] Restarting FFmpeg process in 5 seconds...`);
        setTimeout(() => startFFmpegStream(streamId), 5000);
      }
    });

    ffmpeg.on('error', (err) => {
      console.error(`[${streamId}] Failed to start FFmpeg:`, err.message);
      pendingStarts.delete(streamId);
      if (err.code === 'ENOENT') {
        console.error(`[${streamId}] FFmpeg not found. Please install FFmpeg.`);
      }
    });

    ffmpegProcesses.set(streamId, ffmpeg);
    pendingStarts.delete(streamId);
    return ffmpeg;
  };

  // Schedule the start at the next segment boundary
  if (delay > 0) {
    const timeoutId = setTimeout(startAtBoundary, delay);
    pendingStarts.set(streamId, timeoutId);
  } else {
    // Start immediately if we're already at a boundary
    startAtBoundary();
  }
}

/**
 * Stop FFmpeg process for a stream
 */
export function stopFFmpegStream(streamId) {
  // Cancel pending start if exists
  const pendingTimeout = pendingStarts.get(streamId);
  if (pendingTimeout) {
    clearTimeout(pendingTimeout);
    pendingStarts.delete(streamId);
  }

  const ffmpeg = ffmpegProcesses.get(streamId);
  if (ffmpeg) {
    console.log(`[${streamId}] Stopping FFmpeg process...`);
    ffmpeg.kill('SIGTERM');
    ffmpegProcesses.delete(streamId);
  }
}

/**
 * Get all active stream IDs
 */
export function getActiveStreams() {
  return Array.from(ffmpegProcesses.keys());
}

/**
 * Check if a stream is running
 */
export function isStreamRunning(streamId) {
  return ffmpegProcesses.has(streamId);
}

/**
 * Stop all streams
 */
export function stopAllStreams() {
  // Cancel all pending starts
  pendingStarts.forEach((timeoutId, streamId) => {
    clearTimeout(timeoutId);
    pendingStarts.delete(streamId);
  });

  ffmpegProcesses.forEach((ffmpeg, streamId) => {
    stopFFmpegStream(streamId);
  });
}

