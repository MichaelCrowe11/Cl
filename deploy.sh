#!/bin/bash

# Crowe Logic AI Deployment Script
echo "🚀 Deploying Crowe Logic AI to Vercel..."

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit them first."
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Push to GitHub (triggers Vercel deployment)
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Deployment initiated!"
echo "🔗 Check deployment status at: https://vercel.com/michaelcrowe11s-projects/cl"
echo "🌐 Live site will be updated at: https://cl.vercel.app" 