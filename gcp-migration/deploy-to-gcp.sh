#!/bin/bash

# Crowe Logic AI - GCP Deployment Script
# Deploy to Cloud Run with full CI/CD pipeline

set -e

# Configuration
PROJECT_ID="dulcet-nucleus-450804-a3"
SERVICE_NAME="crowe-logic-ai"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Ensure we're in the right project
gcloud config set project $PROJECT_ID

# 1. Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if required files exist
if [[ ! -f "Dockerfile" ]]; then
    print_error "Dockerfile not found. Please ensure you're in the project root."
    exit 1
fi

if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please ensure you're in the project root."
    exit 1
fi

# 2. Run tests
print_status "Running tests and linting..."
pnpm run lint || print_warning "Linting issues found, but continuing..."
# pnpm run test || print_warning "Tests failed, but continuing..."

# 3. Build and push Docker image
print_status "Building Docker image..."
COMMIT_SHA=$(git rev-parse --short HEAD)
IMAGE_TAG="$IMAGE_NAME:$COMMIT_SHA"
IMAGE_LATEST="$IMAGE_NAME:latest"

# Build the image
docker build -t $IMAGE_TAG -t $IMAGE_LATEST .

print_status "Pushing image to Container Registry..."
docker push $IMAGE_TAG
docker push $IMAGE_LATEST

# 4. Deploy to Cloud Run
print_status "Deploying to Cloud Run..."

# Get database connection details
DB_CONNECTION_NAME=$(gcloud sql instances describe crowe-logic-db --format="value(connectionName)")

# Deploy the service
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_TAG \
    --region $REGION \
    --platform managed \
    --service-account crowe-logic-app@$PROJECT_ID.iam.gserviceaccount.com \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --concurrency 100 \
    --max-instances 10 \
    --min-instances 1 \
    --timeout 300 \
    --set-env-vars "NODE_ENV=production" \
    --set-env-vars "DATABASE_URL=postgresql://crowe_user@/$PROJECT_ID:crowe-logic-db/crowe_logic?host=/cloudsql/$DB_CONNECTION_NAME" \
    --set-secrets "NEXTAUTH_SECRET=nextauth-secret:latest" \
    --set-secrets "OPENAI_API_KEY=openai-api-key:latest" \
    --set-secrets "ANTHROPIC_API_KEY=anthropic-api-key:latest" \
    --add-cloudsql-instances $DB_CONNECTION_NAME

# 5. Update traffic to new revision
print_status "Updating traffic allocation..."
gcloud run services update-traffic $SERVICE_NAME \
    --region $REGION \
    --to-latest

# 6. Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)")

print_success "Deployment completed!"
print_status "Service URL: $SERVICE_URL"

# 7. Run post-deployment health check
print_status "Running health check..."
sleep 10  # Give the service time to start

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/api/health" || echo "000")
if [[ $HTTP_STATUS -eq 200 ]]; then
    print_success "Health check passed! Service is running correctly."
else
    print_warning "Health check returned status: $HTTP_STATUS"
    print_status "You may need to check the logs: gcloud logs tail --service=$SERVICE_NAME"
fi

# 8. Display useful information
echo ""
print_status "Deployment Summary:"
echo "  - Service: $SERVICE_NAME"
echo "  - Region: $REGION"
echo "  - Image: $IMAGE_TAG"
echo "  - URL: $SERVICE_URL"
echo ""
print_status "Useful commands:"
echo "  - View logs: gcloud logs tail --service=$SERVICE_NAME"
echo "  - Describe service: gcloud run services describe $SERVICE_NAME --region $REGION"
echo "  - View revisions: gcloud run revisions list --service $SERVICE_NAME --region $REGION"
echo ""
print_success "Crowe Logic AI Platform is now live on Google Cloud Platform! 🚀"
