---
name: "source-command-masterplan-task"
description: "Execute an ordered task from MASTERPLAN.md, keep it In progress, and tell the user to run /verify-task when implementation appears ready."
---

# source-command-masterplan-task

Use this skill when the user asks to run the migrated source command `masterplan-task`.

## Command Template

# /masterplan-task — Run & Test Phase Tasks

Execute one ordered task from MASTERPLAN.md, generate code, sync GitHub Project status to `In progress`, and create a dedicated test file under `docs/tests/`.

## Usage

```bash
/masterplan-task "[P2.1]"
/masterplan-task "[P2.3] feature service"
/masterplan-task "Phase 2: Core Workflow - [P2.1] Build feature form"
```

## What it does

1. **Read the task** from MASTERPLAN.md — exact spec, no guessing
2. **If the requested task is not in MASTERPLAN.md**, stop and ask whether to add it through `/update-masterplan` before building
3. **Find the matching GitHub Project item** by stable task ID (`[P2.1]`, `[P3A.2]`, etc.)
4. **Confirm the card** when ambiguous: "This maps to `[P2.1] ...`; move it to `In progress`?"
5. **Move the Project item to `In progress` before implementation**
6. **Implement the feature** — code changes in `src/`, `supabase/`, `scripts/`, etc.
7. **Create `docs/tests/` if it doesn't exist**
8. **Generate `docs/tests/<phase-slug>/<task-slug>.md`** containing:
   - What was built (1-paragraph summary)
   - Automated checks (Codex runs these and reports pass/fail inline)
   - Step-by-step manual verification (human follows in browser/terminal)
   - RLS smoke test (if the task touches DB or auth)
   - Common issues + troubleshooting
9. **Leave task tracking open** after implementation:
   - do not mark the task `[x]` in MASTERPLAN.md
   - do not move the GitHub Project item to `Done`
   - keep the Project item `In progress`
10. **Tell the user to run `/verify-task <task-id>`** when implementation appears ready for human verification
11. **After the user verifies everything, they should run `/close-task <task-id>`** to commit, check MASTERPLAN.md, and move the Project item to `Done`
12. **Output an auto-selected conventional commit message preview** for context only; `/close-task` creates the actual commit

## GitHub Project status sync

- Prefer GitHub MCP if it exposes GitHub Projects v2 item APIs.
- If Projects APIs are not exposed through MCP, use authenticated `gh` CLI with the `project` scope.
- If neither path is available, stop with the project's Missing Tool Alert Protocol for GitHub MCP.
- Match Project items by the stable task ID prefix. Do not rely on the rest of the title.
- Leave the Project item `In progress` after implementation until `/verify-task` passes and `/close-task` runs.
- If the work pauses or verification fails, leave the Project item `In progress` and explain what remains.
- If `MASTERPLAN.md` changes during the task, run `/update-masterplan` or warn the user that the Project board needs syncing.

## Folder structure produced

```
docs/
└── tests/
    ├── phase-0/
    │   ├── project-setup.md
    │   └── verify-auth-flow.md
    ├── phase-1/
    │   ├── apply-schema.md
    │   └── seed-reference-data.md
    ├── phase-2/
    │   ├── feature-form.md
    │   └── feature-service.md
    └── ...
```

File names are kebab-case derived from the task description.

## Test file template

Each generated file follows this structure:

```md
# Test: <Task Name>

**Phase:** <phase number and name>
**Task:** <task ID, e.g. P2.6>
**Date:** <ISO date>

## What was built

<1-paragraph summary of what was implemented>

## Automated checks

Codex runs these after implementation and marks each pass/fail:

- [ ] `npm run build` exits 0
- [ ] `pnpm db:generate` and `pnpm db:migrate` completed if schema changed
- [ ] `src/types/supabase.ts` refreshed after migration
- [ ] <task-specific checks>

## Manual verification

Step-by-step for the human to follow:

1. <step>
2. <step>
3. ...

## RLS smoke test

*(Skip if task doesn't touch DB)*

1. Log in as a test `user` -> confirm you can only see owned records
2. Log in as an elevated/scoped role -> confirm scope-limited access
3. Try to access another user's data -> confirm 403 / empty result

## Common issues

| Symptom | Likely cause | Fix |
|---|---|---|
| ... | ... | ... |
```

## Output

```
Phase 2, Task P2.6 — Feature form — complete
📁 docs/tests/phase-2/feature-form.md created
Next: run /verify-task [P2.6]
Then, after human verification passes: run /close-task [P2.6]
📦 Commit message preview: feat: add feature form
```

## Flags

- `--no-commit` — Skip the commit message output, review changes first
- `--dry-run` — Show what would be done without executing

## Notes

- **Task spec is law** — reads exact wording from MASTERPLAN.md, implements it as written
- **Task IDs are law** — every task must use `[P*.n]`; do not create or sync bare `[P2]` cards
- **One file per task** — never append to an existing test file; create a new one
- **RLS is always checked** for any task that touches Supabase tables or auth
- **Never skip the docs/tests/ write** — even if implementation is trivial
- **Never close from this command** — when implementation appears ready, tell the user to run `/verify-task <task-id>` first.
