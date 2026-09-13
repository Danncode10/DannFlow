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

**Connection, capability, and authorization are different checks:** Do not infer that an MCP is disconnected just because a task-specific tool is not exposed, a tool lacks a particular capability, or an API/CLI call returns an authorization or scope error. First inspect the available tools for that MCP and, when applicable, make one read-only capability check. If any tool from the MCP is available or responds, report it as **connected**. Then describe the precise blocker instead (for example, “GitHub Projects capability is not exposed in this session” or “the authenticated GitHub token lacks `project` scope”). Use the Missing Tool Alert only when the MCP itself has no available tools or an actual connection attempt fails. Apply this rule equally to GitHub and Supabase; never ask the user to reconnect an MCP that is already connected.

**GitHub Projects CLI fallback:** If GitHub is connected but `gh project` reports a missing `read:project` or `project` scope, say exactly that GitHub is connected and instruct the user to run `gh auth refresh -s project`. Do not show the Missing Tool Alert, ask them to reconnect GitHub, or ask them to install an MCP. After the user confirms the refresh, retry the blocked GitHub Projects operation.

## Architectural Guardrails

1.  **Separation of Concerns**: UI components must NOT contain database logic or direct API calls.
2.  **Logic Layer**: All business logic and Supabase queries MUST live strictly within `src/services/`.
3.  **Context First**: ALWAYS look for a feature blueprint in `src/prompts/features/` before starting a new task.
4.  **Type Safety**: Use the generated TypeScript types from `src/types/` for all data structures. Never use `any`.

## 🛠 Tech Stack Conventions

- **React**: Use Functional Components and Hooks. Favor Server Components for data fetching.
- **CSS**: Use Tailwind CSS for all styling.
- **Components**: Use Shadcn/UI for UI primitives.
- **Async**: Use `async/await` for all asynchronous operations.
- **Git Workflow**: Husky is configured with a hybrid check strategy (Fast local commits via lint-staged, Strict-lite on push to prevent Vercel errors). If absolutely needed for WIP saves, use `git push --no-verify`.

## Vibe Workflow

- **Inspiration Folder Protocol**: We have a dedicated `inspirations/` folder at the root (which is gitignored). Whenever you start a major UI task or a complex feature, FIRST ask the user if they want to clone/download a reference GitHub repo into `inspirations/` to serve as a design/code reference and save tokens. If the user agrees, fetch the reference repo there before coding.
  - **CRITICAL RULE**: If an inspiration repo is present, you MUST copy its UI components, styling, and logic as exactly as possible into the project. Do not write your own simplified version from scratch. Your job is to extract the existing complex components from the inspiration folder and modify them only as necessary to wire them into the DannFlow repo.
- If you encounter a bug, fix it in the **Service** layer first.
- If you need a new data structure, define or request generation of its types in `src/types/` first.
- **Masterplan + GitHub Project Tracking**: For a new SaaS, `/new-project` must finish before `/masterplan-init`; the user must create a Kanban-style GitHub Project before `/masterplan-init` links it. Before later feature or task work, find the matching ordered task in `MASTERPLAN.md` and the linked GitHub Project when one exists. Use stable IDs like `[P2.1]`, `[P2.2]`, `[P3A.1]`; never create bare `[P2]` cards.
  - Bind the board with `GITHUB_PROJECT_URL` in `.env.local`, using `https://github.com/users/<owner>/projects/<number>` or `https://github.com/orgs/<owner>/projects/<number>`. Ignore `/views/...` and query-string suffixes; derive legacy owner, number, and API ID values automatically when needed.
  - If the task exists, confirm the card when ambiguous, then move it to `In progress` when work starts.
  - If the task is not in `MASTERPLAN.md`, warn the user and ask whether to add it to `MASTERPLAN.md` and the GitHub Project before proceeding.
  - When finishing, check the task in `MASTERPLAN.md`, move the GitHub Project item to `Done`, and mention the task ID in the final response.
  - If `MASTERPLAN.md` is edited, warn that `/update-masterplan` must be run to sync GitHub Project cards; run it immediately when GitHub tooling is available and the edit belongs to the current task.
- **Documentation Governance**:
  - **As You Code**: If you change code that affects architecture, services (`src/services/`), types (`src/types/`), database schemas (`supabase/migrations/`), or APIs, you MUST append a detailed note to `docs/PENDING_DOC_UPDATES.md` tracking what needs to be documented.
  - **Revisions & Pruning**: If code is modified, refactored, or discarded during conversation, immediately edit or delete the corresponding note in `docs/PENDING_DOC_UPDATES.md` so the ledger remains accurate and never contains stale entries.
  - **Phase Milestones**: Every phase in `MASTERPLAN.md` MUST conclude with a final documentation milestone task: `[PX.DOC] Finalize Phase X Documentation & Diagrams`.
  - **Commit-Time Enforcement**: Committing changes to `src/services/`, `src/types/`, `supabase/migrations/`, or APIs requires staging `docs/PENDING_DOC_UPDATES.md`, unless the commit message explicitly includes `No docs needed` or `[no-docs]`.
  - **Pre-Merge Clearance**: Prior to merging feature branches into `main` or executing `/close-task`, the AI agent or developer MUST process all notes in `docs/PENDING_DOC_UPDATES.md`, update the corresponding documentation in `docs/` and diagrams in `docs/diagrams/`, commit the documentation changes with `docs(<task-id>): update docs and verification for <slug>`, and remove the logged entries to unblock pushes to `main`.
