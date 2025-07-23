#!/bin/bash

# Deploy Crowe Lo  --set-secrets XAI_API_KEY=xai-api-key:latest,ANTHROPIC_API_KEY=anthropic-api-key:latest \ic AI to Cloud Run
# Final deployment step after successful build

set -e

PROJECT_ID="dulcet-nucleus-450804-a3"
SERVICE_NAME="crowe-logic-ai"
REGION="us-central1"
IMAGE="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Deploying Crowe Logic AI to Cloud Run..."

gcloud run deploy $SERVICE_NAME \
  --image $IMAGE \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 0 \
  --max-instances 5 \
  --concurrency 80 \
  --timeout 300s \
  --set-env-vars NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1 \
  --set-secrets DATABASE_URL=database-url:latest \
  --set-secrets REDIS_URL=redis-url:latest \
  --set-secrets NEXTAUTH_SECRET=nextauth-secret:latest \
  --set-secrets XAI_API_KEY=xai-api-key:latest

echo "✅ Deployment complete!"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --project $PROJECT_ID --format 'value(status.url)')

echo "🌐 Your Crowe Logic AI Platform is live at: $SERVICE_URL"
echo "🎯 Platform features:"
echo "   • Enterprise-grade PostgreSQL database"
echo "   • Redis caching for performance"
echo "   • Auto-scaling Cloud Run deployment"
echo "   • Secure secrets management"
echo "   • Production Docker container"
echo ""
echo "🚀 Platform is now ready to compete with GitHub Codespaces and Replit!"
