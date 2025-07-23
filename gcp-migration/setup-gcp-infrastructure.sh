#!/bin/bash

# Crowe Logic AI - GCP Infrastructure Setup
# Optimized for $1000 credit budget with production-grade setup

set -e

echo "🚀 Setting up Crowe Logic AI on Google Cloud Platform..."

# Configuration
export PROJECT_ID="dulcet-nucleus-450804-a3"
export REGION="us-central1"
export ZONE="us-central1-a"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Project Setup
print_status "Creating GCP project..."
gcloud projects create $PROJECT_ID --name="Crowe Logic AI Platform" || print_warning "Project may already exist"
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
gcloud config set compute/zone $ZONE

# 2. Enable Required APIs
print_status "Enabling required APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sql-component.googleapis.com \
    redis.googleapis.com \
    storage.googleapis.com \
    aiplatform.googleapis.com \
    cloudresourcemanager.googleapis.com \
    iam.googleapis.com \
    secretmanager.googleapis.com \
    monitoring.googleapis.com \
    logging.googleapis.com

# 3. Create Service Accounts
print_status "Creating service accounts..."
gcloud iam service-accounts create crowe-logic-app \
    --display-name="Crowe Logic Application" \
    --description="Main application service account"

gcloud iam service-accounts create crowe-logic-ai \
    --display-name="Crowe Logic AI Services" \
    --description="AI and ML operations service account"

# 4. Grant IAM roles
print_status "Setting up IAM permissions..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

# App service account permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:crowe-logic-app@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:crowe-logic-app@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:crowe-logic-app@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# AI service account permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:crowe-logic-ai@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:crowe-logic-ai@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/ml.admin"

# 5. Create Cloud Storage buckets
print_status "Creating storage buckets..."
gsutil mb -l $REGION gs://$PROJECT_ID-static-assets
gsutil mb -l $REGION gs://$PROJECT_ID-ai-datasets  
gsutil mb -l $REGION gs://$PROJECT_ID-user-files
gsutil mb -l $REGION gs://$PROJECT_ID-backups

# Set bucket permissions
gsutil iam ch serviceAccount:crowe-logic-app@$PROJECT_ID.iam.gserviceaccount.com:roles/storage.objectAdmin gs://$PROJECT_ID-static-assets
gsutil iam ch serviceAccount:crowe-logic-app@$PROJECT_ID.iam.gserviceaccount.com:roles/storage.objectAdmin gs://$PROJECT_ID-user-files
gsutil iam ch serviceAccount:crowe-logic-ai@$PROJECT_ID.iam.gserviceaccount.com:roles/storage.objectAdmin gs://$PROJECT_ID-ai-datasets

# 6. Create PostgreSQL instance (cost-optimized)
print_status "Creating PostgreSQL instance..."
gcloud sql instances create crowe-logic-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --storage-type=HDD \
    --storage-size=10GB \
    --backup-start-time=03:00 \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=04 \
    --deletion-protection

# Create database and user
gcloud sql databases create crowe_logic --instance=crowe-logic-db
gcloud sql users create crowe_user --instance=crowe-logic-db --password=$(openssl rand -base64 32)

# 7. Create Redis instance for sessions/cache
print_status "Creating Redis instance..."
gcloud redis instances create crowe-logic-cache \
    --region=$REGION \
    --memory-size=1GB \
    --tier=basic

# 8. Set up Secret Manager
print_status "Setting up secrets..."
echo -n "$(openssl rand -base64 32)" | gcloud secrets create nextauth-secret --data-file=-
echo -n "your-openai-api-key-here" | gcloud secrets create openai-api-key --data-file=-
echo -n "your-anthropic-api-key-here" | gcloud secrets create anthropic-api-key --data-file=-

# Grant access to secrets
gcloud secrets add-iam-policy-binding nextauth-secret \
    --member="serviceAccount:crowe-logic-app@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding openai-api-key \
    --member="serviceAccount:crowe-logic-app@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding anthropic-api-key \
    --member="serviceAccount:crowe-logic-app@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# 9. Create Cloud Build configuration
print_status "Setting up Cloud Build..."
cat > cloudbuild.yaml << EOF
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['install', '-g', 'pnpm']
  
  - name: 'node:18'
    entrypoint: 'pnpm'
    args: ['install']
    env:
      - 'NODE_ENV=production'
  
  # Run tests
  - name: 'node:18'
    entrypoint: 'pnpm'
    args: ['run', 'test']
  
  # Build application
  - name: 'node:18'
    entrypoint: 'pnpm'
    args: ['run', 'build']
    env:
      - 'NODE_ENV=production'
  
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/\$PROJECT_ID/crowe-logic-ai:\$COMMIT_SHA', '.']
  
  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/\$PROJECT_ID/crowe-logic-ai:\$COMMIT_SHA']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'crowe-logic-ai'
      - '--image'
      - 'gcr.io/\$PROJECT_ID/crowe-logic-ai:\$COMMIT_SHA'
      - '--region'
      - '$REGION'
      - '--platform'
      - 'managed'
      - '--service-account'
      - 'crowe-logic-app@\$PROJECT_ID.iam.gserviceaccount.com'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'NODE_ENV=production'

options:
  machineType: 'E2_HIGHCPU_8'

timeout: '1200s'
EOF

# 10. Setup monitoring and alerting
print_status "Setting up monitoring..."
gcloud alpha monitoring channels create \
    --display-name="Email Notifications" \
    --type=email \
    --channel-labels=email_address=admin@crowelogic.com

print_success "GCP infrastructure setup complete!"

echo ""
echo "📋 Next Steps:"
echo "1. Update your API keys in Secret Manager"
echo "2. Configure your domain DNS"
echo "3. Run the deployment script"
echo "4. Set up Claude Code integration"

echo ""
echo "💰 Cost Estimate:"
echo "- Cloud Run: ~$5-20/month (depending on usage)"
echo "- PostgreSQL (f1-micro): ~$7/month"
echo "- Redis (1GB): ~$25/month"
echo "- Storage: ~$1-5/month"
echo "- Vertex AI: Pay per use with $1000 credits"
echo "Total: ~$40-60/month + AI usage"
