# SwasthPrameh Deployment Guide

This guide explains how to deploy SwasthPrameh to a Hostinger VPS using Docker Compose and GitHub Actions.

## 📋 Prerequisites

- Hostinger VPS with Ubuntu 20.04+ 
- HestiaCP installed
- Domain name pointed to your VPS
- GitHub repository with the code
- Required API keys (Supabase, Groq)

## 🚀 Quick Start

### 1. Initial Server Setup

SSH into your VPS and run the setup script:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/aakashbisht0704/swasth-prameh/main/deploy/setup-server.sh | bash

# Or clone the repo and run manually
git clone https://github.com/aakashbisht0704/swasth-prameh.git
cd swasth-prameh
chmod +x deploy/setup-server.sh
./deploy/setup-server.sh
```

### 2. Configure Environment Variables

Edit the environment file with your actual values:

```bash
nano /home/$USER/swasthprameh/.env
```

Required variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant
```

### 3. Configure Domain in HestiaCP

1. Login to HestiaCP
2. Go to **Web** → **Add Domain**
3. Enter your domain name
4. Enable **SSL** and **Let's Encrypt**
5. Configure Nginx proxy (see Nginx Configuration section)

### 4. Start the Application

```bash
cd /home/$USER/swasthprameh
docker-compose up -d
```

### 5. Verify Deployment

```bash
# Check health
./healthcheck.sh

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

## 🔧 Configuration

### HestiaCP Nginx Configuration

Add this configuration to your domain's Nginx config in HestiaCP:

```nginx
# Proxy to Docker services
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Proxy LLM API to ML service
location /api/llm/ {
    proxy_pass http://127.0.0.1:8002/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### SSL Certificates

If not using HestiaCP's Let's Encrypt:

```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to Docker volume
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
sudo chown $USER:$USER nginx/ssl/*
```

## 🔄 GitHub Actions Setup

### Required Secrets

The workflow `.github/workflows/deploy.yml` ships with the repository and redeploys on every push to `main`. Add the following repository secrets before enabling it:

1. **VPS_HOST** – Your VPS IP address or hostname  
2. **VPS_SSH_PORT** – SSH port (default `22`)  
3. **VPS_USER** – SSH username (your Hostinger/Hestia user)  
4. **VPS_SSH_PRIVATE_KEY** – Private key with access to the VPS (format: PEM)  
5. **VPS_PROJECT_PATH** – Absolute path to the project on the server (default `/home/<user>/swasthprameh`)  
6. **VPS_REPO_URL** – Git URL to clone (default `https://github.com/aakashbisht0704/swasth-prameh.git`)
7. **SLACK_WEBHOOK_URL** *(optional)* – For custom notification steps

The key must be added to `~/.ssh/authorized_keys` on the VPS. You can reuse the same key for manual SSH access.

### SSH Key Setup

Generate SSH key pair and add to VPS:

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions"
ssh-copy-id user@your-vps-ip

# Add private key to GitHub Secrets as VPS_SSH_PRIVATE_KEY
cat ~/.ssh/id_rsa
```

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Manual health check
./healthcheck.sh

# Check container status
docker-compose ps

# View logs
docker-compose logs -f web
docker-compose logs -f ml
```

### Updates

Deployments happen automatically when you push to `main`. The GitHub Actions workflow connects to the VPS and runs `deploy/deploy.sh`, which:

1. Fetches the latest commit on `main`
2. Seeds `.env` from `deploy/env.deploy` if requested
3. Pulls fresh Docker base layers
4. Rebuilds images and restarts the stack
5. Executes `deploy/healthcheck.sh`

For manual updates:

```bash
# Pull latest changes
git pull origin main

# Restart services
./restart.sh
```

### Rollback

```bash
# Stop current containers
docker-compose down

# Checkout previous commit
git checkout HEAD~1

# Start with previous version
docker-compose up -d
```

## 🛠️ Troubleshooting

### Common Issues

1. **Services not starting**
   ```bash
   docker-compose logs
   docker-compose ps
   ```

2. **SSL certificate issues**
   ```bash
   sudo certbot renew --dry-run
   ```

3. **Port conflicts**
   ```bash
   sudo netstat -tlnp | grep :3000
   sudo netstat -tlnp | grep :8002
   ```

4. **Permission issues**
   ```bash
   sudo chown -R $USER:$USER /home/$USER/swasthprameh
   ```

### Log Locations

- Application logs: `docker-compose logs`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u swasthprameh`

## 🔒 Security

### Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

## 📞 Support

For issues and questions:
- Check logs: `docker-compose logs`
- Run health check: `./healthcheck.sh`
- Review this documentation
- Check GitHub Issues

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Domain configured in HestiaCP
- [ ] SSL certificate installed
- [ ] GitHub Actions secrets configured
- [ ] Health checks passing
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Security measures in place
