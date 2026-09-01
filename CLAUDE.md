# CLAUDE.md — DannFlow

> **Start here.** This file is Claude Code's authoritative config for this project. Read it before doing anything.

## What is DannFlow?

A Next.js 15 + Supabase starter optimized for **Vibe Coding** — an AI-native dev workflow where schema is authored in TypeScript, applied through reviewed SQL migrations, and mirrored back into generated app types:

## Repository mode guard (mandatory)

Before editing, identify the repository root, folder name, and remotes:

```bash
REPO_ROOT=$(git rev-parse --show-toplevel)
printf '%s\n' "$(basename "$REPO_ROOT")"
git remote -v
```

Select one mode and follow its rules:

- **Template Mode:** the root folder is `Dannflow`/`DannFlow` and this is the actual DannFlow template repository. Keep all changes generic and reusable. Do not create or commit client-specific context, screenshots, discovery reports, product requirements, Supabase project data, or application work here. Do not run `/new-project`, `/masterplan-init`, or project-specific setup in this checkout. Never push a project change to the template.
- **Project Mode:** the root folder is not `Dannflow`/`DannFlow`. This is a project using DannFlow. Require `origin` to point to the project repository and `upstream` to point to `Danncode10/DannFlow`. Project-specific work belongs here; use `/sync-upstream` to pull generic template improvements and `/sync-to-upstream` to contribute selected generic improvements back.

If folder name and remotes disagree, stop before editing and explain the mismatch. A non-`Dannflow` checkout with only `upstream → DannFlow` is not ready for project work; configure `origin` and make `upstream` fetch-only first. Never infer mode from the files being viewed—use the repository root folder and remote configuration.

```
pnpm db:setup (local Studio) → make schema changes visually
pnpm db:generate <name>      → capture SQL via `supabase db diff`
pnpm db:migrate              → apply to Supabase + refresh src/types/supabase.ts
pnpm checkpoint    → snapshot live schema (RLS, triggers, enums) to supabase/backups/
```

The agent reads `supabase/migrations/`, `db/schema/*.ts`, and `src/types/supabase.ts` before touching database-backed code, so it never guesses schema shape.

For the full marketing/setup story, see [README.md](README.md). For deeper docs, see [docs/dannflow_docs/](docs/dannflow_docs/).

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19
- **DB / Auth**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Schema / Migrations**: Supabase CLI (`supabase/migrations/`)
- **Styling**: Tailwind CSS v4 + Shadcn/UI primitives
- **State / Data**: TanStack Query, React Server Components by default
- **Rate limiting**: Upstash Redis helper for production-sensitive paths
- **Animation**: Framer Motion
- **Toasts**: Sonner
- **Icons**: lucide-react

## Project structure

```
src/
├── app/                # Next.js App Router pages (Server Components by default)
├── components/         # UI components (Shadcn-based)
├── services/           # ⚡ ALL business logic + Supabase queries live here
├── lib/
│   └── config.ts       # siteConfig + creatorRepos (central config)
├── types/
│   └── supabase.ts     # 👁️ AUTO-GENERATED — never edit manually
└── utils/
    └── supabase/       # Supabase client helpers (server, client, middleware)

db/
└── schema/             # Drizzle schemas (used strictly for querying)

supabase/
├── migrations/         # ✍️ Generated SQL from pnpm db:generate (Supabase CLI source of truth)
└── backups/            # 📋 Timestamped DDL snapshots from pnpm checkpoint
```

## Architectural guardrails (non-negotiable)

1. **Separation of concerns** — UI components MUST NOT contain DB logic or direct API calls.
2. **Service layer** — All business logic + Supabase queries live in `src/services/`.
3. **Type safety** — Use `src/types/supabase.ts` for all data shapes. **Never** use `any`.
4. **Server-first** — Default to Server Components. Only use `'use client'` when you need state, events, or browser APIs.
5. **Feature blueprints** — Before scaffolding a new feature, check `src/prompts/features/` for an existing blueprint.

## RLS security constraint

Assume **Row Level Security is active on every table.** Services must match the table's ownership or admin policy; add an explicit user ownership filter when the table has a user-owner column. Public endpoints require an intentional public policy.

## UI quality standards

- **Mobile-first**: every component responsive from 375px up. No horizontal scroll.
- **Touch targets**: interactive elements ≥48px tall.
- **Forms**: labels ABOVE inputs (never placeholder-only). Visible focus rings via `ring-ring`. Error states use `text-destructive`.
- **Cards**: wrap form pages in Shadcn `<Card>` / `<CardHeader>` / `<CardContent>` / `<CardFooter>`.
- **Spacing**: stick to the scale — `p-4`, `p-6`, `gap-4`, `gap-6`. Don't cram.
- **Empty states**: never blank — centered icon + message.
- **Buttons**: always Shadcn `<Button variant="...">`, never raw `<button>`.

