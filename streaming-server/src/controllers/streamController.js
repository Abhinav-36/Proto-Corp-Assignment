
import { streamConfigs } from '../config/streamConfig.js';
import { 
  startFFmpegStream, 
  stopFFmpegStream, 
  isStreamRunning,
  stopAllStreams as stopAllStreamsUtil
} from '../utils/ffmpegManager.js';

/**
 * Get list of available streams
 */
export function getStreams(req, res) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const streams = streamConfigs.map(config => ({
    id: config.id,
    name: config.name,
    playlist: `${baseUrl}/api/hls/${config.id}/index.m3u8`
  }));
  res.json(streams);
}

/**
 * Start a specific stream
 */
export function startStream(req, res) {
  const { streamId } = req.params;
  const config = streamConfigs.find(s => s.id === streamId);
  
  if (!config) {
    return res.status(404).json({ error: 'Stream not found' });
  }

  if (isStreamRunning(streamId)) {
    return res.json({ message: 'Stream already running', streamId });
  }

  startFFmpegStream(streamId);
  res.json({ message: 'Stream started', streamId });
}

/**
 * Stop a specific stream
 */
export function stopStream(req, res) {
  const { streamId } = req.params;
  
  if (!isStreamRunning(streamId)) {
    return res.json({ message: 'Stream not running', streamId });
  }

  stopFFmpegStream(streamId);
  res.json({ message: 'Stream stopped', streamId });
}

/**
 * Start all streams (synchronized - all start at the same segment boundary)
 */
export function startAllStreams(req, res) {
  // Start all streams - they will automatically synchronize to the same segment boundary
  streamConfigs.forEach(config => {
    if (!isStreamRunning(config.id)) {
      startFFmpegStream(config.id);
    }
  });
  res.json({ 
    message: 'All streams started (synchronized to segment boundary)', 
    count: streamConfigs.length 
  });
}

/**
 * Stop all streams
 */
export function stopAllStreams(req, res) {
  stopAllStreamsUtil();
  res.json({ message: 'All streams stopped' });
}
