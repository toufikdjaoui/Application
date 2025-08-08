#!/bin/bash

# Mode DZ Development Startup Script

echo "🚀 Starting Mode DZ Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f backend/app/.env ]; then
    echo "📝 Creating environment file..."
    cp backend/app/.env.example backend/app/.env
fi

# Start services with Docker Compose
echo "🐳 Starting Docker containers..."
docker-compose up -d mongodb redis

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 10

# Start backend
echo "🔧 Starting FastAPI backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Start frontend
echo "⚛️  Starting React frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

npm start &
FRONTEND_PID=$!

cd ..

echo "✅ Mode DZ Development Environment Started!"
echo ""
echo "🌐 Services:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo "  - MongoDB: localhost:27017"
echo "  - Redis: localhost:6379"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker-compose down
    echo "👋 Mode DZ Development Environment Stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for processes
wait
