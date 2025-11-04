# Quick Docker Commands Reference

## First Time Setup

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# 3. Install Git
sudo apt install git -y

# 4. Clone repository
git clone <your-repo-url>
cd swasth-prameh

# 5. Create .env file
cp env.example .env
nano .env  # Fill in your values

# 6. Build and start
docker compose build
docker compose up -d

# 7. Check status
docker compose ps
docker compose logs
```

## Daily Operations

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Restart a service
docker compose restart web
docker compose restart ml

# Rebuild after code changes
docker compose up -d --build
```

## Troubleshooting

```bash
# Check what's running
docker compose ps

# View logs
docker compose logs web
docker compose logs ml

# Rebuild from scratch
docker compose down
docker compose build --no-cache
docker compose up -d

# Check if ports are in use
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8002
```

## Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose down
docker compose build
docker compose up -d

# Or one-liner
git pull && docker compose down && docker compose build && docker compose up -d
```

