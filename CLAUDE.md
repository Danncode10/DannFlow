# CLAUDE.md — Fix Pinas

> **Start here.** This file is Claude Code's authoritative config for this project. Read it before doing anything.

## What is Fix Pinas?

A national Philippines incident reporting platform built on Next.js 15 + Supabase. Citizens snap a photo of a problem (broken road, exposed electrical wires, flooding, etc.), pin the location on a map, and the system automatically routes the report to the correct government agency for that province.

**Pilot province:** Nueva Vizcaya. Schema is province-agnostic and covers all 82 Philippine provinces from day one — only agency data and `provincial_admin` accounts are scoped to the pilot.

Zero-Hallucination loop — always run before touching code:

```
npm run checkpoint   →  snapshot live schema (RLS, triggers, enums) to supabase/backups/
npm run update-types →  regenerate src/types/supabase.ts from the live schema
```

For deeper docs and the full plan, see [docs/fixpinas/](docs/fixpinas/).

## Tech stack

- **Framework**: Next.js 15+ (App Router), React 19
- **DB / Auth**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Styling**: Tailwind CSS v4 + Shadcn/UI primitives
- **State / Data**: TanStack Query, React Server Components by default
- **Maps**: Google Maps JS API + Geocoding API (server-proxied, never client-exposed)
- **Email notifications**: Resend
- **SMS notifications**: Semaphore PH (Phase 3+)
- **Photo storage**: Supabase Storage
- **Animation**: Framer Motion
- **Toasts**: Sonner
- **Icons**: lucide-react
- **Rate limiting**: Upstash Redis (Phase 6+)

## Project structure

```
src/
├── app/                # Next.js App Router pages (Server Components by default)
├── components/         # UI components (Shadcn-based)
├── services/           # ⚡ ALL business logic + Supabase queries live here
├── lib/
│   └── config.ts       # siteConfig (central config)
├── types/
│   └── supabase.ts     # 👁️ AUTO-GENERATED — never edit manually
└── utils/
    └── supabase/       # Supabase client helpers (server, client, middleware)

supabase/
└── backups/            # 📋 Timestamped DDL snapshots from npm run checkpoint

docs/
└── fixpinas/           # Fix Pinas technical specs (schema, roles, routing, anti-spam)
```

## Roles

| Role | Access |
|---|---|
| `user` | Submit reports, track own reports, verify others' reports |
| `provincial_admin` | Manage reports in assigned province, update statuses, approve pending reports |
| `admin` | Full access — all provinces, agencies, categories, users |

## Architectural guardrails (non-negotiable)

1. **Separation of concerns** — UI components MUST NOT contain DB logic or direct API calls.
2. **Service layer** — All business logic + Supabase queries live in `src/services/`.
3. **Type safety** — Use `src/types/supabase.ts` for all data shapes. **Never** use `any`.
4. **Server-first** — Default to Server Components. Only `<ReportForm>` and map components need `'use client'`.
5. **Google Maps key** — Never expose in client bundle. All geocoding calls go through a Next.js API route.
6. **Province-agnostic** — No hardcoded province IDs or names in business logic. Everything links via `province_id`.

## RLS security constraint

Assume **Row Level Security is active on every table.** Every `select`/`update`/`delete` in `src/services/` MUST include `.eq('user_id', userId)` (or equivalent ownership/province filter) unless it's an explicitly public endpoint. Skipping this is a security vulnerability, not a style issue.

RLS role matrix:
- `user`: read/write own reports only
- `provincial_admin`: read/write reports where `province_id` matches their assigned province
- `admin`: unrestricted

## UI quality standards

- **Mobile-first**: every component responsive from 375px up. Primary users are on phones taking photos.
- **Touch targets**: interactive elements ≥48px tall. This is a camera/GPS app — fat fingers apply.
- **Forms**: labels ABOVE inputs (never placeholder-only). Visible focus rings via `ring-ring`. Error states use `text-destructive`.
- **Cards**: wrap form pages in Shadcn `<Card>` / `<CardHeader>` / `<CardContent>` / `<CardFooter>`.
- **Spacing**: stick to the scale — `p-4`, `p-6`, `gap-4`, `gap-6`. Don't cram.
- **Empty states**: never blank — centered icon + message.
- **Buttons**: always Shadcn `<Button variant="...">`, never raw `<button>`.

## Semantic tokens — CRITICAL

Use ONLY Tailwind/Shadcn semantic tokens. **Hex codes, `rgba()`, or hardcoded `white`/`black`/`gray-*` in className is a CRITICAL FAILURE.**

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

If a required MCP is missing, stop and tell the user:
> ⚠️ [Tool Name] MCP Not Detected: I need this to [task]. Open Settings → MCP Store → install "[Tool Name]" using credentials from `.env.local`.

## Code conventions

- Functional components + hooks. No classes.
- `async`/`await` for all async ops.
- Place new components in `src/components/`, logic in `src/lib/` or `src/hooks/`.
- DRY + SOLID. Extract repeated logic into hooks or components.
- **Don't restructure** existing folder hierarchy or UI patterns unless explicitly asked.
- After making code changes, end your response with a one-line conventional commit message for easy copy-paste (e.g. `feat: add report submission form`).

## Claude environment in this repo

| File / Folder | Purpose |
|---|---|
| `CLAUDE.md` (this file) | Authoritative Claude Code config |
| [SKILLS.md](SKILLS.md) | Which Claude Code skills are relevant + when to invoke them |
| [MASTERPLAN.md](MASTERPLAN.md) | Phased build plan — check before starting any feature |
| [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) | Audience, stack decisions, design rules, anti-decisions |
| `.claude/commands/` | Custom slash commands |
| `docs/fixpinas/` | Technical specs: schema, roles, agency routing, anti-spam |

If you don't know which custom command fits a task, run `/ask-command <your intent>`.

## Memory & docs

- **`PROJECT_CONTEXT.md`** (root) — project-specific decisions that override or extend this file. Read this before any feature work, UI rewrite, or marketing command.
- **`MASTERPLAN.md`** (root) — current phase status and what's being built. Check before starting any new work.
- Technical specs in `docs/fixpinas/`
- Central config: `src/lib/config.ts`
- Auto-generated types: `src/types/supabase.ts` (read-only)

---

## Ruflo memory protocol

Before starting any Fix Pinas command or multi-file task, search ruflo memory (`mcp__ruflo__memory_search`) for relevant prior decisions — use the feature name, table name, or technology as the search term.

After any non-trivial decision is made, store it in ruflo memory (`mcp__ruflo__memory_store`) **without being asked**. Good candidates:

- **Tech choices**: "We use Resend for email, not SendGrid"
- **Schema decisions**: "reports table uses soft deletes via deleted_at, not hard deletes"
- **Design decisions**: "Report cards use rounded-xl, never rounded-md"
- **Anti-decisions**: "We're NOT using Zustand — TanStack Query handles all server state"
- **"Why" context**: "AI classification is Phase 4+ — not in MVP"

Auto-memory (`~/.claude/projects/.../memory/`) stores human-readable facts for future conversations. Ruflo memory enables semantic recall as the project grows. Use both.

---

**Be concise. Be proactive. Respect the guardrails. Default to Server Components. Never skip RLS. Schema is always province-agnostic.**
