#!/bin/bash

# CroweOS Pro IDE - Stripe Setup Script
# This script will:
# 1. Configure Stripe CLI with your API key
# 2. Create products and prices for CroweOS Pro IDE
# 3. Update your .env.local with the price IDs

echo "🚀 CroweOS Pro IDE - Stripe Setup"
echo "================================="

# Check if STRIPE_SECRET_KEY is set
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ STRIPE_SECRET_KEY not found in environment"
    echo "Please set your Stripe secret key:"
    echo "export STRIPE_SECRET_KEY=sk_test_your_key_here"
    echo ""
    echo "Or add it to your .env.local file"
    exit 1
fi

echo "✅ Found Stripe secret key"

# Configure Stripe CLI
echo "🔧 Configuring Stripe CLI..."
stripe config --set test_mode_api_key $STRIPE_SECRET_KEY

# Create CroweOS Pro IDE products
echo "📦 Creating CroweOS Pro IDE products..."

# Create Pro Product
echo "Creating Pro plan product..."
PRO_PRODUCT=$(stripe products create \
    --name "CroweOS Pro IDE - Professional" \
    --description "Professional AI-powered development environment with unlimited generations, 10 projects, 5GB storage, and priority support" \
    --metadata plan_id=pro \
    --format json)

PRO_PRODUCT_ID=$(echo $PRO_PRODUCT | jq -r '.id')
echo "✅ Pro product created: $PRO_PRODUCT_ID"

# Create Pro Price
echo "Creating Pro plan price..."
PRO_PRICE=$(stripe prices create \
    --product $PRO_PRODUCT_ID \
    --unit-amount 2999 \
    --currency usd \
    --recurring interval=month \
    --metadata plan_id=pro \
    --format json)

PRO_PRICE_ID=$(echo $PRO_PRICE | jq -r '.id')
echo "✅ Pro price created: $PRO_PRICE_ID"

# Create Enterprise Product
echo "Creating Enterprise plan product..."
ENTERPRISE_PRODUCT=$(stripe products create \
    --name "CroweOS Pro IDE - Enterprise" \
    --description "Enterprise AI development platform with unlimited everything, 50GB storage, SSO, dedicated support, and on-premise deployment" \
    --metadata plan_id=enterprise \
    --format json)

ENTERPRISE_PRODUCT_ID=$(echo $ENTERPRISE_PRODUCT | jq -r '.id')
echo "✅ Enterprise product created: $ENTERPRISE_PRODUCT_ID"

# Create Enterprise Price
echo "Creating Enterprise plan price..."
ENTERPRISE_PRICE=$(stripe prices create \
    --product $ENTERPRISE_PRODUCT_ID \
    --unit-amount 9999 \
    --currency usd \
    --recurring interval=month \
    --metadata plan_id=enterprise \
    --format json)

ENTERPRISE_PRICE_ID=$(echo $ENTERPRISE_PRICE | jq -r '.id')
echo "✅ Enterprise price created: $ENTERPRISE_PRICE_ID"

# Update .env.local with price IDs
echo "📝 Updating .env.local with price IDs..."

# Create a temporary file with updated env vars
cat > .env.local.tmp << EOF
# Development Environment Variables
# Copy this to .env.local for local development

# OpenAI Configuration (add your actual key)
OPENAI_API_KEY=sk-your-openai-key-here

# Anthropic Configuration (optional)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Next.js Configuration
NEXTAUTH_SECRET=your-secure-random-string-here
NEXTAUTH_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_PRO_PRICE_ID=$PRO_PRICE_ID
STRIPE_ENTERPRISE_PRICE_ID=$ENTERPRISE_PRICE_ID

# OAuth Providers (add these when you set them up)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Node Environment
NODE_ENV=development
EOF

# Replace the old .env.local
mv .env.local.tmp .env.local

echo ""
echo "🎉 Stripe setup complete!"
echo "========================="
echo ""
echo "📋 Summary:"
echo "• Pro Plan: $29.99/month (Price ID: $PRO_PRICE_ID)"
echo "• Enterprise Plan: $99.99/month (Price ID: $ENTERPRISE_PRICE_ID)"
echo ""
echo "✅ .env.local updated with price IDs"
echo "✅ Ready to test billing at http://localhost:3000"
echo ""
echo "🔗 View in Stripe Dashboard:"
echo "https://dashboard.stripe.com/test/products"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: pnpm dev"
echo "2. Test at /pricing page"
echo "3. Set up webhooks for production"
