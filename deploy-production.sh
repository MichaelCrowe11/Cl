#!/bin/bash

echo "🚀 Deploying Crowe Logic AI to Production..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

echo -e "${BLUE}🔍 Running final checks...${NC}"
pnpm lint:fix
pnpm type-check

echo -e "${BLUE}🏗️ Building for production...${NC}"
pnpm build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo -e "${BLUE}📊 Bundle analysis:${NC}"
    echo "   Bundle size: $(du -sh .next | cut -f1)"
    echo "   Static files: $(find .next/static -type f | wc -l) files"
    echo ""
    
    echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}📥 Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    # Deploy to production
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
        echo -e "${GREEN}================================================${NC}"
        echo -e "${GREEN}✅ Crowe Logic AI is now LIVE in production!${NC}"
        echo ""
        echo -e "${BLUE}📋 Next Steps:${NC}"
        echo "1. Test your production URL"
        echo "2. Set up custom domain (optional)"
        echo "3. Configure environment variables"
        echo "4. Monitor performance in Vercel dashboard"
        echo ""
        echo -e "${YELLOW}🔗 Useful Links:${NC}"
        echo "• Vercel Dashboard: https://vercel.com/dashboard"
        echo "• Analytics: Check your project dashboard"
        echo "• Domains: Project Settings → Domains"
        echo ""
        echo -e "${GREEN}🚀 Your mycology AI platform is ready to serve users!${NC}"
    else
        echo -e "${RED}❌ Deployment failed! Check the error messages above.${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Build failed! Please fix the errors above before deploying.${NC}"
    exit 1
fi
