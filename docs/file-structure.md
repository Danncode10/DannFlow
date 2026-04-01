# 📁 The "Holy Trinity" File Structure

The DannFlow structure revolves around the "Holy Trinity" of files to maintain order while Vibe Coding.

### 1. `src/types/supabase.ts` (The Eyes)
This is the single source of truth for the AI's type-safety. Never edit this manually. Let the Supabase CLI (`npm run update-types`) generate it so the AI always knows the *exact* signature of your database.

### 2. `schema.sql` (The Blueprint / Save Point)
Found inside `supabase/backups/`. This is your historical record and fallback. Whenever you reach a stable state, we create a checkpoint snapshot (e.g. `schema-MM-DD-YYYY.sql`). 

### 3. `src/services/` (The Action)
All Supabase queries, API calls, and complex business logic strictly live here. The AI is specifically instructed *never* to dump database logic directly into UI components. UI fetches via functions defined in this directory.
