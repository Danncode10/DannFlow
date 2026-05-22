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

## Design taste skills (Leonxlnx/taste-skill)

`install.sh` runs this automatically. To pull the latest skill definitions in an existing project:

```bash
./guide.sh taste-update
# or directly:
npx skills add https://github.com/Leonxlnx/taste-skill
```

Skills land in `.agents/skills/<name>/` (sources) and are symlinked into `.claude/skills/<name>/` so Claude Code picks them up. Re-running is idempotent — it pulls the latest from the repo.

| Skill | When to use |
|---|---|
| **`design-taste-frontend`** | Default. After `/ui` finishes responsive/a11y rewrites, run this to upgrade visual hierarchy, spacing rhythm, and component polish. |
| **`redesign-existing-projects`** | Audit + upgrade an existing page. Pairs well with DannFlow's current dashboard/profile screens. |
| **`high-end-visual-design`** | Landing pages, marketing surfaces, anywhere "expensive feel" matters. |
| **`minimalist-ui`** | Editorial/clean style — usually the right default for a dev-tool starter. |
| **`full-output-enforcement`** | Prevents Claude from truncating long file generations. Useful when scaffolding many components at once. |

**Lower priority (skip unless the task demands them):**
- `gpt-taste` — GPT/Codex-tuned, not Claude
- `industrial-brutalist-ui` — off-brand for a SaaS starter
- `stitch-design-taste` — Google Stitch DESIGN.md format
- `brandkit`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code` — require an image-generation model

**How this composes with DannFlow's own commands:**

1. `/ui` — hard rules pass (responsive, 48px targets, semantic tokens, a11y)
2. `design-taste-frontend` skill — subjective polish pass
3. `/review` — pre-PR lint + typecheck + CLAUDE.md guardrails

Don't run the taste skill *before* `/ui` — you'll polish a layout that may get restructured.

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
