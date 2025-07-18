#!/bin/bash

# CroweOS Pro IDE - Quick Stripe Setup
# This will prompt for your keys and set everything up

echo "🔐 CroweOS Pro IDE - Stripe Configuration"
echo "========================================"
echo ""

# Check if we can extract keys from .env.local
if [ -f ".env.local" ]; then
    echo "📁 Found .env.local file, extracting keys..."
    
    # Extract existing keys
    EXISTING_SECRET=$(grep "STRIPE_SECRET_KEY=" .env.local | cut -d'=' -f2)
    EXISTING_PUBLIC=$(grep "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=" .env.local | cut -d'=' -f2)
    
    if [ ! -z "$EXISTING_SECRET" ] && [ "$EXISTING_SECRET" != "sk_test_51N6…" ]; then
        echo "✅ Using existing secret key: ${EXISTING_SECRET:0:20}..."
        export STRIPE_SECRET_KEY=$EXISTING_SECRET
    fi
    
    if [ ! -z "$EXISTING_PUBLIC" ] && [ "$EXISTING_PUBLIC" != "pk_test_51N6…" ]; then
        echo "✅ Using existing publishable key: ${EXISTING_PUBLIC:0:20}..."
        export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$EXISTING_PUBLIC
    fi
fi

# If we still don't have keys, prompt for them
if [ -z "$STRIPE_SECRET_KEY" ] || [ "$STRIPE_SECRET_KEY" = "sk_test_51N6…" ]; then
    echo "🔑 Please enter your Stripe SECRET key (starts with sk_test_):"
    read -s STRIPE_SECRET_KEY
    export STRIPE_SECRET_KEY
fi

if [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ] || [ "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" = "pk_test_51N6…" ]; then
    echo "🔑 Please enter your Stripe PUBLISHABLE key (starts with pk_test_):"
    read -s NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
fi

echo ""
echo "🚀 Running Stripe setup..."
./setup-stripe.sh
