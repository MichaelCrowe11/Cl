#!/bin/bash

# CroweOS Systems - Environment Sync Script
# This script helps sync environment variables between local and Vercel

echo "🔐 CroweOS Systems - Environment Management"
echo "=========================================="

# Check if Vercel CLI is installed and user is logged in
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Please login to Vercel first: vercel login"
    exit 1
fi

echo "✅ Vercel CLI ready"

# Function to pull environment variables from Vercel
pull_from_vercel() {
    echo "📥 Pulling environment variables from Vercel..."
    
    # Create backup of current .env.local
    if [ -f ".env.local" ]; then
        cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
        echo "🔄 Backed up existing .env.local"
    fi
    
    # Pull environment variables
    vercel env pull .env.local
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pulled environment variables to .env.local"
    else
        echo "❌ Failed to pull environment variables"
        return 1
    fi
}

# Function to push environment variables to Vercel
push_to_vercel() {
    echo "📤 Pushing environment variables to Vercel..."
    
    if [ ! -f ".env.local" ]; then
        echo "❌ .env.local not found. Please create it first."
        return 1
    fi
    
    echo "⚠️  This will add/update environment variables in Vercel."
    echo "🔍 Current variables in .env.local:"
    cat .env.local | grep -E '^[A-Z]' | cut -d'=' -f1 | sed 's/^/  - /'
    
    read -p "Continue? (y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        # Read .env.local and add each variable to Vercel
        while IFS='=' read -r key value; do
            if [[ $key =~ ^[A-Z] ]] && [[ ! -z "$value" ]]; then
                echo "Adding $key to Vercel..."
                echo "$value" | vercel env add "$key" production
                echo "$value" | vercel env add "$key" preview  
                echo "$value" | vercel env add "$key" development
            fi
        done < .env.local
        
        echo "✅ Environment variables pushed to Vercel"
    else
        echo "❌ Cancelled push operation"
    fi
}

# Function to list environment variables
list_env_vars() {
    echo "📋 Environment Variables Status"
    echo "==============================="
    
    echo "🔧 Local (.env.local):"
    if [ -f ".env.local" ]; then
        cat .env.local | grep -E '^[A-Z]' | cut -d'=' -f1 | sed 's/^/  ✓ /'
    else
        echo "  ❌ No .env.local file found"
    fi
    
    echo ""
    echo "☁️  Vercel (Remote):"
    vercel env ls
}

# Function to setup development environment
setup_dev_env() {
    echo "🚀 Setting up CroweOS Systems development environment..."
    
    # Copy example env file if .env.local doesn't exist
    if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "📋 Copied .env.example to .env.local"
        echo "⚠️  Please edit .env.local and add your actual API keys"
    fi
    
    echo "✅ Development environment setup complete"
    echo "📝 Next steps:"
    echo "  1. Edit .env.local with your API keys"
    echo "  2. Run: npm run dev"
    echo "  3. Open: http://localhost:3000"
}

# Main menu
case "$1" in
    "pull")
        pull_from_vercel
        ;;
    "push")
        push_to_vercel
        ;;
    "list")
        list_env_vars
        ;;
    "setup")
        setup_dev_env
        ;;
    *)
        echo "Usage: $0 {pull|push|list|setup}"
        echo ""
        echo "Commands:"
        echo "  pull   - Pull environment variables from Vercel to .env.local"
        echo "  push   - Push environment variables from .env.local to Vercel"
        echo "  list   - List current environment variables (local and remote)"
        echo "  setup  - Setup development environment"
        echo ""
        echo "Examples:"
        echo "  $0 pull    # Download env vars from Vercel"
        echo "  $0 setup   # Setup local development"
        echo "  $0 list    # Show current env vars"
        ;;
esac
