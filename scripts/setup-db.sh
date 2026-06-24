#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx is not available."
  echo "Install Node.js/npm first, then run this command again."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is not installed or not available in PATH."
  echo "Supabase local development requires Docker."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Error: Docker is not running."
  echo "Start Docker, then run this command again."
  exit 1
fi

if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example."
fi

echo "Starting local Supabase..."
npx supabase start

echo "Applying Drizzle migrations from db/migrations..."
DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}" npx tsx db/migrate.ts

echo "Generating local Supabase types..."
bash scripts/update-types.sh --local

echo "Database setup complete."
