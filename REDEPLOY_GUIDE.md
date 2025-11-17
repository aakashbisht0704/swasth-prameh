# Redeployment Guide

## Quick Redeploy Commands

### Option 1: Using the Deploy Script (Recommended)

SSH into your server and run:

```bash
# Navigate to project directory
cd /root/swasth-prameh

# Run the deployment script
./deploy.sh
```

This will:
- Pull latest changes from GitHub
- Rebuild Docker containers
- Restart services
- Run health checks

### Option 2: Manual Docker Compose Commands (Recommended)

```bash
# SSH into your server
ssh root@your-server-ip

# Navigate to project
cd /root/swasth-prameh

# Pull latest code
git pull origin main

# Stop and remove containers (clean shutdown)
docker compose down

# Rebuild containers
docker compose build --no-cache web ml

# Start containers
docker compose up -d

# Check status
docker compose ps

# View logs if needed
docker compose logs -f web
docker compose logs -f ml
```

### Option 3: Rebuild Only Web Container (Faster)

If you only changed frontend code:

```bash
cd /root/swasth-prameh
git pull origin main
docker compose stop web
docker compose build --no-cache web
docker compose up -d web
docker compose logs -f web
```

### Option 4: Restart Without Rebuild (Fastest)

If you only changed environment variables:

```bash
cd /root/swasth-prameh
git pull origin main
docker compose restart web ml
```

## Verify Deployment

After deployment, check:

```bash
# Check container status
docker compose ps

# Test health endpoints
curl http://localhost:3000/api/health
curl http://localhost:8002/health

# Check if site is accessible
curl -I https://swasthprameh.com
```

## Troubleshooting

### If containers fail to start:

```bash
# Check logs
docker compose logs web
docker compose logs ml

# Restart containers
docker compose restart

# If still failing, rebuild from scratch
docker compose down
docker compose build --no-cache
docker compose up -d
```

### If you need to clear Docker cache:

```bash
docker system prune -a --volumes
docker compose build --no-cache
docker compose up -d
```

## Environment Variables

If you changed `.env` file:

1. Update `.env` on the server
2. Restart containers:
   ```bash
   docker compose restart web ml
   ```

Note: `NEXT_PUBLIC_*` variables need a rebuild (they're baked into the Next.js build):
```bash
docker compose build --no-cache web
docker compose up -d web
```

## Quick Reference

| Action | Command |
|--------|---------|
| Full redeploy | `./deploy.sh` |
| Rebuild web only | `docker compose build --no-cache web && docker compose up -d web` |
| Restart services | `docker compose restart` |
| View logs | `docker compose logs -f` |
| Check status | `docker compose ps` |
| Pull latest code | `git pull origin main` |

