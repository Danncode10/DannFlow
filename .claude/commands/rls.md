---
description: Inspects RLS policies for a single Supabase table. Returns who can SELECT/INSERT/UPDATE/DELETE and any gaps.
argument-hint: <table-name>
---

Inspect Row Level Security for the table: **$ARGUMENTS**

**Procedure:**

1. Verify Supabase MCP is connected. If not, stop and tell the user to install/connect it.
2. Use the Supabase MCP to query `pg_policies` for the table `$ARGUMENTS` in the `public` schema. (Use `execute_sql` if needed: `SELECT * FROM pg_policies WHERE tablename = '$ARGUMENTS';`)
3. Also check whether RLS is enabled on the table: `SELECT relrowsecurity FROM pg_class WHERE relname = '$ARGUMENTS';`
4. List the table's columns via `list_tables` so you know what the policies are referencing.

**Output:**

```
Table: $ARGUMENTS
RLS enabled: yes/no

Policies:
  ┌─ <policy-name> (<command>)
  │  Roles: <roles>
  │  USING: <expression>
  │  WITH CHECK: <expression-or-none>
  └─ Purpose: <one-line plain-English explanation>

Coverage matrix:
  SELECT: <covered by which policies, or ❌ none>
  INSERT: <...>
  UPDATE: <...>
  DELETE: <...>

Gaps & concerns:
  - <e.g. no DELETE policy means nobody can delete — intentional?>
  - <e.g. USING clause references column that doesn't exist>

Service-layer usage:
  - <file:line in src/services/ that queries this table>
```

If the table doesn't exist, say so and suggest similar table names from `list_tables`.
