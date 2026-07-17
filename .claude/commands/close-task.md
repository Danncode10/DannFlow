---
description: Close the current tracked task by committing completed work, then updating MASTERPLAN.md and the linked GitHub Project to Done.
argument-hint: "[task-id] [--project-owner <owner>] [--project-number <number>] [--dry-run]"
---

Close a completed tracked task.

User input: **$ARGUMENTS**

## Procedure

1. Read `CLAUDE.md` and the full `MASTERPLAN.md`.
2. Identify the task to close:
   - Use the task ID from `$ARGUMENTS` when provided.
   - Otherwise inspect GitHub Project items in `In progress`.
   - If exactly one task is `In progress`, use that task.
   - If multiple tasks are `In progress`, ask the user which task to close.
   - If no task is `In progress`, ask for a task ID.
3. Verify GitHub tooling before touching the Project:
   - Prefer GitHub MCP if it exposes Projects v2 item APIs.
   - If Projects APIs are not exposed through MCP, use authenticated `gh` CLI with the `project` scope.
   - If neither is available, stop with the project's Missing Tool Alert Protocol for GitHub MCP.
4. Confirm the task exists in `MASTERPLAN.md` and the linked GitHub Project by stable task ID prefix.
5. Check whether the task appears complete:
   - inspect `git status`
   - inspect unstaged and staged diffs
   - run task-appropriate verification commands when available
   - summarize what changed and what passed
6. If completion is ambiguous, ask before closing.
7. Commit completed work before updating task tracking:
   - follow the same safety rules as `/commit`
   - do not stage `.env*`, credentials, or unrelated files
   - stage only files that belong to the completed task
   - create a focused conventional commit
8. After the implementation commit succeeds, update task tracking:
   - mark the matching checkbox `[x]` in `MASTERPLAN.md`
   - move the GitHub Project item to `Done`
   - do not use `In review` unless the repository explicitly requires it
9. If `MASTERPLAN.md` changed, create a second small tracking commit unless the user explicitly asks to leave it uncommitted.
10. Report the closed task, commit hash or hashes, verification, and any remaining follow-up.

## Commit rules

- Never `git add -A` or `git add .`.
- Never commit unrelated work.
- Never amend unless the user explicitly asks.
- Never push.
- If there are multiple unrelated changes, ask before grouping them into one implementation commit.
- If a verification or pre-commit hook fails, fix the issue before committing or stop with a clear explanation.

## GitHub Project commands

Use these primitives when `gh` is the available Projects path:

```bash
gh project item-list <project-number> --owner <owner> --format json --limit 200
gh project field-list <project-number> --owner <owner> --format json
gh project item-edit --id <item-id> --project-id <project-id> --field-id <status-field-id> --single-select-option-id <option-id>
```

## Output format

```text
Closed:
  [P2.2] <title>

Commits:
  <hash> <implementation commit message>
  <hash> <tracking commit message>

Verification:
  - <command>: pass

Updated:
  - MASTERPLAN.md checkbox marked [x]
  - GitHub Project item moved to Done

Next:
  Run /what-task to choose the next task.
```

## Constraints

- Close only one task per run unless the user explicitly provides multiple task IDs.
- `MASTERPLAN.md` is updated only after the implementation commit succeeds.
- Do not move unfinished or ambiguous work to `Done`.
- Do not modify application code after the implementation commit except to fix failed verification or hooks.
