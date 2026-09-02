# Database Workflow & Vibe Coding

This project strictly uses the Supabase CLI for all database management. **Drizzle has been completely removed.**

## 1. The Local Database (Optional)

You can run a local instance of Supabase for testing and visual schema editing:

```bash
npm run db:setup
```

This starts a local Docker stack (shared images across projects) and opens a local Supabase Studio in your browser. 
**Note:** Running the local Docker stack takes up ~9GB of storage globally on your machine. **It is optional.** If you want to save space, you can skip this and edit the live Supabase project directly or just use SQL files.

## 2. Vibe Coding Flow (AI Workflow)

When using AI to vibe code schema changes, the flow is simple:

1. **Write SQL**: The AI will write `.sql` migration files directly into the `supabase/migrations/` directory.
2. **Apply Migrations**: The AI will apply the migrations to your active Supabase database by running:
   ```bash
   npm run db:migrate
   ```
3. **Generate Types**: After a successful migration, the AI must sync the TypeScript definitions by running:
   ```bash
   npm run db:types
   ```
   This ensures `src/types/supabase.ts` accurately reflects the live database.

## 3. Synchronizing with Live (Manual Edits)

If you made changes manually in the remote Supabase dashboard and want to bring them into your local project:

```bash
npm run db:pull
```

This will connect to your live project, detect changes, and create a new migration file in `supabase/migrations/`.

## 4. Comparing Local vs Live

To see if your local migrations and the remote database match, use:

```bash
npm run db:compare
```

## Summary of NPM Scripts

- `npm run db:setup`: Starts the local Supabase Docker stack.
- `npm run db:generate`: Captures changes made in local Supabase Studio into a `.sql` file.
- `npm run db:pull`: Pulls changes from the live Supabase DB into a local `.sql` file.
- `npm run db:migrate`: Pushes all pending local `.sql` files to the active database.
- `npm run db:compare`: Compares local migration files against the live schema.
- `npm run db:types`: Regenerates `src/types/supabase.ts` based on the database schema.
- `npm run checkpoint`: Snapshots the live schema (Tables, Enums, RLS, Triggers) into `supabase/backups/`.
