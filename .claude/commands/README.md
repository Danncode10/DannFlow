# Custom Slash Commands — DannFlow

Drop `.md` files in this folder to add custom slash commands. Each file becomes `/filename`.

## Available commands

| Command | Purpose |
|---|---|
| `/new-project ["name"]` | **Start a new project (Phase 1).** Interviews you for the project facts, writes `business.json` + `README` + `PROJECT_CONTEXT`, rebrands the code, creates a GitHub repo and repoints `origin` (keeps DannFlow as `upstream`), wires the Claude env (`/business-init` → `/init-claude` → `/ruflo-upgrade`), and stands up the Supabase tenant. |
| `/design-project ["section"]` | **Then design it (Phase 2). ⭐ Use Opus.** Claude reads README + `business.json` + `PROJECT_CONTEXT`, runs a design-taste interview, then strictly replaces the template's placeholder copy, theme, and sections with a bespoke design for this project. |
| `/init-claude` | Reads `README.md` + scans `src/` + `package.json`, then auto-rewrites `CLAUDE.md`, `SKILLS.md`, and refreshes this README to match the actual project state. |
| `/help-dannflow` | Report-only command catalog. Shows how to run DannFlow commands in Claude and through the Codex bridge, grouped by category with a Mermaid graph. |
| `/ask-command` | Meta-router. Describe what you want in plain English; it searches all commands here and returns the best one + a ready-to-paste prompt. |
| `/make-masterplan [--project-owner <owner>] [--project-number <number>]` | Creates `MASTERPLAN.md` from project context and populates a linked GitHub Project with ordered `[P2.1]` task cards. |
| `/update-masterplan [--project-owner <owner>] [--project-number <number>]` | Syncs edits in `MASTERPLAN.md` to the linked GitHub Project, preserving ordered task IDs and live statuses. |
| `/what-task [--project-owner <owner>] [--project-number <number>]` | Shows current task status, prepares Ready tasks when empty, and asks before moving one task to `In progress`; never implements the task. |
| `/verify-task [task-id] [--project-owner <owner>] [--project-number <number>]` | Generates the human verification checklist for an `In progress` task and tells you to run `/close-task` only after it passes. |
| `/close-task [task-id] [--project-owner <owner>] [--project-number <number>]` | After `/verify-task` is confirmed, commits completed work, marks the task complete in `MASTERPLAN.md`, and moves its Project item to `Done`. |
| `/security-audit` | Full security scan: secrets in client bundles, service-role key leaks, `dangerouslySetInnerHTML`, missing `'use server'`, XSS vectors. |
| `/rls-check` | Walks `src/services/` and confirms every query filters by user/ownership. Cross-references `src/types/supabase.ts`. |
| `/rls <table>` | Inspects RLS policies for a single table via Supabase MCP. Returns who can SELECT/INSERT/UPDATE/DELETE and any gaps. |
| `/ui` | Active rewrite — makes the diff (or a target file) fully responsive: mobile-first, 48px touch targets, labels above inputs, focus rings, semantic tokens only. |
| `/checkpoint` | Runs `pnpm checkpoint`: verifies Supabase MCP, pulls live schema, writes timestamped DDL to `supabase/backups/`. |
| `/start-supabase [project ref\|name] [--pause <project ref>]` | Restores/starts the Supabase project from `.env.local` or an explicit ref. Separates MCP-visible active projects from Supabase-counted free-plan projects, explains visibility gaps, and uses strict pause/start commands. |
| `/pause-supabase [project id\|name]` | Lists Supabase projects, confirms the target, pauses it through MCP, and verifies status. |
| `/sync-types` | Regenerates `src/types/supabase.ts`, diffs before/after, summarizes schema drift. |
| `/new-feature <name>` | Reads `src/prompts/features/` blueprint, scaffolds service + types + App Router page + Shadcn form. |
| `/new-page <route>` | Scaffolds an App Router page (Server Component) with `loading.tsx` + `error.tsx`, Card-wrapped layout. |
| `/explain-schema` | Pulls live Supabase schema via MCP → human-readable summary of tables, relationships, RLS policies. |
| `/review` | Pre-PR review: lint + typecheck + critique diff against `CLAUDE.md` guardrails. |
| `/commit` | Stages changes + drafts a conventional commit message. |
| `/cleanup` | Finds dead code, unused exports, orphaned components, stale files. |
| `/sync-commands` | Audits `.claude/commands/` and validates against `claude-workflow.md` and `./guide.sh`. Reports orphaned commands, optionally auto-patches docs. |
| `/auto-docs` | Broader superset of `/sync-commands`. Audits commands, skills, npm scripts, env vars, tech stack, and folder structure for documentation drift. `--fix` auto-patches the safe categories. |
| `/init-update` | Update your DannFlow project to the latest version — pull new commands, scripts, guide, skills, and more while preserving your code. Interactive menu or `--all` for one-command full update. |
| `/adopt-dannflow [--no-protect\|--force]` | Bootstrap a non-DannFlow repo into a first-class DannFlow project: detect shape, install + prove CI, write `dannflow.json`, create the `dev` branch, then run the first sync. Run once per repo. |
| `/sync-upstream [path|--commits [N]]` | Pull selective file or commit updates from DannFlow upstream. Lands changes on a `feat/sync-*` branch → PR into `dev`. File-level diff is the default — safe for forked-and-rewritten repos with no common git ancestry. Opt-in commit-level cherry-pick with `--commits`. |
| `/sync-to-upstream [path\|--dry-run]` | Contribute local improvements back UP to DannFlow. Classifies changes as generic vs. business-specific, then opens a clean PR into DannFlow `main`. |
| `/update-dannflow [--init]` | Smart entry point — auto-detects your `dannflow.json` version anchor and pulls the latest upstream updates. Creates the anchor if missing. |
| `/no-conflict` | Audits repo for conflicts between documentation (README, CLAUDE.md) and actual code — technology versions, features, commands, RLS enforcement, semantic tokens, folder structure. Reports only. |
| `/seed <table\|all>` | Generates realistic, type-safe seed data from `src/types/supabase.ts`. Respects FK order and RLS ownership. Writes to `supabase/seeds/`. |
| `/migrate <description>` | Edits `db/schema/*.ts`, generates SQL in `db/migrations/`, applies with `pnpm db:migrate`, verifies Supabase, and syncs types. |
| `/schema-change <description>` | Explicit live Supabase MCP schema workflow: checkpoint → approved SQL → tracked `db/migrations/*.sql` file → apply_migration → sync types → verify. |
| `/seo-check [route]` | Per-route SEO audit: metadata, OG, canonical, sitemap.ts, robots.ts, JSON-LD, alt text, heading hierarchy. Reports only. |
| `/seo-fix <route\|all>` | Active rewrite — adds missing SEO essentials. Scaffolds `sitemap.ts`, `robots.ts`, metadata blocks, JSON-LD. Plan-then-confirm. |
| `/marketing-check [route]` | Conversion-fundamentals audit for landing/marketing pages — headline, CTA, social proof, friction, pricing legibility. Opinionated, judgement-heavy. Reports only. |
| `/hero-bg [creative direction]` | Inspects the active hero and produces a guided two-image, one 8-second video AI-background workflow with prompt and delivery instructions. |
| `/ruflo-upgrade` | Re-applies Ruflo memory + parallel-agent patterns to the 8 core commands. Safe to re-run after `/init-update`. |
| `/make-command` | Creates a new custom slash command from a plain-English description. Auto-updates documentation and proposes conflict-avoidance edits to existing commands or SKILLS.md. |
| `/masterplan-task` | Execute an ordered task from MASTERPLAN.md, keep its Project item `In progress`, and tell you to run `/verify-task` when implementation appears ready. |

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

## Keeping this index current

This table covers the core DannFlow commands. The folder also contains Ruflo/claude-flow
command packs (`claude-flow-*`, plus the `agents/`, `swarm/`, `sparc/`, etc. subfolders) that
aren't listed individually here. To reconcile this index with what's actually on disk, run
`/auto-docs` (broad drift check) or `/sync-commands` (command-specific) — they detect orphaned
or undocumented commands and can auto-patch.
