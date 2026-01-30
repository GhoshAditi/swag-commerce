# Backend Setup Script for Windows PowerShell
# This script automates the complete backend setup process

Write-Host "🚀 Starting Backend Setup..." -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
$backendDir = "c:\Users\ADITI\port\backend"
Set-Location $backendDir
Write-Host "📁 Working directory: $backendDir" -ForegroundColor Green

# Check if virtual environment exists
if (-Not (Test-Path ".\venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Initialize database
Write-Host "🗄️  Initializing database..." -ForegroundColor Yellow
python database.py

if (Test-Path ".\swagcommerce.db") {
    Write-Host "✅ Database created successfully: swagcommerce.db" -ForegroundColor Green
} else {
    Write-Host "❌ Database creation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 Backend Setup Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Database seeded with:" -ForegroundColor White
Write-Host "   - 6 Products with tiered pricing" -ForegroundColor Gray
Write-Host "   - 4 Coupons (including test cases)" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 To start the backend server, run:" -ForegroundColor White
Write-Host "   uvicorn main:app --reload" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 API Documentation will be available at:" -ForegroundColor White
Write-Host "   http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
