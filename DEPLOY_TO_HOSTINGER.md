# Deploy SwasthPrameh to Hostinger VPS

This guide provides step-by-step instructions to deploy SwasthPrameh to your Hostinger VPS.

## 🚀 Quick Deployment Checklist

### Prerequisites
- [ ] Hostinger VPS with Ubuntu 20.04+
- [ ] HestiaCP installed and configured
- [ ] Domain name pointed to your VPS
- [ ] Supabase project created
- [ ] Groq API key obtained

### Step 1: Initial Server Setup

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Run the automated setup script
curl -fsSL https://raw.githubusercontent.com/aakashbisht0704/swasth-prameh/main/deploy/setup-server.sh | bash
```

### Step 2: Configure Environment

```bash
# Edit environment variables
nano /home/$USER/swasthprameh/.env

# Required variables:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant
```

### Step 3: Configure Domain in HestiaCP

1. **Login to HestiaCP** → **Web** → **Add Domain**
2. **Enter your domain** and enable SSL
3. **Add Nginx configuration**:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /api/llm/ {
    proxy_pass http://127.0.0.1:8002/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Step 4: Start Application

```bash
cd /home/$USER/swasthprameh
docker-compose up -d
```

### Step 5: Verify Deployment

```bash
# Check health
./healthcheck.sh

# View logs
docker-compose logs -f
```

## 🔄 GitHub Actions Setup

### Add Repository Secrets

1. Go to **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VPS_HOST` | `your-vps-ip` | VPS IP address |
| `VPS_USER` | `your-username` | SSH username |
| `VPS_SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | SSH private key |
| `VPS_SSH_PORT` | `22` | SSH port (optional) |

### Generate SSH Key

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copy public key to VPS
ssh-copy-id user@your-vps-ip

# Copy private key content to GitHub Secret
cat ~/.ssh/id_rsa
```

## 🛠️ Management Commands

### Daily Operations

```bash
# Check application status
docker-compose ps

# View logs
docker-compose logs -f

# Restart application
./restart.sh

# Health check
./healthcheck.sh
```

### Updates & Maintenance

```bash
# Manual update
git pull origin main
docker-compose pull
docker-compose up -d

# Rollback to previous version
git checkout HEAD~1
docker-compose up -d
```

## 🔧 Troubleshooting

### Services Not Starting
```bash
docker-compose logs
docker-compose ps
```

### SSL Issues
```bash
sudo certbot renew --dry-run
```

### Port Conflicts
```bash
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8002
```

## 📊 Monitoring

### Health Check Endpoints
- Web Service: `http://your-domain.com/api/health`
- ML Service: `http://your-domain.com/api/llm/health`

### Log Locations
- Application: `docker-compose logs`
- Nginx: `/var/log/nginx/`
- System: `journalctl -u swasthprameh`

## 🔒 Security

### Firewall Setup
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP  
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### Regular Updates
```bash
sudo apt update && sudo apt upgrade -y
docker-compose pull && docker-compose up -d
```

## 📞 Support

- **Documentation**: `deploy/README_DEPLOY.md`
- **Health Check**: `./healthcheck.sh`
- **Logs**: `docker-compose logs`
- **GitHub Issues**: Repository issues page

---

**🎉 Your SwasthPrameh application is now deployed and ready to use!**

Visit `https://your-domain.com` to access your application.
