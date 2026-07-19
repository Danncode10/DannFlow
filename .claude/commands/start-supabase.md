---
description: Restore/start the Supabase project from .env.local or an explicit ref, explicitly separating MCP-visible projects from Supabase-counted free-plan projects.
argument-hint: "[project ref | project name] [--pause <project ref>]"
---

Restore or start a paused Supabase project through Supabase MCP.

User request / target: `$ARGUMENTS`

## Procedure

### Step 0 - Confirm tooling

Verify Supabase MCP is available with project lifecycle tools:

- `list_organizations`
- `get_organization`
- `list_projects`
- `get_project`
- `restore_project`
- `pause_project`

If Supabase MCP is unavailable, stop and use the AGENTS.md Missing Tool Alert Protocol.

Verify Terminal is available to read `.env.local`. If Terminal is unavailable, stop and use the AGENTS.md Missing Tool Alert Protocol.

### Step 1 - Resolve the target from .env.local or arguments

Parse `$ARGUMENTS` for:

```text
start-supabase [target project ref | exact project name] [--pause <project ref>]
```

Before asking for a target, read `.env.local` and look for:

```text
NEXT_PUBLIC_SUPABASE_URL=https://<project_ref>.supabase.co
```

If `NEXT_PUBLIC_SUPABASE_URL` exists, extract `<project_ref>` and treat it as the default target when no explicit target is provided.

If `.env.local` is missing or `NEXT_PUBLIC_SUPABASE_URL` is missing, say exactly:

```text
NEXT_PUBLIC_SUPABASE_URL is missing from .env.local, so I cannot infer the current workspace Supabase project.

Run one exact command:
  start-supabase <project ref>
```

Do not scan or print secret values from `.env.local`.

### Step 2 - Discover MCP-visible organizations and projects

Call Supabase MCP `list_organizations`, then call `get_organization` for every returned organization.

Call Supabase MCP `list_projects`.

Before choosing or restoring anything, print only the active MCP-visible inventory grouped by organization.

Important wording rule: never say "only active project" or "all active projects" unless Supabase MCP can prove it has visibility into every Supabase organization for the account. Say "MCP-visible active projects" instead.

```text
MCP-visible Supabase inventory

Organization: <organization name>
Organization ID: <organization_id>
Plan: <plan or unknown>

Active projects:
  - <project name>
    Ref: <project ref>
    Status: <status>
    Region: <region>
```

If there are no active projects visible to MCP for an organization, show:

```text
Active projects: none visible to MCP
```

Do not list inactive projects by default. Only show an inactive project when it is the selected target, an exact name/ref match, or needed to explain a restore action.

For each active project, always show:

- Project name
- Project ref / ID
- Organization name and organization ID
- Organization plan, if available
- Region
- Status

If the target ref came from `.env.local`, print:

```text
Target source: .env.local NEXT_PUBLIC_SUPABASE_URL
Target ref: <project_ref>
```

If `$ARGUMENTS` identifies exactly one project by ID/ref or exact name, select it as the target project. If it is missing and `.env.local` did not provide a target, ask the user which project ref to start.

Never guess between similarly named projects.

If `$ARGUMENTS` is a partial name and more than one project matches, stop and show strict choices. Include inactive matches only in this ambiguity report:

```text
Multiple projects match "<argument>".

Choose one:
1. start-supabase <exact project ref>
2. start-supabase <exact project name>
```

If the target ref from `.env.local` or `$ARGUMENTS` is not present in `list_projects`, continue only if the value is a valid-looking Supabase ref. Print:

```text
Target ref <project_ref> was not found in MCP list_projects. I can attempt restore by ref, but MCP may not have visibility into that project.
```

### Step 3 - Determine active project limit risk

Classify project status from the MCP response. Treat projects as active-count candidates when their status appears active, healthy, restoring, starting, or otherwise available for use. Treat paused/inactive projects as not active.

Print the active-project count before attempting restore:

```text
Active project count visible to MCP: <n>
Free-plan organization(s): <organization names or n/a>
Target project: <name> (<ref>)
Target status: <status>
```

Also print MCP visibility limitations:

```text
MCP-visible organizations: <organization names>
MCP-visible organization count: <n>
```

If Supabase Dashboard, user screenshots, user text, or a previous restore error indicates another organization exists but `list_organizations` does not show it, say:

```text
MCP visibility gap detected.

What MCP can list:
  - Organizations: <visible organizations>
  - Active projects: <visible active count>

What Supabase is enforcing:
  - The free-plan active-project limit is counted across organizations where this member is an administrator or owner.
  - Supabase may count active projects in organizations this MCP connection cannot enumerate.

Likely cause:
  - The Supabase Dashboard browser session can see an organization that the Supabase MCP OAuth connection cannot list, or the MCP connector was authorized with narrower organization visibility than the dashboard session.
```

Determine whether the account appears to be on the free plan:

