# Proto Streaming Server

Node.js/Express backend server that converts RTSP streams to HLS format using FFmpeg.

## Prerequisites

- **Node.js** (v18 or higher)
- **FFmpeg** installed and available in PATH (or set `FFMPEG_PATH` in `.env`)

### Installing FFmpeg

**Windows:**
```powershell
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

## FOLDER STRUCTURE

## Directory Structure

```
streaming-server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── index.js         # Main configuration (env vars, paths)
│   │   └── streamConfig.js  # Stream definitions
│   │
│   ├── controllers/         # Route handlers (business logic)
│   │   ├── healthController.js  # Health check endpoints
│   │   ├── streamController.js  # Stream management endpoints
│   │   └── hlsController.js     # HLS file serving
│   │
│   ├── middlewares/         # Express middlewares
│   │   ├── cors.js          # CORS configuration
│   │   └── errorHandler.js  # Error handling & 404
│   │
│   ├── routes/              # Route definitions
│   │   ├── index.js         # Main router (mounts all routes)
│   │   ├── healthRoutes.js  # Health check routes
│   │   ├── streamRoutes.js  # Stream management routes
│   │   └── hlsRoutes.js     # HLS serving routes
│   │
│   ├── utils/               # Utility functions
│   │   └── ffmpegManager.js # FFmpeg process management
│   │
│   └── server.js            # Main server file (entry point)
│
├── outputs/                 # HLS output directory (generated)
├── package.json
├── .env.example
└── README.md
```



## Installation

```bash
cd streaming-server
npm install
```

## Configuration

1. Copy `.env.template` to `.env`:
```bash
cp .env.template .env
```

2. Edit `.env` with your settings:
```env
RTSP_SOURCE=rtsp://13.60.76.79:8554/live
PORT=3001
STREAM_COUNT=6
CORS_ORIGIN=http://localhost:5173
FFMPEG_PATH=ffmpeg  # Optional: Full path to ffmpeg.exe if not in PATH
```

## Running

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will:
- Start on `http://localhost:3001` (or your configured PORT)
- Automatically start all configured streams
- Convert RTSP to HLS in real-time
- Serve HLS playlists and segments via HTTP

## API Endpoints

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-21T20:00:00.000Z",
  "streams": ["cam-master", "cam-alpha", ...]
}
```

### `GET /api/streams`
Get list of available streams with their HLS playlist URLs.

**Response:**
```json
[
  {
    "id": "cam-master",
    "name": "Master Feed",
    "playlist": "http://localhost:3001/api/hls/cam-master/index.m3u8"
  },
  ...
]
```

### `GET /api/hls/:streamId/:filename`
Serve HLS playlists (`.m3u8`) and segments (`.ts`).

**Example:**
- `GET /api/hls/cam-master/index.m3u8` - Get playlist
- `GET /api/hls/cam-master/segment_000.ts` - Get segment

### `POST /api/streams/:streamId/start`
Start a specific stream.

### `POST /api/streams/:streamId/stop`
Stop a specific stream.

### `POST /api/streams/start-all`
Start all streams.

### `POST /api/streams/stop-all`
Stop all streams.

## How It Works

1. **RTSP Input**: The server connects to the RTSP source stream.
2. **FFmpeg Conversion**: Multiple FFmpeg processes convert the RTSP stream to HLS format.
3. **HLS Output**: Each stream generates:
   - `index.m3u8` - Playlist file
   - `segment_000.ts`, `segment_001.ts`, ... - Video segments
4. **HTTP Serving**: Express serves the HLS files with proper CORS headers.

## Stream Configuration

The server creates multiple HLS streams from a single RTSP source by:
- Spawning separate FFmpeg processes for each stream
- Each process reads from the same RTSP source
- Outputs to separate directories (`outputs/cam-master/`, `outputs/cam-alpha/`, etc.)

## Troubleshooting

### FFmpeg not found
Ensure FFmpeg is installed and available in your PATH:
```bash
ffmpeg -version
```

### RTSP connection failed
- Verify the RTSP URL is accessible
- Check network connectivity
- Ensure RTSP server is running

### No segments generated
- Check FFmpeg logs in console
- Verify output directory permissions
- Ensure RTSP stream is active

### CORS errors
Update `CORS_ORIGIN` in `.env` to match your frontend URL.

