---
description: Expand one or more future MASTERPLAN phases into detailed ordered tasks and sync their cards to the linked GitHub Project.
argument-hint: "<phase> [--project-owner <owner>] [--project-number <number>] [--dry-run]"
---

# /make-masterplan

Expand a future phase of the initialized `MASTERPLAN.md` and sync only that phase's detailed tasks into the linked GitHub Project.

User input: **$ARGUMENTS**

## Procedure

1. Read `CLAUDE.md`, `AGENTS.md`, `PROJECT_CONTEXT.md`, `README.md`, `dannflow.json`, the full existing `MASTERPLAN.md`, `docs/`, `src/prompts/features/`, and any existing planning docs.
2. If Phase 0 has not been initialized, stop and tell the user to run `/masterplan-init` first.
3. Verify GitHub tooling before touching the Project:
   - Prefer GitHub MCP if it exposes GitHub Projects v2 item APIs.
   - If Projects APIs are not exposed through MCP, use authenticated `gh` CLI with the `project` scope.
   - If neither path is available, stop with the project's Missing Tool Alert Protocol for GitHub MCP.
4. Resolve the GitHub Project:
   - Prefer the binding in `dannflow.json`.
   - Use `--project-owner` and `--project-number` when provided.
   - Otherwise list projects for the current repo owner or authenticated user and ask only if the intended project is ambiguous.
5. Require a target phase from `$ARGUMENTS` such as `Phase 1`, `P1`, or `Phase 2`. If it is ambiguous, ask which future phase to expand.
6. Preserve Phase 0, completed tasks, task IDs, notes, and live Project statuses. Replace only the selected phase's placeholder with detailed ordered tasks.
7. Use this task ID format exactly:
   - `[P0.1]`, `[P0.2]`, `[P1.1]`, `[P2.1]`
   - subphases keep their letter: `[P3A.1]`, `[P3B.1]`
   - never use bare `[P2]` or unordered names for GitHub Project items
8. Create or update real GitHub Issues from the selected phase only, then add them to the linked Project. Never create Project draft items:
   - Title: `[P2.1] Build feature service`
   - Body: goal, files, guardrails, dependencies, and source line from `MASTERPLAN.md`
   - Status: checked tasks go to `Done`; unchecked tasks go to `Backlog`
9. Preserve existing Project item status if an item already exists and is not being recreated, except:
   - checked tasks in `MASTERPLAN.md` always map to `Done`
   - a task explicitly marked current or active maps to `In progress`
10. Do not create cards for unexpanded placeholder phases. Do not delete Project items unless the user passes `--prune`.

## GitHub Project sync commands

Use these primitives when `gh` is the available Projects path:

```bash
gh project list --owner <owner> --format json
gh project item-list <project-number> --owner <owner> --format json --limit 200
gh project field-list <project-number> --owner <owner> --format json
gh issue create --repo <owner>/<repo> --title "<title>" --body "<body>"
gh project item-add <project-number> --owner <owner> --url <issue-url>
gh project item-edit --id <project-item-id> --project-id <project-id> --field-id <status-field-id> --single-select-option-id <option-id>
```

## Output format

```text
MASTERPLAN.md expanded: <phase>
GitHub Project synced: <owner>/<project-number> (<created> created, <updated> updated)

Task ID scheme:
  [P0.1] ... [P0.n]
  [P1.1] ... [P1.n]

Next:
  /masterplan-task "[P2.1]"

Suggested commit: feat: expand <phase> masterplan tasks
```

## Constraints

- `/masterplan-init` owns initial Phase 0 creation and GitHub Project linking; this command expands later phases only.
- `MASTERPLAN.md` is the source of truth; the GitHub Project mirrors detailed tasks only.
- Every Project card is a real GitHub Issue and must start with a stable `[P*.n]` ID; never use Project draft items.
- Keep task titles short; put details in card bodies and phase docs.
- Do not mark work `Done` unless the corresponding task is checked in `MASTERPLAN.md` or the user explicitly says it is complete.
- Do not modify application code while creating the plan.
