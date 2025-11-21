# Quick Start - Render Deployment

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Setup Render deployment"
git push origin main
```

### Step 2: Create Render Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select **`streaming-server`** as root directory (if monorepo)

### Step 3: Configure

**Build Settings:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Environment Variables** (Required):
```
RTSP_SOURCE=rtsp://your-source:8554/live
CORS_ORIGIN=https://your-dashboard.onrender.com
```

**Optional Variables:**
```
STREAM_COUNT=6
SEGMENT_DURATION=2
PLAYLIST_SIZE=6
```

### Step 4: Deploy

Click **"Create Web Service"** and wait for deployment.

### Step 5: Verify

1. Check health: `https://your-service.onrender.com/api/health`
2. Check streams: `https://your-service.onrender.com/api/streams`
3. View logs in Render dashboard

## ✅ Done!

Your streaming server is now live on Render.

**Service URL**: `https://your-service-name.onrender.com`

## 📝 Notes

- **Free tier**: Service sleeps after 15 min inactivity
- **Storage**: HLS segments are ephemeral (lost on restart)
- **FFmpeg**: Installs automatically during build

For production, consider upgrading to a paid plan.

