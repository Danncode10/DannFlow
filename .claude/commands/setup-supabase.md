---
description: Guide the existing DannFlow template's Supabase environment values and dashboard settings without designing or changing project database schema.
---

# /setup-supabase

Set up the existing DannFlow template's Supabase connection without exposing secrets or changing its database design. Read `PROJECT_CONTEXT.md`, `.env.local`, `.env.example`, and the current auth implementation first.

1. Verify Supabase MCP is connected and that `.env.local` contains a non-placeholder `SUPABASE_PROJECT_ID`. If it is missing, use the Missing Tool Alert Protocol.
2. Tell the user where to obtain each existing-template environment value: Project Settings > Data API for `NEXT_PUBLIC_SUPABASE_URL` and publishable key; Project Settings > General for the project ref; Connect for `DATABASE_URL`; and Project Settings > API for the service-role key. Never print or commit secret values.
3. Confirm `.env.local` has the values required by the shipped DannFlow template without displaying them.
4. Guide the user through template-level Supabase Dashboard settings only: Site URL, local callback/recovery redirect URLs, email confirmation choice, and whether the supplied email templates should be branded now or deferred. Explain the setting and ask for the user's choice when it changes behavior.
5. Confirm the existing baseline template database can be reached. Do not inspect, alter, design, migrate, or verify project-specific schema, relationships, types, functions, triggers, or RLS policies in this command.
6. Confirm the project reference stays in `SUPABASE_PROJECT_ID`; do not write Supabase connection metadata to tracked files.
7. Give the user concrete pass/fail results and, if successful, direct them to the relevant next Phase 0 task.

Do not change application schema, run `pnpm db:migrate`, or use Supabase MCP `apply_migration` in this command. Project-specific database work belongs in a later Masterplan phase.
