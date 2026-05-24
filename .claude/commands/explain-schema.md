---
description: Pulls the live Supabase schema via MCP and produces a human-readable summary of tables, relationships, and RLS policies.
---

Produce a plain-English summary of the live Supabase schema.

**Procedure:**

1. Verify Supabase MCP is connected.
2. Pull schema via MCP:
   - `list_tables` for `public` schema
   - `pg_policies` for RLS info
   - Foreign key relationships from `information_schema.table_constraints` + `key_column_usage`

3. Synthesize, don't dump. The user doesn't want raw SQL — they want to understand the model.
4. **Multi-tenancy emphasis** — highlight the `organization_id` foreign key and its RLS role in every table. This is the security boundary.

**Output format:**

```
📊 Schema overview
<2-3 sentences on what this database does at a high level>

Tables (n)

┌─ <table_name>
│  Purpose: <one-line — inferred from columns + naming>
│  Columns: <count> (<key columns highlighted>)
│  Relationships:
│    → <foreign_table>.<column> (FK)
│    ← referenced by <other_table>
│  RLS: <enabled? n policies — one-line summary of who can do what>
└─

(repeat per table)

🔗 Key relationships
<bullet list of important joins, e.g. "profiles 1:1 auth.users via id">

🔒 RLS summary
<bullet list of the security model in plain English, e.g. "Users can only read/update their own profile">

⚠️ Concerns
<anything notable: tables without RLS, missing FK indexes, orphaned tables>
```

Keep it scannable. Use the existing `src/types/supabase.ts` as a sanity check — flag if the live schema has tables not in the types file (meaning types are stale, suggest `/sync-types`).
