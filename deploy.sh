#!/bin/bash

# Crowe Logic AI - Production Deployment Script

echo "🚀 Starting Crowe Logic AI Production Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Run linting
echo "🔍 Running linting..."
pnpm lint:fix

# Type checking
echo "🔷 Running TypeScript type check..."
pnpm type-check

# Build the application
echo "🏗️ Building application..."
pnpm build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📊 Bundle size: $(du -sh .next | cut -f1)"
    echo ""
    echo "🎯 Ready for deployment!"
    echo ""
    echo "To deploy to Vercel:"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Login: vercel login"
    echo "3. Deploy: vercel --prod"
    echo ""
    echo "Or push to your connected Git repository for automatic deployment."
else
    echo "❌ Build failed! Please fix the errors above."
    exit 1
fi
