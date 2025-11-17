#!/bin/bash

# SwasthPrameh Auto-Deployment Script
# This script pulls latest changes and rebuilds containers

set -e  # Exit on error

echo "🚀 Starting deployment..."
echo "Timestamp: $(date)"

# Navigate to project directory
cd /root/swasth-prameh || exit 1

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Stop containers for clean rebuild
echo "🛑 Stopping containers..."
docker compose down

# Rebuild containers
echo "🔨 Rebuilding containers..."
docker compose build --no-cache web ml

# Start containers
echo "🚀 Starting containers..."
docker compose up -d

# Wait for containers to be healthy
echo "⏳ Waiting for containers to be ready..."
sleep 15

# Check container status
echo "📊 Container status:"
docker compose ps

# Test health endpoints
echo "🏥 Testing health endpoints..."
if curl -f -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Web server is healthy"
else
    echo "❌ Web server health check failed"
    exit 1
fi

if curl -f -s http://localhost:8002/health > /dev/null; then
    echo "✅ ML server is healthy"
else
    echo "❌ ML server health check failed"
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "Timestamp: $(date)"


