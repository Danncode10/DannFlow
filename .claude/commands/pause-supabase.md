---
description: Pause a selected Supabase project through Supabase MCP after listing projects and confirming the exact target.
argument-hint: "[project id | project name]"
---

Pause a Supabase project through Supabase MCP.

User request / target: `$ARGUMENTS`

## Procedure

### Step 0 - Confirm tooling

Verify Supabase MCP is available with project lifecycle tools:

- `list_projects`
- `get_project`
- `pause_project`

If Supabase MCP is unavailable, stop and use the AGENTS.md Missing Tool Alert Protocol.

### Step 1 - Discover projects

Call Supabase MCP `list_projects`.

Show a concise project list with:

- Project name
- Project ID / ref
- Region, if available
- Status, if available

If `$ARGUMENTS` identifies exactly one project by ID or unambiguous name, select it as the candidate. If it is missing or ambiguous, ask the user which project to pause.

Never guess between similarly named projects.

### Step 2 - Safety confirmation

Before pausing, show:

```text
I am about to pause:
Project: <name>
Project ID: <project_id>
Status: <status>
```

Ask for confirmation unless the user already provided an exact project ID and explicitly asked to pause it in the same message.

For projects that appear production-critical, customer-facing, or connected to the current repo, require an explicit confirmation.

### Step 3 - Pause

Call Supabase MCP `pause_project` with:

```json
{ "project_id": "<project_id>" }
```

Then call `get_project` to verify the new status.

If the project enters an in-progress state, report that clearly and suggest checking again with `/pause-supabase <project_id>` or `/start-supabase <project_id>` later.

### Step 4 - Report

Use this format:

```text
Supabase project pause requested.

Project: <name>
Project ID: <project_id>
Status: <verified status>
```

If the pause fails, report the exact error and do not claim success.

## Constraints

- Do not pause a project without confirming the target.
- Do not modify local files, migrations, environment variables, or TypeScript types.
- Do not run SQL.
- Do not create, delete, or branch projects.
