---
description: Walks every file in src/services/ and confirms each Supabase query filters by user/ownership. Cross-references src/types/supabase.ts.
---

Audit `src/services/` for RLS compliance.

**Procedure:**

1. List every `.ts` file in `src/services/`.
2. For each file, find every Supabase query — patterns like:
   - `.from('<table>').select(...)`
   - `.from('<table>').update(...)`
   - `.from('<table>').delete(...)`
   - `.from('<table>').insert(...)`
3. For each query, check whether it includes an ownership filter — typically `.eq('id', userId)`, `.eq('user_id', userId)`, or equivalent.
4. Cross-reference the table name against `src/types/supabase.ts` to confirm it actually exists and identify its owner column.

**Exceptions** — these don't need an ownership filter:
- Explicitly public reads (e.g. fetching the `creatorRepos` list from a public table)
- Inserts where the row is being created FOR the current user (the user_id field IS the filter)
- Service-role admin operations (but flag those for `/security-audit` review)

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
