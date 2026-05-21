---
description: Pre-PR review. Runs lint and typecheck, then critiques the current branch diff against CLAUDE.md guardrails.
---

Review the current branch before opening a PR.

**Procedure:**

1. **Identify the diff** — `git diff main...HEAD` plus any uncommitted changes. If on `main` with uncommitted changes, review those.

2. **Run automated checks** in parallel:
   - `npm run lint`
   - `npx tsc --noEmit` (typecheck)
   - `git status` (uncommitted files)

3. **Critique the diff** against `CLAUDE.md` guardrails:

   - **Service layer** — any Supabase query in a component instead of `src/services/`?
   - **Type safety** — any `any` usage? Any missing types?
   - **RLS** — any new service queries missing ownership filters?
   - **Server-first** — any unnecessary `'use client'` (no state/events/browser APIs)?
   - **Semantic tokens** — any hex codes, `rgba()`, or hardcoded color words in `className`?
   - **Shadcn primitives** — any raw `<button>` or `<input>` that should be Shadcn components?
   - **Mobile-first** — any layouts that won't work at 375px?
   - **Forms** — labels above inputs? Focus rings? Error states with `text-destructive`?
   - **Structure** — any arbitrary folder restructuring?

4. **Output format:**

```
🔧 Automated checks
  Lint: ✅/❌ (<n errors, n warnings>)
  Typecheck: ✅/❌ (<n errors>)

📋 Guardrail review

🔴 Must fix (n)
  - <file>:<line> — <issue> → <fix>

🟡 Should fix (n)
  - <file>:<line> — <issue> → <fix>

🟢 Nitpicks (n)
  - <file>:<line> — <suggestion>

✅ What's good
  - <one-line praise for non-trivial good choices>

Verdict: READY / NEEDS FIXES / BLOCK
Suggested commit message: <conventional commit one-liner>
```

If lint or typecheck fails, list the actual errors (not just "X errors"). If everything passes, end with: `READY — run /commit to stage and draft the message.`

Do not modify code. Report only.
