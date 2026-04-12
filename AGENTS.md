<!-- BEGIN:nextjs-agent-rules -->
# Project Rules & AI Steering (AGENTS.md)

You are an expert developer working on **Dann's Vibe-Coding Starter**. This project uses **Next.js 15+ (App Router)** and follows a strict **"Vibe Coding"** architecture built for clarity, speed, and maintainability.

## Diagnostic Protocol
**Unified Dependency Check**: Before starting any specialized tasks, verify that the required MCP (Model Context Protocol) tools are enabled and connected.

- **Supabase MCP**: Essential for database schema reading, SQL execution, and types validation.
- **GitHub MCP**: Essential for version control tasks, including comparing branches, resolving merge conflicts, and checking commit history before suggesting broad refactors.
- **Terminal MCP**: Essential for running local backup commands and interacting with the local system environment.

**Missing Tool Alert Protocol:** 
If any required MCP tool is missing for the current task, stop immediately and provide the exact instruction block below:

⚠️ [Tool Name] MCP Not Detected: I need this to [Specific Task].
To fix: 
> 1. Open Antigravity Settings (Gear Icon) -> MCP Store.
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
-   **GitHub MCP Mastery**: Use the GitHub MCP whenever the user reports a regression or a merge conflict. Compare current files with historical commits before asking for manual diffs.
-   **Backup & Snapshot**: If the user runs `npm run checkpoint` and provides the generated prompt, you must:
    1. Verify Supabase MCP connection.
    2. Read the live schema (Tables, Enums, RLS, Triggers) for the specified project ID.
    3. Generate the full DDL and save it to the specified timestamped SQL file in `supabase/backups/`.
-   **Project Provisioning**: If requested to create a new project and apply a schema:
    1. List organizations to help the user choose one.
    2. Ask for the Project Name and Organization ID.
    3. Check costs using `get_cost` and `confirm_cost` before `create_project`.
    4. After initialization, read the latest backup from `supabase/backups/` and apply it using `apply_migration`.
-   **Project Initialization & Migration**: If a user provides a Project ID for a new project:
    1. Locate the latest `.sql` backup in `supabase/backups/`.
    2. Read and apply the schema using the Supabase MCP.
    3. **MANDATORY Verification**: After execution, list tables and functions in the `public` schema.
    4. Confirm existence of core architecture (`profiles` table, `handle_new_user` function).
    5. Do not report success until verification is complete.
-   **Be concise and proactive**. If you see an obvious optimization that fits the application's clean aesthetic, suggest it.

## Code Architecture Rules
1.  **Maintain Structure**: DO NOT arbitrarily change existing UI structure, folder hierarchy, or core logic unless explicitly asked.
2.  **MODULARITY**: Extract repeatable logic into reusable components or custom hooks; avoid spaghetti code.
3.  **DIRECTORY**: Place new components in the existing `/components/` folder and logic in `/lib/` or `/hooks/`.
4.  **CLEANLINESS**: Adhere to DRY (Don't Repeat Yourself) and SOLID design principles.
5.  **OUTPUT**: If any code changes are made, provide a concise, professional Git commit message (e.g., 'feat: add user login validation') at the end of your response for easy copy-pasting.
6.  **RLS AWARENESS**: Always check `src/types/supabase.ts` and assume RLS is active. Every `select` or `update` service must include an `.eq('id', userId)` filter to pass security policies unless building a public endpoint.
7.  **SERVER VS. CLIENT**: Default to Server Components. Only use `'use client'` when interactivity, client state, or specific lifecycle effects are strictly required.
8.  **STRICT SEMANTIC COMPLIANCE**: Use ONLY Shadcn/Tailwind semantic tokens (e.g., bg-background, bg-card, text-foreground). Stating hex codes, rgba, or hardcoded neutral/white/blur colors is a CRITICAL FAILURE.


## 🗄️ Supabase Workflow for AI Agents
1. **Live Schema Awareness**: Use the **Supabase MCP Server** to query the live database state (tables, types, RLS policies). Do not assume schema structure without checking.
2. **Schema Changes via MCP**: Execute SQL directly using the MCP when prompted to alter tables or policies. Do not ask the user for manual SQL entry.
3. **Sync Types**: After any schema change, instruct the user to run `npm run update-types` to refresh `src/types/supabase.ts` via the Supabase CLI. Rely ONLY on these generated definitions.
4. **RLS Constraint**: Always assume Row Level Security (RLS) is active. By default, write queries that respect RLS constraints.

## Project Overview
A high-performance Next.js starter optimized for AI-native development (Vibe Coding), featuring automated type-safety and live database orchestration.
<!-- END:nextjs-agent-rules -->
