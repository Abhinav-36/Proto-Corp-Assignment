# Render Deployment Setup - Summary

## ✅ Files Created

### Configuration Files
- **`render.yaml`** - Render Blueprint configuration (optional, for automated setup)
- **`.renderignore`** - Files to exclude from Render builds
- **`.gitignore`** - Updated to exclude build artifacts

### Build Scripts
- **`scripts/install-ffmpeg.sh`** - FFmpeg installation script for Render (Ubuntu)
- **`scripts/install-ffmpeg.ps1`** - PowerShell reference for Windows (local dev)

### Documentation
- **`RENDER_DEPLOY.md`** - Complete deployment guide
- **`scripts/README.md`** - Build scripts documentation

### Updated Files
- **`package.json`** - Added build scripts and Render-specific configuration
- **`src/config/index.js`** - Restored configuration with Render support
- **`src/server.js`** - Updated to use `process.env.PORT` and bind to `0.0.0.0`

## 🚀 Quick Deployment Steps

### Method 1: Render Dashboard (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select the `streaming-server` directory (if monorepo)

3. **Configure Settings**:
   ```
   Name: proto-streaming-server
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Set Environment Variables** (in Render Dashboard):
   ```
   RTSP_SOURCE=rtsp://your-source:8554/live
   STREAM_COUNT=6
   SEGMENT_DURATION=2
   PLAYLIST_SIZE=6
   CORS_ORIGIN=https://your-dashboard.onrender.com
   NODE_ENV=production
   ```

5. **Deploy**: Click "Create Web Service"

### Method 2: Using render.yaml (Blueprint)

1. **Push `render.yaml` to repository**
2. **In Render Dashboard**:
   - Click "New +" → "Blueprint"
   - Connect repository
   - Render will auto-detect and create service

## 🔧 Build Process

When Render builds your service:

1. **Installs Node.js dependencies**: `npm install`
2. **Runs build script**: `npm run build`
   - This executes `scripts/install-ffmpeg.sh`
   - Installs FFmpeg using `apt-get` (Ubuntu)
3. **Starts server**: `npm start`
   - Server binds to `0.0.0.0` and uses `process.env.PORT`

## 📋 Required Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RTSP_SOURCE` | ✅ Yes | RTSP stream URL | `rtsp://13.60.76.79:8554/live1` |
| `CORS_ORIGIN` | ✅ Yes | Dashboard URL | `https://your-dashboard.onrender.com` |
| `PORT` | ❌ No | Server port (auto-set by Render) | `10000` |
| `STREAM_COUNT` | ❌ No | Number of streams | `6` |
| `SEGMENT_DURATION` | ❌ No | HLS segment duration | `2` |
| `PLAYLIST_SIZE` | ❌ No | Playlist size | `6` |
| `FFMPEG_PATH` | ❌ No | FFmpeg binary path | `ffmpeg` |

## 🌐 Service URL

After deployment, your service will be available at:
- **Base URL**: `https://your-service-name.onrender.com`
- **Health Check**: `https://your-service-name.onrender.com/api/health`
- **Streams API**: `https://your-service-name.onrender.com/api/streams`

## ⚠️ Important Notes

### Free Tier Limitations
- **Ephemeral Storage**: HLS segments are lost on restart
- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Build Time**: Limited build time per month

### Production Recommendations
1. **Upgrade Plan**: Use paid plan for production
2. **Persistent Storage**: Use Render Disk or external storage (S3, R2)
3. **Health Checks**: Configure health check endpoint
4. **Custom Domain**: Add custom domain for production

## 🔍 Verification

After deployment, verify:

1. **Health Check**: `curl https://your-service.onrender.com/api/health`
2. **Streams List**: `curl https://your-service.onrender.com/api/streams`
3. **Check Logs**: View logs in Render dashboard for FFmpeg status

## 📚 Documentation

- **Full Guide**: See `RENDER_DEPLOY.md` for detailed instructions
- **Render Docs**: https://render.com/docs
- **Troubleshooting**: Check logs in Render dashboard

## 🎯 Next Steps

1. Deploy to Render using one of the methods above
2. Set environment variables in Render dashboard
3. Verify service is running
4. Connect your dashboard to the new API endpoint
5. Test video streaming

