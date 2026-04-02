# The "Time Machine" Workflow

When you are "Vibe Coding," you will change your database frequently. Follow this loop:

1. **Change**: Tell the AI to modify the DB (via Supabase MCP).
2. **Sync**: Run `npm run update-types` to update the AI's "Eyes."
3. **Checkpoint**: Every time you finish a feature, tell the AI: "Checkpoint." 
   - The AI will run `npm run checkpoint` to create a timestamped file.
   - The AI then reads the live database schema (via Supabase MCP) and populates the file with the latest DDL.
   - Example: `supabase/backups/schema-04-02-2026-20-47.sql`.

If you ever break your DB, you can "Restore" by copying the content of the last Checkpoint file into the Supabase SQL Editor.
