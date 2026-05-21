---
description: Finds dead code, unused exports, orphaned components, and stale files. Reports only — does not delete.
---

Scan the repo for cruft and report what's safe to remove.

**Procedure:**

1. **Unused exports** — for each `.ts` / `.tsx` file in `src/`, find exported symbols (functions, components, types, constants). For each, grep the rest of `src/` for imports. Anything imported zero times is a candidate.

2. **Orphaned components** — files in `src/components/` not imported anywhere in `src/app/` or other components.

3. **Dead service functions** — functions in `src/services/*.ts` not called from any page, component, or other service.

4. **Stale routes** — directories in `src/app/` with a `page.tsx` but no inbound links anywhere in the codebase. (Heuristic — could be intentional, flag for human review.)

5. **Unused dependencies** — for each entry in `package.json` dependencies, grep `src/` for imports. Anything imported zero times is a candidate (be careful: some deps are used transitively or via config files).

6. **Stale backups** — files in `supabase/backups/` older than 90 days. (Don't suggest deleting — just list with dates.)

7. **TODO/FIXME debt** — grep `src/` for `TODO`, `FIXME`, `XXX`, `HACK`. List with file:line.

**Output:**

```
🧹 Cleanup candidates

🪦 Unused exports (n)
  - <file>:<symbol> — last commit touching this: <hash> <date>

👻 Orphaned components (n)
  - <file>

💀 Dead service functions (n)
  - <file>:<function>

🛣️  Stale routes (n) — VERIFY before removing
  - <route>

📦 Unused dependencies (n) — VERIFY before removing
  - <package>

📅 Old backups (>90 days) (n)
  - <file> (<date>)

📝 TODO/FIXME debt (n)
  - <file>:<line> — <text>

Summary: <n total cleanup candidates>
```

**Do NOT delete anything.** Only report. After the report, ask the user which categories they want to actually clean up — then handle removals one category at a time with explicit confirmation.

False-positive watch:
- Files imported dynamically (e.g. `import()`) won't show in grep — flag this caveat in the output
- Type-only imports and re-exports can be missed by naive grep — note this too
