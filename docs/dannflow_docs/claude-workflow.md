# Claude Workflow

> The Claude Code setup for this repo. Read this once. Then forget about it.

## TL;DR

```
1. Configure GitHub MCP + Supabase MCP
2. Run /new-project to describe and initialize the SaaS
3. Create a Kanban-style GitHub Project
4. Run /masterplan-init, then start Phase 0
```

That's the whole workflow. Everything else is detail.

---

## The setup, step by step

### Step 1 — Configure GitHub MCP and Supabase MCP

Follow [MCP setup](mcp-setup.md) before beginning. GitHub MCP must be able to access GitHub Projects; Supabase MCP must be able to verify the hosted project.

### Step 2 — Run `/new-project`

`/new-project` collects and writes the product description into `README.md`, `PROJECT_CONTEXT.md`, and code-owned configuration, connects the repository and Supabase project, and verifies tracked migrations. Do not manually mark this template initialized.

### Step 3 — Create the Kanban board

Create a non-draft GitHub Project in Kanban/Board layout with these Status values: `Backlog`, `Ready`, `In progress`, and `Done`.

### Step 4 — Run `/masterplan-init`

In Claude Code, run:

```
/masterplan-init
```

This detects the completed project, links the existing board, creates detailed Phase 0 and its cards, and leaves later phases concise. It never creates a GitHub Project or a draft board.

### Step 5 — Start building

You're done with setup. From here on, the daily loop is:

```
1. Ask Claude to build something
2. /migrate              → for schema changes (db/schema → db/migrations → Supabase)
3. /checkpoint           → snapshot live DB before risky/destructive changes
4. /review               → before opening a PR
5. /commit               → stage + draft commit message
```

---

## The full command list

> **Live source of truth**: run `./guide.sh commands` for the current list — it reads `.claude/commands/*.md` at runtime. The tables below are kept in sync by `/init-claude` but may drift between runs.

Run `/ask-command <what you want>` if you don't remember which command to use.

