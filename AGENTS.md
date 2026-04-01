<!-- BEGIN:nextjs-agent-rules -->
# Project Rules & AI Steering (AGENTS.md)

You are an expert developer working on **Dann's Vibe-Coding Starter**. This project uses **Next.js 15+ (App Router)** and follows a strict **"Vibe Coding"** architecture.

## Architectural Guardrails
1.  **Separation of Concerns**: UI components must NOT contain database logic or direct API calls.
2.  **Logic Layer**: All business logic and Supabase queries MUST live in `src/services/`.
3.  **Context First**: ALWAYS look for a feature blueprint in `src/prompts/features/` before starting a new task.
4.  **Type Safety**: Use the generated types from `src/types/` for all data structures. Never use `any`.

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
6.  **RLS AWARENESS**: Always assume Row Level Security (RLS) is active; include user ID filters in Service queries where necessary. (This prevents the AI from writing 'Select All' queries that fail in production).
7.  **SERVER VS. CLIENT**: Default to Server Components. Only use 'use client' when interactivity (state/effects) is strictly required.

## Project Overview
*[Describe what this project actually does here. What is the primary purpose and what features does it have? Users should replace this section with their project details when using this starter]*

*Read the README.md for the full workflow overview.*
<!-- END:nextjs-agent-rules -->
