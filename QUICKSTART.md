# Quick Start Guide

## Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **FFmpeg** - Install based on your OS:
   - **Windows**: `choco install ffmpeg` or download from [ffmpeg.org](https://ffmpeg.org/download.html)
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt-get install ffmpeg`

Verify FFmpeg installation:
```bash
ffmpeg -version
```

## Step 1: Start the Streaming Server

```bash
cd streaming-server
npm install
cp .env.example .env    # Optional: edit RTSP_SOURCE if needed
npm start
```

The server will:
- Start on `http://localhost:3001`
- Automatically begin converting RTSP to HLS
- Create 6 distinct HLS streams

**Verify it's working:**
- Open `http://localhost:3001/api/health` in your browser
- You should see: `{"status":"ok","timestamp":"...","streams":[...]}`

## Step 2: Start the Dashboard

Open a **new terminal window**:

```bash
cd dashboard
npm install
npm run dev
```

The dashboard will:
- Start on `http://localhost:5173`
- Automatically fetch stream metadata from the backend
- Display all 6 video streams in a synchronized grid

## Troubleshooting

### FFmpeg not found
- Ensure FFmpeg is installed and in your PATH
- Restart your terminal after installing FFmpeg
- **Alternative**: If FFmpeg is not in PATH (e.g., in Cursor terminal), add `FFMPEG_PATH` to your `streaming-server/.env` file:
  ```env
  FFMPEG_PATH=C:\path\to\ffmpeg.exe
  ```
  The code will automatically use this path instead of searching PATH.

### RTSP connection failed
- Check that the RTSP source is accessible: `rtsp://13.60.76.79:8554/live1`
- Verify network connectivity
- Check firewall settings

### No video in dashboard
- Ensure the streaming server is running
- Check browser console for errors
- Verify CORS settings in `streaming-server/.env`

### Port already in use
- Change `PORT` in `streaming-server/.env`
- Update `VITE_API_BASE` in `dashboard/.env.local` to match
## Next Steps

- See `streaming-server/README.md` for backend API documentation
- See `dashboard/README.md` for frontend features
- See main `README.md` for deployment instructions

