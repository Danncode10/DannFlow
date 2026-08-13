---
description: Guide and verify hosted Supabase environment setup, tracked Drizzle migration, generated types, and RLS/schema readiness for the current SaaS.
---

# /setup-supabase

Set up the current SaaS's Supabase project without exposing secrets. Read `PROJECT_CONTEXT.md`, `.env.local`, `.env.example`, `db/schema/`, `db/migrations/`, and `src/types/supabase.ts` first.

1. Verify Supabase MCP is connected and that `.env.local` contains a non-placeholder `SUPABASE_PROJECT_ID`. If it is missing, use the Missing Tool Alert Protocol.
2. Tell the user where to obtain each environment value: Project Settings > Data API for `NEXT_PUBLIC_SUPABASE_URL` and publishable key; Project Settings > General for the project ref; Connect for `DATABASE_URL`; and Project Settings > API for the service-role key. Never print or commit secret values.
3. Confirm `.env.local` has required values without displaying them.
4. Apply tracked schema only through `pnpm db:migrate`; do not apply a backup file from `supabase/backups/`.
5. Verify public tables, required functions/triggers, RLS policies, and regenerated `src/types/supabase.ts`. Use the actual schema rather than assuming a fixed table list.
6. Confirm the project reference stays in `SUPABASE_PROJECT_ID`; do not write Supabase connection metadata to tracked files.
7. Give the user concrete pass/fail results and, if successful, direct them to the relevant next Phase 0 task.

Do not change application schema unless the user explicitly requests it. Do not use Supabase MCP `apply_migration` for normal tracked migrations.
