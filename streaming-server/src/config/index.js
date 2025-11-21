import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
  server: {
    port: process.env.PORT || 3001,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  },
  streaming: {
    rtspSource: process.env.RTSP_SOURCE || 'rtsp://13.60.76.79:8554/live3',
    hlsOutputDir: process.env.HLS_OUTPUT_DIR || join(__dirname, '../../outputs'),
    streamCount: parseInt(process.env.STREAM_COUNT || '6', 10),
    segmentDuration: process.env.SEGMENT_DURATION || '2',
    playlistSize: process.env.PLAYLIST_SIZE || '6',
    // Use FFMPEG_PATH env var, or check for installed FFmpeg, or default to 'ffmpeg'
    ffmpegPath: process.env.FFMPEG_PATH || 'ffmpeg'
  }
};
