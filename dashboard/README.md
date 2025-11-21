# Proto Corp Video Dashboard

This React + Vite application visualizes 5–6 synchronized HLS streams generated from the Proto Corp RTSP feed.

## Prerequisites

- Node.js 18+
- Streaming server running (see `../streaming-server`). The app connects to `http://localhost:3001/api/streams` by default.

## Getting Started

**1. Start the streaming server:**
```bash
cd ../streaming-server
npm install
npm start
```

**2. Start the dashboard:**
```bash
cd dashboard
npm install
npm run dev
```

The dev server defaults to http://localhost:5173. The dashboard automatically fetches stream metadata from the backend API.

**Custom API endpoint:**
Create a `.env.local` file:
```
VITE_API_BASE=http://localhost:3001
```

Deploy via Vercel/Netlify by building:

```bash
npm run build
```

## Key Features

- `useHlsPlayer` hook wraps `hls.js` with low-latency options, buffer metrics, and autoplay fallbacks.
- `useSyncStore` + `SyncPulse` continuously align players to a designated clock source using drift tolerance + playbackRate nudging.
- Diagnostics panel shows per-stream drift, tolerance breaches, and clock status for troubleshooting.