## Semantic tokens — CRITICAL

Use ONLY Tailwind/Shadcn semantic tokens. **Stating hex codes, `rgba()`, or hardcoded `white`/`black`/`gray-*` in className is a CRITICAL FAILURE.**

- Backgrounds: `bg-background`, `bg-card`, `bg-muted`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Borders: `border`, `border-border`, `border-input`
- Brand: `bg-primary`, `text-primary-foreground`

Theme variables live in `src/app/globals.css` under `@theme`.

## Database workflow (Supabase CLI)

1. **Schema source of truth** — Database schema and migrations are managed natively via Supabase CLI in `supabase/migrations/`.
2. **Generate SQL** — Make changes in local Supabase Studio (`pnpm db:setup`), then run `pnpm db:generate <name>` to capture changes (runs `supabase db diff`).
3. **Supabase platform SQL** — You can also manually add RLS policies, auth triggers, and functions directly to the generated SQL migration when needed.
4. **Apply and sync** — Run `pnpm db:migrate`; it pushes to your remote database and refreshes `src/types/supabase.ts`.
5. **Checkpoint live state** — Before risky/destructive changes, run `pnpm checkpoint` to snapshot the live project into `supabase/backups/`.

Do **not** use Supabase MCP `apply_migration` for normal schema changes. Supabase MCP is for reading, verifying, advisors, provisioning, and checkpointing. If an emergency live SQL change is explicitly requested, generate a migration and run `pnpm db:migrate`.

Use `.claude/commands/schema-change.md` only when the user explicitly wants to manipulate the live Supabase schema through MCP or needs an emergency live SQL change captured in git. That command checkpoints the live schema, writes the approved SQL to `supabase/migrations/YYYYMMDDHHMMSS_<name>.sql`, applies it through Supabase MCP `apply_migration`, regenerates `src/types/supabase.ts`, and verifies the live database.

### Checkpoint protocol
When the user runs `pnpm checkpoint` and provides the generated prompt:
1. Verify Supabase MCP connection.
2. Read live schema (tables, enums, RLS policies, triggers, functions) for the specified project ID.
3. Generate full DDL and save it to the timestamped `.sql` file in `supabase/backups/`.

### Project provisioning
When asked to create a new Supabase project + apply schema:
1. `list_organizations` → let user choose.
2. Ask for Project Name and Organization ID.
3. `get_cost` → `confirm_cost` BEFORE `create_project`.
4. After init, set `SUPABASE_PROJECT_ID` and `DATABASE_URL`, then run `pnpm db:migrate`.
5. **Mandatory verification**: list tables and functions in `public` schema. Confirm `profiles` table and `handle_new_user` function exist. Do not report success until verified.

## Required MCP tools

Before specialized work, verify these MCPs are connected:

- **Supabase MCP** — schema reads, RLS/policy verification, advisors, checkpoints, and project provisioning
- **GitHub MCP** — branch diffs, commit history, PR management
- **Terminal MCP** — local commands like `pnpm db:generate`, `pnpm db:migrate`, and `pnpm checkpoint`

If a required MCP is missing, stop and tell the user:
> ⚠️ [Tool Name] MCP Not Detected: I need this to [task]. Open Settings → MCP Store → install "[Tool Name]" using credentials from `.env.local`.

### Connection reporting rule

Keep three states separate: **connected**, **capability unavailable**, and **authorization denied**. The presence of any callable tool from an MCP, or a successful read-only call, means that MCP is connected. A missing task-specific tool or an API/CLI permission error must be reported as its exact capability or scope issue—not as a disconnected MCP. Use the missing-MCP message only when no tools from that MCP are available or a connection attempt fails. This applies equally to GitHub and Supabase.

For GitHub Projects, if the authenticated `gh` CLI reports a missing `read:project` or `project` scope, report **GitHub connected; GitHub Projects authorization needs refresh** and instruct the user to run `gh auth refresh -s project`. After confirmation, retry the operation. Never turn this scope error into an MCP installation or reconnection request.

## Code conventions

- Functional components + hooks. No classes.
- `async`/`await` for all async ops.
- Place new components in `src/components/`, logic in `src/lib/` or `src/hooks/`.
- DRY + SOLID. Extract repeated logic into hooks or components.
- **Don't restructure** existing folder hierarchy or UI patterns unless explicitly asked.
- After making code changes, end your response with a one-line conventional commit message for easy copy-paste (e.g. `feat: add password re-auth gate`).

## Claude environment in this repo

