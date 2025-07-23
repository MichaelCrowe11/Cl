#!/bin/bash

# Clean GCP Deployment - Crowe Logic AI Platform
# Remove unused files and deploy only production-ready components

set -e

echo "🧹 Cleaning up unused files before GCP deployment..."

# Configuration
export PROJECT_ID="dulcet-nucleus-450804-a3"
export REGION="us-central1"
export SERVICE_NAME="crowe-logic-ai"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create clean deployment directory
print_status "Creating clean deployment structure..."
mkdir -p /tmp/crowe-logic-clean
cd /workspaces/Cl

# Copy only essential production files
print_status "Copying core application files..."

# Essential app pages - only production routes
mkdir -p /tmp/crowe-logic-clean/app
cp app/layout.tsx /tmp/crowe-logic-clean/app/ 2>/dev/null || true
cp app/page.tsx /tmp/crowe-logic-clean/app/
cp app/loading.tsx /tmp/crowe-logic-clean/app/ 2>/dev/null || true
cp app/not-found.tsx /tmp/crowe-logic-clean/app/ 2>/dev/null || true
cp app/favicon.svg /tmp/crowe-logic-clean/app/ 2>/dev/null || true

# Core IDE pages
mkdir -p /tmp/crowe-logic-clean/app/{farm-management,ide-pro,platform}
cp app/farm-management/page.tsx /tmp/crowe-logic-clean/app/farm-management/ 2>/dev/null || true
cp app/ide-pro/page.tsx /tmp/crowe-logic-clean/app/ide-pro/ 2>/dev/null || true  
cp app/platform/page.tsx /tmp/crowe-logic-clean/app/platform/ 2>/dev/null || true

# API routes
mkdir -p /tmp/crowe-logic-clean/app/api
cp -r app/api/* /tmp/crowe-logic-clean/app/api/ 2>/dev/null || true

# Essential components - production only
mkdir -p /tmp/crowe-logic-clean/components/{ui,platform}
cp -r components/ui /tmp/crowe-logic-clean/components/ 2>/dev/null || true

# Core platform components
cp components/claude-code-integration.tsx /tmp/crowe-logic-clean/components/ 2>/dev/null || true
cp components/professional-landing-page.tsx /tmp/crowe-logic-clean/components/ 2>/dev/null || true
cp -r components/platform /tmp/crowe-logic-clean/components/ 2>/dev/null || true

# Configuration files
cp package.json /tmp/crowe-logic-clean/
cp tsconfig.json /tmp/crowe-logic-clean/
cp tailwind.config.ts /tmp/crowe-logic-clean/
cp postcss.config.mjs /tmp/crowe-logic-clean/
cp components.json /tmp/crowe-logic-clean/
cp next.config.mjs /tmp/crowe-logic-clean/

# Essential lib files
mkdir -p /tmp/crowe-logic-clean/lib
cp -r lib/* /tmp/crowe-logic-clean/lib/ 2>/dev/null || true

# Styles
mkdir -p /tmp/crowe-logic-clean/styles
cp -r styles/* /tmp/crowe-logic-clean/styles/ 2>/dev/null || true

# GCP deployment files
mkdir -p /tmp/crowe-logic-clean/gcp-migration
cp gcp-migration/setup-gcp-infrastructure.sh /tmp/crowe-logic-clean/gcp-migration/
cp gcp-migration/deploy-to-gcp.sh /tmp/crowe-logic-clean/gcp-migration/
cp Dockerfile /tmp/crowe-logic-clean/

print_success "Clean deployment structure created!"
print_status "Removed unused test files, duplicates, and legacy components"

# List what we're deploying
print_status "Final deployment structure:"
find /tmp/crowe-logic-clean -type f -name "*.tsx" -o -name "*.ts" -o -name "*.json" | head -20

echo ""
print_success "✅ Ready for clean GCP deployment!"
print_status "Only production-ready, actively used files included"
