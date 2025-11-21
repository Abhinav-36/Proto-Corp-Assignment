# Video Streaming Dashboard

## Vercel Link: https://proto-corp-assignment.vercel.app/ 
(Hosted Backend is shutting down due to limitations of free teir deployment)

End-to-end assignment that:

- Converts the RTSP feed (`rtsp://13.60.76.79:8554/live`) into multiple HLS playlists.
- Displays all playlists inside a React dashboard with drift-aware synchronization controls.

Table of Contents
- [Repository Layout](#repository-layout)
- [Streaming Server](#1-streaming-server-streaming-server)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Available HLS Playlists](#available-hls-playlists)
  - [API Endpoints](#api-endpoints)
- [React Dashboard](#2-react-dashboard-dashboard)
  - [Tech Stack](#tech-stack-1)
  - [Local Development](#local-development)
  - [Features](#features)
  - [Build & Deploy](#build--deploy)
- [Submission Checklist](#submission-checklist)

---

## Repository Layout

- `streaming-server/` — Node.js/Express backend (RTSP → HLS conversion)
- `dashboard/`        — React + Vite application (multi-view player)

---

## 1. Streaming Server (`streaming-server/`)

### Tech Stack

- Node.js + Express backend
- FFmpeg processes converting RTSP → HLS in real time
- Multiple FFmpeg instances create distinct HLS streams derived from a single RTSP source

### Prerequisites

- Node.js (v18+)
- FFmpeg installed and available in PATH

Install FFmpeg:
- Windows: `choco install ffmpeg` or download from https://ffmpeg.org
- macOS: `brew install ffmpeg`
- Linux (Debian/Ubuntu): `sudo apt-get install ffmpeg`

### Quick Start

```bash
cd streaming-server
npm install
cp .env.example .env    # Edit RTSP_SOURCE if needed
npm start               # Server starts on http://localhost:3001
```

The server will:
- Start all configured streams automatically
- Convert the RTSP feed to multiple HLS playlists in real time
- Serve playlists and segments over HTTP

### Available HLS Playlists (examples)

```
http://localhost:3001/api/hls/cam-01/index.m3u8
http://localhost:3001/api/hls/cam-02/index.m3u8
http://localhost:3001/api/hls/cam-03/index.m3u8
http://localhost:3001/api/hls/cam-04/index.m3u8
http://localhost:3001/api/hls/cam-05/index.m3u8
http://localhost:3001/api/hls/cam-06/index.m3u8
```

### API Endpoints

- `GET  /api/health` — Health check
- `GET  /api/streams` — List available streams (metadata)
- `GET  /api/hls/:streamId/:filename` — Serve HLS playlists & segments
- `POST /api/streams/:streamId/start` — Start a specific stream
- `POST /api/streams/:streamId/stop` — Stop a specific stream
- `POST /api/streams/start-all` — Start all streams
- `POST /api/streams/stop-all` — Stop all streams

See `streaming-server/README.md` for detailed server documentation and configuration options.

---

## 2. React Dashboard (`dashboard/`)

### Tech Stack

- Vite + React + TypeScript
- Tailwind CSS for layout and styling
- `hls.js` for HLS playback
- Zustand for synchronization state
- Vitest + Testing Library scaffolding

### Local Development

1. Start the streaming server:

```bash
cd streaming-server
npm install
npm start
```

2. Start the dashboard:

```bash
cd dashboard
npm install
npm run dev
```

By default the dashboard connects to the streaming server API at `http://localhost:3001/api/streams`. To override the API base URL locally:

```bash
echo "VITE_API_BASE=http://localhost:3001" > dashboard/.env.local
```

### Features

- Auto-fetches stream metadata and renders a responsive 2×3 video wall
- Sync controls:
  - Choose a master clock stream
  - Adjust drift tolerance
  - Force re-syncs
- Background `SyncPulse` that keeps players within configured tolerance
- Diagnostics panel showing per-stream drift values for quick troubleshooting

### Build & Deploy

```bash
cd dashboard
npm run build
# Deploy the contents of dist/ to Vercel/Netlify or static hosting
```

Ensure the hosted dashboard can reach your HLS URLs (CORS & HTTPS considerations).

---

