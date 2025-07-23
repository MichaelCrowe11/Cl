#!/bin/bash

# Crowe Logic AI - Complete Local Setup for GCP Migration
# This script installs all prerequisites and runs the full migration

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 Crowe Logic AI - Complete GCP Migration Setup"
echo "==============================================="
echo ""

# 1. Install Google Cloud SDK
print_status "Installing Google Cloud SDK..."
if ! command -v gcloud &> /dev/null; then
    print_status "Downloading Google Cloud SDK..."
    curl https://sdk.cloud.google.com | bash
    exec -l $SHELL
    print_success "Google Cloud SDK installed"
else
    print_success "Google Cloud SDK already installed"
fi

# 2. Initialize gcloud
print_status "Initializing gcloud..."
print_warning "You will need to authenticate with your Google account"
echo ""
echo "Please follow these steps:"
echo "1. Run: gcloud auth login"
echo "2. Run: gcloud config set project crowe-logic-ai-466714"
echo "3. Enable billing if not already enabled"
echo ""
read -p "Press Enter after completing authentication steps..."

# 3. Verify authentication
print_status "Verifying authentication..."
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 >/dev/null 2>&1; then
    ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)
    print_success "Authenticated as: $ACCOUNT"
else
    print_error "Authentication failed. Please run 'gcloud auth login' first."
    exit 1
fi

# 4. Check Docker
print_status "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_warning "Docker not found. Installing Docker..."
    # For Ubuntu/Debian systems
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y docker.io
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
        print_success "Docker installed. You may need to log out and back in."
    else
        print_error "Please install Docker manually and run this script again."
        exit 1
    fi
else
    print_success "Docker is available"
fi

# 5. Install required tools
print_status "Installing additional required tools..."
if command -v apt-get &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y jq openssl curl
elif command -v yum &> /dev/null; then
    sudo yum install -y jq openssl curl
elif command -v brew &> /dev/null; then
    brew install jq openssl curl
fi

# 6. Verify project access
print_status "Verifying project access..."
PROJECT_ID="crowe-logic-ai-466714"
if gcloud projects describe $PROJECT_ID >/dev/null 2>&1; then
    print_success "Project $PROJECT_ID is accessible"
else
    print_warning "Project $PROJECT_ID not found. Attempting to create..."
    gcloud projects create $PROJECT_ID --name="Crowe Logic AI Platform"
    if [ $? -eq 0 ]; then
        print_success "Project created successfully"
    else
        print_error "Failed to create project. Please check your permissions."
        exit 1
    fi
fi

# 7. Check billing
print_status "Checking billing configuration..."
BILLING_ACCOUNTS=$(gcloud billing accounts list --format="value(name)" 2>/dev/null | wc -l)
if [ $BILLING_ACCOUNTS -gt 0 ]; then
    print_success "Billing accounts available"
    
    # Try to link billing to project
    BILLING_ACCOUNT=$(gcloud billing accounts list --format="value(name)" | head -n1)
    gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_success "Billing linked to project"
    else
        print_warning "Could not link billing automatically. Please link manually in the console."
    fi
else
    print_warning "No billing accounts found. Please set up billing in the Google Cloud Console:"
    echo "https://console.cloud.google.com/billing"
    read -p "Press Enter after setting up billing..."
fi

# 8. Run infrastructure setup
print_status "Ready to run infrastructure setup..."
print_warning "This will create GCP resources and may incur charges."
echo ""
echo "Resources to be created:"
echo "• Cloud Run service"
echo "• PostgreSQL database (db-f1-micro)"
echo "• Redis cache (1GB basic)"
echo "• Cloud Storage buckets"
echo "• IAM service accounts"
echo ""
read -p "Continue with infrastructure setup? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Running infrastructure setup..."
    ./gcp-migration/setup-gcp-infrastructure.sh
    
    if [ $? -eq 0 ]; then
        print_success "Infrastructure setup completed!"
        echo ""
        echo "🎉 Next Steps:"
        echo "1. Update your API keys:"
        echo "   gcloud secrets versions add openai-api-key --data-file=<(echo -n 'your-key')"
        echo "   gcloud secrets versions add anthropic-api-key --data-file=<(echo -n 'your-key')"
        echo ""
        echo "2. Deploy your application:"
        echo "   ./gcp-migration/deploy-to-gcp.sh"
        echo ""
        echo "3. Test your deployment:"
        echo "   Open the URL provided after deployment"
        echo ""
    else
        print_error "Infrastructure setup failed. Check the logs above."
        exit 1
    fi
else
    print_status "Setup cancelled. You can run the infrastructure setup manually later:"
    echo "./gcp-migration/setup-gcp-infrastructure.sh"
fi

print_success "Setup completed! Your Crowe Logic AI platform is ready for GCP deployment! 🚀"
