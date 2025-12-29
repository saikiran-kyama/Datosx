# Bootstrap Setup Script for Windows PowerShell

Write-Host "Bootstrap Static Resource Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$bootstrapVersion = "5.3.3"
$downloadUrl = "https://github.com/twbs/bootstrap/releases/download/v$bootstrapVersion/bootstrap-$bootstrapVersion-dist.zip"
$tempZip = "$env:TEMP\bootstrap.zip"
$tempExtract = "$env:TEMP\bootstrap-extract"
$targetDir = "$PSScriptRoot\bootstrap\bootstrap"

Write-Host "Step 1: Downloading Bootstrap v$bootstrapVersion..." -ForegroundColor Yellow

try {
    # Download Bootstrap
    Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip -UseBasicParsing
    Write-Host "✓ Download complete" -ForegroundColor Green
    
    # Extract
    Write-Host "Step 2: Extracting files..." -ForegroundColor Yellow
    if (Test-Path $tempExtract) {
        Remove-Item -Recurse -Force $tempExtract
    }
    Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force
    Write-Host "✓ Extraction complete" -ForegroundColor Green
    
    # Create target directory if it doesn't exist
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    
    # Copy required files
    Write-Host "Step 3: Copying required files..." -ForegroundColor Yellow
    $extractedBootstrap = Get-ChildItem -Path $tempExtract -Filter "bootstrap-*" -Directory | Select-Object -First 1
    
    Copy-Item -Path "$($extractedBootstrap.FullName)\dist\css\bootstrap.min.css" -Destination $targetDir -Force
    Copy-Item -Path "$($extractedBootstrap.FullName)\dist\js\bootstrap.bundle.min.js" -Destination $targetDir -Force
    
    Write-Host "✓ Files copied successfully" -ForegroundColor Green
    
    # Cleanup
    Write-Host "Step 4: Cleaning up..." -ForegroundColor Yellow
    Remove-Item -Path $tempZip -Force
    Remove-Item -Path $tempExtract -Recurse -Force
    Write-Host "✓ Cleanup complete" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "SUCCESS! Bootstrap files are ready." -ForegroundColor Green
    Write-Host ""
    Write-Host "Files installed at:" -ForegroundColor Cyan
    Write-Host "  - $targetDir\bootstrap.min.css" -ForegroundColor White
    Write-Host "  - $targetDir\bootstrap.bundle.min.js" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Deploy to Salesforce using: sf project deploy start" -ForegroundColor White
    Write-Host "  2. Test your LWC component" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual installation:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://getbootstrap.com/docs/5.3/getting-started/download/" -ForegroundColor White
    Write-Host "  2. Extract and copy bootstrap.min.css and bootstrap.bundle.min.js" -ForegroundColor White
    Write-Host "  3. Place in: $targetDir" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
