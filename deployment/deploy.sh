#!/bin/bash
# Quick deployment script for updates
# Run this on your VPS after pulling new code

set -e

echo "🚀 Deploying Openworld API..."

# Navigate to app directory
cd /var/www/openworld-api

# Pull latest code
echo "📥 Pulling latest code..."
git pull

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build application
echo "🔨 Building application..."
npm run build

# Run migrations
echo "🗄️  Running database migrations..."
NODE_ENV=prod npm run migration:run

# Restart application
echo "♻️  Restarting application..."
pm2 restart openworld-api

# Show status
echo "✅ Deployment complete!"
pm2 status openworld-api
