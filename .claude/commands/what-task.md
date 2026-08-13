---
description: Inspect MASTERPLAN.md and the linked GitHub Project, organize Ready tasks, and ask which task the user wants to handle next.
argument-hint: "[--project-owner <owner>] [--project-number <number>] [--limit <n>] [--dry-run]"
---

Organize the task board and help the user choose what to handle next. This command does not implement, edit application code, or start feature work.

User input: **$ARGUMENTS**

## Procedure

1. Read `CLAUDE.md` and the full `MASTERPLAN.md`.
2. Verify GitHub tooling before touching the Project:
   - Prefer GitHub MCP if it exposes Projects v2 item APIs.
   - If Projects APIs are not exposed through MCP, use authenticated `gh` CLI with the `project` scope.
   - If neither is available, stop with the project's Missing Tool Alert Protocol for GitHub MCP.
3. Resolve the GitHub Project:
   - Prefer `GITHUB_PROJECT_OWNER`, `GITHUB_PROJECT_NUMBER`, and `GITHUB_PROJECT_ID` in `.env.local`.
   - Use `--project-owner` and `--project-number` when provided.
   - Otherwise list projects and ask only if the intended Project is ambiguous.
4. Fetch Project items and match them to `MASTERPLAN.md` tasks by stable task ID prefix:
   - valid: `[P2.1]`, `[P3A.2]`
   - invalid: `[P2]`
5. Report the current task state before recommending anything:
   - `In progress` tasks
   - `Ready` tasks
   - next unchecked `Backlog` tasks in `MASTERPLAN.md` order
   - any mismatch between `MASTERPLAN.md` and the Project
6. If `Ready` is empty:
   - choose the next eligible unchecked task or tasks from `Backlog` in `MASTERPLAN.md` order
   - default to 1-3 tasks unless `--limit <n>` is provided
   - say exactly: "I will move these task(s) to Ready:" followed by the task list
   - move those Project items to `Ready` unless `--dry-run` is present
7. If one or more tasks are already `In progress`, show them first and ask the user whether they want to handle one of those tasks or leave them as-is.
8. If no task is `In progress`, recommend one best task from `Ready`.
9. Ask the user whether to move the recommended task to `In progress`.
10. Move exactly one task to `In progress` only after the user confirms the status change.
11. When reporting that the task moved to `In progress`, include a beginner-friendly `Why this matters` statement that explains the task's value in plain language, avoiding jargon where possible.
12. After moving a task to `In progress`, move the next eligible unchecked `Backlog` task in `MASTERPLAN.md` order to `Ready` unless:
   - that task is already `Ready`, `In progress`, `In review`, or `Done`
   - no eligible unchecked backlog task exists
   - `--dry-run` is present
13. Report the task promoted to `Ready`, or say that no next backlog task was available.
14. Stop after the status updates and task selection. Do not begin implementation. The user must explicitly ask to work on the task in a follow-up prompt or run the project command intended for executing tasks.

## Recommendation rules

- If any task is already `In progress`, prefer showing that active work over recommending new work.
- Prefer the earliest unchecked task in `MASTERPLAN.md` order unless dependencies or active work clearly point elsewhere.
- Do not start more than one task per `/what-task` run.
- Keep one upcoming task prepared in `Ready` after a confirmed `In progress` move so the board always shows the next likely task.
- Do not use the `In review` status unless the repository explicitly uses a review workflow for this task.
- Keep paused or abandoned work in `In progress` until the user asks to close, pause, or replace it.
- Never mark a task `Done`; use `/close-task` for finishing.
- Never implement the task, edit application files, run feature scaffolding, or continue into coding from this command.

## GitHub Project commands

Use these primitives when `gh` is the available Projects path:

```bash
gh project item-list <project-number> --owner <owner> --format json --limit 200
gh project field-list <project-number> --owner <owner> --format json
gh project item-edit --id <item-id> --project-id <project-id> --field-id <status-field-id> --single-select-option-id <option-id>
```

## Output format

```text
Task board state
In progress:
  - [P2.1] <title>

Ready:
  - [P2.2] <title>

Next backlog:
  - [P2.3] <title>
  - [P2.4] <title>

Moved to Ready:
  - [P2.3] <title>

Recommended now:
  [P2.2] <title>

Why:
  <short reason based on order, dependencies, or continuity>

Confirm:
  Should I move [P2.2] to In progress?
```

After the user confirms moving the recommended task, use this final output shape:

```text
Moved to In progress:
  [P2.2] <title>

Why this matters:
  <plain-language explanation of why this task helps the project or protects users>

Moved upcoming task to Ready:
  [P2.3] <title>

Next:
  Ask me to work on [P2.2] when you are ready to begin implementation.
```

## Constraints

- `MASTERPLAN.md` remains the source of truth; GitHub Project status mirrors execution state.
- Match tasks by stable ID prefix, not by full title.
- Ask before moving a task to `In progress`.
- Move no more than one task to `In progress` per run.
- After a confirmed move to `In progress`, move no more than one upcoming backlog task to `Ready`.
- Do not modify application code.
- Do not commit.
- Stop after board organization and task selection.