### Discovery & setup
| Command | What it does |
|---|---|
| `/help-dannflow` | Report-only command catalog. Shows Claude and Codex usage, grouped command categories, and a Mermaid graph. |
| `/ask-command <intent>` | Tells you which command to use for your task. Returns a copy-paste-ready prompt. |
| `/init-claude` | Rewrites the entire Claude environment (`CLAUDE.md`, `SKILLS.md`, commands README, individual commands, and this file's command tables) to match the current README + src + package.json. Plan-then-confirm flow. |
| `/make-command <description>` | Creates a new custom slash command from a plain-English description. Auto-updates this file's tables and proposes conflict-avoidance edits to existing commands. |
| `/new-project [name]` | Initializes the SaaS identity, repository, Supabase connection, and tracked schema. |
| `/masterplan-init` | Requires an existing Kanban-style GitHub Project, then links it and creates detailed Phase 0 cards. |
| `/make-masterplan <phase>` | Expands a later phase without overwriting Phase 0. |
| `/update-masterplan [--project-owner <owner>] [--project-number <number>]` | Syncs `MASTERPLAN.md` edits to the linked GitHub Project while preserving task order and live statuses. |

### Security & quality
| Command | What it does |
|---|---|
| `/security-audit` | Full security scan: secret leaks, service-role exposure, XSS, missing auth gates, rate-limiting gaps. |
| `/rls-check` | Walks `src/services/` and confirms every Supabase query has an ownership filter. |
| `/rls <table>` | Inspects RLS policies for one table. Useful for "why can't this user see X?" debugging. |
| `/ui` | **Active rewrite.** Makes the diff (or a target file) fully responsive — mobile-first, 48px touch targets, semantic tokens only. |
| `/review` | Pre-PR review. Runs lint + typecheck, then critiques diff against `CLAUDE.md` guardrails. |

### Supabase workflow
| Command | What it does |
|---|---|
| `/checkpoint` | Snapshots live schema (tables, RLS, triggers, functions) to `supabase/backups/schema-MM-DD-YYYY-HH-MM.sql`. |
| `/sync-types` | Regenerates `src/types/supabase.ts` from Supabase and summarizes drift. Usually handled by `pnpm db:migrate`. |
| `/explain-schema` | Plain-English summary of your live Supabase schema. |
| `/migrate <description>` | Edits `db/schema/*.ts`, generates `db/migrations/*.sql`, applies with `pnpm db:migrate`, then verifies Supabase. |
| `/seed <table\|all>` | Generates type-safe seed data from `src/types/supabase.ts`. Respects FK dependency order and RLS ownership. Writes to `supabase/seeds/`. Never auto-applies. |
| `/setup-supabase` | Guides environment values, tracked migration, types, and hosted schema/RLS verification. |
| `/setup-auth` | Guides selected auth providers, redirects, branded emails, and smoke tests. |

### Scaffolding
| Command | What it does |
|---|---|
| `/new-feature <name>` | Scaffolds service + types + App Router page + Shadcn form for a new feature. |
| `/new-page <route>` | Scaffolds an App Router page (Server Component) with `loading.tsx` + `error.tsx`. |
| `/masterplan-task <task>` | Execute a single ordered task from `MASTERPLAN.md` with full context. Moves the linked GitHub Project item through `In progress` → `Done` and auto-generates `TEST.md` verification guide. |

### SEO & marketing
| Command | What it does |
|---|---|
| `/seo-check [route]` | Per-route SEO audit — metadata, OG, canonical, sitemap.ts, robots.ts, JSON-LD, alt text, heading hierarchy. Reports gaps only. |
| `/seo-fix <route\|all>` | Active rewrite — adds missing metadata, OG, canonical, JSON-LD, sitemap/robots files. Plan-then-confirm. |
| `/marketing-check [route]` | Conversion-fundamentals audit for landing/pricing pages — headline clarity, CTA, social proof, friction, pricing legibility. Opinionated. Reports only. |
| `/hero-bg [creative direction]` | Inspects the active hero and creates a guided two-image, single 8-second AI-video background workflow with prompts and asset-delivery instructions. Does not modify code or generate media. |

### Housekeeping
| Command | What it does |
|---|---|
| `/commit` | Stages changes + drafts a conventional commit message. |
| `/cleanup` | Finds dead code, unused exports, orphaned components. Reports only — never deletes. |
| `/sync-commands` | Audits `.claude/commands/` and validates docs against `claude-workflow.md` + `./guide.sh`. Identifies orphaned commands, optionally auto-patches. |
| `/auto-docs` | Broader superset of `/sync-commands`. Audits commands, skills, npm scripts, env vars, tech stack, and folder structure for drift. `--fix` auto-patches the safe categories (commands/skills/scripts/env); stack and structure are report-only. |
| `/init-update` | Update your DannFlow project to the latest version — pull new commands, scripts, guide, skills, and more while preserving your code. Interactive menu or `--all` for one-command full update. |
| `/sync-upstream [path|--commits [N]]` | Pull selective file or commit updates from DannFlow upstream. File-level diff is default — safe for forked repos with no common git ancestry. |
| `/sync-to-upstream` | Reverse of `/sync-upstream`. Classifies your local changes as generic (upstream candidates) vs. business-specific (keep local), then prepares a clean patch or GitHub PR to contribute back to DannFlow. |
| `/no-conflict` | Audits repo for conflicts between documentation (README, CLAUDE.md) and actual code — versions, features, commands, RLS, semantic tokens, folder structure. Reports only. |
| `/ruflo-upgrade` | Re-applies Ruflo memory + parallel-agent patterns to the 5 core commands (`/new-feature`, `/new-page`, `/security-audit`, `/seo-fix`, `/migrate`). Safe to re-run after `/init-update`. |

---

## Ruflo command namespace (beta — separate from DannFlow)

If you ran `npx ruflo@latest init wizard`, your `.claude/commands/` directory **also** contains a large set of Ruflo-installed commands organized by topic:

```
.claude/commands/
├── <DannFlow commands>.md      ← curated, listed in the tables above
├── claude-flow-help.md         ← Ruflo
├── claude-flow-memory.md       ← Ruflo
├── claude-flow-swarm.md        ← Ruflo
├── agents/                     ← Ruflo (agent lifecycle: spawn, list, metrics…)
├── analysis/                   ← Ruflo (bottleneck, token-usage, performance…)
├── automation/                 ← Ruflo (auto-agent, smart-spawn, self-healing…)
├── coordination/               ← Ruflo (orchestrate, task-orchestrate…)
├── github/                     ← Ruflo (pr-manager, code-review-swarm, release-swarm…)
├── hive-mind/                  ← Ruflo (hive-mind-spawn, consensus, memory…)
├── hooks/                      ← Ruflo (pre-task, post-edit, session-end…)
├── memory/                     ← Ruflo (memory-search, memory-persist, neural…)
├── monitoring/                 ← Ruflo (swarm-monitor, agent-metrics, real-time…)
├── optimization/               ← Ruflo (parallel-execute, topology-optimize…)
├── sparc/                      ← Ruflo (SPARC modes: architect, coder, tester, debug…)
├── swarm/                      ← Ruflo (swarm-init, swarm-spawn, strategies…)
└── workflows/                  ← Ruflo (workflow-create, workflow-execute…)
```

**Rules of thumb:**

- The tables above (Discovery & setup, Security & quality, Supabase workflow, Scaffolding, Housekeeping) document **DannFlow's commands only**. They will never list Ruflo commands.
- `/sync-commands` is scoped to the top level of `.claude/commands/` and explicitly skips the Ruflo subdirectories and the three `claude-flow-*.md` files. Ruflo commands are **not** orphans.
- Ruflo commands live and die with the Ruflo install. To update them, re-run `npx ruflo@latest init wizard`. To remove them, delete the relevant subdirectory (or uninstall Ruflo).
- Don't move Ruflo commands up to the top level — that breaks `/sync-commands` scoping and Ruflo's own expectations.

For what each Ruflo command does, run `/claude-flow-help` (top-level) or open the file directly.

---

## Design taste skill packs (three upstream sources)

`install.sh` installs three complementary design-taste skill packs (refreshable via `./guide.sh skills-update`). Sources live in `.agents/skills/<name>/` and are symlinked into `.claude/skills/<name>/`. These are **skills**, not slash commands — they're invoked by Claude when relevant, not typed with `/`.

| Pack | Repo | Skills | Risk |
|---|---|---|---|
| Leonxlnx | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 12 broad design-taste skills | Low |
| Emil Kowalski | [emilkowalski/skill](https://github.com/emilkowalski/skill) | `emil-design-eng` (animation/UI craft) | Low |
| Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `impeccable` (anti-pattern critique, 23 commands) | ⚠️ Med |

**Most relevant skills for DannFlow work:**

| Skill | Trigger |
|---|---|
| `design-taste-frontend` (Leonxlnx) | Default polish pass after `/ui` |
| `redesign-existing-projects` (Leonxlnx) | Auditing/upgrading an existing screen |
| `high-end-visual-design` (Leonxlnx) | Premium landing/marketing surfaces |
| `minimalist-ui` (Leonxlnx) | Clean editorial style (good SaaS default) |
| `full-output-enforcement` (Leonxlnx) | Long generations that risk truncation |
| `emil-design-eng` (Emil) | Any animation/interaction surface — drawers, modals, popovers, hovers, press states |
| `impeccable` (pbakaus) | Pre-merge audit + anti-pattern scan on big visual changes |

**Rule:** taste skills run *after* `/ui` (which handles hard rules: responsive, 48px, semantic tokens, a11y). Don't polish a layout that may still get restructured. Full table + risk notes in [SKILLS.md](../../SKILLS.md).

To pull the latest skill definitions:
```bash
./guide.sh skills-update
```

---

## Quality skill packs (three utility sources)

`install.sh` also installs three non-visual skill packs alongside the taste packs. Same `./guide.sh skills-update` refreshes them all.

| Skill | Source | Auto-triggers when |
|---|---|---|
| `claude-api` | [anthropics/skills](https://github.com/anthropics/skills) | A file imports `@anthropic-ai/sdk` or you ask about prompt caching / model migration. Use if/when DannFlow grows AI features. |
| `shadcn` | [shadcn/ui](https://github.com/shadcn-ui/ui) | Project has `components.json` (DannFlow does). Provides current Shadcn component docs + composition guidance. |
| `a11y-audit` | [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | You ask for WCAG 2.2 A/AA compliance, contrast checks, ARIA review, or alt-text passes. |

All three are Low Risk. They complement `/ui` (hard responsive/touch-target rules) by adding domain knowledge `/ui` doesn't carry.

---

## SEO + Marketing skill packs (two upstream sources, 30+ skills)

`install.sh` also installs two growth-focused packs since DannFlow targets SaaS use cases. Same `./guide.sh skills-update` refreshes them with everything else.

| Pack | Source | Highlights |
|---|---|---|
| `coreyhaines31/marketingskills` | [skills.sh](https://skills.sh/coreyhaines31/marketingskills) | 30+ skills: SEO (`seo-audit`, `programmatic-seo`, `ai-seo`, `schema`), copy (`copywriting`, `copy-editing`, `cold-email`, `emails`), CRO (`cro`, `pricing`, `paywalls`, `signup`, `onboarding`), GTM (`launch`, `referrals`, `directory-submissions`), channels (`ads`, `social`, `sms`, `video`), strategy (`marketing-psychology`, `customer-research`, `competitor-profiling`, `analytics`, `ab-testing`) |
| `addyosmani/web-quality-skills` | [skills.sh](https://skills.sh/addyosmani/web-quality-skills) | `seo` skill — technical SEO + Core Web Vitals from Google Chrome team |

These pair with three DannFlow slash commands that enforce per-route checks:

| Command | Skills it composes with |
|---|---|
| `/seo-check` | `seo-audit`, `seo` (addy), `schema`, `site-architecture` |
| `/seo-fix` | `seo-audit`, `schema`, `copywriting` (for titles/descriptions) |
| `/marketing-check` | `cro`, `pricing`, `copywriting`, `marketing-psychology` |

**Workflow order for new SaaS:** trigger `product-marketing` once to scaffold positioning context → use the other skills as needed for execution.

---

## When to use what

**Building a new feature?**
```
/make-masterplan Phase 1         # expand the next phase after /masterplan-init
/update-masterplan               # after editing MASTERPLAN.md, sync ordered cards back to GitHub
/new-feature <name>             # scaffold
/ui                             # responsive + a11y hard rules
# Claude may then invoke:
#   design-taste-frontend       (broad polish)
#   emil-design-eng             (if the feature involves animation/interaction)
#   impeccable                  (final critique pass)
/review                         # before PR
/commit                         # ship it
```

**Changed the database?**
```
# Fastest path — one command chains all four steps:
/migrate "add bio text column to profiles"

# Manual path (if you prefer per-step control):
pnpm db:generate        # generate SQL from db/schema/*.ts
# review db/migrations/*.sql
pnpm db:migrate         # apply migration and regenerate types
/rls <new-table>        # verify RLS on any new tables
/seed <new-table>       # optional: generate type-safe test data
```

**Auditing security?**
```
/security-audit
/rls-check
```

**Don't know what to do?**
```
/help-dannflow
/ask-command I want to <plain English>
```

---

## How this differs from skills

| Layer | Where it lives | When to use |
|---|---|---|
| **Custom command** (`.claude/commands/*.md`) | This repo | DannFlow-specific workflows (RLS check against `src/services/`, schema flow via `db/schema` and `pnpm db:migrate`) |
| **Skill** (`~/.claude/skills/` or plugin) | Your machine | Generally useful workflows reusable across all your projects (security review, code review, simplification) |

See [SKILLS.md](../../SKILLS.md) for which Claude Code skills are recommended for this project.

---

## Customizing the setup

The `.claude/` directory is yours. Customize freely:

- **Add a new command** — drop `your-command.md` into `.claude/commands/` with frontmatter:
  ```markdown
  ---
  description: One-line summary for /ask-command routing.
  argument-hint: <args> (optional)
  ---

  The prompt body. Use $ARGUMENTS for typed arguments.
  ```

- **Remove a command** — just delete the file. `/init-claude` won't recreate it unless you tell it to (or unless the README still mentions it).

- **Rewrite a command** — edit the `.md` file. `/init-claude` won't overwrite hand-edited commands unless you pass `--commands` AND confirm each change.

---

## FAQ

**Q: Will `/init-claude` overwrite my carefully tuned `CLAUDE.md` and commands?**
A: It rewrites everything — that's its job. But it always shows you the plan first and waits for confirmation per file. If you've made manual edits you want to keep, commit them first so you can review the diff and revert anything you don't like. The command preserves the non-negotiable guardrails (RLS, semantic tokens, service layer) unless your README clearly indicates the project no longer needs them.

**Q: Does Claude actually use these commands automatically?**
A: No — you invoke them with `/command-name`. Claude doesn't run them on its own. They're prompt shortcuts, not hooks.

**Q: What if I want a command to run automatically (e.g. `/ui` after every edit)?**
A: That's a hook, not a command. See Claude Code's settings — `PostToolUse` hooks in `.claude/settings.json` can run commands automatically. Different mechanism. Ask Claude to set one up via the `update-config` skill.

**Q: Why is `AGENTS.md` still around if `CLAUDE.md` is authoritative?**
A: `AGENTS.md` is the cross-tool standard (Cursor, Antigravity, etc. read it). `CLAUDE.md` is Claude-specific. We keep both for compatibility.
