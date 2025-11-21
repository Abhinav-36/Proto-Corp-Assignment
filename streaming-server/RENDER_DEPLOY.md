# Render Deployment Guide

## ✅ Why Render?

Render is **perfect** for video streaming servers because:

1. **Long-Running Processes**: Supports continuous FFmpeg processes (unlike Netlify Functions)
2. **Persistent Storage**: Can store HLS segments on disk
3. **Full Control**: Complete environment control, not limited by function timeouts
4. **Easy Setup**: Simple configuration with `render.yaml`

## 🚀 Quick Start

### Option 1: Deploy via Render Dashboard (Recommended)

1. **Create a New Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your Git repository

2. **Configure Build Settings:**
   - **Name**: `proto-streaming-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `streaming-server` (if deploying from monorepo)

3. **Set Environment Variables:**
   ```
   RTSP_SOURCE=rtsp://your-source:8554/live
   STREAM_COUNT=6
   SEGMENT_DURATION=2
   PLAYLIST_SIZE=6
   CORS_ORIGIN=https://your-dashboard.onrender.com
   PORT=10000
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically install FFmpeg and deploy

### Option 2: Deploy via render.yaml (Blueprint)

1. **Push `render.yaml` to your repository**
2. **In Render Dashboard:**
   - Go to "New +" → "Blueprint"
   - Connect your repository
   - Render will detect `render.yaml` and create the service

## 📋 Environment Variables

Set these in Render Dashboard → Environment:

| Variable | Description | Example |
|----------|-------------|---------|
| `RTSP_SOURCE` | RTSP stream source URL | `rtsp://13.60.76.79:8554/live1` |
| `STREAM_COUNT` | Number of streams to create | `6` |
| `SEGMENT_DURATION` | HLS segment duration (seconds) | `2` |
| `PLAYLIST_SIZE` | Number of segments in playlist | `6` |
| `CORS_ORIGIN` | Allowed CORS origin | `https://your-dashboard.onrender.com` |
| `PORT` | Server port (Render sets this automatically) | `10000` |
| `HLS_OUTPUT_DIR` | Directory for HLS files | `./outputs` |
| `FFMPEG_PATH` | FFmpeg binary path | `ffmpeg` (default) |

## 🔧 Build Process

Render will automatically:

1. **Install Dependencies**: `npm install`
2. **Install FFmpeg**: Runs `scripts/install-ffmpeg.sh` (via `npm run build`)
3. **Start Server**: Runs `npm start`

### FFmpeg Installation

The build script (`scripts/install-ffmpeg.sh`) will:
- Check if FFmpeg is already installed
- Use `apt-get` to install FFmpeg (Render uses Ubuntu)
- Verify installation

## 📁 File Structure

```
streaming-server/
├── scripts/
│   └── install-ffmpeg.sh    # FFmpeg installation script
├── render.yaml              # Render configuration
├── .renderignore           # Files to exclude from build
├── package.json            # Node.js dependencies
└── src/                    # Application source code
```

## 🌐 Accessing Your Service

After deployment, your service will be available at:
- **URL**: `https://your-service-name.onrender.com`
- **Health Check**: `https://your-service-name.onrender.com/api/health`
- **Streams API**: `https://your-service-name.onrender.com/api/streams`

## 🔄 Continuous Deployment

Render automatically deploys when you push to:
- `main` branch (production)
- Any branch you configure

## 💾 Persistent Storage

**Important**: Render's free tier has **ephemeral storage**. HLS segments will be lost on restart.

**Solutions:**
1. **Use Render Disk** (paid feature) for persistent storage
2. **Use external storage** (S3, Cloudflare R2) for HLS segments
3. **Stream directly** without storing segments (modify FFmpeg output)

## 🐛 Troubleshooting

### FFmpeg Not Found
- Check build logs for FFmpeg installation errors
- Verify `scripts/install-ffmpeg.sh` has execute permissions
- Check if `FFMPEG_PATH` environment variable is set correctly

### Streams Not Starting
- Check RTSP source is accessible from Render's network
- Verify environment variables are set correctly
- Check application logs in Render dashboard

### CORS Errors
- Set `CORS_ORIGIN` to your dashboard URL
- Include protocol: `https://your-dashboard.onrender.com`

### Port Issues
- Render automatically sets `PORT` environment variable
- Don't hardcode port numbers, use `process.env.PORT`

## 📊 Monitoring

Render provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory usage
- **Events**: Deployments, restarts

## 🔐 Security

1. **Environment Variables**: Never commit secrets to Git
2. **RTSP Source**: Use secure RTSP (rtsps://) if available
3. **CORS**: Restrict CORS_ORIGIN to your dashboard domain only

## 🚀 Production Tips

1. **Upgrade Plan**: Free tier has limitations, consider paid plan for production
2. **Health Checks**: Configure health check endpoint in Render
3. **Auto-Deploy**: Enable auto-deploy for seamless updates
4. **Custom Domain**: Add custom domain in Render settings

## 📝 Example Deployment

```bash
# 1. Push code to GitHub
git add .
git commit -m "Setup Render deployment"
git push origin main

# 2. In Render Dashboard:
#    - Create new Web Service
#    - Connect repository
#    - Set environment variables
#    - Deploy

# 3. Service will be live at:
#    https://your-service.onrender.com
```

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Render Web Services](https://render.com/docs/web-services)
- [Environment Variables](https://render.com/docs/environment-variables)


