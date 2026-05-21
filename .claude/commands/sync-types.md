---
description: Runs npm run update-types, diffs src/types/supabase.ts before and after, and summarizes schema drift.
---

Sync TypeScript types with the live Supabase schema.

**Procedure:**

1. **Snapshot current types** — read `src/types/supabase.ts` and remember its contents.
2. **Run** `npm run update-types` via Bash.
3. **Read the new** `src/types/supabase.ts`.
4. **Diff** the two versions semantically:
   - New tables added
   - Tables removed
   - Columns added/removed/renamed per table
   - Type changes (e.g. `string` → `number`, nullable changes)
   - Enum changes

**Output:**

```
✅ Types regenerated: src/types/supabase.ts

Schema drift detected:

📥 New tables (n)
  - <table_name>: <column-count> columns

🗑️  Removed tables (n)
  - <table_name>

🔧 Modified tables (n)
  - <table_name>
    + added: <col> (<type>)
    - removed: <col>
    ~ changed: <col> <old-type> → <new-type>

Impact:
  - <file:line in src/services/ likely affected by removed/renamed columns>
  - <suggested follow-up: run typecheck, update affected services>
```

If there's no drift, say so in one line and exit. If `npm run update-types` fails, report stderr and stop — don't pretend success.

After reporting, suggest running `npx tsc --noEmit` if any removals/renames were detected, so the user can spot broken consumers.
