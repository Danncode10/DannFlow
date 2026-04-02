# The "Time Machine" Workflow

When you are "Vibe Coding," you will change your database frequently. Follow this loop:

1. **Change**: Tell the AI to modify the DB (via Supabase MCP).
2. **Sync**: Run `npm run update-types` to update the AI's "Eyes."
3. **Checkpoint**: Every time you finish a feature, run `npm run checkpoint`. 
   - The script will generate a specific prompt for your AI Agent.
   - **Copy and paste** that message to the AI (Antigravity).
   - The AI will then read your live Supabase schema (via MCP) and populate a new file under `supabase/backups/`.
   - Example: `supabase/backups/schema-04-02-2026-21-00.sql`.

If you ever break your DB, you can "Restore" by copying the SQL from your last Checkpoint file into the Supabase SQL Editor.
