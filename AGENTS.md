<!-- BEGIN:nextjs-agent-rules -->
# Project Rules & AI Steering (AGENTS.md)

You are an expert developer working on **Dann's Vibe-Coding Starter**. This project uses **Next.js 15+ (App Router)** and follows a strict **"Vibe Coding"** architecture.

## Architectural Guardrails
1.  **Separation of Concerns**: UI components must NOT contain database logic or direct API calls.
2.  **Logic Layer**: All business logic and Supabase queries MUST live in `src/services/`.
3.  **Context First**: ALWAYS look for a feature blueprint in `src/prompts/features/` before starting a new task.
4.  **Type Safety**: Use the generated types from `src/types/` for all data structures. Never use `any`.
5.  **Agent Connectivity (MCP)**:
    - **Self-Check**: Before starting any database-related task, verify if you have the supabase MCP tool enabled.
    - **Alert User**: If the supabase tool is missing, stop and alert me: '⚠️ MCP Not Detected: To allow me to manage your DB, please add the Supabase MCP (Command: `npx -y @supabase/mcp-server`) to your IDE settings using the SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from `.env`'

## 🛠 Tech Stack Conventions
-   **React**: Use Functional Components and Hooks. Favor Server Components for data fetching.
-   **CSS**: Use Tailwind CSS for all styling.
-   **Components**: Use Shadcn/UI for UI primitives.
-   **Async**: Use `async/await` for all asynchronous operations.

## Vibe Workflow
-   If you encounter a bug, fix it in the **Service** layer first.
-   If you need a new type, define it in `src/types/` first.
-   Be concise and proactive. If you see an obvious optimization that fits the "Vibe," suggest it.

## Code Architecture Rules
1.  **Maintain Structure**: DO NOT change existing UI structure, folder hierarchy, or core logic unless explicitly asked.
2.  **MODULARITY**: Extract repeatable logic into reusable components or hooks; avoid spaghetti code.
3.  **DIRECTORY**: Place new components in the existing `/components/` folder and logic in `/lib/` or `/hooks/`.
4.  **CLEANLINESS**: Follow DRY (Don't Repeat Yourself) and SOLID principles.
5.  **OUTPUT**: At the end of the response, provide a concise, professional Git commit message (e.g., 'feat: add user login validation') for me to copy. If no changes are made, ignore this. Put this at the chatbot response whenever new feature is added. If no changes are made, ignore this.
6.  **RLS AWARENESS**: Always check `src/types/supabase.ts` and assume RLS is active. Every `select` or `update` service must include a `.eq('id', userId)` filter to pass security policies.
7.  **SERVER VS. CLIENT**: Default to Server Components. Only use 'use client' when interactivity (state/effects) is strictly required.

## 🗄️ Supabase Workflow for AI Agents

1. **Live Schema Awareness**: Use the **Supabase MCP Server** to query the live database state (tables, types, RLS policies). Do not assume schema structure without checking.
2. **Schema Changes via MCP**: Execute SQL directly using the MCP when prompted to alter tables or policies. Do not ask the user for manual SQL entry.
3. **Sync Types**: After any schema change, instruct the user to run `npm run update-types` to refresh `src/types/supabase.ts` via the Supabase CLI. Rely ONLY on these generated definitions.
4. **RLS Constraint**: Always assume Row Level Security (RLS) is active. Every `select` or `update` must include `.eq('id', userId)` unless specifically building a public endpoint. By default, write queries that respect RLS.

*Note: See the README.md for the full context of the "DannFlow Way" methodology.*

## Project Overview
*[Describe what this project actually does here. What is the primary purpose and what features does it have? Users should replace this section with their project details when using this starter]*

*Read the README.md for the full workflow overview.*
<!-- END:nextjs-agent-rules -->
