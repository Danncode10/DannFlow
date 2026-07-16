---
description: Create MASTERPLAN.md from project context and populate a linked GitHub Project with ordered phase task cards.
argument-hint: "[--project-owner <owner>] [--project-number <number>] [--dry-run]"
---

# /make-masterplan

Create a fresh `MASTERPLAN.md` for the current product and sync its tasks into a GitHub Project.

User input: **$ARGUMENTS**

## Procedure

1. Read `CLAUDE.md`, `AGENTS.md`, `PROJECT_CONTEXT.md`, `README.md`, `docs/`, `src/prompts/features/`, and any existing planning docs.
2. Verify GitHub tooling before touching the Project:
   - Prefer GitHub MCP if it exposes GitHub Projects v2 item APIs.
   - If Projects APIs are not exposed through MCP, use authenticated `gh` CLI with the `project` scope.
   - If neither path is available, stop with the project's Missing Tool Alert Protocol for GitHub MCP.
3. Resolve the GitHub Project:
   - Use `--project-owner` and `--project-number` when provided.
   - Otherwise list projects for the current repo owner or authenticated user and ask only if the intended project is ambiguous.
4. Draft `MASTERPLAN.md` with:
   - a concise project summary
   - phase sections
   - ordered task checkboxes
   - stable task IDs in every task label
5. Use this task ID format exactly:
   - `[P0.1]`, `[P0.2]`, `[P1.1]`, `[P2.1]`
   - subphases keep their letter: `[P3A.1]`, `[P3B.1]`
   - never use bare `[P2]` or unordered names for GitHub Project items
6. Create or update GitHub Project draft items from `MASTERPLAN.md`:
   - Title: `[P2.1] Build feature service`
   - Body: goal, files, guardrails, dependencies, and source line from `MASTERPLAN.md`
   - Status: checked tasks go to `Done`; unchecked tasks go to `Backlog`
7. Preserve existing Project item status if an item already exists and is not being recreated, except:
   - checked tasks in `MASTERPLAN.md` always map to `Done`
   - a task explicitly marked current or active maps to `In progress`
8. Do not delete Project items unless the user passes `--prune`.

## GitHub Project sync commands

Use these primitives when `gh` is the available Projects path:

```bash
gh project list --owner <owner> --format json
gh project item-list <project-number> --owner <owner> --format json --limit 200
gh project field-list <project-number> --owner <owner> --format json
gh project item-create <project-number> --owner <owner> --title "<title>" --body "<body>"
gh project item-edit --id <draft-issue-content-id> --title "<title>" --body "<body>"
gh project item-edit --id <project-item-id> --project-id <project-id> --field-id <status-field-id> --single-select-option-id <option-id>
```

## Output format

```text
MASTERPLAN.md created
GitHub Project synced: <owner>/<project-number> (<created> created, <updated> updated)

Task ID scheme:
  [P0.1] ... [P0.n]
  [P1.1] ... [P1.n]

Next:
  /masterplan-task "[P2.1]"

Suggested commit: feat: create masterplan and project task board
```

## Constraints

- `MASTERPLAN.md` is the source of truth; the GitHub Project mirrors it.
- Every Project card created from the plan must start with a stable `[P*.n]` ID.
- Keep task titles short; put details in card bodies and phase docs.
- Do not mark work `Done` unless the corresponding task is checked in `MASTERPLAN.md` or the user explicitly says it is complete.
- Do not modify application code while creating the plan.
