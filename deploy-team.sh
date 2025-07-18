#!/bin/bash

# 🚀 CroweOS Platform - Team Deployment Script
# This script helps deploy the platform to a new team account

set -e

echo "🚀 CroweOS Platform Team Deployment"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed. Installing pnpm..."
        npm install -g pnpm
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_status "All requirements satisfied"
}

# Get deployment platform choice
choose_platform() {
    echo ""
    echo "Choose your deployment platform:"
    echo "1) Vercel (Recommended)"
    echo "2) Netlify" 
    echo "3) Railway"
    echo "4) Manual setup only"
    
    read -p "Enter your choice (1-4): " platform_choice
    
    case $platform_choice in
        1) PLATFORM="vercel" ;;
        2) PLATFORM="netlify" ;;
        3) PLATFORM="railway" ;;
        4) PLATFORM="manual" ;;
        *) print_error "Invalid choice. Exiting."; exit 1 ;;
    esac
    
    print_status "Selected platform: $PLATFORM"
}

# Setup environment variables
setup_environment() {
    print_info "Setting up environment variables..."
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_warning ".env.local not found. Creating template..."
        cat > .env.local << EOF
# OpenAI Integration
OPENAI_API_KEY=sk-proj-your-openai-key-here

# Authentication
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# Database (optional)
# DATABASE_URL=postgresql://username:password@host:port/database

# Analytics (optional)
# VERCEL_ANALYTICS_ID=your-analytics-id
EOF
        print_warning "Please update .env.local with your actual API keys before deploying"
    else
        print_status "Environment file exists"
    fi
}

# Install dependencies and build
install_and_build() {
    print_info "Installing dependencies..."
    pnpm install
    
    print_info "Running production build..."
    pnpm build
    
    print_status "Build completed successfully"
}

# Deploy to chosen platform
deploy_platform() {
    case $PLATFORM in
        "vercel")
            deploy_vercel
            ;;
        "netlify")
            deploy_netlify
            ;;
        "railway")
            deploy_railway
            ;;
        "manual")
            print_info "Manual setup selected. Please follow the deployment guide."
            ;;
    esac
}

deploy_vercel() {
    print_info "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    print_info "Please login to your team Vercel account when prompted..."
    vercel login
    
    print_info "Linking project..."
    vercel link
    
    print_warning "Please set your environment variables in Vercel dashboard before deploying to production"
    print_info "Deploying to preview first..."
    vercel
    
    read -p "Deploy to production? (y/N): " deploy_prod
    if [[ $deploy_prod =~ ^[Yy]$ ]]; then
        vercel --prod
        print_status "Deployed to production!"
    fi
}

deploy_netlify() {
    print_info "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_info "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    print_info "Please login to your team Netlify account when prompted..."
    netlify login
    
    print_info "Initializing project..."
    netlify init
    
    print_warning "Please set your environment variables in Netlify dashboard"
    print_info "Deploying to preview first..."
    netlify deploy --build
    
    read -p "Deploy to production? (y/N): " deploy_prod
    if [[ $deploy_prod =~ ^[Yy]$ ]]; then
        netlify deploy --prod --build
        print_status "Deployed to production!"
    fi
}

deploy_railway() {
    print_info "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_info "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    print_info "Please login to your team Railway account when prompted..."
    railway login
    
    print_info "Creating new project..."
    railway new
    
    print_warning "Please set your environment variables using: railway variables set KEY=value"
    
    read -p "Deploy to Railway? (y/N): " deploy_railway
    if [[ $deploy_railway =~ ^[Yy]$ ]]; then
        railway up
        print_status "Deployed to Railway!"
    fi
}

# Main deployment flow
main() {
    echo ""
    print_info "Starting CroweOS Platform team deployment..."
    
    check_requirements
    choose_platform
    setup_environment
    install_and_build
    deploy_platform
    
    echo ""
    print_status "Deployment process completed!"
    echo ""
    print_info "Next steps:"
    echo "1. Update environment variables with your actual API keys"
    echo "2. Test all platform features: /, /platform, /chat, /ide"
    echo "3. Configure custom domain (optional)"
    echo "4. Set up monitoring and analytics"
    echo ""
    print_info "For detailed instructions, see TEAM_DEPLOYMENT_GUIDE.md"
}

# Run main function
main "$@"
