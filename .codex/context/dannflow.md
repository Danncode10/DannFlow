# DannFlow Notes for Codex

DannFlow is a Next.js 15+, React 19, Supabase, Tailwind v4, Shadcn/UI starter
optimized for AI-assisted development.

## Operating Order

1. Read `AGENTS.md` before taking action.
2. Read `CLAUDE.md` for richer project context.
3. For feature work, check `PROJECT_CONTEXT.md` if present.
4. For new features, check `src/prompts/features/` before scaffolding.
5. Keep business logic and Supabase queries in `src/services/`.
6. Use generated types from `src/types/supabase.ts`; never use `any`.

## Database Discipline

Assume RLS is active on every table. Service queries must include explicit user,
ownership filters when the table has an ownership column unless the endpoint is intentionally public.

Before schema-sensitive work:

```bash
pnpm checkpoint
pnpm db:generate
pnpm db:migrate
```

Author schema changes in `db/schema/*.ts`, generate SQL into `db/migrations/`,
review that SQL, then apply it with `pnpm db:migrate`. Use Supabase MCP for live
schema reads, advisors, verification, project provisioning, and checkpoints. Do
not use MCP `apply_migration` for normal tracked schema changes.

## UI Discipline

Use Tailwind and Shadcn semantic tokens only:

- Backgrounds: `bg-background`, `bg-card`, `bg-muted`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Borders: `border`, `border-border`, `border-input`
- Brand: `bg-primary`, `text-primary-foreground`

Avoid raw `button` elements for app UI. Use Shadcn `Button`.

## Codex Command Bridge

The `.claude/commands/` files remain the command source of truth. Codex should
load those prompts through `.codex/commands/claude-command.md` instead of copying
or rewriting them.
