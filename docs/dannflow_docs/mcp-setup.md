# Powering Up the AI (The MCP Trinity)

To make "DannFlow" work, the AI needs three sets of tools:

### 1. Supabase MCP (The Database Brain)
- **Purpose**: Allows the AI to create tables, write SQL, and check RLS policies automatically.
- **Setup**: Use your Supabase Access Token from Account Settings.

### 2. GitHub MCP (The Memory)
- **Purpose**: Allows the AI to "Time Travel." It can compare why your code worked yesterday but broke today without you copying and pasting long diffs.
- **Setup**: Use a GitHub Personal Access Token with repo scopes.

### 3. Terminal MCP (The Hands)
- **Purpose**: Allows the AI to run commands like `npm install` or `npm run update-types` for you.
- **Setup**: Enable "Terminal" or "Shell" access in Antigravity settings.
