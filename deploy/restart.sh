#!/bin/bash

# SwasthPrameh Restart Script
# Quick restart script for the application

set -e

echo "🔄 Restarting SwasthPrameh..."

# Navigate to project directory
cd /home/$USER/swasthprameh

# Stop containers
echo "Stopping containers..."
docker-compose down

# Start containers
echo "Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Health check
echo "Performing health check..."
if ./healthcheck.sh; then
    echo "✅ SwasthPrameh restarted successfully!"
else
    echo "❌ Health check failed. Check logs with: docker-compose logs"
    exit 1
fi
