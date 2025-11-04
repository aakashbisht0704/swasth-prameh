# Fix: Port 80 Already in Use

## Problem
Nginx container can't start because port 80 is already in use by another service (likely system Apache or Nginx).

## Solution Options

### Option 1: Stop the System Web Server (Recommended if not using it)

```bash
# Check what's using port 80
sudo netstat -tulpn | grep :80
# or
sudo lsof -i :80
# or
sudo ss -tulpn | grep :80

# If it's Apache
sudo systemctl stop apache2
sudo systemctl disable apache2

# If it's Nginx
sudo systemctl stop nginx
sudo systemctl disable nginx

# Then restart Docker containers
docker compose up -d
```

### Option 2: Use Different Ports for Docker Nginx (Temporary)

If you need to keep the system web server, you can temporarily change Docker nginx to use different ports:

1. Edit `docker-compose.yml`:
```bash
nano docker-compose.yml
```

2. Change nginx ports from:
```yaml
ports:
  - "80:80"
  - "443:443"
```

To:
```yaml
ports:
  - "8080:80"   # Access via http://your-ip:8080
  - "8443:443"  # Access via https://your-ip:8443
```

3. Rebuild:
```bash
docker compose down
docker compose up -d
```

### Option 3: Use System Nginx as Reverse Proxy (Best for Production)

Keep Docker nginx disabled and use system nginx:

1. Stop Docker nginx:
```bash
# Comment out nginx service in docker-compose.yml
# Or use this command to start only web and ml
docker compose up -d web ml
```

2. Configure system nginx to proxy to Docker containers:
```bash
sudo nano /etc/nginx/sites-available/swasthprameh
```

Add:
```nginx
server {
    listen 80;
    server_name swasthprameh.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/llm/ {
        proxy_pass http://localhost:8002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/swasthprameh /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Quick Fix Command

Most likely you just need to stop Apache/Nginx:

```bash
# Stop Apache (if installed)
sudo systemctl stop apache2 2>/dev/null
sudo systemctl disable apache2 2>/dev/null

# Stop system Nginx (if installed and not needed)
sudo systemctl stop nginx 2>/dev/null
sudo systemctl disable nginx 2>/dev/null

# Restart Docker containers
docker compose down
docker compose up -d

# Check status
docker compose ps
```

## Verify Ports Are Free

```bash
# Check what's using ports 80 and 443
sudo netstat -tulpn | grep -E ':(80|443)'

# Check Docker containers
docker compose ps
```

