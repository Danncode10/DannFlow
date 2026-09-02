---
description: Verify a DannFlow project is initialized, require an existing Kanban-style GitHub Project, then create detailed Phase 0 readiness cards including Vercel deployment setup.
argument-hint: "[--project-url <url>] [--project-owner <owner>] [--project-number <number>] [--dry-run]"
---

# /masterplan-init

Initialize the execution plan for an already-described DannFlow SaaS. This command creates the detailed onboarding **Phase 0** only; later phases remain concise until `/make-masterplan` expands them.

User input: **$ARGUMENTS**

## Required state

Read `.env.local`, `.env.example`, `README.md`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, and `MASTERPLAN.md` before changing anything.

Treat the project as initialized only when all of the following are true:

- `README.md`, `PROJECT_CONTEXT.md`, and `src/lib/config.ts` no longer contain DannFlow starter placeholders for the product identity.
- `.env.local` contains a non-placeholder `SUPABASE_PROJECT_ID`.
- Git remote metadata identifies a repository that is not the DannFlow template repository.

If the project is still the DannFlow template, or the record is incomplete, stop without editing files or GitHub. Say which signals were missing and tell the user to run `/new-project` first. Do not add prerequisite/admin tasks to `MASTERPLAN.md`.

## Supabase project handoff

`/new-project` deliberately does not collect or provision Supabase. This command owns that step.

1. If `.env.local` has no non-placeholder `SUPABASE_PROJECT_ID`, ask the user to provide an existing Supabase project ID or say **provision a new one**.
2. If provisioning is requested, follow the repository provisioning protocol: list organizations, ask for the project name and organization ID, check cost, confirm cost, then provision. Never create an application `organizations` table.
3. Ask the user to add the Supabase URL, publishable key, service-role key, and `DATABASE_URL` to `.env.local`. Never write secrets to tracked files.
4. Verify the project ID is non-placeholder before continuing. After credentials are available, run `npm run db:migrate` and verify the required public tables and functions.

## GitHub Project prerequisite

1. Verify GitHub Projects access. Prefer GitHub MCP; use authenticated `gh` CLI with the `project` scope only when MCP Projects APIs are unavailable.
2. Resolve the Project from `--project-url`, then `GITHUB_PROJECT_URL` in `.env.local`, then legacy `--project-owner`/`--project-number` arguments and `GITHUB_PROJECT_OWNER`, `GITHUB_PROJECT_NUMBER`, and `GITHUB_PROJECT_ID`. Accept canonical GitHub URLs in the form `https://github.com/users/<owner>/projects/<number>` or `https://github.com/orgs/<owner>/projects/<number>`; strip any `/views/...` suffix and query string before lookup. Derive the owner and number from the URL, then fetch the API ID. Only list Projects for the repository owner if no binding is present.
3. If no matching Project exists, stop without editing `MASTERPLAN.md` or creating cards. Tell the user:

```text
No GitHub Project is linked to this SaaS yet. Create a GitHub Project in Kanban/Board layout with these Status values: Backlog, Ready, In progress, Done. Then run /masterplan-init again.
```

4. Never create a GitHub Project or use a Project named "Draft" as the execution board. Cards must be real GitHub Issues added to the Project, never Project draft items.
5. Confirm the selected Project has a `Status` field with `Backlog`, `Ready`, `In progress`, and `Done`. If a value is missing, ask the user to add it before continuing.

## Procedure

1. Preserve completed tasks and existing IDs if `MASTERPLAN.md` was previously initialized. Do not duplicate tasks or cards when rerun.
2. After selecting the Project, write its non-secret canonical binding to `.env.local`, derive the compatibility/API fields, and keep placeholder names documented in `.env.example`:

```env
GITHUB_PROJECT_URL=https://github.com/users/<owner>/projects/<number>
GITHUB_PROJECT_OWNER=<owner>
GITHUB_PROJECT_NUMBER=<number>
GITHUB_PROJECT_ID=<project-id>
```

3. Create or refresh `MASTERPLAN.md` with:
   - the app name and one-line summary from the initialized project context;
   - a detailed Phase 0 containing only real SaaS readiness work;
   - concise Phase 1+ placeholders, without detailed tasks;
   - stable ordered IDs for every Phase 0 task.
