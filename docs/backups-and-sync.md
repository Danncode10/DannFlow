# The "Time Machine" Workflow

When you are "Vibe Coding," you will change your database frequently. Follow this loop:

1. **Change**: Tell the AI to modify the DB (via Supabase MCP).
2. **Sync**: Run `npm run update-types` to update the AI's "Eyes."
3. **Checkpoint**: Every time you finish a feature, tell the AI: "Checkpoint." 
   - The AI will generate a new file: `supabase/backups/schema-04-01-2026.sql`.

If you ever break your DB, you can "Restore" by running the last Checkpoint file.