- **GitHub MCP Mastery**: Use the GitHub MCP whenever the user reports a regression or a merge conflict. Compare current files with historical commits before asking for manual diffs.
- **Codex Compatibility**: If the user invokes `/claude-command <command> [args]`, read `.codex/commands/claude-command.md`, resolve the matching `.claude/commands/*.md` file, replace `$ARGUMENTS` with the provided args, and execute the loaded prompt under these AGENTS.md rules.
- **Command Source of Truth**: Keep `.claude/commands/` as the canonical command library. Do not duplicate every Claude command into `.codex/`; `.codex/` is the adapter/context layer for Codex.
- **Backup & Snapshot**: If the user runs `npm run checkpoint` and provides the generated prompt, you must:
  1. Verify Supabase MCP connection.
  2. Read the live schema (Tables, Enums, RLS, Triggers) for the specified project ID.
  3. Generate the full DDL and save it to the specified timestamped SQL file in `supabase/backups/`.
- **Schema Source of Truth**: Database schema and migrations are managed natively via Supabase CLI in `supabase/migrations/`. For normal schema changes, write `.sql` files directly in `supabase/migrations/`, then run `npm run db:migrate` (which runs `supabase db push`) to deploy them to the remote cloud database. **DO NOT** use `npm run db:setup` or attempt to start local Docker containers, as the user has low storage. Always test and apply changes directly against the remote cloud database. Do **not** use Supabase MCP `apply_migration` or direct SQL on the live database for normal schema changes.
- **Explicit Supabase MCP Schema Changes**: If the user explicitly asks to manipulate the live Supabase schema through MCP, use `.claude/commands/schema-change.md`. The tracked flow must checkpoint first, save the approved SQL to `supabase/migrations/YYYYMMDDHHMMSS_<name>.sql`, apply the exact SQL, regenerate `src/types/supabase.ts`, and verify the live schema/RLS state.
- **Emergency Schema Hotfixes**: If a schema change is made directly through Supabase MCP or SQL on the live database, immediately capture it by running `supabase db pull` or generating a new migration in `supabase/migrations/`, and refresh `src/types/supabase.ts`. Never leave live schema drift untracked.
- **Project Provisioning**: If requested to create a new project and apply a schema:
  1. List Supabase account organizations to help the user choose one.
  2. Ask for the Project Name and Supabase account Organization ID.
  3. Check costs using `get_cost` and `confirm_cost` before `create_project`.
  4. After initialization, apply `supabase/migrations/` using `npm run db:migrate` with the new project's `DATABASE_URL`.
- **Project Initialization & Migration**: If a user provides a Project ID for a new project:
  1. Confirm `.env.local` has `SUPABASE_PROJECT_ID` and `DATABASE_URL` for the target project.
  2. Apply tracked schema with `npm run db:migrate`; do not apply `supabase/backups/` unless performing an explicit restore.
  3. **MANDATORY Verification**: After execution, list tables and functions in the `public` schema.
  4. Confirm existence of core architecture (`profiles` table, `handle_new_user` function).
  5. Do not report success until verification is complete.
- **Be concise and proactive**. If you see an obvious optimization that fits the application's clean aesthetic, suggest it.

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

1. **Schema Source of Truth**: Database schema and migrations are managed natively via Supabase CLI in `supabase/migrations/`.
2. **Cloud-First Migration Flow**: Write `.sql` files in `supabase/migrations/`, then run `npm run db:migrate` to push them directly to the remote cloud database. **CRITICAL RULE:** Do NOT use `npm run db:setup`, `supabase start`, or Docker locally. The user has low storage constraints and develops exclusively against the cloud Supabase project.
3. **MCP Read/Verify Role**: Use the Supabase MCP for live schema reads, verification, advisors, project provisioning, and checkpoint snapshots. Do not use MCP `apply_migration` for normal tracked schema changes.
4. **Explicit MCP Mutation Flow**: When the user explicitly requests live Supabase schema manipulation through MCP, use `.claude/commands/schema-change.md` so the approved SQL is tracked in `supabase/migrations/`, and types are regenerated.
5. **Sync Types**: After any schema change, refresh `src/types/supabase.ts` using `npm run db:types` or `npm run db:types:remote`. Rely ONLY on these generated definitions in app code.
6. **RLS Constraint**: Always assume Row Level Security (RLS) is active. New tables require explicit RLS policies in the generated SQL migration before it is applied.

## Project Overview

A high-performance Next.js starter optimized for AI-native development (Vibe Coding), featuring automated type-safety and live database orchestration.

