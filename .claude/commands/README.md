# Custom Slash Commands — DannFlow

Drop `.md` files in this folder to add custom slash commands. Each file becomes `/filename`.

## Planned commands

| Command | Purpose |
|---|---|
| `/init-claude` | Reads `README.md` + scans `src/` + `package.json`, then auto-rewrites `CLAUDE.md`, `SKILLS.md`, and refreshes this README to match the actual project state. |
| `/ask-command` | Meta-router. Describe what you want in plain English; it searches all commands here and returns the best one + a ready-to-paste prompt. |
| `/security-audit` | Full security scan: secrets in client bundles, service-role key leaks, `dangerouslySetInnerHTML`, missing `'use server'`, XSS vectors. |
| `/rls-check` | Walks `src/services/` and confirms every query filters by user/ownership. Cross-references `src/types/supabase.ts`. |
| `/rls <table>` | Inspects RLS policies for a single table via Supabase MCP. Returns who can SELECT/INSERT/UPDATE/DELETE and any gaps. |
| `/ui` | Active rewrite — makes the diff (or a target file) fully responsive: mobile-first, 48px touch targets, labels above inputs, focus rings, semantic tokens only. |
| `/checkpoint` | Runs `npm run checkpoint`: verifies Supabase MCP, pulls live schema, writes timestamped DDL to `supabase/backups/`. |
| `/sync-types` | Runs `npm run update-types`, diffs `src/types/supabase.ts` before/after, summarizes schema drift. |
| `/new-feature <name>` | Reads `src/prompts/features/` blueprint, scaffolds service + types + App Router page + Shadcn form. |
| `/new-page <route>` | Scaffolds an App Router page (Server Component) with `loading.tsx` + `error.tsx`, Card-wrapped layout. |
| `/explain-schema` | Pulls live Supabase schema via MCP → human-readable summary of tables, relationships, RLS policies. |
| `/review` | Pre-PR review: lint + typecheck + critique diff against `CLAUDE.md` guardrails. |
| `/commit` | Stages changes + drafts a conventional commit message. |
| `/cleanup` | Finds dead code, unused exports, orphaned components, stale files. |
| `/sync-commands` | Audits `.claude/commands/` and validates against `claude-workflow.md` and `./guide.sh`. Reports orphaned commands, optionally auto-patches docs. |
| `/no-conflict` | Audits repo for conflicts between documentation (README, CLAUDE.md) and actual code — technology versions, features, commands, RLS enforcement, semantic tokens, folder structure. Reports only. |

## File format

Each command is a markdown file with optional YAML frontmatter:

```markdown
---
description: One-line summary used by /ask-command for routing.
argument-hint: <name> (optional — shown in help)
---

The prompt that Claude executes when you run /commandname.
Use $ARGUMENTS to reference args the user typed after the command.
```

## Status

Empty for now. Commands will be added one at a time after planning is locked in.