4. Phase 0 is **DannFlow template readiness**, not project feature design. Do not plan a product-specific relational database, schema migration, RLS policy, new auth provider, or application feature in this phase. When the applicable tasks are present, use this order and dependency chain:
   - `[P0.1]` Supabase template connection and environment values — `Run: /setup-supabase`;
   - `[P0.2]` project overview applied to the template UI: design direction, color system, landing-page copy, and template visual cleanup — `Run: /design-project`;
   - `[P0.3]` template email authentication and redirect configuration: Gmail SMTP for Supabase auth emails, email confirmation and recovery settings, app redirect URLs, and branded email templates — `Run: /setup-auth`; depend on `[P0.1]` and `[P0.2]` because branded email templates must use the established visual system;
   - `[P0.4]` Google OAuth sign-in configuration and verification: Google Cloud consent screen and Web client, Google-to-Supabase callback URI, Supabase Google provider credentials, app redirect URLs, and a successful end-to-end sign-in — `Run: /setup-auth`; depend on `[P0.1]`, `[P0.2]`, and `[P0.3]`;
   - `[P0.5]` hero media brief and asset handoff — `Run: /hero-bg`; depend on `[P0.2]`;
   - `[P0.6]` template-level visual and quality review — `Run: /seo-check`, `/marketing-check`, and `/review`; depend on the applicable earlier Phase 0 tasks.
   - `[P0.7]` Vercel production deployment and authentication URL registration: import the Git repository, copy the current private runtime environment values into Vercel for an initial deploy, then treat Vercel's resulting stable production domain as a required handoff checkpoint. Replace `NEXT_PUBLIC_SITE_URL` with that canonical HTTPS origin, add its exact app redirect URLs to Supabase Auth while keeping localhost redirects for development, add it as a Google Cloud Authorized JavaScript origin, retain the Google-to-Supabase callback URI, redeploy after the environment update, and verify email confirmation, password recovery, and Google sign-in from the intended origin. Keep Supabase Site URL as the intended fallback during testing; set it to the production origin at public launch. A successful initial Vercel deployment alone does not complete this task — `Run: /setup-vercel`; depend on `[P0.1]`, `[P0.2]`, `[P0.3]`, `[P0.4]`, and `[P0.6]`.
5. Put project-specific database design, relationships, new tables, RLS changes, new provider implementation, and product features into later phases created with `/make-masterplan`.
6. Every Phase 0 task must include a short goal, dependencies, acceptance criteria, and one or more `Run: /...` handoffs. Do not put long dashboard tutorials in `MASTERPLAN.md`; they belong in the referenced command.
7. Sync every Phase 0 task to one matching real GitHub Issue and add that Issue to the Project by stable ID prefix. New unchecked items start in `Backlog`; checked items map to `Done`; preserve existing `Ready` and `In progress` states. Never create a Project draft item.
8. Do not create cards for Phase 1+ placeholders until `/make-masterplan` expands that phase.

## Output format

```text
MASTERPLAN.md initialized
GitHub Project linked: <owner>/<number>

Phase 0 cards synced:
  - [P0.1] <title> -> <status>

Later phases:
  - placeholders created; no cards yet

Next:
  Run /what-task to choose the first Phase 0 task.
```

## Constraints

- `MASTERPLAN.md` is the local source of truth; GitHub Project mirrors detailed tasks only.
- Never create a GitHub Project automatically.
- Never create a draft Project or draft card; use real GitHub Issues as cards.
- Never store credentials, database URLs, or tokens in `.env.example` or tracked files.
- Vercel deployment instructions must distinguish browser-safe `NEXT_PUBLIC_*` values from server-only secrets; never recommend adding `DATABASE_URL` merely to deploy the application.
- For Google OAuth, the deployed app origin belongs in **Authorized JavaScript origins**. The **Authorized redirect URI** remains the Supabase callback (`https://<project-ref>.supabase.co/auth/v1/callback`), while Supabase allow-lists the app's `/auth/callback` and recovery routes. During testing, the Supabase Site URL may remain the local fallback; set it to the production origin at public launch.
- Do not modify application code while initializing the plan.
