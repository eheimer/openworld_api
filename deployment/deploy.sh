#!/bin/bash
# Deployment script for Openworld API
# Builds in ~/work/openworld-api and deploys to /var/www/openworld-api

set -e

BUILD_DIR=~/work/openworld-api
PROD_DIR=/var/www/openworld-api

echo "🚀 Deploying Openworld API..."

# Build in work directory
echo "📥 Pulling latest code..."
cd $BUILD_DIR
git pull

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

# Run migrations (before deploying, while still in build dir with dev deps)
echo "�️ e Running database migrations..."
NODE_ENV=prod npm run migration:run

# Deploy to production directory
echo "📋 Deploying to production..."
cd $PROD_DIR
rm -rf dist/
cp -r $BUILD_DIR/dist ./
cp -r $BUILD_DIR/deployment ./
cp $BUILD_DIR/package*.json ./

echo "�️ Installing production dependencies..."
npm ci --production

# Restart application
echo "♻️  Restarting application..."
cd $PROD_DIR
pm2 restart openworld-api

# Show status
echo "✅ Deployment complete!"
pm2 status openworld-api
pm2 logs openworld-api --lines 10