## Core DannFlow Agent Skills

DannFlow ships with three core native agent skills to orchestrate massive project workflows. Unlike simple commands, these skills give the AI autonomy to manage complex, multi-step processes:

- **`dannflow-masterplan`**: Run this to start a new project, generate a Masterplan, sync a GitHub Project board, or initialize infrastructure.
- **`dannflow-task`**: Run this to execute a specific task from `MASTERPLAN.md` end-to-end (includes automated quality gates and human verification steps).
- **`dannflow-update`**: Run this to safely and surgically update an old DannFlow repository from upstream without destroying custom business logic.

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

## JuanStack Vertical Namespace Rules

> These rules apply to ALL AI coding assistants (Claude, Codex, Gemini) working on any `dannflow`-based JuanStack vertical project. They exist to prevent cross-vertical code contamination and AI hallucination about file ownership.

### Architecture Decisions (Locked — Do Not Override)

| Decision                       | Resolution                                                                                                                                                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `business.json` load strategy  | **Build-time** — read from filesystem during `next build`                                                                                                                                                                                               |
| Multi-tenancy model            | **SEPARATE Supabase projects** per vertical. Verticals DO NOT share a database. The `dannflow` repo only holds the migration _templates_. When a vertical is created, `db:migrate` applies the template to the vertical's completely isolated database. |
| AI Secretary runtime           | **Supabase Edge Function with pg_cron**                                                                                                                                                                                                                 |
| `sync-to-upstream` enforcement | **Hard block** — stops push if files are outside `owned_paths`                                                                                                                                                                                          |
| Registry location              | **Separate `juanstack-portal` repo** — not in `dannflow`                                                                                                                                                                                                |

### The Golden Rule: Respect the Namespace

When editing code **in a vertical repo** (e.g., `attyjuan`, `vetstack`, `restostack`), you may ONLY modify:

1. Files within `src/bir/{this_vertical_id}/`
2. Files within `src/analytics/{this_vertical_id}/`
3. The file `src/ai/personas/{this_vertical_id}.ai-manifest.json`
4. All non-namespaced project files (pages, components, services, etc.)

You MUST NEVER modify:

- `src/bir/core/` — requires a direct `dannflow` PR
- `src/analytics/core/` — requires a direct `dannflow` PR
- `src/ai/core.ai-manifest.json` — requires a direct `dannflow` PR
- Any other vertical's namespace folder (e.g., do NOT touch `src/bir/veterinary/` when working in `attyjuan`)

When editing code **directly in `dannflow`** (Template Mode), you may ONLY modify `core/` folders and generic template files. Never add vertical-specific logic directly here.

### Namespace Convention Table

| Module           | Path Pattern                                     | Owner                |
| ---------------- | ------------------------------------------------ | -------------------- |
| BIR Tax Logic    | `src/bir/{vertical_id}/`                         | That vertical's repo |
| Analytics        | `src/analytics/{vertical_id}/`                   | That vertical's repo |
| AI Persona       | `src/ai/personas/{vertical_id}.ai-manifest.json` | That vertical's repo |
| BIR Core Engine  | `src/bir/core/`                                  | `dannflow` only      |
| Analytics Core   | `src/analytics/core/`                            | `dannflow` only      |
| AI Core Manifest | `src/ai/core.ai-manifest.json`                   | `dannflow` only      |

### Before Starting Any BIR, Analytics, or AI Task

1. **Read `business.json`** at the repo root. _(Note: Ensure any modifications to this file strictly adhere to `docs/juanstack/schemas/business.schema.json`)_.
2. **Confirm `vertical_id`** — this tells you which namespace folder you own.
3. **Check `dannflow_features`** — only implement features where the flag is `true`.
4. **Read the AI persona** at `business.json → ai_rules.persona_manifest`.

### Before Running `sync-to-upstream`

1. **Read `business.json → owned_paths`**.
2. **Verify every staged file** is within a declared `owned_paths` entry.
3. If ANY staged file is outside `owned_paths` → **STOP**. Report the conflict and do not create a PR. This is a hard block, not a warning.

### Domain Terminology Rule (Non-Negotiable)

NEVER hardcode the words `Client`, `Patient`, `Customer`, `Case`, `Appointment`, `Lawyer`, `Vet`, or any domain noun in a `.tsx` or `.ts` file.

Always resolve terminology from:

```typescript
const clientLabel = getTerm("consumer"); // from business.json → domain_nomenclature
const caseLabel = getTerm("transaction"); // from business.json → domain_nomenclature
```

Use the `useTerm()` hook in client components and `getTerm()` in server components/utilities.

### `business.json` Loading (Build-Time Pattern)

`business.json` is read **at build time** via `src/lib/vertical-config.ts`. It is NOT fetched at runtime. Consequence: changing `business.json` requires a redeploy of the vertical. This is intentional — each vertical is its own independent deployment with its own Supabase project.

<!-- END:nextjs-agent-rules -->
