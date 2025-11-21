# Build Scripts

## install-ffmpeg.sh

Installs FFmpeg on Render's Ubuntu-based build environment.

**Usage:**
- Automatically runs during `npm run build`
- Can be run manually: `bash scripts/install-ffmpeg.sh`

**What it does:**
1. Checks if FFmpeg is already installed
2. Updates apt package list
3. Installs FFmpeg using `apt-get`
4. Verifies installation

**Requirements:**
- Ubuntu/Debian-based system (Render uses Ubuntu)
- sudo access (available in Render build environment)

## install-ffmpeg.ps1

PowerShell script for local Windows development reference.

**Note:** Render uses Linux, so this is only for local Windows testing.


