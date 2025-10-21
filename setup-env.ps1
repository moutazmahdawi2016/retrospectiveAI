# PowerShell script to set up environment variables for Azure DevOps integration
# Run this script in PowerShell as Administrator if you want to set system-wide variables

Write-Host "Setting up Azure DevOps environment variables..." -ForegroundColor Green

# IMPORTANT: Replace these placeholder values with your actual API keys
# You can get your Azure DevOps PAT from: https://dev.azure.com/[your-org]/_usersSettings/tokens
# You can get your DeepSeek API key from: https://platform.deepseek.com/

# Set environment variables for current session
$env:AZURE_DEVOPS_PAT = "YOUR_AZURE_DEVOPS_PAT_HERE"
$env:AZURE_DEVOPS_ORG = "ThiqahDev"
$env:AZURE_DEVOPS_API_VERSION = "7.1"
$env:AZURE_DEVOPS_BASE_URL = "https://dev.azure.com"
$env:DEEPSEEK_API_KEY = "YOUR_DEEPSEEK_API_KEY_HERE"
$env:DEEPSEEK_BASE_URL = "https://api.deepseek.com"
$env:PORT = "5000"

Write-Host "Environment variables set for current session:" -ForegroundColor Yellow
Write-Host "AZURE_DEVOPS_PAT: $($env:AZURE_DEVOPS_PAT)" -ForegroundColor Cyan
Write-Host "AZURE_DEVOPS_ORG: $($env:AZURE_DEVOPS_ORG)" -ForegroundColor Cyan
Write-Host "AZURE_DEVOPS_API_VERSION: $($env:AZURE_DEVOPS_API_VERSION)" -ForegroundColor Cyan
Write-Host "AZURE_DEVOPS_BASE_URL: $($env:AZURE_DEVOPS_BASE_URL)" -ForegroundColor Cyan
Write-Host "PORT: $($env:PORT)" -ForegroundColor Cyan

Write-Host "`n⚠️  IMPORTANT: You need to replace the placeholder API keys with your actual keys!" -ForegroundColor Red
Write-Host "1. Edit this script and replace 'YOUR_AZURE_DEVOPS_PAT_HERE' with your actual Azure DevOps PAT" -ForegroundColor Yellow
Write-Host "2. Replace 'YOUR_DEEPSEEK_API_KEY_HERE' with your actual DeepSeek API key" -ForegroundColor Yellow
Write-Host "3. Run this script again after updating the keys" -ForegroundColor Yellow

Write-Host "`nTo set these permanently (optional), run as Administrator:" -ForegroundColor Yellow
Write-Host "[Environment]::SetEnvironmentVariable('AZURE_DEVOPS_PAT', '$($env:AZURE_DEVOPS_PAT)', 'User')" -ForegroundColor Gray
Write-Host "[Environment]::SetEnvironmentVariable('AZURE_DEVOPS_ORG', '$($env:AZURE_DEVOPS_ORG)', 'User')" -ForegroundColor Gray
Write-Host "[Environment]::SetEnvironmentVariable('AZURE_DEVOPS_API_VERSION', '$($env:AZURE_DEVOPS_API_VERSION)', 'User')" -ForegroundColor Gray
Write-Host "[Environment]::SetEnvironmentVariable('AZURE_DEVOPS_BASE_URL', '$($env:AZURE_DEVOPS_BASE_URL)', 'User')" -ForegroundColor Gray

Write-Host "`nEnvironment setup complete! You can now start the application." -ForegroundColor Green
