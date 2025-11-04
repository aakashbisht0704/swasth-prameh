# Complete Docker Deployment Guide for Hostinger VPS

This guide will help you set up your SwasthPrameh application on Hostinger VPS using Docker.

## Prerequisites

- Hostinger VPS with Ubuntu 20.04+ (or similar Linux distribution)
- SSH access to your VPS
- Domain name pointed to your VPS IP (swasthprameh.com)
- Basic terminal/SSH knowledge

---

## Step 1: Initial VPS Setup

### 1.1 Connect to Your VPS

```bash
ssh root@your-vps-ip
# or
ssh username@your-vps-ip
```

### 1.2 Update System Packages

```bash
# Update package list
sudo apt update

# Upgrade existing packages
sudo apt upgrade -y
```

### 1.3 Install Essential Tools

```bash
# Install Git (for cloning repository)
sudo apt install git -y

# Install curl and wget (useful tools)
sudo apt install curl wget -y

# Install text editors (optional but helpful)
sudo apt install nano vim -y
```

---

## Step 2: Install Docker

### 2.1 Install Docker Engine

```bash
# Remove old versions if any
sudo apt-get remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 2.2 Start Docker Service

```bash
# Start Docker service
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Check Docker status
sudo systemctl status docker
```

### 2.3 Add User to Docker Group (Optional)

```bash
# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Apply the changes (or logout and login again)
newgrp docker

# Verify you can run docker without sudo
docker ps
```

---

## Step 3: Install Node.js and npm (For Building Locally - Optional)

**Note:** Docker will handle Node.js in containers, but you might need it for local development or scripts.

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

## Step 4: Clone Your Repository

### 4.1 Navigate to a Suitable Directory

```bash
# Create a directory for your projects (or use existing)
mkdir -p ~/projects
cd ~/projects

# Or use /opt for system-wide applications
# sudo mkdir -p /opt/swasthprameh
# cd /opt/swasthprameh
```

### 4.2 Clone the Repository

```bash
# Clone your repository
git clone https://github.com/your-username/swasth-prameh.git
# or if using SSH
# git clone git@github.com:your-username/swasth-prameh.git

# Navigate to project directory
cd swasth-prameh
```

### 4.3 Verify Files

```bash
# List files
ls -la

# Check if docker-compose.yml exists
ls -la docker-compose.yml
```

---

## Step 5: Set Up Environment Variables

### 5.1 Create .env File

```bash
# Copy the example file
cp env.example .env

# Edit the .env file
nano .env
# or
vim .env
```

### 5.2 Fill in Your Environment Variables

Edit the `.env` file with your production values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gdcfuasdaaveskiscqfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# Groq API Configuration
GROQ_API_KEY=your-actual-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant

# Application Configuration
NODE_ENV=production
PORT=3000
ML_PORT=8002

# Site URL for OAuth
NEXT_PUBLIC_SITE_URL=https://swasthprameh.com
```

**Save and exit:**
- Nano: Press `Ctrl+X`, then `Y`, then `Enter`
- Vim: Press `Esc`, type `:wq`, then `Enter`

### 5.3 Verify .env File

```bash
# Check if .env file exists and has content
cat .env | grep -v "^#" | grep -v "^$"
```

---

## Step 6: Set Up Nginx Configuration

### 6.1 Check Nginx Configuration Files

```bash
# Verify nginx directory exists
ls -la nginx/

# Check nginx config files
ls -la nginx/conf.d/
```

### 6.2 Update Nginx Configuration (if needed)

The nginx configuration should already be in your repo. If you need to modify it:

```bash
# Edit nginx config
nano nginx/conf.d/default.conf
```

Make sure it's configured for your domain and ports.

---

## Step 7: Build and Start Docker Containers

### 7.1 Build Docker Images

```bash
# Build all images (this will take a few minutes)
docker compose build

# Or build specific services
docker compose build web
docker compose build ml
```

### 7.2 Start Services

```bash
# Start all services in detached mode (background)
docker compose up -d

# Or start with logs visible
docker compose up
```

### 7.3 Check Container Status

```bash
# Check running containers
docker compose ps

# Check all containers (including stopped)
docker compose ps -a

# Check container logs
docker compose logs

# Check logs for specific service
docker compose logs web
docker compose logs ml
docker compose logs nginx

# Follow logs in real-time
docker compose logs -f
```

---

## Step 8: Verify Services Are Running

### 8.1 Check Container Health

```bash
# Check if containers are healthy
docker compose ps

# You should see:
# - web: running, healthy
# - ml: running, healthy
# - nginx: running
```

### 8.2 Test Services Locally

```bash
# Test Next.js app (should respond on port 3000)
curl http://localhost:3000

# Test LLM server (should respond on port 8002)
curl http://localhost:8002/health

# Test from your local machine
curl http://your-vps-ip:3000
```

---

