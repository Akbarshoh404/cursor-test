#!/bin/bash

# PrepX Startup Script
# This script starts both the backend and frontend services

echo "🚀 Starting PrepX IELTS Preparation Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to start backend
start_backend() {
    echo "📦 Starting Backend Server..."
    cd backend
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing backend dependencies..."
        npm install
    fi
    
    # Check if database is seeded
    if [ ! -f "database/prepx.db" ]; then
        echo "🌱 Seeding database with demo data..."
        npm run seed
    fi
    
    # Start backend server
    echo "🔧 Starting backend on port 5000..."
    npm start &
    BACKEND_PID=$!
    
    # Wait for backend to start
    echo "⏳ Waiting for backend to start..."
    for i in {1..30}; do
        if check_port 5000; then
            echo "✅ Backend started successfully!"
            break
        fi
        sleep 1
    done
    
    if ! check_port 5000; then
        echo "❌ Backend failed to start on port 5000"
        exit 1
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Application..."
    cd prepx-mvp
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend server
    echo "🔧 Starting frontend on port 3000..."
    npm start &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    echo "⏳ Waiting for frontend to start..."
    for i in {1..60}; do
        if check_port 3000; then
            echo "✅ Frontend started successfully!"
            break
        fi
        sleep 1
    done
    
    if ! check_port 3000; then
        echo "❌ Frontend failed to start on port 3000"
        exit 1
    fi
    
    cd ..
}

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    # Kill any remaining processes on ports 3000 and 5000
    pkill -f "node.*3000" 2>/dev/null
    pkill -f "node.*5000" 2>/dev/null
    echo "👋 Services stopped. Goodbye!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if ports are already in use
if check_port 5000; then
    echo "⚠️  Port 5000 is already in use. Please stop the service using this port."
    exit 1
fi

if check_port 3000; then
    echo "⚠️  Port 3000 is already in use. Please stop the service using this port."
    exit 1
fi

# Start services
start_backend
start_frontend

echo ""
echo "🎉 PrepX Platform is now running!"
echo ""
echo "📋 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API:      http://localhost:5000/api"
echo "   Health:   http://localhost:5000/health"
echo ""
echo "🎯 Demo Account:"
echo "   Email:    john.doe@example.com"
echo "   Password: password123"
echo ""
echo "🔧 To stop the services, press Ctrl+C"
echo ""

# Wait for user to stop the services
wait