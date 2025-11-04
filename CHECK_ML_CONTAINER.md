# Check ML Container Status

## Quick Diagnostic Commands

Run these on your VPS:

```bash
# Check if ML container is running
docker compose ps

# Check ML container logs
docker compose logs ml

# Check last 50 lines of ML logs
docker compose logs ml --tail=50

# Check if container is restarting
docker ps -a | grep ml
```

## Common Issues

### Issue 1: Container Not Running
If container shows as "Exited" or "Restarting":

```bash
# Check logs to see why it crashed
docker compose logs ml

# Restart the container
docker compose restart ml

# Check logs again
docker compose logs ml -f
```

### Issue 2: Container Running But Port Not Accessible
If container is running but port 8002 doesn't work:

```bash
# Check if port is actually listening inside container
docker compose exec ml netstat -tulpn | grep 8002

# Or check if the server started
docker compose exec ml ps aux
```

### Issue 3: Still Getting TypeScript Errors
If you still see TypeScript errors in logs:

```bash
# Rebuild ML container from scratch (no cache)
docker compose build ml --no-cache

# Start it
docker compose up -d ml

# Check logs
docker compose logs ml -f
```

## Quick Fix Commands

```bash
# Check status
docker compose ps

# If ML is not running, check logs
docker compose logs ml

# Restart ML container
docker compose restart ml

# Follow logs in real-time
docker compose logs ml -f
```

