# DatosX Platform - Setup Script
# This script packages the dxApp folder as a static resource

Write-Host "🚀 DatosX Platform - Static Resource Setup" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$sourceFolder = "force-app\main\default\staticresources\dxApp"
$zipFile = "force-app\main\default\staticresources\dxApp.resource"

# Check if source folder exists
if (-not (Test-Path $sourceFolder)) {
    Write-Host "❌ Error: Source folder not found: $sourceFolder" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Source folder: $sourceFolder" -ForegroundColor Yellow
Write-Host "📦 Creating zip file: $zipFile`n" -ForegroundColor Yellow

# Remove existing zip if it exists
if (Test-Path $zipFile) {
    Write-Host "🗑️  Removing existing zip file..." -ForegroundColor Gray
    Remove-Item $zipFile -Force
}

try {
    # Create the zip file
    Write-Host "⏳ Compressing files..." -ForegroundColor Gray
    Compress-Archive -Path "$sourceFolder\*" -DestinationPath $zipFile -CompressionLevel Optimal
    
    Write-Host "✅ Static resource created successfully!" -ForegroundColor Green
    Write-Host "`n📊 File Details:" -ForegroundColor Cyan
    
    $fileInfo = Get-Item $zipFile
    Write-Host "   Size: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor White
    Write-Host "   Path: $($fileInfo.FullName)" -ForegroundColor White
    
    Write-Host "`n✨ Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Deploy to Salesforce: sfdx force:source:push" -ForegroundColor White
    Write-Host "   2. Add 'DX App Container' component to your Experience Cloud page" -ForegroundColor White
    Write-Host "   3. Test login with credentials:" -ForegroundColor White
    Write-Host "      - Health System: datosx@2025" -ForegroundColor Yellow
    Write-Host "      - Sponsor: datosx@2025" -ForegroundColor Yellow
    
}
catch {
    Write-Host "❌ Error creating static resource: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Setup complete! Ready to deploy.`n" -ForegroundColor Green
