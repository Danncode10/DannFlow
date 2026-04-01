I hear you. If you’re willing to put in the work to keep the repo updated every few months, then a clean **`git clone`** is definitely the most "vibe-ready" way to start. It keeps your custom configurations, Shadcn setups, and AI rules exactly where you want them.

Here is a clean, no-nonsense README for your repo. Just copy and paste this into your `README.md`.

---

# 🚀 Dann's Vibe-Coding Starter (2026 Edition)

This is a pre-configured, AI-optimized boilerplate for **Next.js**, **Supabase**, and **Vercel**. It is structured specifically to give **Claude Code** and **Antigravity** the "guardrails" they need to code autonomously without breaking the architecture.

### ⚡ Quick Start
Run this in your terminal to get the engine started:

```bash
git clone <your-repo-link> . && npm install && npm run dev
```

---

## 🛠 The Tech Stack
*   **Framework:** Next.js 15+ (App Router)
*   **Language:** TypeScript (Strict Mode)
*   **Database/Auth:** Supabase
*   **Styling:** Tailwind CSS + Shadcn/UI
*   **Deployment:** Vercel

---

## 📁 AI-Legible Folder Structure
To keep the "vibe" clean, we follow this strict separation of concerns. **Do not let the AI mix these up:**

*   **`@/services/`**: **The Logic Layer.** All Supabase queries, API calls, and business logic live here. *AI Rule: No DB logic in components.*
*   **`@/types/`**: **The Ground Truth.** Keep your generated Supabase types here.
*   **`@/prompts/`**: **The Context Layer.** Store feature-specific `.md` files here for the AI to read before coding.
*   **`AGENTS.md`**: The "Instruction Manual" that every AI agent must read before starting a task.

---

## 🤖 AI Workflow (How to Vibe Code)

### 1. Enable MCP Servers
For the best experience, ensure your environment has the following **MCP Servers** active:
*   **PostgreSQL/Supabase:** Allows the AI to "see" your live database schema.
*   **Filesystem:** Essential for the AI to navigate this specific folder structure.
*   **Memory:** (Optional) To help the AI remember project-wide decisions across sessions.

### 2. The Initial Prompt
When you start a new feature, point the AI to the source of truth:
> *"Read **AGENTS.md** and **@/types/supabase.ts**. Then, look at the feature requirements in **@/prompts/features/[your-feature].md** and begin implementation in **@/services**."*

---

## 🔄 Maintenance Note
This repo is updated every 6 months to ensure compatibility with the latest Next.js patterns and AI agent capabilities. Last updated: **April 2026**.

---

*Built for speed. Structured for Agents. Optimized for the Vibe.*