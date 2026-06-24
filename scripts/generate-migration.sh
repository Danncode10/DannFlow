#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx is not available."
  echo "Install Node.js/npm first, then run this command again."
  exit 1
fi

echo "Generating SQL migration from db/schema..."
npx drizzle-kit generate "$@"

echo "Migration generated in db/migrations/."
echo "Review the SQL before running pnpm db:migrate."
