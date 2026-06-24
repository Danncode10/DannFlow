#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx is not available."
  echo "Install Node.js/npm first, then run this command again."
  exit 1
fi

if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

if [ -z "${SUPABASE_PROJECT_ID:-}" ] && [ -f "supabase/.temp/project-ref" ]; then
  SUPABASE_PROJECT_ID="$(cat supabase/.temp/project-ref)"
  export SUPABASE_PROJECT_ID
fi

if [ -n "${SUPABASE_PROJECT_ID:-}" ] && [ ! -f "supabase/.temp/project-ref" ]; then
  echo "Linking Supabase project: $SUPABASE_PROJECT_ID"
  npx supabase link --project-ref "$SUPABASE_PROJECT_ID"
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Error: DATABASE_URL is not set in .env.local."
  echo "Use the Supabase Postgres connection string for the project you want to migrate."
  exit 1
fi

echo "Applying db/migrations/ to Supabase..."
npx tsx db/migrate.ts

echo "Refreshing remote Supabase types..."
bash scripts/update-types.sh

echo "Remote migration complete."
