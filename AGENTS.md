<!-- BEGIN:nextjs-agent-rules -->
# Project Rules & AI Steering (AGENTS.md)

> **Start here**: Always read this file first before taking any action on this project.

You are an expert developer working on **Dann's Vibe-Coding Starter**. This project uses **Next.js 16 (App Router)** and follows a strict **"Vibe Coding"** architecture built for clarity, speed, and maintainability.

## Repository identity guard (read before editing)

Determine the repository root and folder name before taking any action:

```bash
REPO_ROOT=$(git rev-parse --show-toplevel)
printf '%s\n' "$(basename "$REPO_ROOT")"
git remote -v
```

Use the folder name and remotes to select exactly one mode:

- **Template Mode** — the repository folder is `Dannflow`/`DannFlow` and the DannFlow repository is the canonical `origin`. This is the actual DannFlow template. Keep it generic: do not add client names, discovery reports, screenshots, product requirements, Supabase project details, or application-specific code. Changes here must improve the reusable template, installer, commands, docs, or generic starter architecture. Never run project initialization against this checkout and never push project work here.
- **Project Mode** — the repository folder is not `Dannflow`/`DannFlow`. This is a project built from DannFlow. Its `origin` must identify the project repository, while `upstream` must identify `Danncode10/DannFlow`. Project-specific app code and context belong here. Use `/sync-upstream` for template-to-project updates and `/sync-to-upstream` only for deliberately selected generic improvements.

If the folder name and remotes disagree, stop and report the mismatch before editing. In particular, a non-`Dannflow` folder with only `upstream → DannFlow` is unsafe: configure the project's `origin` first and make the DannFlow remote fetch-only. Do not assume that a file's subject matter changes repository mode; repository identity comes from the root folder and remote configuration.

## Diagnostic Protocol
**Unified Dependency Check**: Before starting any specialized tasks, verify that the required MCP (Model Context Protocol) tools are enabled and connected.

- **Supabase MCP**: Essential for live schema reading, RLS/policy verification, advisors, checkpoints, and project provisioning.
- **GitHub MCP**: Essential for version control tasks, including comparing branches, resolving merge conflicts, and checking commit history before suggesting broad refactors.
- **Terminal MCP**: Essential for running local database, migration, backup, and verification commands.

**Missing Tool Alert Protocol:** 
If any required MCP tool is missing for the current task, stop immediately and provide the exact instruction block below:

⚠️ [Tool Name] MCP Not Detected: I need this to [Specific Task].
To fix: 
> 1. Open your AI IDE's MCP Store (Settings → MCP Store).
> 2. Install "[Tool Name]" and follow the setup.
> 3. Use your credentials from .env.local.

## Architectural Guardrails
1.  **Separation of Concerns**: UI components must NOT contain database logic or direct API calls.
2.  **Logic Layer**: All business logic and Supabase queries MUST live strictly within `src/services/`.
3.  **Context First**: ALWAYS look for a feature blueprint in `src/prompts/features/` before starting a new task.
4.  **Type Safety**: Use the generated TypeScript types from `src/types/` for all data structures. Never use `any`.

## 🛠 Tech Stack Conventions
-   **React**: Use Functional Components and Hooks. Favor Server Components for data fetching.
-   **CSS**: Use Tailwind CSS for all styling.
-   **Components**: Use Shadcn/UI for UI primitives.
-   **Async**: Use `async/await` for all asynchronous operations.

## Vibe Workflow
-   If you encounter a bug, fix it in the **Service** layer first.
-   If you need a new data structure, define or request generation of its types in `src/types/` first.
-   **Masterplan + GitHub Project Tracking**: For a new SaaS, `/new-project` must finish before `/masterplan-init`; the user must create a Kanban-style GitHub Project before `/masterplan-init` links it. Before later feature or task work, find the matching ordered task in `MASTERPLAN.md` and the linked GitHub Project when one exists. Use stable IDs like `[P2.1]`, `[P2.2]`, `[P3A.1]`; never create bare `[P2]` cards.
    - If the task exists, confirm the card when ambiguous, then move it to `In progress` when work starts.
    - If the task is not in `MASTERPLAN.md`, warn the user and ask whether to add it to `MASTERPLAN.md` and the GitHub Project before proceeding.
    - When finishing, check the task in `MASTERPLAN.md`, move the GitHub Project item to `Done`, and mention the task ID in the final response.
    - If `MASTERPLAN.md` is edited, warn that `/update-masterplan` must be run to sync GitHub Project cards; run it immediately when GitHub tooling is available and the edit belongs to the current task.
