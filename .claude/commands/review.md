---
description: Pre-PR review. Runs lint and typecheck, then critiques the current branch diff against CLAUDE.md guardrails.
---

Review the current branch before opening a PR.

**Procedure:**

0. **Check ruflo memory** — search for project-specific conventions, prior review decisions, or patterns the team has agreed on (e.g. "we use server actions, not API routes", "all forms need optimistic updates"). Apply these as additional guardrails during step 3.

1. **Identify the diff** — `git diff main...HEAD` plus any uncommitted changes. If on `main` with uncommitted changes, review those.

2. **Run automated checks + guardrail critique in parallel** — these three jobs are independent, spawn agents simultaneously:
   - Agent A: `npm run lint` + `npx tsc --noEmit` + `git status`
   - Agent B: Critique diff against `CLAUDE.md` guardrails (step 3 below)
   - Agent C: Apply any project-specific patterns recalled from ruflo memory in step 0

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

**After the report** — if new project conventions surface during the review (patterns the team is consistently applying that aren't in CLAUDE.md), save them to ruflo memory so future reviews enforce them automatically.
