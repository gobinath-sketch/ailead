# Unified Setup Script for Global Knowledge Technologies
# This script synchronizes environment variables and initializes the database.

Write-Host "Initializing Unified Environment..." -ForegroundColor Cyan

# 1. Synchronize Environment Files
Write-Host "Syncing .env files..." -ForegroundColor Yellow
Copy-Item .env backend/.env -Force
Copy-Item .env frontend/.env.local -Force

# 2. Install Root Dependencies (Concurrently)
Write-Host "Installing master dependencies..." -ForegroundColor Yellow
npm install

# 3. Backend Setup
Write-Host "Setting up Backend..." -ForegroundColor Yellow
cd backend
npm install
Write-Host "Running Database Migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name sync_master
cd ..

# 4. Frontend Setup
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
cd frontend
npm install
cd ..

Write-Host "------------------------------------------------" -ForegroundColor White
Write-Host "SETUP COMPLETE! To start your site, run:" -ForegroundColor Green
Write-Host "npm run dev" -ForegroundColor Green
Write-Host "------------------------------------------------" -ForegroundColor White
