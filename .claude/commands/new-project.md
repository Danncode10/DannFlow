---
description: "Initialize a fresh DannFlow SaaS: capture product context, rebrand configuration, connect one repository and Supabase project, then hand off to masterplan initialization."
argument-hint: "[project name]"
---

# /new-project

Turn a fresh DannFlow clone into one project with one dedicated Supabase project. This command never creates application tenants, `app_id` values, or organization rows.

1. Read `README.md`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, `.env.example`, and `package.json`.
2. Collect the project name, URL, description, GitHub visibility, and the Supabase project to connect.
3. Update only `package.json`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, `README.md`, and non-secret site variables in `.env.local`.
4. Create/repoint the GitHub repository after confirmation.
5. Ask the user to add Supabase URL, publishable key, service role key, `SUPABASE_PROJECT_ID`, and `DATABASE_URL` to `.env.local`.
6. Run `pnpm db:migrate`, then verify public tables and functions. Do not run `/create-organization`; application tenancy does not exist.
7. Confirm `.env.local` contains the non-secret `SUPABASE_PROJECT_ID`; never write keys, database URLs, passwords, or tokens to tracked files.
8. Hand off to `/masterplan-init`. Explain that the user must first create a non-draft GitHub Project in Kanban/Board layout with `Backlog`, `Ready`, `In progress`, and `Done` statuses; `/masterplan-init` will detect it and save the selected GitHub Project identifiers in `.env.local`.

When provisioning a new Supabase project, account-level organization selection is required by Supabase. It is not an application data model and must never create a public `organizations` table.
