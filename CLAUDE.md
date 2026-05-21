# CLAUDE.md — DannFlow

> **Start here.** This file is Claude Code's authoritative config for this project. Read it before doing anything.

## What is DannFlow?

A Next.js 15 + Supabase starter optimized for **Vibe Coding** — an AI-native dev workflow where the agent stays in sync with the live database via a "Zero-Hallucination" loop:

```
npm run checkpoint   →  snapshot live schema (RLS, triggers, enums) to supabase/backups/
npm run update-types →  regenerate src/types/supabase.ts from the live schema
```

The agent reads those two artifacts before touching code, so it never guesses schema shape.

For the full marketing/setup story, see [README.md](README.md). For deeper docs, see [docs/dannflow_docs/](docs/dannflow_docs/).

## Tech stack

- **Framework**: Next.js 15+ (App Router), React 19
- **DB / Auth**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Styling**: Tailwind CSS v4 + Shadcn/UI primitives
- **State / Data**: TanStack Query, React Server Components by default
- **Rate limiting**: Upstash Redis + Ratelimit
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

supabase/
└── backups/            # 📋 Timestamped DDL snapshots from npm run checkpoint
```

## Architectural guardrails (non-negotiable)

1. **Separation of concerns** — UI components MUST NOT contain DB logic or direct API calls.
2. **Service layer** — All business logic + Supabase queries live in `src/services/`.
3. **Type safety** — Use `src/types/supabase.ts` for all data shapes. **Never** use `any`.
4. **Server-first** — Default to Server Components. Only use `'use client'` when you need state, events, or browser APIs.
5. **Feature blueprints** — Before scaffolding a new feature, check `src/prompts/features/` for an existing blueprint.

## RLS security constraint

Assume **Row Level Security is active on every table.** Every `select`/`update`/`delete` in `src/services/` MUST include `.eq('id', userId)` (or equivalent ownership filter) unless it's an explicitly public endpoint. Skipping this is a security vulnerability, not a style issue.

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

## Supabase workflow (MCP-driven)

1. **Live schema first** — use the Supabase MCP to query tables/types/RLS before assuming structure.
2. **Schema changes** — apply migrations via MCP (`apply_migration`), not manual SQL entry.
3. **Sync types** — after any schema change, run `npm run update-types` to refresh `src/types/supabase.ts`.
4. **Checkpoint first** — before destructive schema changes, run `npm run checkpoint` to snapshot.

### Checkpoint protocol
When the user runs `npm run checkpoint` and provides the generated prompt:
1. Verify Supabase MCP connection.
2. Read live schema (tables, enums, RLS policies, triggers, functions) for the specified project ID.
3. Generate full DDL and save it to the timestamped `.sql` file in `supabase/backups/`.

### Project provisioning
When asked to create a new Supabase project + apply schema:
1. `list_organizations` → let user choose.
2. Ask for Project Name and Organization ID.
3. `get_cost` → `confirm_cost` BEFORE `create_project`.
4. After init, read latest backup from `supabase/backups/` and apply via `apply_migration`.
5. **Mandatory verification**: list tables and functions in `public` schema. Confirm `profiles` table and `handle_new_user` function exist. Do not report success until verified.

## Required MCP tools

Before specialized work, verify these MCPs are connected:

- **Supabase MCP** — schema reads, SQL execution, types validation
- **GitHub MCP** — branch diffs, commit history, PR management
- **Terminal MCP** — local commands like `npm run checkpoint`

If a required MCP is missing, stop and tell the user:
> ⚠️ [Tool Name] MCP Not Detected: I need this to [task]. Open Settings → MCP Store → install "[Tool Name]" using credentials from `.env.local`.

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
| `.claude/commands/` | Custom slash commands (see its README for the list) |
| `AGENTS.md` | Cross-tool agent standard (Cursor/Antigravity/etc.) — kept for compatibility |

If you don't know which custom command fits a task, run `/ask-command <your intent>`.

## Memory & docs

- Project context in `docs/dannflow_docs/` (methodology, trinity model, MCP setup, backups, UI system)
- Central config: `src/lib/config.ts`
- Auto-generated types: `src/types/supabase.ts` (read-only)

---

**Be concise. Be proactive. Respect the guardrails. Default to Server Components. Never skip RLS.**
