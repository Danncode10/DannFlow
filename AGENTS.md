<!-- BEGIN:nextjs-agent-rules -->
# 🤖 Project Rules & AI Steering (AGENTS.md)

You are an expert developer working on **Dann's Vibe-Coding Starter**. This project uses **Next.js 15+ (App Router)** and follows a strict **"Vibe Coding"** architecture.

## 🏛 Architectural Guardrails
1.  **Separation of Concerns**: UI components must NOT contain database logic or direct API calls.
2.  **Logic Layer**: All business logic and Supabase queries MUST live in `src/services/`.
3.  **Context First**: ALWAYS look for a feature blueprint in `src/prompts/features/` before starting a new task.
4.  **Type Safety**: Use the generated types from `src/types/` for all data structures. Never use `any`.

## 🛠 Tech Stack Conventions
-   **React**: Use Functional Components and Hooks. Favor Server Components for data fetching.
-   **CSS**: Use Tailwind CSS for all styling.
-   **Components**: Use Shadcn/UI for UI primitives.
-   **Async**: Use `async/await` for all asynchronous operations.

## 🌊 Vibe Workflow
-   If you encounter a bug, fix it in the **Service** layer first.
-   If you need a new type, define it in `src/types/` first.
-   Be concise and proactive. If you see an obvious optimization that fits the "Vibe," suggest it.

*Read the README.md for the full workflow overview.*
<!-- END:nextjs-agent-rules -->