| File / Folder | Purpose |
|---|---|
| `CLAUDE.md` (this file) | Authoritative Claude Code config |
| [SKILLS.md](SKILLS.md) | Which Claude Code skills are relevant + when to invoke them |
| [MASTERPLAN.md](MASTERPLAN.md) | Ordered build plan — check before starting any feature or task |
| `.claude/commands/` | Custom slash commands (see its README for the list) |
| `AGENTS.md` | Cross-tool agent standard (Cursor/Antigravity/etc.) — kept for compatibility |
| `.codex/` | Codex compatibility layer that loads `.claude/commands/` through `/claude-command` |

If you don't know which custom command fits a task, run `/ask-command <your intent>`.

## Memory & docs

- **`PROJECT_CONTEXT.md`** (root) — project-specific decisions that override or extend this file: audience, stack choices, design rules, tone, anti-decisions. Read this before any feature work, UI rewrite, or marketing command. Fill it in once after running `/init-claude`.
- **`MASTERPLAN.md`** (root) — current phase status and what's being built. Run `/new-project`, create a Kanban-style GitHub Project, then run `/masterplan-init` to create detailed Phase 0. Use `/make-masterplan Phase 1` to expand later phases and `/update-masterplan` after edits.
- Project methodology in `docs/dannflow_docs/` (methodology, trinity model, MCP setup, backups, UI system)
- Central config: `src/lib/config.ts`
- Auto-generated types: `src/types/supabase.ts` (read-only)

## Masterplan + GitHub Project protocol

`MASTERPLAN.md` is the local source of truth and the linked GitHub Project is the execution board. `/masterplan-init` links an existing Kanban-style Project and stores its non-secret binding in `.env.local`; it never creates a Project or draft board. Prefer `GITHUB_PROJECT_URL` in the canonical form `https://github.com/users/<owner>/projects/<number>` or `https://github.com/orgs/<owner>/projects/<number>`, without `/views/...` or query-string suffixes. Derive legacy owner, number, and API ID values automatically when an API needs them.

1. **Before starting work**, find the matching task in `MASTERPLAN.md` and the GitHub Project. Ask the user which card to use if the request could map to multiple cards.
2. **If no matching task exists**, warn the user: "This task is not in `MASTERPLAN.md`. Add it to `MASTERPLAN.md` and the GitHub Project first?" Do not begin feature work until the user confirms or explicitly says to proceed without tracking.
3. **When starting a tracked task**, ask or confirm: "This maps to `[P2.1] ...`; move it to `In progress` in GitHub Project?" Move it once confirmed.
4. **When finishing a tracked task**, check the task in `MASTERPLAN.md`, move the GitHub Project item to `Done`, and mention the task ID in the final response.
5. **If `MASTERPLAN.md` is edited**, warn: "`MASTERPLAN.md` changed. Run `/update-masterplan` to sync GitHub Project cards." If the edit was part of the current task and GitHub tooling is available, run the sync immediately.
6. **Task IDs are ordered and stable**: use `[P2.1]`, `[P2.2]`, `[P3A.1]`, etc. Never create bare `[P2]` cards.

### Task lifecycle commands

- Use `/what-task` when organizing the task board or choosing what to work on next. It reports current `In progress`, `Ready`, and pending `Backlog` tasks; moves one or more tasks to `Ready` when that lane is empty; recommends one task; and asks before moving exactly one task to `In progress`. It must stop after task selection and must not implement or edit application code.
- Use `/close-task` when a tracked task is complete. It commits completed work first, then marks the task checked in `MASTERPLAN.md` and moves the linked Project item to `Done`.
- Do not leave completed work sitting in `In progress`. If the current task appears finished, proactively tell the user to run `/close-task` even when they did not explicitly ask.
- Do not use `In review` unless the active repository explicitly requires a review step for that task.

---

## Ruflo memory protocol

Before starting any DannFlow command or multi-file task, search ruflo memory (`mcp__ruflo__memory_search`) for relevant prior decisions — use the feature name, table name, or technology as the search term.

After any non-trivial decision is made, store it in ruflo memory (`mcp__ruflo__memory_store`) **without being asked**. Good candidates:

- **Tech choices**: "We use Resend for email, not SendGrid"
- **Schema decisions**: "posts table uses soft deletes via deleted_at, not hard deletes"
- **Design decisions**: "Cards use rounded-xl, never rounded-md"
- **Anti-decisions**: "We're NOT using Zustand — TanStack Query handles all server state"
- **"Why" context**: "billing is behind a feature flag until Stripe goes live"

Auto-memory (`~/.claude/projects/.../memory/`) stores human-readable facts for future conversations. Ruflo memory enables semantic recall as the project grows past ~50 decisions. Use both.

---

**Be concise. Be proactive. Respect the guardrails. Default to Server Components. Never skip RLS.**