## Step 9: Configure Nginx and SSL

### 9.1 Set Up Nginx (if not using Docker nginx)

If you want to use system nginx instead of Docker nginx:

```bash
# Install Nginx
sudo apt install nginx -y

# Create nginx config
sudo nano /etc/nginx/sites-available/swasthprameh
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name swasthprameh.com www.swasthprameh.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # LLM API endpoint
    location /api/llm/ {
        proxy_pass http://localhost:8002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/swasthprameh /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 9.2 Install SSL Certificate with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d swasthprameh.com -d www.swasthprameh.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

# Test automatic renewal
sudo certbot renew --dry-run
```

---

## Step 10: Configure Firewall

### 10.1 Set Up UFW (Uncomplicated Firewall)

```bash
# Install UFW if not installed
sudo apt install ufw -y

# Allow SSH (important - don't lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

**Note:** If using Docker nginx, ports 80 and 443 are already exposed. If using system nginx, you need these ports open.

---

## Step 11: Verify Everything Works

### 11.1 Test Your Application

1. **Open browser and visit:** `https://swasthprameh.com`
2. **Test OAuth:** Try Google sign-in
3. **Test API:** Check if LLM endpoints work

### 11.2 Check Logs

```bash
# View all logs
docker compose logs

# View specific service logs
docker compose logs web
docker compose logs ml
docker compose logs nginx

# Follow logs in real-time
docker compose logs -f web
```

---

## Common Docker Commands

### Start/Stop Services

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v

# Restart specific service
docker compose restart web
docker compose restart ml

# Restart all services
docker compose restart
```

### View Logs

```bash
# View all logs
docker compose logs

# View logs for specific service
docker compose logs web
docker compose logs ml

# Follow logs (real-time)
docker compose logs -f

# View last 100 lines
docker compose logs --tail=100
```

### Rebuild After Code Changes

```bash
# Stop services
docker compose down

# Rebuild images
docker compose build

# Start services
docker compose up -d

# Or all in one command
docker compose up -d --build
```

### Check Resource Usage

```bash
# View container resource usage
docker stats

# View disk usage
docker system df

# Clean up unused images/containers
docker system prune -a
```

---

## Troubleshooting

### Issue: Containers won't start

```bash
# Check logs
docker compose logs

# Check if ports are already in use
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8002

# Check Docker status
sudo systemctl status docker
```

### Issue: Build fails

```bash
# Clean build (no cache)
docker compose build --no-cache

# Check if .env file exists
ls -la .env

# Verify environment variables
docker compose config
```

### Issue: Can't access from browser

```bash
# Check if containers are running
docker compose ps

# Check if ports are exposed
docker compose ps

# Test locally on server
curl http://localhost:3000

# Check firewall
sudo ufw status

# Check nginx logs
docker compose logs nginx
```

### Issue: SSL certificate issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test nginx config
sudo nginx -t
```

---

## Updating Your Application

### Pull Latest Code

```bash
# Navigate to project directory
cd ~/projects/swasth-prameh

# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose down
docker compose build
docker compose up -d

# Check logs
docker compose logs -f
```

### Quick Update Script

Create a script for easier updates:

```bash
# Create update script
nano ~/update-app.sh
```

Add this content:

```bash
#!/bin/bash
cd ~/projects/swasth-prameh
git pull origin main
docker compose down
docker compose build
docker compose up -d
docker compose logs -f
```

```bash
# Make executable
chmod +x ~/update-app.sh

# Run update
~/update-app.sh
```

---

## Backup and Maintenance

### Backup Environment Variables

```bash
# Backup .env file
cp .env .env.backup
```

### Backup Docker Volumes (if any)

```bash
# List volumes
docker volume ls

# Backup volume
docker run --rm -v volume_name:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

### Regular Maintenance

```bash
# Clean up unused Docker resources
docker system prune -a

# Update Docker images
docker compose pull

# Restart services weekly (optional)
docker compose restart
```

---

## Useful Commands Summary

```bash
# Start everything
docker compose up -d

# Stop everything
docker compose down

# View logs
docker compose logs -f

# Rebuild after code changes
docker compose up -d --build

# Check status
docker compose ps

# Restart a service
docker compose restart web

# Clean rebuild
docker compose build --no-cache
docker compose up -d

# Update code
git pull && docker compose up -d --build
```

---

## Next Steps

1. ✅ Set up monitoring (optional)
2. ✅ Set up automatic backups (optional)
3. ✅ Configure domain DNS (A record pointing to VPS IP)
4. ✅ Test all features
5. ✅ Set up CI/CD for automatic deployments (optional)

---

## Support

If you encounter issues:

1. Check logs: `docker compose logs`
2. Check container status: `docker compose ps`
3. Verify environment variables: `cat .env`
4. Test services locally: `curl http://localhost:3000`

Good luck with your deployment! 🚀

