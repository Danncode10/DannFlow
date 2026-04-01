# 🚀DannFlow (2026 Edition)

Welcome DannFlow, the ultimate AI-optimized boilerplate for **Next.js**, **Supabase**, and **Vercel**. 

This repository is more than just a template—it's a **structured environment** designed specifically to empower AI agents like **Claude Code**, **Antigravity**, and **Cursor** to work alongside you with maximum efficiency and minimum friction.

---

## 🌊 What is "Vibe Coding"?

Vibe coding is an AI-first development methodology where you focus on **concepts, prompts, and architecture**, while the AI handles the **implementation, boilerplate, and logic**. 

To do this successfully, your project needs a specific "Mental Map" for the AI to follow. That's what this structure provides.

## ⚡ Quick Start

Run this in your terminal to get the engine started:
```
git clone https://github.com/Danncode10/DannFlow . && npm install && npm run dev
```

---

## 🛠 The Tech Stack
*   **Framework:** Next.js 15+ (App Router) — *Cutting-edge React patterns.*
*   **Language:** TypeScript (Strict Mode) — *Essential for AI accuracy.*
*   **Database/Auth:** Supabase — *Instant backend with typed schemas.*
*   **Styling:** Tailwind CSS + Shadcn/UI — *Rapid UI prototyping with AI.*
*   **Deployment:** Vercel — *Seamless CI/CD.*

---

## 📁 The "Vibe Ready" Folder Structure

This structure is designed to separate **intent** from **implementation**, ensuring the AI never gets "confused" or creates spaghetti code.

### 1. `src/prompts/` — The Context Layer
> **The most important folder in Vibe Coding.**
- **Why it exists:** Before the AI writes a single line of code, it needs a "Feature Blueprint."
- **How to use it:** Create a `.md` file for every new feature (e.g., `src/prompts/features/auth-flow.md`). Describe the logic, UI, and edge cases here. Point the AI to this file first.
- **Vibe Rule:** *AI should never code without a corresponding prompt blueprint.*

### 2. `src/services/` — The Logic Layer
- **Why it exists:** AI often tries to dump database logic directly into UI components. This folder forces a clean separation.
- **Contents:** All Supabase queries, API calls, and complex business logic live here.
- **Vibe Rule:** *Components are for UI; Services are for data. No DB calls in components.*

### 3. `src/types/` — The Ground Truth
- **Why it exists:** AI thrives on strong typing. Without types, AI makes assumptions (and usually gets them wrong).
- **Contents:** Strongly-typed versions of your Supabase schema and custom interfaces.
- **Vibe Rule:** *Run `supabase gen types typescript` whenever your schema changes.*

### 4. `AGENTS.md` — The Instruction Manual
- **Why it exists:** This is the project's "System Prompt." It tells every AI agent the specific rules, conventions, and architectural choices for *this* project.
- **Vibe Rule:** *Every AI agent MUST read this file upon first load.*

---

## 🤖 AI Workflow (The Vibe Process)

To build a new feature autonomously, follow these four steps:

### 1. The Blueprinting Phase
Create a new file in `src/prompts/features/[your-feature].md`.
Outline exactly what needs to be built. Include UI details, API requirements, and logic flow.

### 2. The Setup Prompt
Feed the context to your agent (Claude/Antigravity/Cursor):
> *"Read **AGENTS.md**, **src/types/supabase.ts**, and the blueprint in **src/prompts/features/[feature].md**. Confirm you understand the plan before coding."*

### 3. The Implementation Phase
Ask the AI to build the **Services** first, then the **UI Components**. This ensures the data logic is solid before you worry about CSS.

### 4. Validation
Run `npm run lint` and `npm run dev` to verify. Let the AI fix any type errors immediately.

---

## 🗄️ Supabase Workflow (The DannFlow Way)

### 1. The Game Changer: Supabase MCP
The **Supabase MCP Server** gives the AI "eyes" and "hands" inside your project.
*   **No more SQL Editor manual entry:** You can ask the AI to "Create a `profiles` table with RLS..." and it executes it directly.
*   **Live Schema Awareness:** The agent can query your *actual* database to see what tables exist, what the column types are, and which RLS policies are active.

*(To set it up in Claude Code, run `claude mcp add supabase` once.)*

### 2. Syncing the "Ground Truth" (The Schema)
We use the **Supabase CLI** to keep the `src/types/` folder updated. This is the professional way to ensure type safety.

**The "One-Command" Sync:**
This repository includes a pre-configured `update-types` script in `package.json`. Whenever the database is changed via MCP, just run `npm run update-types`. The AI will immediately see the new TypeScript definitions in `src/types/` and stop hallucinating column names.

### 3. RLS: The "Invisible" Logic
Handling Row Level Security (RLS) is critical. As stated in the Code Architecture Rules above:
> **RLS Rule:** Always check `src/types/supabase.ts` and assume RLS is active. Every `select` or `update` service must include a `.eq('id', userId)` filter to pass security policies.

### The "Old Way" vs. The "DannFlow Way"

| Feature | The Old Struggle (Manual) | The DannFlow Way (Automated) |
| :--- | :--- | :--- |
| **Schema Changes** | Copy SQL from AI → Paste in Browser. | AI executes SQL directly via **MCP**. |
| **Type Safety** | Guessing column names or manual JSON. | **Supabase CLI** generates perfect TS types. |
| **RLS Awareness** | AI writes "select all"; query fails. | AI reads live policies via **MCP** & follows **AGENTS.md**. |
| **Context** | AI is "blind" to your DB state. | AI has a **live connection** to your project. |

---

## 🔄 Maintenance & Longevity
This repo is updated every 6 months to ensure compatibility with the latest Next.js patterns and AI agent capabilities.

**Last Updated:** April 2026

---

*Built for speed. Structured for Agents. Optimized for the Vibe.*