# PowerShell script to securely set up environment variables
# This script will prompt you to enter your API keys without exposing them in the script

Write-Host "🔐 Secure API Key Setup for Retrospective AI" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Prompt for Azure DevOps PAT
Write-Host "`n1. Azure DevOps Personal Access Token (PAT)" -ForegroundColor Yellow
Write-Host "   Get your PAT from: https://dev.azure.com/[your-org]/_usersSettings/tokens" -ForegroundColor Gray
$azureDevOpsPAT = Read-Host "Enter your Azure DevOps PAT" -AsSecureString
$azureDevOpsPATPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($azureDevOpsPAT))

# Prompt for DeepSeek API Key
Write-Host "`n2. DeepSeek API Key" -ForegroundColor Yellow
Write-Host "   Get your API key from: https://platform.deepseek.com/" -ForegroundColor Gray
$deepSeekAPIKey = Read-Host "Enter your DeepSeek API Key" -AsSecureString
$deepSeekAPIKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($deepSeekAPIKey))

# Set environment variables
$env:AZURE_DEVOPS_PAT = $azureDevOpsPATPlain
$env:AZURE_DEVOPS_ORG = "ThiqahDev"
$env:AZURE_DEVOPS_API_VERSION = "7.1"
$env:AZURE_DEVOPS_BASE_URL = "https://dev.azure.com"
$env:DEEPSEEK_API_KEY = $deepSeekAPIKeyPlain
$env:DEEPSEEK_BASE_URL = "https://api.deepseek.com"
$env:PORT = "5000"

# Clear sensitive variables from memory
$azureDevOpsPATPlain = $null
$deepSeekAPIKeyPlain = $null

Write-Host "`n✅ Environment variables set successfully!" -ForegroundColor Green
Write-Host "`nCurrent configuration:" -ForegroundColor Yellow
Write-Host "AZURE_DEVOPS_ORG: $($env:AZURE_DEVOPS_ORG)" -ForegroundColor Cyan
Write-Host "AZURE_DEVOPS_API_VERSION: $($env:AZURE_DEVOPS_API_VERSION)" -ForegroundColor Cyan
Write-Host "AZURE_DEVOPS_BASE_URL: $($env:AZURE_DEVOPS_BASE_URL)" -ForegroundColor Cyan
Write-Host "PORT: $($env:PORT)" -ForegroundColor Cyan
Write-Host "AZURE_DEVOPS_PAT: [HIDDEN]" -ForegroundColor Cyan
Write-Host "DEEPSEEK_API_KEY: [HIDDEN]" -ForegroundColor Cyan

Write-Host "`n🚀 You can now start the application with: npm run dev" -ForegroundColor Green
Write-Host "`n⚠️  Note: These environment variables are only set for the current session." -ForegroundColor Yellow
Write-Host "   To set them permanently, run this script as Administrator and add:" -ForegroundColor Gray
Write-Host "   [Environment]::SetEnvironmentVariable('AZURE_DEVOPS_PAT', '[your-pat]', 'User')" -ForegroundColor Gray
Write-Host "   [Environment]::SetEnvironmentVariable('DEEPSEEK_API_KEY', '[your-key]', 'User')" -ForegroundColor Gray
