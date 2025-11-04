# Fix: ML Container TypeScript Compilation Error

## Problem
The ML container is failing because `@types/express` and `@types/cors` are not installed in the production Docker image, but `ts-node` needs them to compile TypeScript.

## Solution Applied
I've updated `docker/ml/Dockerfile` to install the required type definitions.

## Commands to Run on Your VPS

```bash
# Stop the failing containers
docker compose down

# Rebuild only the ML container (faster)
docker compose build ml

# Or rebuild everything (if you want to be sure)
docker compose build

# Start services again
docker compose up -d

# Check logs to verify it's working
docker compose logs ml -f
```

## What to Expect

After rebuilding, you should see:
- ✅ Web container: Running
- ✅ ML container: Running (no more TypeScript errors)
- ✅ Nginx container: Running

## Quick One-Liner

```bash
docker compose down && docker compose build ml && docker compose up -d
```

## Verify It's Working

```bash
# Check all containers are running
docker compose ps

# Check ML container logs (should show server starting)
docker compose logs ml

# Test ML server health endpoint
curl http://localhost:8002/health
```

If you see any errors, share the logs and I'll help fix them.

