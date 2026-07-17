---
description: Generate a human verification checklist for the current tracked task, then tell the user to run /close-task only after they confirm it works.
argument-hint: "[task-id] [--project-owner <owner>] [--project-number <number>]"
---

Help the user verify a tracked task before closing it. This command does not close the task, move Project cards, edit application code, or commit.

User input: **$ARGUMENTS**

## Procedure

1. Read `CLAUDE.md` and the full `MASTERPLAN.md`.
2. Identify the task to verify:
   - Use the task ID from `$ARGUMENTS` when provided.
   - Otherwise inspect the linked GitHub Project for items in `In progress`.
   - If exactly one task is `In progress`, use that task.
   - If multiple tasks are `In progress`, ask the user which task to verify.
   - If no task is `In progress`, ask for a task ID.
3. Resolve the task details from `MASTERPLAN.md`, phase docs, and the linked GitHub Project item by stable task ID prefix.
4. Inspect the local implementation:
   - `git status --short --branch`
   - unstaged and staged diffs
   - relevant files changed for the task
   - relevant docs or acceptance criteria for the task
5. Run safe, task-appropriate automated verification commands when available.
   - Prefer fast checks first.
   - Do not run destructive commands.
   - Do not apply migrations to a remote database unless the user explicitly asked for that in the current invocation.
   - If live tooling or credentials are missing, state the exact verification that could not be performed.
6. Convert the task into a human verification checklist:
   - Include concrete steps the user can perform in the browser, Supabase Dashboard, GitHub Project, email inbox, or local terminal.
   - Include expected results for each step.
   - Include any important negative/security checks, especially RLS or ownership checks.
   - Keep the checklist scoped to the selected task only.
7. Ask the user to perform the checklist and report pass/fail.
8. End by telling the user:
   - If every human check passes, run `/close-task <task-id>`.
   - If anything fails, paste the failed step/error back into chat so it can be fixed before closing.

## Output format

```text
Verify:
  [P2.2] <task title>

What changed:
  - <brief local diff summary>

Automated checks:
  - <command>: pass/fail/not run — <reason>

Human verification checklist:
  1. <step>
     Expected: <result>
  2. <step>
     Expected: <result>

Do not close yet if:
  - <specific risk or failure condition>

Next:
  If every check passes, run /close-task [P2.2].
  If anything fails, paste the failed step/error here first.
```

## Constraints

- Do not edit application code.
- Do not commit.
- Do not stage files.
- Do not mark tasks done.
- Do not move GitHub Project items.
- Do not run `/close-task` automatically.
- Match tasks by stable ID prefix, not by full title.
- Keep the verification plan specific enough that a human can confirm the task works without guessing.
