# Core DannFlow Agent Skills

DannFlow ships with three core, native AI agent skills designed to orchestrate massive project workflows autonomously. Unlike simple slash commands (which execute single, contained instructions), these agent skills guide the AI through multi-step, conversational, and highly autonomous processes.

These skills live in `.agents/skills/` (and `.claude/skills/`) and are automatically detected by any compatible IDE (like Cursor or Antigravity).

---

## 1. `dannflow-masterplan`

**The SaaS Project Orchestrator**

When you start a new DannFlow project, the first step is planning and infrastructure. The `dannflow-masterplan` agent acts as your lead architect and technical project manager.

**What it does:**

- Orchestrates the SaaS onboarding flow.
- Generates a highly detailed `MASTERPLAN.md` based on your product context.
- Links and syncs your tasks with a Kanban-style GitHub Project board.
- Handles initializing core infrastructure, such as your Supabase configuration, Auth settings, and Vercel deployments.

**When to use it:**

- `"Start a new project"`
- `"Initialize the masterplan"`
- `"Sync my GitHub board"`
- `"Let's plan the next development phase"`

---

## 2. `dannflow-task`

**The Autonomous Task Lifecycle Manager**

Once your Masterplan is established, `dannflow-task` becomes your lead developer. It is designed to take a specific, ordered task from your `MASTERPLAN.md` and execute it from start to finish.

**What it does:**

- Reads your `MASTERPLAN.md` and identifies the task context.
- Syncs the task status to `In Progress` on your GitHub Project board.
- Autonomously writes the necessary code to implement the feature.
- Enforces strict architectural guardrails (like RLS policies, semantic styling, and server components).
- Executes pre-verification quality gates (linting, type-checking, and tests).
- Guides you through a human-verification loop to ensure the feature looks and works exactly as expected.
- Updates documentation and safely closes the task out (`/close-task`), marking it `Done` in the ledger.

**When to use it:**

- `"Execute task P2.1"`
- `"Do the next task in the masterplan"`
- `"Let's work on the user profile feature"`

---

## 3. `dannflow-update`

**The Surgical Upstream Synchronizer**

SaaS projects grow quickly, and it's easy for older repositories to fall behind the latest features and architectural patterns of the upstream DannFlow template. The `dannflow-update` agent solves the pain of manually migrating legacy projects.

**What it does:**

- Engages in a highly conversational, step-by-step update process.
- Prevents hallucination by requiring your explicit approval for major structural changes.
- Analyzes the git history of the upstream DannFlow template and creates a temporary updates ledger.
- Safely migrates legacy technologies (such as Drizzle ORM) to the modern stack (Supabase CLI).
- Upgrades the underlying repository framework, UI components, and authentication patterns.
- Protects your custom business logic by ensuring files in `src/services/` are surgically updated, not blindly overwritten.
- Commits changes granularly (4-5+ commits per update) rather than dropping one massive, unreadable PR.

**When to use it:**

- `"Run the dannflow-update agent"`
- `"Sync this old repo from upstream"`
- `"Update this repository to the latest DannFlow version"`

> **Note:** Before running `dannflow-update` on a legacy repository, you must manually upgrade its AI governance files. See [Updating an Old Repo](setup/updating-old-repo.md) for step-by-step instructions.
