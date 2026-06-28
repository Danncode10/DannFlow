---
description: Applies an explicit Supabase MCP schema change, records the approved SQL in a tracked migration file, regenerates TypeScript types, and verifies RLS.
argument-hint: <plain-english schema change>
---

Execute a complete tracked Supabase schema change described by `$ARGUMENTS`.

Use this command when the user explicitly wants to manipulate the live Supabase schema through MCP or needs to backport an emergency live SQL change into the repo. For normal planned app schema work, prefer `/migrate`, which edits `db/schema/*.ts`, generates `db/migrations/*.sql`, runs `pnpm db:migrate`, and keeps Drizzle as the source of truth.

This command chains:

`/checkpoint` -> draft SQL -> create tracked migration SQL -> Supabase MCP `apply_migration` -> `/sync-types` -> verification.

## Procedure

### Step 0 - Confirm tooling

Verify these are available before doing schema work:

- Supabase MCP, for live schema reads, `apply_migration`, RLS/policy checks, advisors, and verification.
- Terminal, for reading/writing the tracked SQL migration file and running `/sync-types`.

If Supabase MCP is unavailable, stop and use the AGENTS.md Missing Tool Alert Protocol.

### Step 1 - Understand the request

Parse `$ARGUMENTS` into a concrete schema change. If it is ambiguous, ask one clarifying question.

Check the live schema first with Supabase MCP. Do not assume table or column shape from memory.

### Step 2 - Checkpoint first

Run the `/checkpoint` flow and save a full live-schema backup under:

`supabase/backups/schema-MM-DD-YYYY-HH-MM.sql`

Do not continue if the checkpoint fails.

### Step 3 - Draft SQL

Draft the SQL required for the change.

Include, where applicable:

- Tables, columns, constraints, defaults, and comments.
- Indexes for foreign keys and commonly filtered columns.
- `updated_at` triggers for mutable tables.
- RLS enablement and policies for every new exposed table.
- Ownership predicates consistent with the existing app model.

Security rules:

- Every new exposed table must enable RLS.
- Policies must use `TO authenticated` plus ownership predicates; do not rely on role checks alone.
- UPDATE policies need both `USING` and `WITH CHECK`.
- Avoid `SECURITY DEFINER` unless there is a clear reason and the function is locked down.

Show the full SQL to the user before applying it.

For destructive changes (`DROP`, `TRUNCATE`, type narrowing, removing constraints, or adding `NOT NULL` to existing nullable data), require the user to type `yes`.

### Step 4 - Create a tracked migration file

Before applying the SQL, save the exact approved SQL to a tracked migration file.

Preferred location for this repo:

`db/migrations/YYYYMMDDHHMMSS_<snake_case_name>.sql`

Use the current local timestamp and a concise snake_case name derived from the request, for example:

`db/migrations/20260628143000_add_bio_to_profiles.sql`

The file must include a short header comment:

```sql
-- DannFlow tracked Supabase MCP migration
-- Applied via Supabase MCP apply_migration: <migration_name>
-- Checkpoint: supabase/backups/<checkpoint_file>.sql
```

Then include the exact SQL that will be sent to Supabase MCP.

If the project has adopted native Supabase migration files, create the file with `supabase migration new <name>` first instead of inventing a filename.

### Step 5 - Apply via Supabase MCP

Call Supabase MCP `apply_migration` with:

- `name`: the same snake_case migration name used in the file.
- `query`: the exact SQL saved in the migration file, excluding only header comments if needed.

If apply fails:

- Report the exact error.
- Keep the migration file for review unless the user asks to remove it.
- Cite the rollback checkpoint.
- Do not run `/sync-types`.

### Step 6 - Sync TypeScript types

Run `/sync-types`, which regenerates:

`src/types/supabase.ts`

Never edit `src/types/supabase.ts` manually.

Summarize the generated type drift:

- New tables.
- Removed tables.
- Added, removed, or changed columns.
- Enum changes.

### Step 7 - Backport schema source when needed

If this live change affects app-owned tables represented in `db/schema/*.ts`, update the matching Drizzle schema files after the MCP migration succeeds.

Then run:

```bash
pnpm db:generate
```

If Drizzle generates an overlapping migration, reconcile it with the tracked SQL file so the repo has one authoritative migration for the change.

### Step 8 - Verify live database state

Use Supabase MCP to verify the change:

- For new tables: confirm the table exists and list columns.
- For altered tables: confirm the new/changed column or constraint exists.
- For dropped objects: confirm the object is gone.
- For RLS changes: list policies and confirm RLS is enabled.

### Step 9 - Report

Report in this format:

```text
Schema change applied: <migration_name>

Files:
  - Migration: db/migrations/<timestamp>_<name>.sql
  - Types: src/types/supabase.ts
  - Checkpoint: supabase/backups/<checkpoint>.sql
  - Schema source: db/schema/<file>.ts or n/a

Verified:
  - <specific live database verification>
  - RLS: <enabled/policies confirmed/n/a>

Suggested commit:
  feat(db): <short schema change>
```

## Constraints

- Always checkpoint first.
- Always save the approved SQL to a tracked migration file before applying it.
- Always apply the exact approved SQL with Supabase MCP `apply_migration`.
- Always regenerate `src/types/supabase.ts` after a successful schema change.
- Backport app-owned table changes into `db/schema/*.ts`.
- Never manually edit generated types.
- Never report success until live verification is complete.
- Never `git add` or `git commit` from this command.
