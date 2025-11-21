import { existsSync, readFileSync, statSync, createReadStream } from 'fs';
import { join } from 'path';
import { config } from '../config/index.js';

/**
 * Serve HLS playlists and segments
 */
export function serveHlsFile(req, res) { 
  const { streamId, filename } = req.params;
  
  // Security: prevent directory traversal
  if (streamId.includes('..') || filename.includes('..')) {
    return res.status(400).send('Invalid path');
  }

  const filePath = join(config.streaming.hlsOutputDir, streamId, filename);

  // Check if file exists
  if (!existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  // Set appropriate headers
  if (filename.endsWith('.m3u8')) {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Read and modify playlist to use absolute URLs
    try {
      let playlist = readFileSync(filePath, 'utf8');
      const baseUrl = `https://${req.get('host')}/api/hls/${streamId}`;
      
      // Replace segment filenames with absolute URLs
      // Split into lines to process each line individually
      const lines = playlist.split('\n');
      const processedLines = lines.map(line => {
        // Skip lines that are already absolute URLs (start with http:// or https://)
        if (line.trim().startsWith('http://') || line.trim().startsWith('https://')) {
          return line;
        }
        
        // Replace segment filenames (with or without /api/hls/ prefix)
        // Match: segment_000.ts or /api/hls/streamId/segment_000.ts
        return line.replace(/(\/api\/hls\/[^\/\s]+\/)?(segment_\d+\.ts)/g, (match, prefix, segment) => {
          return `${baseUrl}/${segment}`;
        });
      });
      
      res.send(processedLines.join('\n'));
    } catch (err) {
      console.error(`Error reading playlist ${filePath}:`, err);
      res.status(500).send('Error reading playlist');
    }
  } else if (filename.endsWith('.ts')) {
    res.setHeader('Content-Type', 'video/mp2t');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Stream the segment file for better memory efficiency
    const stat = statSync(filePath);
    res.setHeader('Content-Length', stat.size);
    
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
    return;
  } else {
    res.status(400).send('Unsupported file type');
  }
}

