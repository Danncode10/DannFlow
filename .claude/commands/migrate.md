---
description: Wraps the full migration flow — checkpoint → apply_migration → sync-types — into one step. Plain-English description in, type-safe code out.
argument-hint: <plain-english description of the schema change>
---

Execute a complete, safe Supabase migration described by `$ARGUMENTS`. Chains `/checkpoint` → migration SQL → `apply_migration` (via Supabase MCP) → `/sync-types`, with confirmation gates between destructive steps.

## Procedure

### Step 0 — Check ruflo memory

Before drafting SQL, search ruflo memory for prior decisions related to this table or domain (e.g. if adding a column to `profiles`, search "profiles", the column topic, or the feature name). Retrieve any relevant schema decisions, naming conventions, or "why not" context.

### Step 1 — Understand the request

Parse `$ARGUMENTS` into a concrete schema change. Examples:
- "add a `bio` text column to profiles" → `ALTER TABLE public.profiles ADD COLUMN bio text;`
- "create a `posts` table with a user_id FK" → `CREATE TABLE` + RLS policies + trigger
- "drop the `legacy_field` from users" → destructive — ⚠️ extra confirmation

If the request is ambiguous (e.g. "add a posts table" without saying which columns), ask ONE clarifying question, then proceed.

### Step 2 — Checkpoint first (mandatory)

Run the `/checkpoint` flow: verify Supabase MCP, snapshot the live schema to a timestamped file in `supabase/backups/`. **Never skip this**, even for additive changes.

If `/checkpoint` fails (MCP down, write error), stop. Report the error. Do not proceed.

### Step 3 — Draft the migration SQL

Based on the parsed change, draft:

1. **The migration SQL itself** — `ALTER`, `CREATE`, `DROP`, etc.
2. **RLS policies** — if creating a new table, every table MUST have RLS enabled and at minimum an ownership policy (`auth.uid() = user_id` or equivalent). This is non-negotiable per CLAUDE.md.
3. **Indexes** — for any new FK or commonly filtered column.
4. **Triggers** — if the table needs `updated_at` auto-update, include the trigger.

Show the full SQL to the user with a header:

```
📋 Proposed migration: <short name derived from request>

Description: <one-line>
Safety: ✅ Additive  /  ⚠️ Destructive  /  🛑 Irreversible

SQL:
─────────────────────────────────────────
<the full SQL>
─────────────────────────────────────────

This will:
  - <plain-english effect 1>
  - <plain-english effect 2>

RLS coverage: <"included" / "n/a — not a new table">
Rollback: <"snapshot in supabase/backups/<file>.sql" — always cite the checkpoint file>

Proceed? (y/n)
```

For destructive changes (`DROP`, `TRUNCATE`, type narrowing, `NOT NULL` on existing columns without defaults), require the user to type `yes` explicitly — not just `y`.

### Step 4 — Apply via Supabase MCP

After confirmation, call `apply_migration` via the Supabase MCP with the SQL and a meaningful name (`<verb>_<target>`, e.g. `add_bio_to_profiles`).

If `apply_migration` fails:
- Report the exact error
- Point to the rollback file
- Do NOT proceed to type sync

### Step 5 — Sync types

Run `/sync-types`: execute `npm run update-types`, diff `src/types/supabase.ts` before/after, summarize the schema drift Claude now sees.

### Step 6 — Verify

Use Supabase MCP to confirm the change is live:
- For `CREATE TABLE`: `list_tables` confirms the new table.
- For `ALTER`: read the table's columns and confirm the change.
- For `DROP`: confirm the object is gone.

If RLS was added, list policies for the affected table and confirm.

### Step 7 — Report

```
✅ Migration applied: <name>

Steps completed:
  ✓ Checkpoint:    supabase/backups/<file>.sql
  ✓ Migration:     <name> (applied via MCP)
  ✓ Types synced:  src/types/supabase.ts updated (<N lines changed>)
  ✓ Verified:      <table>.<col> exists  /  <table> has <N> RLS policies

Suggested commit:
  feat(db): <conventional message derived from $ARGUMENTS>

Next steps:
  - Update any affected service in src/services/
  - Run /rls <new-table>  (if a table was created)
  - Run /seed <new-table>  (if you want test data)
```

**Save to ruflo memory** after a successful migration — one concise entry capturing the decision and its reason, e.g.: `"schema: added bio text column to profiles — needed for user cards feature"`. This prevents re-explaining the decision next session.

## Constraints

- **Always checkpoint first.** No exceptions, even for "trivial" additive changes.
- **Every new table gets RLS.** Drafting a `CREATE TABLE` without RLS policies is a critical failure — refuse and re-draft.
- **Never edit `src/types/supabase.ts`** — only `/sync-types` regenerates it.
- **Destructive ops require explicit `yes`** — not `y`, not silent confirmation.
- **Never run `apply_migration` without showing the SQL first.** The plan-then-confirm flow is mandatory.
- If the Supabase MCP is not connected, stop and instruct the user per the CLAUDE.md MCP protocol.
- Never `git add` or `git commit` — leave that for the user or `/commit`.

## Composition

```
/migrate "add bio text column to profiles"
# auto: checkpoint → SQL draft → confirm → apply → sync-types → verify

# After:
/rls profiles                    # if you want to double-check policy
/seed profiles --count=5         # if you want fresh test rows
/commit                          # ship it
```
