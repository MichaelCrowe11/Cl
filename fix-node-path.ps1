Write-Host "🔧 Fixing Node.js PATH..." -ForegroundColor Cyan

# Try to find Node.js installation
$nodePaths = @(
    "${env:ProgramFiles}\nodejs",
    "${env:ProgramFiles(x86)}\nodejs",
    "${env:LOCALAPPDATA}\Programs\nodejs"
)

$foundPath = $null
foreach ($path in $nodePaths) {
    if (Test-Path "$path\node.exe") {
        $foundPath = $path
        Write-Host "✅ Found Node.js at: $path" -ForegroundColor Green
        break
    }
}

if ($foundPath) {
    # Add to current session
    $env:Path += ";$foundPath"
    
    Write-Host ""
    Write-Host "✅ PATH updated for this session!" -ForegroundColor Green
    Write-Host ""
    
    # Test it
    $nodeVersion = & "$foundPath\node.exe" -v
    $npmVersion = & "$foundPath\npm.cmd" -v
    
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor White
    Write-Host "npm version: $npmVersion" -ForegroundColor White
    
    Write-Host ""
    Write-Host "📦 Now you can run:" -ForegroundColor Yellow
    Write-Host "   npm install" -ForegroundColor Cyan
} else {
    Write-Host "❌ Node.js not found in expected locations!" -ForegroundColor Red
    Write-Host "Please restart your computer or reinstall Node.js" -ForegroundColor Yellow
} 