# PowerShell script for local Windows testing
# Note: Render uses Linux, but this is for local development

Write-Host "🔧 FFmpeg Installation Script" -ForegroundColor Cyan
Write-Host ""
Write-Host "For Render deployment, FFmpeg will be installed automatically during build." -ForegroundColor Yellow
Write-Host "For local Windows development, install FFmpeg manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Using Chocolatey:" -ForegroundColor Green
Write-Host "  choco install ffmpeg" -ForegroundColor White
Write-Host ""
Write-Host "Or download from:" -ForegroundColor Green
Write-Host "  https://ffmpeg.org/download.html" -ForegroundColor White
Write-Host ""


