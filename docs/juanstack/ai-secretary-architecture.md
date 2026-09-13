# AI Secretary Architecture

The AI Secretary is the proactive heartbeat of JuanStack. It monitors tenant data in the background and generates actionable tasks for users based on predefined rules.

## Core Components

1. **Manifest Definitions (`core.ai-manifest.json`)**
   - Pure JSON files that define `observable_states` (e.g. what table to monitor, what field to check, what condition triggers the task).
   - Allows product managers to add new proactive features without writing code.

2. **The Task Engine (`supabase/functions/_shared/task-engine.ts`)**
   - Pure TypeScript logic that loads manifests, evaluates database rows against `observable_states`, and generates `secretary_tasks` payloads.

3. **The Scheduler (`supabase/functions/ai-secretary/index.ts`)**
   - A Supabase Edge Function that runs on a schedule (via `pg_cron` or Supabase cron).
   - Iterates through target tables with the `service_role` key (bypassing RLS for the scan) and delegates matching rows to the Task Engine.
   - Inserts generated tasks into the `secretary_tasks` table.

4. **The Task Queue API (`src/ai/secretary/task-queue.ts` & `src/services/secretary.service.ts`)**
   - Next.js Server Actions that wrap the Supabase client.
   - Respects standard Row Level Security (RLS) so users only see tasks generated for their specific `organization_id`.
   - Exposes methods to fetch, dismiss, and complete tasks.

## Data Flow

1. Cron triggers Edge Function.
2. Edge Function scans `invoices` (for example) using Service Role.
3. Edge Function passes rows to `evaluateState`.
4. If `true`, Edge Function inserts a new task into `secretary_tasks` linked to the correct `organization_id`.
5. User logs into Next.js app.
6. React UI calls `fetchSecretaryTasks()`, which queries `secretary_tasks` using the authenticated user's RLS context.
7. User completes the task, UI calls `markTaskDone()`, updating the DB state.
