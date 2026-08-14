---
description: Close a human-verified tracked task by committing completed work, recording a short verification note, then updating MASTERPLAN.md and the linked GitHub Project to Done.
argument-hint: "[task-id] [--project-url <url>] [--project-owner <owner>] [--project-number <number>] [--dry-run]"
---

Close a completed tracked task after human verification. If the user has not confirmed `/verify-task` passed, send them back to `/verify-task` first.

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
4. Resolve the linked Project from `--project-url`, then `GITHUB_PROJECT_URL` in `.env.local`. Accept `https://github.com/users/<owner>/projects/<number>` and `https://github.com/orgs/<owner>/projects/<number>`; strip `/views/...` and query strings, derive owner/number, and fetch the API ID. Use explicit or environment owner/number/ID values only as a legacy fallback.
5. Confirm the task exists in `MASTERPLAN.md` and the linked GitHub Project by stable task ID prefix.
6. Confirm human verification:
   - If the current conversation includes a clear user confirmation that `/verify-task <task-id>` passed, continue.
   - If not, stop and say: "Before closing, run `/verify-task <task-id>` and confirm the checklist passes."
   - Do not infer human verification from automated checks alone.
7. Check whether the task appears complete:
   - inspect `git status`
   - inspect unstaged and staged diffs
   - run task-appropriate verification commands when available
   - summarize what changed and what passed
8. If completion is ambiguous, ask before closing.
9. Commit completed work before updating task tracking:
   - follow the same safety rules as `/commit`
   - do not stage `.env*`, credentials, or unrelated files
   - stage only files that belong to the completed task
   - create a focused conventional commit
   - if the implementation was already committed and the worktree is clean, reuse that existing commit instead of creating an empty commit
10. Create or update one short verification note before marking the task done:
   - path: `docs/tests/<task-id-lowercase>-<short-task-slug>.md`
   - keep it text-only by default; do not copy screenshots, images, or large artifacts into the repo
   - summarize screenshot evidence in one sentence when screenshots were discussed in chat
   - write for beginners: explain what was tested, why the task mattered, what passed, and what would count as a failure
   - keep the note concise; prefer 1-2 short paragraphs and a compact checklist
   - if `docs/tests/` does not exist, create it
11. After the implementation commit succeeds and the verification note is ready, update task tracking:
   - mark the matching checkbox `[x]` in `MASTERPLAN.md`
   - move the GitHub Project item to `Done`
   - do not use `In review` unless the repository explicitly requires it
12. Create a second small tracking commit for `MASTERPLAN.md` and the verification note unless the user explicitly asks to leave tracking uncommitted.
13. Report the closed task, commit hash or hashes, verification note path, verification, and any remaining follow-up.

## Commit rules

- Never `git add -A` or `git add .`.
- Never commit unrelated work.
- Never amend unless the user explicitly asks.
- Never push.
- If there are multiple unrelated changes, ask before grouping them into one implementation commit.
- If a verification or pre-commit hook fails, fix the issue before committing or stop with a clear explanation.
- Tracking commit message format:
  - subject: `chore(tasks): close <task-id> <short-task-slug>`
  - body includes `Task: [P1.2] <title>` and `Verification: docs/tests/<file>.md`
  - do not rely on GitHub issue closing keywords unless the task is linked to a real issue number

## Verification note format

Use this compact shape for `docs/tests/<task-id-lowercase>-<short-task-slug>.md`:

```md
# [P2.2] <task title>

## Why This Task Mattered
<1-2 beginner-friendly sentences explaining the user/product risk this task reduces.>

## What Was Verified
- <automated check or code check>: <pass/fail and short note>
- <human app check>: <pass/fail and short note>

## Human Evidence
<short text summary of what the user did in the app. If screenshots were provided, summarize what they showed instead of storing the images.>

## Result
Pass. <one sentence on why it is safe to close.>
```

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

Verification note:
  docs/tests/p2.2-<task-slug>.md

Verification:
  - Human verification: confirmed after /verify-task
  - <command>: pass

Updated:
  - MASTERPLAN.md checkbox marked [x]
  - Verification note written under docs/tests/
  - GitHub Project item moved to Done

Next:
  Run /what-task to choose the next task.
```

## Constraints

- Close only one task per run unless the user explicitly provides multiple task IDs.
- Require human confirmation from `/verify-task` before closing.
- `MASTERPLAN.md` is updated only after the implementation commit succeeds.
- A concise `docs/tests/*.md` verification note is written before the task is moved to `Done`.
- Do not create GitHub issues or upload screenshots unless the user explicitly asks.
- Do not move unfinished or ambiguous work to `Done`.
- Do not modify application code after the implementation commit except to fix failed verification or hooks.
