#!/bin/bash

set -euo pipefail

MODE="${1:-remote}"

# Load environment variables from .env.local if it exists
if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

if [ "$MODE" = "--local" ] || [ "$MODE" = "local" ]; then
  echo "Generating Supabase types from the local database"
  npx supabase gen types typescript --local > src/types/supabase.ts
  echo "Types generated successfully at src/types/supabase.ts"
  exit 0
fi

# Check if SUPABASE_PROJECT_ID is set
if [ -z "${SUPABASE_PROJECT_ID:-}" ]; then
  echo "Error: SUPABASE_PROJECT_ID is not set in .env.local"
  exit 1
fi

echo "Generating Supabase types for project: $SUPABASE_PROJECT_ID"
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" > src/types/supabase.ts
echo "Types generated successfully at src/types/supabase.ts"
