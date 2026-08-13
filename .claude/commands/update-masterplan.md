---
description: Sync edits in MASTERPLAN.md to a linked GitHub Project while preserving ordered task IDs and live statuses.
argument-hint: "[--project-owner <owner>] [--project-number <number>] [--prune] [--dry-run]"
---

# /update-masterplan

Update the GitHub Project from the current `MASTERPLAN.md`.

User input: **$ARGUMENTS**

## Procedure

1. Read `CLAUDE.md`, `AGENTS.md`, and the full `MASTERPLAN.md`.
2. Verify GitHub tooling:
   - Prefer GitHub MCP if it exposes GitHub Projects v2 item APIs.
   - If Projects APIs are not exposed through MCP, use authenticated `gh` CLI with the `project` scope.
   - If neither path is available, stop with the project's Missing Tool Alert Protocol for GitHub MCP.
3. Resolve the GitHub Project from explicit args, then `dannflow.json`'s `github_project` binding, then by listing projects. If no linked Project exists, tell the user to create a Kanban-style Project and run `/masterplan-init`; do not create a Project automatically.
4. Parse all task checkboxes in `MASTERPLAN.md`.
5. Validate every task title starts with a stable ID:
   - valid: `[P2.1] Build feature service`
   - valid: `[P3A.2] Add admin filters`
   - invalid: `[P2] Build feature service`
6. If bare phase IDs are found, renumber tasks in file order before syncing.
7. Fetch current Project items and match by the stable ID prefix, not by full title.
8. For each detailed masterplan task:
   - create a missing real GitHub Issue, then add it to the Project; never create a Project draft item
   - update changed Issue titles and bodies
   - map checked tasks to `Done`
   - keep existing `In progress` / `In review` statuses unless the task is checked
   - map unchecked new tasks to `Backlog`
9. If a task is removed from `MASTERPLAN.md`, report the orphaned Project item. Only remove/archive when `--prune` is present.
10. If the current user request is task work rather than planning, confirm the matching card before moving it to `In progress`.

## Status rules

- Before doing tracked work: identify the matching Masterplan task and ask which card to use if ambiguous.
- If no matching task exists: ask whether to add it to `MASTERPLAN.md` and the GitHub Project before proceeding.
- Starting a task: move its Project item to `In progress`.
- Pausing a task: leave it `In progress` unless the user says it is no longer active.
- Finishing a task: check it in `MASTERPLAN.md`, move its Project item to `Done`, and include the completed task ID in the final response.
- Reviewing a task: use `In review` only when a PR/review step is actually active.

## GitHub Project sync commands

Use these primitives when `gh` is the available Projects path:

```bash
gh project item-list <project-number> --owner <owner> --format json --limit 200
gh project field-list <project-number> --owner <owner> --format json
gh issue create --repo <owner>/<repo> --title "<title>" --body "<body>"
gh issue edit <issue-number> --repo <owner>/<repo> --title "<title>" --body "<body>"
gh project item-add <project-number> --owner <owner> --url <issue-url>
gh project item-edit --id <project-item-id> --project-id <project-id> --field-id <status-field-id> --single-select-option-id <option-id>
```

## Output format

```text
MASTERPLAN.md synced to GitHub Project: <owner>/<project-number>

Updated:
  - [P2.1] <title> -> <status>

Created:
  - [P4.3] <title> -> Backlog

Needs attention:
  - <orphan/conflict, or "None">

Suggested commit: chore: sync masterplan task board
```

## Constraints

- Never create bare `[P2]` task cards.
- Use real GitHub Issues as cards; never create Project draft items.
- Never reorder completed task IDs casually; preserve history unless the user explicitly asks to renumber.
- Do not delete Project items without `--prune`.
- Do not modify application code.
