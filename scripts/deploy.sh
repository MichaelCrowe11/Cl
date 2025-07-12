#!/bin/bash

# Crowe Logic AI - Production Deployment Script
# Phase 0 MVP Deployment to Vercel

set -e

echo "🚀 Crowe Logic AI - Production Deployment"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Environment check
if [ ! -f ".env.production.example" ]; then
    echo "❌ Error: .env.production.example not found"
    exit 1
fi

echo "✅ Environment files ready"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful"

# Type checking
echo "🔍 Running type checks..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  Type check warnings detected. Continuing with deployment..."
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

# Check if this is production deployment
read -p "🎯 Deploy to production? (y/N): " confirm
if [[ $confirm =~ ^[Yy]$ ]]; then
    echo "🌐 Deploying to PRODUCTION..."
    vercel --prod
    
    echo ""
    echo "🎉 Production deployment complete!"
    echo "📊 Next steps:"
    echo "   1. Configure environment variables in Vercel dashboard"
    echo "   2. Set up Supabase production database"
    echo "   3. Update DNS settings for custom domain"
    echo "   4. Configure monitoring alerts"
    echo ""
    echo "🔗 Deployment URL will be shown above"
    
else
    echo "🧪 Deploying to PREVIEW..."
    vercel
    
    echo ""
    echo "✅ Preview deployment complete!"
    echo "🔍 Use this for testing before production deployment"
fi

echo ""
echo "📋 Post-deployment checklist:"
echo "   □ Verify AI API endpoints work"
echo "   □ Test QFOL metrics calculation"
echo "   □ Check database connections"
echo "   □ Validate authentication flow"
echo "   □ Monitor error rates"
echo ""
echo "🏁 Deployment script completed!"
