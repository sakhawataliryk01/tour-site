#!/usr/bin/env bash
# Production redeploy for VPS (kaisertour@…/kaiser-tours).
# Usage: ./scripts/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

UPLOADS_DIR="${UPLOADS_DIR:-$HOME/data/uploads}"
PM2_NAME="${PM2_NAME:-kaiser-tours}"

echo "==> git pull"
git pull --ff-only

echo "==> npm ci"
npm ci

echo "==> prisma db push"
npx prisma db push

echo "==> build"
npm run build

echo "==> stage standalone assets"
mkdir -p .next/standalone/.next
mkdir -p "$UPLOADS_DIR/tours"

if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete public/ .next/standalone/public/
  mkdir -p .next/standalone/.next/static
  rsync -a --delete .next/static/ .next/standalone/.next/static/
else
  rm -rf .next/standalone/public
  cp -a public .next/standalone/public
  mkdir -p .next/standalone/.next/static
  rm -rf .next/standalone/.next/static
  cp -a .next/static .next/standalone/.next/static
fi

cp .env .next/standalone/.env

# Keep tour images outside the build tree
rm -rf .next/standalone/public/uploads
ln -sfn "$UPLOADS_DIR" .next/standalone/public/uploads

echo "==> pm2 restart $PM2_NAME"
pm2 restart "$PM2_NAME"
pm2 status
echo "==> deploy done"
