# Troubleshooting: Website Not Updating

## Quick Diagnostic Steps

Run these commands on your server to diagnose the issue:

```bash
# 1. Check if containers are actually running
docker compose ps

# 2. Check container logs for errors
docker compose logs web --tail 50
docker compose logs ml --tail 50

# 3. Check if the new code was pulled
cd /root/swasth-prameh
git log -1
git status

# 4. Check when containers were last rebuilt
docker images | grep swasth-prameh

# 5. Test if the app is responding
curl -I http://localhost:3000
curl http://localhost:3000/api/health
```

## Common Issues & Fixes

### Issue 1: Containers Not Rebuilt
**Symptom:** Old version still showing

**Fix:**
```bash
cd /root/swasth-prameh
docker compose down
docker compose build --no-cache web ml
docker compose up -d
```

### Issue 2: Browser Cache
**Symptom:** Changes not visible in browser

**Fix:**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Try incognito/private window
- Check in different browser

### Issue 3: Next.js Build Cache
**Symptom:** Build completes but old content shows

**Fix:**
```bash
cd /root/swasth-prameh
docker compose down
# Remove Next.js cache
docker compose run --rm web rm -rf .next
docker compose build --no-cache web
docker compose up -d
```

### Issue 4: Nginx Cache
**Symptom:** Nginx serving cached content

**Fix:**
```bash
# Restart Nginx
sudo systemctl restart nginx

# Or reload config
sudo nginx -s reload

# Check Nginx config
sudo nginx -t
```

### Issue 5: Container Using Old Image
**Symptom:** Container running but with old code

**Fix:**
```bash
# Force remove old images
docker compose down
docker rmi $(docker images | grep swasth-prameh | awk '{print $3}')

# Rebuild from scratch
docker compose build --no-cache web ml
docker compose up -d
```

### Issue 6: Code Not Pulled
**Symptom:** Git shows old commit

**Fix:**
```bash
cd /root/swasth-prameh
git fetch origin
git pull origin main
git log -1  # Verify latest commit
```

## Complete Clean Rebuild

If nothing else works, do a complete clean rebuild:

```bash
cd /root/swasth-prameh

# Stop everything
docker compose down

# Remove all containers and volumes
docker compose down -v

# Remove old images
docker rmi $(docker images | grep swasth-prameh | awk '{print $3}') 2>/dev/null || true

# Pull latest code
git pull origin main

# Rebuild everything
docker compose build --no-cache web ml

# Start fresh
docker compose up -d

# Wait and check
sleep 20
docker compose ps
curl http://localhost:3000/api/health
```

## Verify Deployment

After redeploy, verify:

```bash
# 1. Check container status
docker compose ps

# 2. Check logs for errors
docker compose logs web | tail -20

# 3. Test localhost
curl http://localhost:3000

# 4. Test public URL
curl -I https://swasthprameh.com

# 5. Check if new code is in container
docker compose exec web ls -la /app/.next 2>/dev/null || echo "Container not running"
```

## Check Build Time

To see when the container was actually built:

```bash
docker inspect swasth-prameh-web-1 | grep -i created
```

If the timestamp is old, the container wasn't rebuilt.