-   **GitHub MCP Mastery**: Use the GitHub MCP whenever the user reports a regression or a merge conflict. Compare current files with historical commits before asking for manual diffs.
-   **Codex Compatibility**: If the user invokes `/claude-command <command> [args]`, read `.codex/commands/claude-command.md`, resolve the matching `.claude/commands/*.md` file, replace `$ARGUMENTS` with the provided args, and execute the loaded prompt under these AGENTS.md rules.
-   **Command Source of Truth**: Keep `.claude/commands/` as the canonical command library. Do not duplicate every Claude command into `.codex/`; `.codex/` is the adapter/context layer for Codex.
-   **Backup & Snapshot**: If the user runs `pnpm checkpoint` and provides the generated prompt, you must:
    1. Verify Supabase MCP connection.
    2. Read the live schema (Tables, Enums, RLS, Triggers) for the specified project ID.
    3. Generate the full DDL and save it to the specified timestamped SQL file in `supabase/backups/`.
-   **Schema Source of Truth**: Database schema is authored in `db/schema/*.ts` with Drizzle. For normal schema changes, edit `db/schema/`, run `pnpm db:generate`, review `db/migrations/*.sql`, then run `pnpm db:migrate`. Do **not** use Supabase MCP `apply_migration` or direct SQL for normal schema changes unless the user explicitly requests an emergency live hotfix.
-   **Explicit Supabase MCP Schema Changes**: If the user explicitly asks to manipulate the live Supabase schema through MCP, use `.claude/commands/schema-change.md`. The tracked flow must checkpoint first, save the approved SQL to `db/migrations/YYYYMMDDHHMMSS_<name>.sql`, apply the exact SQL with Supabase MCP `apply_migration`, regenerate `src/types/supabase.ts`, verify the live schema/RLS state, and backport app-owned table changes into `db/schema/*.ts`.
-   **Emergency Schema Hotfixes**: If a schema change is made directly through Supabase MCP or SQL, immediately backport the change into `db/schema/*.ts`, generate or reconcile a matching migration in `db/migrations/`, and refresh `src/types/supabase.ts`. Never leave live schema drift untracked.
-   **Project Provisioning**: If requested to create a new project and apply a schema:
    1. List Supabase account organizations to help the user choose one.
    2. Ask for the Project Name and Supabase account Organization ID.
    3. Check costs using `get_cost` and `confirm_cost` before `create_project`.
    4. After initialization, apply `db/migrations/` using `pnpm db:migrate` with the new project's `DATABASE_URL`.
-   **Project Initialization & Migration**: If a user provides a Project ID for a new project:
    1. Confirm `.env.local` has `SUPABASE_PROJECT_ID` and `DATABASE_URL` for the target project.
    2. Apply tracked schema with `pnpm db:migrate`; do not apply `supabase/backups/` unless performing an explicit restore.
    3. **MANDATORY Verification**: After execution, list tables and functions in the `public` schema.
    4. Confirm existence of core architecture (`profiles` table, `handle_new_user` function).
    5. Do not report success until verification is complete.
-   **Be concise and proactive**. If you see an obvious optimization that fits the application's clean aesthetic, suggest it.

## 🔒 RLS Security Constraint (Non-Negotiable)
Always check `src/types/supabase.ts` and **assume RLS is active on every table**. Services must rely on the table's documented ownership or admin RLS policy; add an explicit user ownership filter when the table has a user-owner column. Public endpoints must use a deliberate public policy.

