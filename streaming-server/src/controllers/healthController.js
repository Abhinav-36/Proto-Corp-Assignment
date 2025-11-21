import { getActiveStreams } from '../utils/ffmpegManager.js';

/**
 * Health check endpoint
 */
export function getHealth(req, res) {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    streams: getActiveStreams()
  });
}