- If `get_organization` exposes `plan`, use it.
- If MCP project data exposes account plan, organization plan, tier, quota, or billing fields, use those fields too.
- If MCP does not expose plan data, do not invent it. Ask the user whether this Supabase account is on the free plan when the active project count is already 2 or more.
- If the user has already stated the account is free, treat it as free.

When the account is free and there are already 2 active projects, do not call `restore_project` yet. Tell the user:

```text
You currently have 2 active Supabase projects, and this account appears to be on the free plan. Supabase free accounts usually allow only 2 active projects.

To start <target project>, I need to pause one active project first.
```

Then list only the active MCP-visible projects that are safe candidates to pause. Include name, ref, organization, and status. Ask which one to pause.

Use strict next-command suggestions:

```text
Choose one exact command:

pause-supabase <project ref to pause>
start-supabase <target project ref> --pause <project ref to pause>
```

If the account is free but MCP shows fewer than 2 active projects, proceed with restore once. If Supabase rejects the restore because the member/account has reached the free project limit, do not keep retrying. Report the exact error and print:

```text
Supabase reports the free active-project limit is reached, but MCP can only list <n> active project(s).

This does not mean there are only <n> active project(s) in Supabase. It means MCP can only see <n>.

MCP-visible organizations:
  - <organization name> (<organization_id>) - <plan>

MCP-visible active projects:
  - <name> (<ref>) - <status>

Strict next commands:
  - pause-supabase <visible active project ref>
  - start-supabase <target ref> --pause <visible active project ref>

If another active project exists in a Supabase organization MCP cannot see, pause it in the Supabase dashboard or reconnect Supabase MCP with access to that organization, then rerun:
  - start-supabase <target ref>
```

If the error message names a member, organization, or account that was not returned by `list_organizations`, explicitly call that out:

```text
Supabase error mentions <name>, but MCP list_organizations did not return an organization/account by that name. That is the visibility mismatch blocking automatic pause selection.
```

### Step 4 - Pause another project if needed

Support an optional strict pause argument:

```text
start-supabase <target project ref> --pause <project ref to pause>
```

If `--pause <project ref>` is provided:

1. Resolve the pause project by exact ref or exact ID.
2. Confirm it is active.
3. Confirm it is not the target project.
4. Pause it before restoring the target.

If the pause ref is not visible in `list_projects`, stop. Supabase MCP cannot safely pause a project it cannot list.

If the user selects a project to pause interactively:

1. Confirm the exact project to pause.
2. Call Supabase MCP `pause_project` with that project ID.
3. Call `get_project` to verify its status.

Do not pause the target project that the user is trying to start.

If the pause fails, stop and report the error. Do not try to restore the target project until the active-project limit risk is resolved.

### Step 5 - Restore target project

Call Supabase MCP `restore_project` with:

```json
{ "project_id": "<target_project_id>" }
```

Then call `get_project` to verify the target project's status.

If the project enters an in-progress state, report that clearly and suggest checking again later with `/start-supabase <project_id>`.

### Step 6 - Report

Use this format:

```text
Supabase project start requested.

Organization:
  Name: <organization name>
  ID: <organization_id>
  Plan: <plan or unknown>

Target:
  Source: <.env.local or explicit argument>
  Project: <target name or unknown>
  Ref: <target_project_id>
  Status before restore: <status or unknown>

MCP-visible active projects before restore:
  - <project name> (<project_ref>) - <status>

Visibility:
  MCP-visible active count: <n>
  Supabase-counted limit status: <not checked | accepted | rejected as limit reached>
  Hidden organization/project risk: <yes/no and why>

Started:
  Project: <target name>
  Ref: <target_project_id>
  Status: <verified status>

Paused first:
  Project: <paused name or n/a>
  Ref: <paused_project_id or n/a>
  Status: <verified status or n/a>
```

If restore fails, report the exact error and do not claim success.

## Constraints

- Do not restore a project until the target is unambiguous.
- If no explicit target is provided, infer the target from `.env.local` `NEXT_PUBLIC_SUPABASE_URL`.
- If `.env.local` or `NEXT_PUBLIC_SUPABASE_URL` is missing and no target was provided, stop and ask for `start-supabase <project ref>`.
- Never print `.env.local` secrets.
- Always show MCP-visible organization name, organization ID, plan, active project names, active project refs, and statuses before restore.
- Never imply MCP-visible active projects are the complete Supabase account inventory when Supabase Dashboard, user-provided evidence, or restore errors show otherwise.
- Do not list inactive projects by default.
- Do not pause any project without the user's explicit selection or confirmation.
- Do not hide or summarize away Supabase limit errors. Quote the actionable part of the error.
- If MCP cannot see an organization shown in Supabase Dashboard or implied by an error, say it is an MCP visibility gap instead of saying the organization/project does not exist.
- When a visibility gap exists, explain that MCP auth/organization visibility and the Supabase Dashboard browser session can differ.
- Do not modify local files, migrations, environment variables, or TypeScript types.
- Do not run SQL.
- Do not create, delete, or branch projects.
