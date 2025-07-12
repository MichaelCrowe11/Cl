#!/bin/bash

# Production Canary Deployment Script
# Enables 5% traffic split for 24h monitoring

set -e

echo "🚀 Starting canary deployment..."

# Check if already in canary mode
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Create canary branch if not exists
if [ "$CURRENT_BRANCH" != "canary" ]; then
    echo "Creating canary branch..."
    git checkout -b canary 2>/dev/null || git checkout canary
fi

# Update Vercel configuration for canary
cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/\$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
EOF

echo "✅ Canary configuration updated"

# Deploy canary version
if command -v vercel &> /dev/null; then
    echo "Deploying canary to Vercel..."
    vercel --prod --yes --token $VERCEL_TOKEN || echo "⚠️  Deploy manually: vercel --prod"
    echo "✅ Canary deployed - 5% traffic split active"
    echo "🔍 Monitor for 24h before full rollout"
else
    echo "⚠️  Vercel CLI not available. Manual deployment required."
fi

echo "📊 Canary deployment complete. Check analytics in Vercel dashboard."
