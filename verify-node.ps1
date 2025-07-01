Write-Host "🔍 Checking Node.js Installation..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js
$nodeVersion = node -v 2>$null
if ($?) {
    Write-Host "✅ Node.js is installed!" -ForegroundColor Green
    Write-Host "   Version: $nodeVersion" -ForegroundColor White
} else {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
$npmVersion = npm -v 2>$null
if ($?) {
    Write-Host "✅ npm is installed!" -ForegroundColor Green
    Write-Host "   Version: $npmVersion" -ForegroundColor White
} else {
    Write-Host "❌ npm not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "📦 Ready to install project dependencies!" -ForegroundColor Cyan
Write-Host "   Run: npm install" -ForegroundColor Yellow 