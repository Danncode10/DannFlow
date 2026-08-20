# The "Time Machine" Workflow — Schema, Migrations, Backups & Type Sync

When you are "Vibe Coding," you will change your database frequently. This loop keeps schema changes tracked in code, keeps the AI's type view honest, and gives you a restore point if something breaks.

> **Two kinds of "sync" in DannFlow.** This doc covers **database** sync — keeping `src/types/supabase.ts` and your backups aligned with the live schema. For **template** sync — pulling command/doc updates from DannFlow upstream — see [branching-and-sync.md](branching-and-sync.md).

## Promoting a reusable database improvement to DannFlow

When a feature built in a project reveals a generic DannFlow primitive—such as hardened profile authorization, reusable memberships, audit logging, or a safer RLS pattern—use `/sync-to-upstream` from the project repository. It automatically detects selected schema, migration, RLS, function, trigger, Storage-policy, and generated-type changes. It must never migrate the project database while preparing an upstream contribution. Instead, it applies the reviewed tracked migrations in a clean DannFlow clone against a dedicated template verification project, regenerates types, verifies the live schema/RLS, commits and pushes the exact PR branch, and posts the PR's human verification checklist before returning its URL.

Project-specific tables, vertical terminology, and client data stay in the project. A reusable pattern belongs upstream only after that generic boundary is clear.

## The loop

1. **Author schema**: Edit `db/schema/*.ts` directly or run `/migrate <description>`.
2. **Generate SQL**: Run `pnpm db:generate` and review `db/migrations/*.sql`.
3. **Apply + sync types**: Run `pnpm db:migrate` to apply migrations and refresh `src/types/supabase.ts`.
4. **Checkpoint**: Every time you finish a feature, run `pnpm checkpoint` (or `/checkpoint`).
   - The script verifies your Supabase MCP connection and generates a prompt.
   - Claude Code reads your live Supabase schema (tables, enums, RLS policies, triggers, functions) via MCP.
   - It writes a new timestamped DDL snapshot under `supabase/backups/`.
   - Example: `supabase/backups/schema-2026-06-18-21-00.sql`.

## Restoring

If you ever break your DB, "restore" by copying the SQL from your most recent checkpoint file in `supabase/backups/` into the Supabase SQL Editor and running it.

## The golden rule

**Schema → Generate SQL → Migrate → Checkpoint.** Do not alter live Supabase schema directly for normal work. If an emergency direct SQL change is explicitly requested, backport it immediately into `db/schema/*.ts` and `db/migrations/`.

## Local contributor setup

New contributors should not need access to the hosted Supabase project just to boot the app. Use the local database flow:

```bash
pnpm db:setup
```

This runs local Supabase, applies `db/migrations/`, and generates `src/types/supabase.ts` from the local database.

When `db/schema/*.ts` changes are ready to save:

```bash
pnpm db:generate add_feature_tables
```

This creates a SQL migration under `db/migrations/`. Review that SQL before applying it to the hosted project:

```bash
pnpm db:migrate
```

For hosted projects, use:

```bash
pnpm db:types:remote
pnpm checkpoint
```

Remote type generation requires `SUPABASE_PROJECT_ID` in `.env.local`.

## See also

- [branching-and-sync.md](branching-and-sync.md) — pulling template updates from DannFlow upstream (a different kind of sync).
- [the-holy-trinity.md](the-holy-trinity.md) — why Types + Schema + Services must stay aligned.
