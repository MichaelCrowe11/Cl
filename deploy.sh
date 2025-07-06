#!/bin/bash

# Deployment Script for the Crowe Logic AI Platform
# This script provides commands to deploy both the frontend and backend.

set -e # Exit immediately if a command exits with a non-zero status.

echo "🚀 Starting deployment process for the Crowe Logic AI Platform..."

# --- Frontend Deployment (Next.js to Vercel) ---

echo "
🌐 Step 1: Deploying Frontend to Vercel"
echo "Vercel deployments are automatically triggered by pushing to the main branch."
echo "Ensure your Vercel project is correctly linked to your Git repository."

# To trigger a deployment, commit your changes and push to the main branch:
# git add .
# git commit -m "feat: Integrate Gemini and prepare for deployment"
# git push origin main

echo "✅ Frontend deployment will be handled by Vercel upon git push."


# --- Backend Deployment (Flask API to a Linux Server) ---

echo "
⚙️  Step 2: Deploying Backend Flask API"
echo "This section provides a template for deploying the Flask API to a Linux server."
echo "You will need to adapt these commands to your specific server environment."
echo "Common steps include pulling the latest code, installing dependencies, and restarting the application server (e.g., Gunicorn)."

# Example commands to be run on your production server:
#
# 1. SSH into your server:
#    ssh user@your_server_ip
#
# 2. Navigate to the application directory:
#    cd /path/to/your/project
#
# 3. Pull the latest code from the repository:
#    git pull origin main
#
# 4. Install or update dependencies:
#    pip install -r requirements.txt
#
# 5. (Optional) Apply database migrations if you have any:
#    flask db upgrade
#
# 6. Restart the application server to apply changes:
#    # This command depends on how you are running your application.
#    # If using systemd and Gunicorn, it might look like this:
#    sudo systemctl restart your-gunicorn-service

echo "✅ Backend deployment template is ready. Customize it for your server setup."


echo "
🎉 Deployment script is ready. Push your changes to start the deployment!"