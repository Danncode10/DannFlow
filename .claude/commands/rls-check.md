---
description: Walks every file in src/services/ and confirms each Supabase query matches the project's RLS ownership or admin policy. Cross-references src/types/supabase.ts.
---

Audit `src/services/` for RLS compliance — **single-project edition**.

**Procedure:**

1. List every `.ts` file in `src/services/`.
2. For each file, find every Supabase query — patterns like:
   - `.from('<table>').select(...)`
   - `.from('<table>').update(...)`
   - `.from('<table>').delete(...)`
   - `.from('<table>').insert(...)`
3. For each query, identify the table's RLS policy and confirm the operation is authorized by user ownership, an admin policy, or an explicit public policy.
4. Check for an explicit `.eq('user_id', userId)` filter when a table has user-owned rows.
5. Cross-reference the table name against `src/types/supabase.ts` to confirm it exists and identify ownership columns.

**Exceptions** — these don't need a tenant filter:
- Explicitly public reads (e.g. public landing-page content)
- Inserts creating a row FOR the current user (the user_id field IS populated from auth context)
- Service-role admin operations (but flag those for `/security-audit` review)

**⚠️ CRITICAL:** Every query without a matching RLS authorization path is a data-leakage risk. Flag as FAIL, not warning.

**Output:**

```
✅ Compliant (n queries)
  - <file>:<line> — <table>.<op> filtered by <column>

❌ MISSING FILTER (n queries)
  - <file>:<line> — <table>.<op> — no ownership filter
    Fix: add .eq('<owner-column>', userId)

⚠️ AMBIGUOUS (n queries) — needs human review
  - <file>:<line> — <reason>
```

End with: `RLS verdict: PASS / FAIL — n queries scanned across n files.`

Do not modify code. Report only.
