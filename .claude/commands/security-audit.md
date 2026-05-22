---
description: Full security scan of the working tree or current branch diff. Catches secret leaks, service-role exposure, XSS, missing 'use server', and other OWASP-style issues.
---

Run a thorough security audit on this repo.

**Parallel scan** — the 7 check categories below are independent. For full-tree scans, spawn parallel agents scoped by directory (`src/services/`, `src/app/`, `src/components/`) and merge their findings. For branch-diff scans, a single pass is fine.

**Scope** — default to the current branch diff against `main`. If there are uncommitted changes, include those too. If the branch IS `main`, scan the whole `src/` tree.

**Check for:**

1. **Secret leaks**
   - `SUPABASE_SERVICE_ROLE_KEY` or other secrets referenced in any client component (`'use client'` files) or in `src/app/**` route handlers that don't gate access
   - Hardcoded API keys, tokens, or credentials anywhere
   - `.env*` files accidentally tracked

2. **Service-role misuse**
   - Service-role Supabase client created outside `src/utils/supabase/server.ts` or admin-only code paths
   - Service-role client passed to or imported by anything in `src/components/` or any `'use client'` file

3. **RLS bypass risk**
   - Queries in `src/services/` missing user/ownership filters (`.eq('id', userId)` or equivalent)
   - Use `/rls-check` logic but report inline — do not invoke the other command

4. **Injection vectors**
   - `dangerouslySetInnerHTML` usage — flag every instance, verify content is sanitized
   - User input concatenated into SQL, URLs, or shell commands
   - `eval()`, `new Function()`, or dynamic `require()`

5. **Auth gaps**
   - Server Actions or Route Handlers performing mutations without `'use server'` directive
   - Protected routes missing session checks (compare against the pattern in `src/app/dashboard/`)
   - Password change flows missing re-auth gate (see `src/components/security-form.tsx` as the reference)

6. **Rate limiting**
   - Auth endpoints, password reset, or expensive routes missing Upstash `@upstash/ratelimit` protection

7. **Client-side data leakage**
   - `console.log` of sensitive data in production code
   - Sensitive fields included in props passed from server to client components

**Output format:**

```
🔴 CRITICAL (n)
  - <file>:<line> — <issue> → <fix>

🟡 WARNING (n)
  - <file>:<line> — <issue> → <fix>

🟢 INFO (n)
  - <file>:<line> — <issue> → <suggestion>

Summary: <n critical, n warnings, n info>
```

If zero issues found in a tier, omit that tier. End with a one-line verdict: SAFE TO MERGE / NEEDS FIXES / BLOCK.

Do NOT auto-fix. Report only.

**After reporting** — if any CRITICAL issues are found, save a ruflo memory entry summarizing the finding and its location so it can be recalled next session: e.g. `"security: service-role key exposed in src/app/api/users/route.ts — fix pending"`.
