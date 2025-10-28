# SSL Setup Guide for SwasthPrameh

This guide covers setting up SSL certificates using Let's Encrypt for your SwasthPrameh deployment.

## Prerequisites

- Domain name pointed to your VPS
- SwasthPrameh deployed and running
- Nginx container running
- Certbot installed

## Method 1: Using Certbot with Nginx Plugin (Recommended)

### Step 1: Install Certbot with Nginx Plugin
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Generate SSL Certificate
```bash
# Generate certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com --email your-email@domain.com --agree-tos --non-interactive
```

### Step 3: Test Certificate Generation
```bash
sudo certbot renew --dry-run
```

## Method 2: Using Certbot Standalone (Alternative)

### Step 1: Stop Nginx Container
```bash
docker-compose stop nginx
```

### Step 2: Generate Certificate
```bash
sudo certbot certonly --standalone -d your-domain.com --email your-email@domain.com --agree-tos --non-interactive
```

### Step 3: Copy Certificates
```bash
# Create SSL directory in project
mkdir -p ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem

# Set proper permissions
sudo chown -R $USER:$USER ssl/
chmod 600 ssl/key.pem
chmod 644 ssl/cert.pem
```

### Step 4: Update Nginx Configuration
Edit `nginx.conf` and uncomment the HTTPS server block:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... rest of configuration
}
```

### Step 5: Restart Nginx
```bash
docker-compose up -d nginx
```

## Method 3: Using Docker with Certbot

### Step 1: Create Certbot Docker Service
Add to your `docker-compose.yml`:

```yaml
  certbot:
    image: certbot/certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - /var/lib/letsencrypt:/var/lib/letsencrypt
    command: certonly --webroot --webroot-path=/var/www/certbot --email your-email@domain.com --agree-tos --no-eff-email -d your-domain.com
```

### Step 2: Update Nginx Configuration for Webroot
Add to nginx server block:

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/certbot;
}
```

### Step 3: Generate Certificate
```bash
docker-compose run --rm certbot
```

## Automatic Certificate Renewal

### Method 1: Cron Job (Recommended)
```bash
# Create renewal script
sudo nano /etc/cron.d/certbot-renew
```

Add:
```bash
0 12 * * * root certbot renew --quiet --post-hook "cd /home/swasth/swasth-prameh && docker-compose restart nginx"
```

### Method 2: Docker Cron Job
Create `renew-certs.sh`:
```bash
#!/bin/bash
cd /home/swasth/swasth-prameh
docker-compose run --rm certbot renew
docker-compose restart nginx
```

Add to crontab:
```bash
0 12 * * * /home/swasth/swasth-prameh/renew-certs.sh
```

### Method 3: Using Docker Compose with Renewal
Add to `docker-compose.yml`:

```yaml
  certbot-renew:
    image: certbot/certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - /var/lib/letsencrypt:/var/lib/letsencrypt
    command: renew
    depends_on:
      - nginx
```

## SSL Configuration Best Practices

### 1. Update Nginx SSL Configuration
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# Security headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
```

### 2. HTTP to HTTPS Redirect
Add to HTTP server block:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. SSL Test
Test your SSL configuration:
```bash
# Online test
curl -I https://your-domain.com

# SSL Labs test (visit in browser)
# https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
```

## Troubleshooting SSL Issues

### Common Issues

1. **Certificate Not Found**
   ```bash
   sudo certbot certificates
   ls -la /etc/letsencrypt/live/your-domain.com/
   ```

2. **Permission Issues**
   ```bash
   sudo chown -R $USER:$USER ssl/
   chmod 600 ssl/key.pem
   chmod 644 ssl/cert.pem
   ```

3. **Nginx Can't Find Certificates**
   ```bash
   # Check certificate paths in nginx.conf
   # Ensure certificates exist
   ls -la ssl/
   ```

4. **Domain Not Pointing to Server**
   ```bash
   nslookup your-domain.com
   dig your-domain.com
   ```

5. **Port 80/443 Not Open**
   ```bash
   sudo ufw status
   sudo ufw allow 80
   sudo ufw allow 443
   ```

### Debug Commands

```bash
# Check certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Test SSL connection
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Check certificate expiration
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Check nginx configuration
docker-compose exec nginx nginx -t

# View nginx logs
docker-compose logs nginx
```

## Force HTTPS Redirect

### Update Nginx Configuration
```nginx
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... rest of configuration
}
```

### Update Next.js Configuration
Add to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  // Force HTTPS in production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ]
  }
}
```

## Monitoring SSL Certificates

### Check Certificate Expiration
```bash
# Check all certificates
sudo certbot certificates

# Check specific certificate
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Set Up Monitoring Script
Create `check-ssl.sh`:
```bash
#!/bin/bash
DOMAIN="your-domain.com"
DAYS=30

expiry_date=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
expiry_epoch=$(date -d "$expiry_date" +%s)
current_epoch=$(date +%s)
days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))

if [ $days_until_expiry -lt $DAYS ]; then
    echo "SSL certificate for $DOMAIN expires in $days_until_expiry days!"
    # Add notification logic here (email, Slack, etc.)
fi
```

## Security Considerations

1. **Use Strong Ciphers**: Always use TLS 1.2+ and strong cipher suites
2. **Enable HSTS**: Include Strict-Transport-Security headers
3. **Regular Updates**: Keep certificates renewed and updated
4. **Monitor Expiration**: Set up alerts for certificate expiration
5. **Backup Certificates**: Keep backups of your certificates and keys

## Next Steps

After SSL setup:
1. Test all HTTPS endpoints
2. Update all internal links to use HTTPS
3. Set up certificate monitoring
4. Configure security headers
5. Test SSL rating on SSL Labs
