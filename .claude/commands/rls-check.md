---
description: Walks every file in src/services/ and confirms each Supabase query filters by organization_id (tenant isolation). Cross-references src/types/supabase.ts.
---

Audit `src/services/` for RLS compliance — **multi-tenant edition**.

**Procedure:**

1. List every `.ts` file in `src/services/`.
2. For each file, find every Supabase query — patterns like:
   - `.from('<table>').select(...)`
   - `.from('<table>').update(...)`
   - `.from('<table>').delete(...)`
   - `.from('<table>').insert(...)`
3. For each query, check whether it includes a **tenant filter** — typically `.eq('organization_id', tenantId)`.
4. ALSO check for user-level ownership — `.eq('user_id', userId)` — when applicable (within a tenant).
5. Cross-reference the table name against `src/types/supabase.ts` to confirm it actually exists and identify its tenant + owner columns.

**Exceptions** — these don't need a tenant filter:
- Explicitly public reads (e.g. public landing-page content)
- Inserts creating a row FOR the current user (the user_id field IS populated from auth context)
- Service-role admin operations (but flag those for `/security-audit` review)

**⚠️ CRITICAL:** Every query missing `.eq('organization_id', ...)` is a data-leakage risk. Flag as FAIL, not warning.

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
