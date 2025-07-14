#!/bin/bash

# Crowe Logic AI - Vercel Deployment Script
set -e

echo "🚀 Deploying Crowe Logic AI to Vercel..."
echo "========================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check environment file
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found!"
    echo "   You'll need to configure environment variables in Vercel dashboard"
    echo "   Required variables:"
    echo "   - OPENAI_API_KEY"
    echo "   - ANTHROPIC_API_KEY"
    echo ""
fi

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Type checking
echo "🔷 Type checking..."
npm run type-check

# Linting
echo "🧹 Linting..."
npm run lint

# Build test
echo "🔨 Testing build..."
npm run build

echo "✅ All checks passed!"
echo ""

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami > /dev/null 2>&1; then
    echo "Please log in to Vercel:"
    vercel login
fi

echo ""
echo "🚀 Deploying to Vercel..."
echo "========================"

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment initiated!"
echo "======================="
echo ""
echo "📋 Post-deployment steps:"
echo "1. Configure environment variables in Vercel dashboard"
echo "2. Set up custom domain (if desired)"
echo "3. Test the live application"
echo "4. Monitor performance and errors"
echo ""
echo "🍄 Your Crowe Logic AI is going live!"

# Get deployment URL
echo "🔗 Getting deployment URL..."
DEPLOYMENT_URL=$(vercel ls | grep "crowe-logic-ai" | head -1 | awk '{print $2}')
if [ ! -z "$DEPLOYMENT_URL" ]; then
    echo "🌐 Live at: https://$DEPLOYMENT_URL"
fi
