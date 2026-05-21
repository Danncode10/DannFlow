# Claude Workflow

> The Claude Code setup for this repo. Read this once. Then forget about it.

## TL;DR

```
1. Edit README.md to describe what you're building
2. Run /init-claude in Claude Code
3. Start building
```

That's the whole workflow. Everything else is detail.

---

## The setup, step by step

### Step 1 — Make the README reflect your project

`README.md` is the **source of truth** for what this codebase is. When you fork DannFlow and start your own product:

1. Open `README.md`
2. Replace the DannFlow intro with **your** project's pitch (2–3 sentences)
3. Update the feature table to match what you're building
4. Update the project structure section if you're adding new top-level folders

Don't worry about polishing it. Claude reads it to understand the project, not to publish it. You can keep it scrappy.

### Step 2 — Run `/init-claude`

In Claude Code, run:

```
/init-claude
```

This reads your updated `README.md` + `package.json` + `src/` + existing `.claude/commands/`, then **rewrites the entire Claude environment** to match:

- `CLAUDE.md` — Claude's project config
- `SKILLS.md` — which Claude Code skills are relevant
- `.claude/commands/README.md` — the command index
- **Individual command files** — adds missing ones (e.g. `/stripe-check` if you added Stripe), removes stale ones (e.g. `/rls-check` if you dropped Supabase), rewrites outdated bodies
- The command tables in this file (`claude-workflow.md`)

Before writing anything, `/init-claude` shows you a plan grouped by file and waits for confirmation. Skip the confirmation by adding "go" or "just do it" to your invocation.

> **Tip**: `/init-claude` won't silently overwrite hand-tuned commands. Every individual command change is in the plan and only applied after you say yes.

### Step 3 — Start building

You're done with setup. From here on, the daily loop is:

```
1. /checkpoint           → snapshot your DB schema (before risky changes)
2. Ask Claude to build something
3. /sync-types           → after any schema change
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
| `/ask-command <intent>` | Tells you which command to use for your task. Returns a copy-paste-ready prompt. |
| `/init-claude` | Rewrites the entire Claude environment (`CLAUDE.md`, `SKILLS.md`, commands README, individual commands, and this file's command tables) to match the current README + src + package.json. Plan-then-confirm flow. |
| `/make-command <description>` | Creates a new custom slash command from a plain-English description. Auto-updates this file's tables and proposes conflict-avoidance edits to existing commands. |

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
| `/sync-types` | Runs `npm run update-types`, diffs `src/types/supabase.ts` before/after, summarizes schema drift. |
| `/explain-schema` | Plain-English summary of your live Supabase schema. |

### Scaffolding
| Command | What it does |
|---|---|
| `/new-feature <name>` | Scaffolds service + types + App Router page + Shadcn form for a new feature. |
| `/new-page <route>` | Scaffolds an App Router page (Server Component) with `loading.tsx` + `error.tsx`. |

### Housekeeping
| Command | What it does |
|---|---|
| `/commit` | Stages changes + drafts a conventional commit message. |
| `/cleanup` | Finds dead code, unused exports, orphaned components. Reports only — never deletes. |
| `/sync-commands` | Audits `.claude/commands/` and validates docs against `claude-workflow.md` + `./guide.sh`. Identifies orphaned commands, optionally auto-patches. |

---

## When to use what

**Building a new feature?**
```
/new-feature <name>     # scaffold
/ui                     # double-check responsiveness
/review                 # before PR
/commit                 # ship it
```

**Changed the database?**
```
/checkpoint             # snapshot first
# (apply your migration via Supabase MCP)
/sync-types             # regenerate types
/rls <new-table>        # verify RLS on any new tables
```

**Auditing security?**
```
/security-audit
/rls-check
```

**Don't know what to do?**
```
/ask-command I want to <plain English>
```

---

## How this differs from skills

| Layer | Where it lives | When to use |
|---|---|---|
| **Custom command** (`.claude/commands/*.md`) | This repo | DannFlow-specific workflows (RLS check against `src/services/`, schema sync via `npm run update-types`) |
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
