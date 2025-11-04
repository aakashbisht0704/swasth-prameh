#!/bin/bash

# SwasthPrameh VPS Setup Script
# This script sets up the server environment for SwasthPrameh deployment

set -e

echo "🚀 Setting up SwasthPrameh on Hostinger VPS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo usermod -aG docker $USER
    print_status "Docker installed successfully"
else
    print_status "Docker is already installed"
fi

# Install Docker Compose (standalone)
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully"
else
    print_status "Docker Compose is already installed"
fi

# Install Certbot for SSL certificates
print_status "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Create project directory
PROJECT_DIR="/home/$USER/swasthprameh"
print_status "Creating project directory: $PROJECT_DIR"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Clone repository
print_status "Cloning SwasthPrameh repository..."
if [ ! -d ".git" ]; then
    git clone https://github.com/aakashbisht0704/swasth-prameh.git .
else
    print_status "Repository already exists, pulling latest changes..."
    git pull origin main
fi

# Create environment file
print_status "Setting up environment file..."
if [ ! -f ".env" ]; then
    cp env.example .env
    print_warning "Please edit .env file with your actual configuration values:"
    print_warning "  nano $PROJECT_DIR/.env"
    print_warning "Required variables:"
    print_warning "  - NEXT_PUBLIC_SUPABASE_URL"
    print_warning "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    print_warning "  - SUPABASE_SERVICE_ROLE_KEY"
    print_warning "  - GROQ_API_KEY"
else
    print_status "Environment file already exists"
fi

# Create SSL directory
print_status "Setting up SSL directory..."
sudo mkdir -p /etc/nginx/ssl
sudo chown $USER:$USER /etc/nginx/ssl

# Set up systemd service for auto-start
print_status "Setting up systemd service..."
sudo tee /etc/systemd/system/swasthprameh.service > /dev/null <<EOF
[Unit]
Description=SwasthPrameh Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0
User=$USER

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable swasthprameh.service

# Create restart script
print_status "Creating restart script..."
cat > restart.sh << 'EOF'
#!/bin/bash
cd /home/$USER/swasthprameh
docker-compose down
docker-compose up -d
echo "✅ SwasthPrameh restarted successfully"
EOF
chmod +x restart.sh

# Create health check script
print_status "Creating health check script..."
cat > healthcheck.sh << 'EOF'
#!/bin/bash

# Health check script for SwasthPrameh
WEB_URL="http://localhost:3000"
ML_URL="http://localhost:8002"

echo "🔍 Checking SwasthPrameh health..."

# Check web service
if curl -f -s "$WEB_URL/api/health" > /dev/null; then
    echo "✅ Web service is healthy"
    WEB_STATUS=0
else
    echo "❌ Web service is unhealthy"
    WEB_STATUS=1
fi

# Check ML service
if curl -f -s "$ML_URL/health" > /dev/null; then
    echo "✅ ML service is healthy"
    ML_STATUS=0
else
    echo "❌ ML service is unhealthy"
    ML_STATUS=1
fi

# Overall status
if [ $WEB_STATUS -eq 0 ] && [ $ML_STATUS -eq 0 ]; then
    echo "🎉 All services are healthy!"
    exit 0
else
    echo "⚠️  Some services are unhealthy"
    exit 1
fi
EOF
chmod +x healthcheck.sh

print_status "Setup completed successfully!"
print_warning "Next steps:"
print_warning "1. Edit the environment file: nano $PROJECT_DIR/.env"
print_warning "2. Configure your domain in HestiaCP"
print_warning "3. Set up SSL certificates: sudo certbot --nginx -d your-domain.com"
print_warning "4. Start the application: cd $PROJECT_DIR && docker-compose up -d"
print_warning "5. Check health: ./healthcheck.sh"

echo ""
print_status "Setup script completed! 🎉"
