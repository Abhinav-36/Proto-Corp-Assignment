import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { config } from './config/index.js';
import { streamConfigs } from './config/streamConfig.js';
import { corsMiddleware } from './middlewares/cors.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';
import { startFFmpegStream, stopAllStreams } from './utils/ffmpegManager.js';

const app = express();

// Ensure output directory exists
if (!existsSync(config.streaming.hlsOutputDir)) {
  mkdirSync(config.streaming.hlsOutputDir, { recursive: true });
}

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use(routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(config.server.port, () => {
  console.log(`🚀 Streaming server running on http://localhost:${config.server.port}`);
  console.log(`📡 RTSP Source: ${config.streaming.rtspSource}`);
  console.log(`📁 HLS Output: ${config.streaming.hlsOutputDir}`);
  console.log(`🎬 Streams: ${config.streaming.streamCount}`);
  console.log('\nStarting all streams...\n');
  
  // Start all streams on server start
  streamConfigs.forEach(config => {
    startFFmpegStream(config.id);
  });
});

// Graceful shutdown
function gracefulShutdown() {
  console.log('\n🛑 Shutting down gracefully...');
  stopAllStreams();
  setTimeout(() => process.exit(0), 2000);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
