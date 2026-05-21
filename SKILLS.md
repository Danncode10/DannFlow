# SKILLS.md — Claude Code Skills for DannFlow

> Skills are reusable capabilities Claude Code can invoke (e.g. `/security-review`, `/review`). They're managed globally (`~/.claude/skills/`) or via plugins — this file just documents **which skills matter for this project** and when to use them.

## Recommended skills

| Skill | When to use it |
|---|---|
| **`init`** | Re-bootstrap `CLAUDE.md` from scratch. Use when the project pivots significantly or after a major refactor. Prefer `/init-claude` (project-specific custom command) for routine refreshes. |
| **`review`** | Run before opening a PR. Critiques the current branch's diff against project conventions in `CLAUDE.md`. |
| **`security-review`** | **Always run** before merging changes that touch: auth (`src/services/auth.ts`), RLS policies, Supabase queries, environment variables, or anything in `src/utils/supabase/`. Catches RLS bypasses and key leaks that `/security-audit` may miss. |
| **`claude-api`** | Use if/when DannFlow adds AI features (chat assistants, embeddings, agents). Enforces prompt caching, correct model IDs, and SDK patterns. |
| **`simplify`** | Run after a feature lands. Reviews changed code for reuse, dead code, and over-engineering. |
| **`fewer-permission-prompts`** | Run once per fresh clone to auto-allowlist common Bash/MCP calls in `.claude/settings.json`. Reduces permission noise during normal dev. |

## Supabase agent skills (install separately)

Install once per machine:

```bash
npx skills add supabase/agent-skills
```

This adds Supabase-specific guidance for migrations, RLS policy design, and edge functions. Recommended by the Supabase MCP server.

## Skills NOT relevant to this project

Skip these — they don't fit the stack:

- `anthropic-skills:docx` / `xlsx` / `pdf` / `pptx` — DannFlow doesn't produce office documents
- `update-config` — only needed when reshaping `.claude/settings.json` (rare)
- `keybindings-help` — personal IDE config, not project concern
- `schedule` / `loop` — for recurring agents, not in scope here

## How skills relate to custom commands

| Layer | Where defined | Scope |
|---|---|---|
| **Skill** | `~/.claude/skills/` or plugins | Global, reusable across all your projects |
| **Custom command** | `.claude/commands/*.md` (in this repo) | Project-specific, encodes DannFlow conventions |

Rule of thumb: if the workflow is **DannFlow-specific** (RLS check against `src/services/`, schema sync via `npm run update-types`), it's a custom command. If it's **generally useful** (security review of any diff), it's a skill.
