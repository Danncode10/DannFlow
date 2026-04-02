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

TIMESTAMP=$(date +%m-%d-%Y-%H-%M)
FILENAME="supabase/backups/schema-$TIMESTAMP.sql"

echo "VIBE CHECKPOINT INITIATED"
echo "------------------------"
echo "Project: $SUPABASE_PROJECT_ID"
echo "Target:  $FILENAME"
mkdir -p supabase/backups

# This command acts as a signal for the AI Agent.
# Antigravity will now read the live DDL and populate the file.
echo "[AI_SYNC_SIGNAL]: Please fulfill schema checkpoint at $FILENAME"

# POWER USER: If you have your DB password, you can enable standalone backups:
if [ ! -z "$SUPABASE_DB_PASSWORD" ]; then
  echo "Standalone mode detected. Executing remote dump..."
  npx supabase db dump --project-ref "$SUPABASE_PROJECT_ID" -p "$SUPABASE_DB_PASSWORD" -f "$FILENAME"
else
  echo "AI Mode: Handing over to Antigravity for schema generation."
fi
