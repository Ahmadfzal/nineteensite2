#!/bin/bash
# Script untuk menyiapkan package siap-deploy ke Hostinger
# Jalankan: bash scripts/prepare-hostinger.sh

set -e

echo "=== Build untuk Hostinger ==="

echo ""
echo "1. Build TypeScript libs..."
pnpm run typecheck:libs

echo ""
echo "2. Build marketplace (frontend)..."
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/marketplace run build

echo ""
echo "3. Build API server..."
PORT=8080 pnpm --filter @workspace/api-server run build

echo ""
echo "4. Membuat hostinger-deploy.zip..."
# Hapus zip lama kalau ada
rm -f hostinger-deploy.zip

# Buat ZIP dengan semua file KECUALI node_modules dan file tidak perlu
zip -r hostinger-deploy.zip . \
  --exclude "*/node_modules/*" \
  --exclude "*/.git/*" \
  --exclude "*/node_modules" \
  --exclude ".git" \
  --exclude "*.log" \
  --exclude "*/dist/public/assets/*.map" \
  --exclude "*/dist/*.map" \
  2>/dev/null || true

echo ""
echo "=== Selesai! ==="
echo ""
echo "File: hostinger-deploy.zip"
echo ""
echo "Pengaturan di Hostinger:"
echo "  Build command : pnpm install --ignore-scripts"
echo "  Entry file    : artifacts/api-server/dist/index.mjs"
echo "  Node version  : 22 atau 24"
echo ""
echo "Environment variables yang harus diset di Hostinger:"
echo "  DATABASE_URL  = (connection string PostgreSQL Hostinger)"
echo "  SESSION_SECRET= (string acak panjang)"
echo "  NODE_ENV      = production"
echo "  PORT          = (otomatis diisi Hostinger)"
