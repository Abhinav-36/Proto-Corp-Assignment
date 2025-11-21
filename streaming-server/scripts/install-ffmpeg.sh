#!/bin/bash
# Install FFmpeg for Render deployment
# Render uses Ubuntu-based environment

set -e

echo "🔧 Installing FFmpeg for Render..."

# Check if FFmpeg is already installed
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg is already installed"
    ffmpeg -version | head -n 1
    exit 0
fi

# Render uses Ubuntu, so we can use apt-get
echo "📦 Installing FFmpeg using apt-get..."

# Update package list (suppress output for cleaner logs)
sudo apt-get update -qq 2>/dev/null || {
    echo "⚠️  apt-get update failed, trying without sudo..."
    apt-get update -qq 2>/dev/null || true
}

# Install FFmpeg and dependencies (suppress output)
sudo apt-get install -y -qq ffmpeg 2>/dev/null || {
    echo "⚠️  Installation with sudo failed, trying without sudo..."
    apt-get install -y -qq ffmpeg 2>/dev/null || {
        echo "❌ FFmpeg installation failed. Please install manually."
        echo "   Run: sudo apt-get install -y ffmpeg"
        exit 1
    }
}

# Verify installation
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg installed successfully"
    ffmpeg -version | head -n 1
    echo "📍 FFmpeg location: $(which ffmpeg)"
else
    echo "❌ FFmpeg installation failed - binary not found in PATH"
    exit 1
fi

