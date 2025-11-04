#!/bin/bash

# SwasthPrameh Health Check Script
# Comprehensive health check for all services

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "🔍 SwasthPrameh Health Check"
echo "=============================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running"
    exit 1
fi

# Check if containers are running
print_status "Checking container status..."
if ! docker-compose ps | grep -q "Up"; then
    print_error "No containers are running"
    exit 1
fi

# Check web service
print_status "Checking web service (port 3000)..."
if curl -f -s "http://localhost:3000/api/health" > /dev/null; then
    print_status "✅ Web service is healthy"
    WEB_STATUS=0
else
    print_error "❌ Web service is unhealthy"
    WEB_STATUS=1
fi

# Check ML service
print_status "Checking ML service (port 8002)..."
if curl -f -s "http://localhost:8002/health" > /dev/null; then
    print_status "✅ ML service is healthy"
    ML_STATUS=0
else
    print_error "❌ ML service is unhealthy"
    ML_STATUS=1
fi

# Check Nginx (if running)
print_status "Checking Nginx (port 80)..."
if curl -f -s "http://localhost/health" > /dev/null; then
    print_status "✅ Nginx is healthy"
    NGINX_STATUS=0
else
    print_warning "⚠️  Nginx health check failed (may not be configured)"
    NGINX_STATUS=1
fi

# Check disk space
print_status "Checking disk space..."
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    print_warning "⚠️  Disk usage is high: ${DISK_USAGE}%"
else
    print_status "✅ Disk usage is normal: ${DISK_USAGE}%"
fi

# Check memory usage
print_status "Checking memory usage..."
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -gt 80 ]; then
    print_warning "⚠️  Memory usage is high: ${MEMORY_USAGE}%"
else
    print_status "✅ Memory usage is normal: ${MEMORY_USAGE}%"
fi

# Overall status
echo ""
echo "=============================="
if [ $WEB_STATUS -eq 0 ] && [ $ML_STATUS -eq 0 ]; then
    print_status "🎉 All critical services are healthy!"
    exit 0
else
    print_error "⚠️  Some services are unhealthy"
    print_status "Run 'docker-compose logs' to check logs"
    exit 1
fi
