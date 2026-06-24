---
description: Safely changes database schema through Drizzle schema files, generated SQL migrations, Supabase verification, and synced types.
argument-hint: <plain-english description of the schema change>
---

Execute a complete DannFlow database migration described by `$ARGUMENTS`.

The source of truth is `db/schema/*.ts`. Do **not** use Supabase MCP `apply_migration` for normal schema changes.

## Procedure

### Step 0 — Check ruflo memory

Before changing schema, search ruflo memory for prior decisions related to this table or domain. Surface relevant naming conventions, RLS decisions, or "why not" context before editing.

### Step 1 — Understand the request

Parse `$ARGUMENTS` into a concrete schema change.

Examples:
- "add a `bio` text column to profiles" → edit `db/schema/core.ts`
- "create a `posts` table with a user_id FK" → add a table file or extend an existing schema module, then include RLS SQL in the generated migration
- "drop the `legacy_field` from users" → destructive — require explicit confirmation

If the request is ambiguous, ask one clarifying question.

### Step 2 — Checkpoint before risky changes

For destructive or live-project changes, run `/checkpoint` first to snapshot the live schema into `supabase/backups/`.

For purely local additive changes, a checkpoint is recommended but not required.

### Step 3 — Edit Drizzle schema

Edit the appropriate file under `db/schema/`.

Rules:
- Tables, columns, indexes, enums, and relations belong in `db/schema/*.ts`.
- Split large domains into focused files and re-export from `db/schema/index.ts`.
- Never edit `src/types/supabase.ts` manually.
- New tables must include tenant/ownership columns consistent with the existing app model.

### Step 4 — Generate and review SQL

Run:

```bash
pnpm db:generate
```

Review the generated SQL in `db/migrations/`.

Add Supabase-specific SQL directly to the generated migration when needed:
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- RLS policies
- auth triggers and functions
- storage buckets and storage policies
- extensions, grants, and comments

Every new exposed table must have RLS before the migration is applied.

### Step 5 — Apply migration

After showing the migration summary and getting confirmation for destructive changes, run:

```bash
pnpm db:migrate
```

This applies `db/migrations/` using `DATABASE_URL` and refreshes `src/types/supabase.ts`.

If migration fails:
- Report the exact error.
- Do not hand-edit the live database unless the user explicitly requests an emergency hotfix.
- Fix `db/schema/*.ts` or the generated migration, then retry.

### Step 6 — Verify

Use Supabase MCP or SQL inspection to confirm the live schema:
- New table exists.
- Altered columns exist with the expected type/nullability/default.
- RLS is enabled for new exposed tables.
- Policies, functions, triggers, and storage objects exist when expected.

Run:

```bash
npx tsc --noEmit
```

### Step 7 — Report

Use this format:

```text
✅ Migration prepared/applied: <short name>

Changed:
  - db/schema/<file>.ts
  - db/migrations/<file>.sql
  - src/types/supabase.ts

Verified:
  - <verification summary>

Suggested commit:
  feat(db): <conventional message>
```

Save a concise ruflo memory entry after a successful migration.

## Constraints

- `db/schema/*.ts` is the schema source of truth.
- `db/migrations/*.sql` is the reviewed/applyable SQL history.
- `src/types/supabase.ts` is generated output.
- Do not use Supabase MCP `apply_migration` for normal tracked changes.
- Emergency direct SQL changes must be backported immediately into `db/schema/*.ts` and `db/migrations/`.
- Destructive operations require explicit `yes`.
- Never `git add` or `git commit`; leave that for the user or `/commit`.
