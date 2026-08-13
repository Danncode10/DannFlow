---
description: Guide the existing DannFlow template's Supabase environment values and project connection without designing or changing database schema.
---

# /setup-supabase

Set up the existing DannFlow template's Supabase connection without exposing secrets or changing database design. Read `PROJECT_CONTEXT.md`, `.env.local`, `.env.example`, and the current template implementation first.

1. Verify Supabase MCP is connected and that `.env.local` contains a non-placeholder `SUPABASE_PROJECT_ID`. If it is missing, use the Missing Tool Alert Protocol.
2. Give an environment checklist using the actual variables in `.env.example`:
   - **Supabase > Project Settings > Data API:** `NEXT_PUBLIC_SUPABASE_URL` and the public/publishable key stored as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - **Supabase > Project Settings > General:** `SUPABASE_PROJECT_ID`.
   - **Supabase > Connect:** `DATABASE_URL`; required later for tracked database work, but do not run migrations in this command.
   - **Supabase > Project Settings > API:** `SUPABASE_SERVICE_ROLE_KEY`; server-only, never expose it to the browser.
   - **Upstash Redis > database > REST API:** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; required before production rate limiting, optional during local template setup.
   - **Project identity:** `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL`, and `NEXT_PUBLIC_GITHUB_URL`.
3. Confirm `.env.local` has the values required by the shipped DannFlow template without displaying them. Clearly label missing required-for-local values versus values intentionally deferred until production.
4. Confirm the existing baseline template database can be reached. Do not inspect, alter, design, migrate, or verify project-specific schema, relationships, types, functions, triggers, or RLS policies in this command.
5. Confirm the project reference stays in `SUPABASE_PROJECT_ID`; do not write Supabase connection metadata to tracked files.
6. Give the user concrete pass/fail results and, if successful, direct them to `/setup-auth` or the next relevant Phase 0 task.

Do not change application schema, run `pnpm db:migrate`, or use Supabase MCP `apply_migration` in this command. Project-specific database work belongs in a later Masterplan phase.
