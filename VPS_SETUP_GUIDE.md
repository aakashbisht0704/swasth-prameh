# VPS Setup Guide for SwasthPrameh

This guide will help you deploy SwasthPrameh on an Ubuntu 22+ VPS with Docker, Nginx, and SSL certificates.

## Prerequisites

- Ubuntu 22.04 LTS VPS (2GB RAM minimum, 4GB+ recommended)
- Domain name pointed to your VPS IP address
- SSH access to your VPS

## Step 1: Initial Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Create Non-Root User (Optional but Recommended)
```bash
sudo adduser swasth
sudo usermod -aG sudo swasth
su - swasth
```

### 1.3 Configure Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Step 2: Install Docker and Docker Compose

### 2.1 Install Docker
```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release -y

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2.2 Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2.3 Verify Installation
```bash
docker --version
docker-compose --version
```

## Step 3: Deploy SwasthPrameh

### 3.1 Clone Repository
```bash
git clone <your-repository-url> swasth-prameh
cd swasth-prameh
```

### 3.2 Configure Environment Variables
```bash
cp env.production.template .env.local
nano .env.local
```

Update the following variables:
- `SUPABASE_PROJECT_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `GROQ_API_KEY`: Your Groq API key
- `NEXT_PUBLIC_ML_SERVER_URL`: `http://your-domain.com/api/ml`
- `NEXT_PUBLIC_LLM_SERVER_URL`: `http://your-domain.com/api/llm`
- `NEXT_PUBLIC_SITE_URL`: `https://your-domain.com`
- `LETSENCRYPT_EMAIL`: Your email for SSL certificates

### 3.3 Train ML Model (Required)
```bash
# Install Python dependencies
cd src/ml
pip install -r data/requirements.txt

# Train the model
python -m src.ml.train_model

# Copy the trained model to the project root
cp dosha_model.pkl ../../
cd ../../
```

### 3.4 Build and Start Services
```bash
# Build all services
docker-compose build

# Start services in background
docker-compose up -d
```

### 3.5 Check Service Status
```bash
docker-compose ps
docker-compose logs
```

## Step 4: Configure Domain and SSL

### 4.1 Point Domain to VPS
In your domain registrar (GoDaddy, Namecheap, etc.):
1. Go to DNS management
2. Create an A record:
   - Type: A
   - Name: @ (or your subdomain)
   - Value: Your VPS public IP address
   - TTL: 600 (10 minutes)

### 4.2 Install Certbot for SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 4.3 Generate SSL Certificate
```bash
# Stop nginx service first
docker-compose stop nginx

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com -m your-email@domain.com --agree-tos --non-interactive

# Copy certificates to project directory
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown -R $USER:$USER ssl/
```

### 4.4 Update Nginx Configuration for HTTPS
```bash
nano nginx.conf
```

Uncomment the HTTPS server block and update:
- `server_name your-domain.com;` with your actual domain
- Update the SSL certificate paths if needed

### 4.5 Restart Services
```bash
docker-compose up -d
```

## Step 5: Set Up Automatic SSL Renewal

### 5.1 Create Renewal Script
```bash
sudo nano /etc/cron.d/certbot-renew
```

Add the following content:
```bash
0 12 * * * root certbot renew --quiet --post-hook "cd /home/swasth/swasth-prameh && docker-compose restart nginx"
```

### 5.2 Make Script Executable
```bash
sudo chmod +x /etc/cron.d/certbot-renew
```

## Step 6: Monitor and Maintain

### 6.1 View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nextjs
docker-compose logs -f ml-server
docker-compose logs -f llm-server
docker-compose logs -f nginx
```

### 6.2 Update Services
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose build
docker-compose up -d
```

### 6.3 Backup Important Data
```bash
# Create backup script
nano backup.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "swasth-backup-$DATE.tar.gz" .env.local ssl/ src/ml/dosha_model.pkl
```

```bash
chmod +x backup.sh
```

## Step 7: Security Hardening

### 7.1 Update System Regularly
```bash
# Create update script
echo "#!/bin/bash
apt update && apt upgrade -y
docker-compose pull && docker-compose up -d" | sudo tee /usr/local/bin/update-system
sudo chmod +x /usr/local/bin/update-system
```

### 7.2 Set Up Fail2Ban (Optional)
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 7.3 Configure Automatic Security Updates
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo systemctl stop apache2  # If Apache is running
   ```

2. **Docker Permission Issues**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **SSL Certificate Issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

4. **Service Won't Start**
   ```bash
   docker-compose logs [service-name]
   docker-compose config  # Validate configuration
   ```

### Useful Commands

```bash
# Check service health
docker-compose ps
docker stats

# Restart specific service
docker-compose restart [service-name]

# View resource usage
htop
df -h
free -h

# Check network connectivity
curl -I http://your-domain.com
curl -I https://your-domain.com
```

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables: `cat .env.local`
3. Test individual services: `curl http://localhost:8001/health` (ML), `curl http://localhost:8002/health` (LLM)
4. Check firewall: `sudo ufw status`
5. Verify domain DNS: `nslookup your-domain.com`

## Next Steps

After successful deployment:
1. Test all functionality (auth, onboarding, AI features)
2. Set up monitoring (optional)
3. Configure backups
4. Set up CI/CD pipeline (optional)
5. Performance optimization based on usage
