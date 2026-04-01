#!/bin/bash

# Load environment variables from .env.local if it exists
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Check if SUPABASE_PROJECT_ID is set
if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "Error: SUPABASE_PROJECT_ID is not set in .env.local"
  exit 1
fi

echo "Generating Supabase types for project: $SUPABASE_PROJECT_ID"
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" > src/types/supabase.ts
echo "Types generated successfully at src/types/supabase.ts"
