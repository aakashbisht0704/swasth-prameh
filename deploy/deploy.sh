#!/usr/bin/env bash

# SwasthPrameh Automated Deployment Script
# ----------------------------------------
# This script runs on the Hostinger VPS and performs a full redeploy:
#   1. Ensures the project directory exists and is a git clone.
#   2. Fetches the latest code from the main branch.
#   3. Syncs the environment file if an updated template is provided.
#   4. Rebuilds Docker images (pulling fresh base layers) and restarts containers.
#   5. Runs a post-deploy health check.
#
# You can invoke this manually over SSH or via GitHub Actions.

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/$USER/swasthprameh}"
REPO_URL="${REPO_URL:-https://github.com/aakashbisht0704/swasth-prameh.git}"
ENV_TEMPLATE="${ENV_TEMPLATE:-$PROJECT_DIR/deploy/env.deploy}"
ENV_FILE="${ENV_FILE:-$PROJECT_DIR/.env}"

echo "📦 Starting SwasthPrameh deployment on $(hostname)"
echo "→ Project directory: ${PROJECT_DIR}"

if [ ! -d "$PROJECT_DIR/.git" ]; then
  echo "⚙️  Project directory not initialized. Cloning repository..."
  rm -rf "$PROJECT_DIR"
  git clone "$REPO_URL" "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"

echo "🔄 Fetching latest code..."
git fetch --prune origin
git reset --hard origin/main

if [ -f "$ENV_TEMPLATE" ]; then
  if [ ! -f "$ENV_FILE" ]; then
    echo "📝 No .env found. Seeding from template."
    cp "$ENV_TEMPLATE" "$ENV_FILE"
  elif ! cmp -s "$ENV_TEMPLATE" "$ENV_FILE"; then
    echo "⚠️  Template env differs from current .env."
    echo "    Saving backup to ${ENV_FILE}.bak and updating from template."
    cp "$ENV_FILE" "${ENV_FILE}.bak"
    cp "$ENV_TEMPLATE" "$ENV_FILE"
  fi
else
  echo "ℹ️  Env template not present at ${ENV_TEMPLATE}. Skipping env sync."
fi

echo "🐳 Pulling latest base images..."
docker compose pull --ignore-pull-failures

echo "🛠️  Building application images (this may take a moment)..."
docker compose build --pull

echo "🚀 Restarting application stack..."
docker compose down --remove-orphans
docker compose up -d --force-recreate

echo "⏳ Waiting for services to warm up..."
sleep 15

if [ -x "$PROJECT_DIR/deploy/healthcheck.sh" ]; then
  echo "✅ Running healthcheck..."
  if "$PROJECT_DIR/deploy/healthcheck.sh"; then
    echo "🎉 Deployment successful!"
  else
    echo "❌ Healthcheck failed. Check logs with: docker compose logs"
    exit 1
  fi
else
  echo "⚠️  Healthcheck script missing or not executable. Skipping."
fi

