#!/bin/bash

# Quantum Video Downloader - Startup Script
# This script helps you start the video downloader application

echo "🚀 Quantum Video Downloader - Startup Script"
echo "=============================================="

# Check if Python is installed
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if yt-dlp is installed
if ! command -v yt-dlp &> /dev/null; then
    echo "⚠️  yt-dlp is not installed. Installing now..."
    $PYTHON_CMD -m pip install yt-dlp
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install yt-dlp. Please install it manually:"
        echo "   pip install yt-dlp"
        exit 1
    fi
fi

# Check if requirements.txt exists and install dependencies
if [ -f "requirements.txt" ]; then
    echo "📦 Installing Python dependencies..."
    $PYTHON_CMD -m pip install -r requirements.txt
fi

# Check if app.py exists
if [ -f "app.py" ]; then
    echo "✅ Starting Flask application..."
    echo "🌐 Open your browser and go to: http://localhost:5000"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    $PYTHON_CMD app.py
else
    echo "❌ app.py not found. Please make sure you're in the correct directory."
    exit 1
fi
