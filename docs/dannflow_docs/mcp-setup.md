# Powering Up the AI (The MCP Trinity)

To make "DannFlow" work, the AI needs three sets of tools:

### 1. Supabase MCP (The Database Brain)
- **Purpose**: Allows the AI to read live schema, verify migrations, inspect RLS policies, run advisors, and manage Supabase projects.
- **Important**: Normal schema changes are tracked in `db/schema/*.ts` and `db/migrations/*.sql`. Do not use Supabase MCP to create or alter app tables unless the user explicitly requests an emergency live hotfix.
- **Setup**: Use your Supabase Access Token from Account Settings.

### 2. GitHub MCP (The Memory)
- **Purpose**: Lets the AI inspect repository history and synchronize detailed Masterplan tasks to an existing GitHub Project.
- **Setup**: Use a GitHub Personal Access Token with repository access and GitHub Projects access. Verify it can list the repository's Projects before running `/masterplan-init`.

> `/masterplan-init` does not create a Project. Create a non-draft GitHub Project in Kanban/Board layout first, with `Backlog`, `Ready`, `In progress`, and `Done` Status values.

### 3. Terminal MCP (The Hands)
- **Purpose**: Allows the AI to run commands like `pnpm db:generate`, `pnpm db:migrate`, and `pnpm db:types` for you.
- **Setup**: Enable "Terminal" or "Shell" access in your agent settings (Claude Code, Cursor, or Antigravity).

### 4. Ruflo MCP (Memory + Orchestration) — Beta

- **Purpose**: Adds persistent memory tools, swarms, hooks, and project agents to Claude Code.
- **Status**: Currently in **beta** — we always install `ruflo@latest`.
- **Global install (once per machine, required BEFORE any per-project init):**
  ```bash
  npm install -g ruflo@latest
  claude mcp add ruflo -- npx ruflo@latest mcp start
  ```
- **Per-project init (run only after the global install above):**
  ```bash
  cd your-project
  npx ruflo@latest init wizard
  ```

> The DannFlow `install.sh` runs both steps automatically. If you set up manually, follow the order strictly: **global install → MCP register → `init wizard`**.