## Code Architecture Rules
1.  **Maintain Structure**: DO NOT arbitrarily change existing UI structure, folder hierarchy, or core logic unless explicitly asked.
2.  **MODULARITY**: Extract repeatable logic into reusable components or custom hooks; avoid spaghetti code.
3.  **DIRECTORY**: Place new components in the existing `/components/` folder and logic in `/lib/` or `/hooks/`.
4.  **CLEANLINESS**: Adhere to DRY (Don't Repeat Yourself) and SOLID design principles.
5.  **OUTPUT**: If any code changes are made, provide a concise, professional Git commit message (e.g., 'feat: add user login validation') at the end of your response for easy copy-pasting.
6.  **SERVER VS. CLIENT**: Default to Server Components. Only use `'use client'` when interactivity, client state, or specific lifecycle effects are strictly required.
7.  **STRICT SEMANTIC COMPLIANCE**: Use ONLY Shadcn/Tailwind semantic tokens (e.g., bg-background, bg-card, text-foreground). Stating hex codes, rgba, or hardcoded neutral/white/blur colors is a CRITICAL FAILURE.


## 🎨 UI Quality Standards (Non-Negotiable)
- **Mobile-First**: Every component must be fully responsive. Start at 375px. No horizontal scroll.
- **Touch Targets**: All interactive elements (buttons, inputs, links) must be at minimum 48px tall.
- **Visual Hierarchy**: Use font-size, weight, and spacing intentionally. Headings must feel like headings.
- **Form UX**: Labels go ABOVE inputs, never as placeholder-only. Inputs must have visible focus rings using `ring-ring`.
- **Spacing Rhythm**: Use consistent spacing scale (p-4, p-6, gap-4, gap-6). Never cram elements together.
- **Feedback States**: Every button must have a loading state. Every input must have an error state. Use `text-destructive` for errors.
- **Empty States**: Never leave a blank screen. Use a centered icon + message for empty or loading states.
- **Semantic Tokens in Practice**: 
  - Backgrounds: `bg-background`, `bg-card`, `bg-muted`
  - Text: `text-foreground`, `text-muted-foreground`, `text-primary`
  - Borders: `border`, `border-border`, `border-input`
  - Buttons: always use Shadcn `<Button variant="default">` or `variant="outline"` — never raw `<button>`
- **Card Pattern**: Wrap all form pages in `<Card>` with `<CardHeader>`, `<CardContent>`, `<CardFooter>` from Shadcn.
- **Multi-step Forms**: Use a visible step indicator (e.g., "Step 2 of 3") with a progress bar using `bg-primary`.


## 🗄️ Supabase Workflow for AI Agents
1. **Schema Source of Truth**: Author tables, columns, indexes, and relations in `db/schema/*.ts` with Drizzle.
2. **Migration Flow**: Run `pnpm db:generate` to create SQL in `db/migrations/`, review the SQL, then run `pnpm db:migrate` to apply it to Supabase and refresh generated types.
3. **MCP Read/Verify Role**: Use the Supabase MCP for live schema reads, verification, advisors, project provisioning, and checkpoint snapshots. Do not use MCP `apply_migration` for normal tracked schema changes.
4. **Explicit MCP Mutation Flow**: When the user explicitly requests live Supabase schema manipulation through MCP, use `.claude/commands/schema-change.md` so the approved SQL is tracked in `db/migrations/`, types are regenerated, and app-owned schema changes are backported into `db/schema/*.ts`.
5. **Sync Types**: After any schema change, refresh `src/types/supabase.ts` using `pnpm db:migrate`, `pnpm db:types`, or `pnpm db:types:remote`. Rely ONLY on these generated definitions in app code.
6. **RLS Constraint**: Always assume Row Level Security (RLS) is active. New tables require explicit RLS policies in the generated SQL migration before it is applied.

## Project Overview
A high-performance Next.js starter optimized for AI-native development (Vibe Coding), featuring automated type-safety and live database orchestration.

## Codex Command Bridge
DannFlow supports Codex through the `.codex/` folder:

- `.codex/commands/claude-command.md` defines `/claude-command <claude-command> [arguments]`.
- `.codex/commands/ask-claude-command.md` routes a plain-English task to the best existing Claude command.
- `.codex/context/claude-compatibility.md` translates Claude-only concepts such as Ruflo memory, Claude hooks, Claude Flow, swarms, and model names into Codex behavior.

When running a Claude command from Codex:
1. Read `AGENTS.md` first, then `CLAUDE.md`.
2. Resolve the command from `.claude/commands/`.
3. Replace `$ARGUMENTS` with the user-provided argument string.
4. Follow the loaded command unless it conflicts with AGENTS.md, active user instructions, or Codex environment safety rules.
5. If the command requires unavailable MCP tooling, use the Missing Tool Alert Protocol unless the user explicitly says to proceed without discussing MCPs.
<!-- END:nextjs-agent-rules -->
