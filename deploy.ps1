# Crowe Logic AI Deployment Script (PowerShell)
Write-Host "🚀 Deploying Crowe Logic AI to Vercel..." -ForegroundColor Green

# Check for uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  You have uncommitted changes. Please commit them first." -ForegroundColor Yellow
    exit 1
}

# Pull latest changes
Write-Host "📥 Pulling latest changes..." -ForegroundColor Cyan
git pull origin main

# Push to GitHub (triggers Vercel deployment)
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host "🔗 Check deployment status at: https://vercel.com/michaelcrowe11s-projects/cl" -ForegroundColor Blue
Write-Host "🌐 Live site will be updated at: https://cl.vercel.app" -ForegroundColor Blue 