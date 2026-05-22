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

## Design taste skill packs (three upstream sources)

`install.sh` installs three complementary design-taste skill packs. Refresh them anytime with:

```bash
./guide.sh skills-update
# or individually:
npx skills add https://github.com/Leonxlnx/taste-skill
npx skills add https://github.com/emilkowalski/skill
npx skills add https://github.com/pbakaus/impeccable
```

All three install into `.agents/skills/<name>/` and symlink into `.claude/skills/<name>/`. Re-running is idempotent.

### Pack 1: Leonxlnx/taste-skill (12 skills, Low Risk)

Broad design-taste enforcement. Most relevant for DannFlow:

| Skill | When to use |
|---|---|
| **`design-taste-frontend`** | Default polish pass after `/ui`. Upgrades visual hierarchy, spacing rhythm, component polish. |
| **`redesign-existing-projects`** | Audit + upgrade an existing page (dashboard, profile, settings). |
| **`high-end-visual-design`** | Landing pages, marketing surfaces, "expensive feel". |
| **`minimalist-ui`** | Editorial/clean style — good default for a dev-tool starter. |
| **`full-output-enforcement`** | Prevents truncation on long generations (scaffolding many components). |

Lower priority: `gpt-taste` (GPT-tuned), `industrial-brutalist-ui` (off-brand), `stitch-design-taste` (Google Stitch format), `brandkit` / `imagegen-*` / `image-to-code` (need image-gen model).

### Pack 2: emilkowalski/skill (1 skill, Low Risk)

| Skill | When to use |
|---|---|
| **`emil-design-eng`** | Animation + micro-interaction craft. Use when adding/reviewing transitions, hover states, popovers, drawers, sheets. Enforces `ease-out` over `ease-in`, `scale(0.95)+opacity:0` over `scale(0)`, `:active` press states, popover transform-origin. Outputs Before/After/Why markdown table on review. |

Pairs naturally with Sonner + Vaul (in stack) and Framer Motion.

### Pack 3: pbakaus/impeccable (1 skill, ⚠️ Med Risk)

| Skill | When to use |
|---|---|
| **`impeccable`** | Broad UI critique covering design, redesign, audit, polish, animate, clarify, distill, harden. 27 deterministic anti-pattern rules (overused fonts, gray-on-color text, excessive cards) plus 23 invocation commands documented in its SKILL.md. Also ships an `npx impeccable detect <path>` CLI scanner. |

> ⚠️ **Security scanners flagged this pack as Medium Risk** (Gen + Snyk; the other two were Low Risk). Skim `.agents/skills/impeccable/SKILL.md` before relying on it for autonomous changes. Risk likely stems from the breadth of permissions its 23 commands request, not malware — but worth eyeballing.

### How the three packs compose

Don't fire taste skills before `/ui` — you'll polish a layout that may get restructured.

```
/ui                       # hard rules: responsive, 48px targets, semantic tokens, a11y
design-taste-frontend     # broad visual polish (Leonxlnx)
emil-design-eng           # motion + interaction craft (Emil) — for animated/interactive surfaces
impeccable                # critique pass with anti-pattern checks (pbakaus)
/review                   # pre-PR lint + typecheck + CLAUDE.md guardrails
/commit
```

Pick by surface — you don't need all four taste skills on every change:
- **Static page** → `design-taste-frontend` alone
- **Animated component** (drawer, modal, dropdown) → add `emil-design-eng`
- **Pre-merge audit of a big visual change** → run `impeccable` last

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
