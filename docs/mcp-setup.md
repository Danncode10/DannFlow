# ⚙️ MCP Setup Guides

Our AI workflow heavily relies on **Model Context Protocol (MCP)** servers to give the AI "eyes" and "hands" inside your environment. 

### 1. Supabase MCP
- **Purpose**: Gives AI read/write access to your live database scheme.
- **Setup**: Open Antigravity Settings -> MCP Store -> Search "Supabase". Add your credentials from `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`).

### 2. GitHub MCP
- **Purpose**: Allows the AI to read your repository history, compare branches, diff conflicts, and safely review PRs.
- **Setup**: Open Antigravity Settings -> MCP Store -> Search "GitHub". Connect your personal access token.

### 3. Terminal MCP
- **Purpose**: Enables the AI to run system commands, such as creating database backup checkpoints (`npx supabase db dump`).
- **Setup**: Usually built-in to robust AI agents, but ensure terminal execution permissions are granted to the agent for "safe" commands.
