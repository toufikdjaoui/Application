@echo off
REM Mode DZ Development Startup Script for Windows

echo 🚀 Starting Mode DZ Development Environment...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Create environment file if it doesn't exist
if not exist "backend\app\.env" (
    echo 📝 Creating environment file...
    copy "backend\app\.env.example" "backend\app\.env"
)

REM Start services with Docker Compose
echo 🐳 Starting Docker containers...
docker-compose up -d mongodb redis

REM Wait for MongoDB to be ready
echo ⏳ Waiting for MongoDB to be ready...
timeout /t 10 /nobreak >nul

REM Start backend
echo 🔧 Starting FastAPI backend...
cd backend

if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and start backend
call venv\Scripts\activate.bat
pip install -r requirements.txt
start /b uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

cd ..

REM Start frontend
echo ⚛️  Starting React frontend...
cd frontend

if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    npm install
)

start /b npm start

cd ..

echo ✅ Mode DZ Development Environment Started!
echo.
echo 🌐 Services:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo   - MongoDB: localhost:27017
echo   - Redis: localhost:6379
echo.
echo Press any key to stop all services...
pause >nul

REM Cleanup
echo.
echo 🛑 Stopping services...
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul
docker-compose down
echo 👋 Mode DZ Development Environment Stopped
pause
