---
description: "Initialize a fresh DannFlow project: capture product context, configure the project repository origin, and hand off Supabase setup to masterplan initialization."
argument-hint: "[project name]"
---

# /new-project

Turn a fresh DannFlow clone into one project repository with its own identity. This command never creates application tenants, `app_id` values, organizations, or Supabase projects.

1. Read `README.md`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, `.env.example`, and `package.json`.
2. Collect the project name, **Project URL**, short product description, and GitHub visibility. The Project URL is required because it becomes this checkout's `origin` remote. If the repository does not exist, ask for explicit permission to create it before continuing.
3. Update only `package.json`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, `README.md`, and non-secret site variables in `.env.local`.
4. Configure `origin` to the confirmed Project URL and verify that `upstream` points to `https://github.com/Danncode10/DannFlow` with pushes disabled. Do not push project work to DannFlow.
5. Do **not** collect a Supabase project ID or provision Supabase here. Leave Supabase project selection, credentials, and `SUPABASE_PROJECT_ID` for `/masterplan-init`.
6. Do not run `pnpm db:migrate` until `/masterplan-init` has completed Supabase project selection and the required credentials are present. Do not run `/create-organization`; application tenancy does not exist.
7. Hand off to `/masterplan-init`. Explain that the user must first create a non-draft GitHub Project in Kanban/Board layout with `Backlog`, `Ready`, `In progress`, and `Done` statuses; `/masterplan-init` will collect or provision the Supabase project, save its non-secret ID, detect the GitHub Project, and save the selected GitHub Project identifiers in `.env.local`.

The Project URL is the repository identity. A checkout with only `upstream → DannFlow` is not initialized for project work and must stop until `origin` is configured.
