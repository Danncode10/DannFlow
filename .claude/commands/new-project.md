---
description: "Scaffold a fresh DannFlow project: collect project context, rebrand configuration, create a repository, and connect one dedicated Supabase project."
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
7. Hand off to `/design-project`.

When provisioning a new Supabase project, account-level organization selection is required by Supabase. It is not an application data model and must never create a public `organizations` table.
