---
description: Snapshots the live Supabase schema (tables, enums, RLS policies, triggers, functions) to a timestamped SQL file in supabase/backups/.
---

Generate a DDL checkpoint of the live Supabase database.

**Procedure:**

1. **Verify Supabase MCP** is connected. If not, stop and instruct the user.
2. **Ask the user for the Supabase project ID** if not already known from context. Confirm before proceeding.
3. **Pull the live schema** via Supabase MCP:
   - `list_tables` for the `public` schema → table definitions, columns, constraints
   - `list_extensions` → installed extensions
   - `list_migrations` → migration history (for reference, not regeneration)
   - `execute_sql` for: enums (`pg_type WHERE typtype = 'e'`), RLS policies (`pg_policies`), triggers (`pg_trigger`), and functions (`pg_proc WHERE pronamespace = 'public'::regnamespace`)
4. **Generate the full DDL** in this order:
   - Extensions
   - Enums / custom types
   - Tables (with constraints, defaults, comments)
   - Indexes (non-PK)
   - Functions
   - Triggers
   - RLS enablement + policies
5. **Save to** `supabase/backups/schema-MM-DD-YYYY-HH-MM.sql` (use current local time).
6. **Verify the file** — read it back, confirm it includes at minimum: the `profiles` table and the `handle_new_user` function (DannFlow core architecture).

**Output:**

```
✅ Checkpoint saved: supabase/backups/schema-MM-DD-YYYY-HH-MM.sql

Captured:
  - n tables
  - n RLS policies
  - n functions
  - n triggers
  - n enums

Core architecture verified: profiles ✓, handle_new_user ✓
```

If core architecture is missing, FLAG IT LOUDLY — do not silently succeed.
