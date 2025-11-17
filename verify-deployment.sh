#!/bin/bash

# Quick deployment verification script

echo "🔍 Verifying Deployment..."
echo ""

# Check if containers are running
echo "1. Container Status:"
docker compose ps
echo ""

# Check when containers were built
echo "2. Container Build Times:"
docker images | grep swasth-prameh
echo ""

# Check latest git commit
echo "3. Latest Git Commit:"
cd /root/swasth-prameh
git log -1 --oneline
echo ""

# Check if code was pulled
echo "4. Git Status:"
git status
echo ""

# Test health endpoints
echo "5. Health Checks:"
echo "Web server:"
curl -s http://localhost:3000/api/health || echo "❌ Web server not responding"
echo ""
echo "ML server:"
curl -s http://localhost:8002/health || echo "❌ ML server not responding"
echo ""

# Check container logs (last 5 lines)
echo "6. Recent Web Container Logs:"
docker compose logs web --tail 5
echo ""

# Check if Next.js is serving
echo "7. Testing Web Response:"
curl -I http://localhost:3000 2>&1 | head -5
echo ""

echo "✅ Verification complete!"


