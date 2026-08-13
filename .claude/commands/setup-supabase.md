---
description: Guide and verify hosted Supabase environment setup, tracked Drizzle migration, generated types, and RLS/schema readiness for the current SaaS.
---

# /setup-supabase

Set up the current SaaS's Supabase project without exposing secrets. Read `PROJECT_CONTEXT.md`, `.env.example`, `dannflow.json`, `db/schema/`, `db/migrations/`, and `src/types/supabase.ts` first.

1. Verify Supabase MCP is connected and that the project reference in `.env.local` matches `dannflow.json`. If it is missing, use the Missing Tool Alert Protocol.
2. Tell the user where to obtain each environment value: Project Settings > Data API for `NEXT_PUBLIC_SUPABASE_URL` and publishable key; Project Settings > General for the project ref; Connect for `DATABASE_URL`; and Project Settings > API for the service-role key. Never print or commit secret values.
3. Confirm `.env.local` has required values without displaying them.
4. Apply tracked schema only through `pnpm db:migrate`; do not apply a backup file from `supabase/backups/`.
5. Verify public tables, required functions/triggers, RLS policies, and regenerated `src/types/supabase.ts`. Use the actual schema rather than assuming a fixed table list.
6. Record only the Supabase project reference in `dannflow.json` if it is not already present.
7. Give the user concrete pass/fail results and, if successful, direct them to the relevant next Phase 0 task.

Do not change application schema unless the user explicitly requests it. Do not use Supabase MCP `apply_migration` for normal tracked migrations.
