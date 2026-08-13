---
description: Verify a DannFlow project is initialized, require an existing Kanban-style GitHub Project, then create a detailed Phase 0 and sync its task cards.
argument-hint: "[--project-owner <owner>] [--project-number <number>] [--dry-run]"
---

# /masterplan-init

Initialize the execution plan for an already-described DannFlow SaaS. This command creates the detailed onboarding **Phase 0** only; later phases remain concise until `/make-masterplan` expands them.

User input: **$ARGUMENTS**

## Required state

Read `dannflow.json`, `README.md`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, `.env.example`, and `MASTERPLAN.md` before changing anything.

Treat the project as initialized only when all of the following are true:

- `dannflow.json` contains `project.initialized_at` and a non-empty `project.name`.
- `README.md`, `PROJECT_CONTEXT.md`, and `src/lib/config.ts` no longer contain DannFlow starter placeholders for the product identity.
- `project.repository` and `project.supabase_project_id` are recorded in `dannflow.json`.

If the project is still the DannFlow template, or the record is incomplete, stop without editing files or GitHub. Say which signals were missing and tell the user to run `/new-project` first. Do not add prerequisite/admin tasks to `MASTERPLAN.md`.

## GitHub Project prerequisite

1. Verify GitHub Projects access. Prefer GitHub MCP; use authenticated `gh` CLI with the `project` scope only when MCP Projects APIs are unavailable.
2. Resolve the Project from command arguments, then from `dannflow.json`'s `github_project` binding, then by listing Projects for the repository owner.
3. If no matching Project exists, stop without editing `MASTERPLAN.md` or creating cards. Tell the user:

```text
No GitHub Project is linked to this SaaS yet. Create a GitHub Project in Kanban/Board layout with these Status values: Backlog, Ready, In progress, Done. Then run /masterplan-init again.
```

4. Never create a GitHub Project or use a Project named "Draft" as the execution board. Cards must be real GitHub Issues added to the Project, never Project draft items.
5. Confirm the selected Project has a `Status` field with `Backlog`, `Ready`, `In progress`, and `Done`. If a value is missing, ask the user to add it before continuing.

## Procedure

1. Preserve completed tasks and existing IDs if `MASTERPLAN.md` was previously initialized. Do not duplicate tasks or cards when rerun.
2. Update `dannflow.json` with a non-secret binding:

```json
{
  "github_project": {
    "owner": "<owner>",
    "number": 0,
    "id": "<project-id>",
    "view": "Kanban",
    "linked_at": "<ISO-8601 timestamp>"
  }
}
```

3. Create or refresh `MASTERPLAN.md` with:
   - the app name and one-line summary from the initialized project context;
   - a detailed Phase 0 containing only real SaaS readiness work;
   - concise Phase 1+ placeholders, without detailed tasks;
   - stable ordered IDs for every Phase 0 task.
4. Use Phase 0 tasks appropriate to the actual SaaS. Include only applicable work from this set:
   - design direction and visual system — `Run: /design-project`;
   - Supabase environment, tracked migration, generated types, RLS/schema verification — `Run: /setup-supabase`;
   - email/password and selected social authentication, Google OAuth when selected, redirects, branded email templates, and auth smoke tests — `Run: /setup-auth`;
   - project-specific landing page — `Run: /design-project`;
   - hero media brief and asset handoff — `Run: /hero-bg`;
   - launch-quality review — `Run: /seo-check`, `/marketing-check`, and `/review`.
5. Every Phase 0 task must include a short goal, dependencies, acceptance criteria, and one or more `Run: /...` handoffs. Do not put long dashboard tutorials in `MASTERPLAN.md`; they belong in the referenced command.
6. Sync every Phase 0 task to one matching real GitHub Issue and add that Issue to the Project by stable ID prefix. New unchecked items start in `Backlog`; checked items map to `Done`; preserve existing `Ready` and `In progress` states. Never create a Project draft item.
7. Do not create cards for Phase 1+ placeholders until `/make-masterplan` expands that phase.

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
- Never store credentials, database URLs, or tokens in `dannflow.json`.
- Do not modify application code while initializing the plan.
