#!/bin/bash

# Crowe Logic AI - Quick Setup Verification
# Verify prerequisites before running full infrastructure setup

set -e

PROJECT_ID="crowe-logic-ai-466714"
REGION="us-central1"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_check() {
    if [ $1 -eq 0 ]; then
        echo -e "✅ ${GREEN}$2${NC}"
    else
        echo -e "❌ ${RED}$2${NC}"
        return 1
    fi
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "🔍 Verifying Crowe Logic AI GCP Setup Prerequisites..."
echo ""

# Check if gcloud is installed
print_info "Checking gcloud CLI..."
gcloud version >/dev/null 2>&1
print_check $? "Google Cloud SDK is installed"

# Check if authenticated
print_info "Checking authentication..."
gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 >/dev/null 2>&1
print_check $? "gcloud is authenticated"

# Check if Docker is available
print_info "Checking Docker..."
docker --version >/dev/null 2>&1
print_check $? "Docker is available"

# Check if project exists or can be created
print_info "Checking GCP project access..."
gcloud projects describe $PROJECT_ID >/dev/null 2>&1
if [ $? -eq 0 ]; then
    print_check 0 "Project $PROJECT_ID exists and is accessible"
else
    print_warning "Project $PROJECT_ID doesn't exist yet - will be created"
fi

# Check if we have the required APIs enabled (if project exists)
if gcloud projects describe $PROJECT_ID >/dev/null 2>&1; then
    print_info "Checking enabled APIs..."
    
    # Check a few key APIs
    APIs=("cloudbuild.googleapis.com" "run.googleapis.com" "sqladmin.googleapis.com")
    for api in "${APIs[@]}"; do
        if gcloud services list --enabled --filter="name:$api" --format="value(name)" | grep -q "$api"; then
            echo -e "  ✅ ${GREEN}$api enabled${NC}"
        else
            echo -e "  ⚠️ ${YELLOW}$api not enabled (will be enabled during setup)${NC}"
        fi
    done
fi

# Check billing account
print_info "Checking billing..."
BILLING_ACCOUNTS=$(gcloud billing accounts list --format="value(name)" | wc -l)
if [ $BILLING_ACCOUNTS -gt 0 ]; then
    print_check 0 "Billing account available"
else
    print_warning "No billing accounts found - you may need to set up billing"
fi

# Estimate setup time and costs
echo ""
echo "📋 Setup Summary:"
echo "  • Project ID: $PROJECT_ID"
echo "  • Region: $REGION"
echo "  • Estimated setup time: 15-30 minutes"
echo "  • Estimated monthly cost: \$40-60 + AI usage"
echo ""

# Check if ready to proceed
echo "🚀 Ready to proceed with infrastructure setup!"
echo ""
echo "Next steps:"
echo "1. Run: ./gcp-migration/setup-gcp-infrastructure.sh"
echo "2. Update API keys in Secret Manager"
echo "3. Run: ./gcp-migration/deploy-to-gcp.sh"
echo ""
echo "💡 Pro tip: Keep your terminal open during setup to monitor progress"
