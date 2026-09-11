---
name: "DannFlow Task Orchestrator"
description: "Autonomous task lifecycle manager for DannFlow. Use when asked to 'do task Px.x', 'execute a task', or whenever you are given a specific task from the MASTERPLAN to complete end-to-end. Orchestrates masterplan reading, GitHub syncing, coding, pre-verification quality gates, human verification loops, and clean closing."
---

# DannFlow Task Orchestrator (`dannflow-task`)

## What This Skill Does

This skill instructs you (the AI Agent) to act as an autonomous project manager and full-stack engineer. You seamlessly orchestrate DannFlow's underlying commands (located in `.claude/commands/`, including `what-task`, `masterplan-task`, `verify-task`, `review`, `rls-check`, and `close-task`) into one disciplined lifecycle, stopping only to ask for explicit human approval or verification.

## Prerequisites

- You must be operating in a DannFlow-compatible environment.
- The project must have a `MASTERPLAN.md`.
- You must have access to GitHub Projects (via MCP or `gh` CLI).

---

## The 4-Phase Task Lifecycle

Whenever a user asks you to implement a task (e.g., _"Do task P1.3"_ or _"Start next task"_), follow these four phases strictly in order.

### Phase 1: Discovery & Approval (No coding yet)

1. **Read the Spec**: Open and read the full `MASTERPLAN.md` to identify the exact requirements and constraints for the requested task ID (`[PX.Y]`).
2. **Fetch GitHub State**: Locate the matching task card on the linked GitHub Project board by its stable task ID prefix.
3. **Formulate Plan**: Formulate a concise architectural plan (files to create/modify, schema changes, UI components).
4. **STOP AND ASK**: Do NOT write any implementation code yet. Tell the user:
   > _"I have found task `[PX.Y]` on the board and am ready to begin. I will move the GitHub card to 'In progress' and implement the following:_
   > _- <Brief plan bullet 1>_
   > _- <Brief plan bullet 2>_
   >
   > _Do you approve starting implementation?"_

---

### Phase 2: Implementation & Quality Gates (No committing)

Once the user approves:

1. **Update Tracking**: Move the GitHub Project item to `In progress`.
2. **Implement**:
   - Write the clean, modular code required by the spec.
   - For database schema changes: write migrations in `supabase/migrations/` and refresh `src/types/supabase.ts`.
3. **Log Pending Docs (MANDATORY)**:
   - As you touch `src/services/`, `src/types/`, `supabase/migrations/`, or APIs, append a structured entry to `docs/PENDING_DOC_UPDATES.md` detailing what architecture or documentation needs updating upon task closure.
4. **Run Pre-Verification Automated Quality Gates**:
   - Run linter & typechecker: `npm run lint` and `npx tsc --noEmit`.
   - Run RLS audit (`.claude/commands/rls-check.md`): Confirm every Supabase query in `src/services/` contains appropriate ownership/admin policies.
5. **Generate Test & Verification Guide**:
   - Create or update `docs/tests/<task-id-lowercase>-<short-task-slug>.md` containing what was built, automated test results, and step-by-step human testing instructions.
6. **STOP AND ASK**: Do NOT commit anything yet. Present the verification checklist to the user:
   > _"Implementation complete and pre-verification checks passed!_
   >
   > **What changed:**
   >
   > - <Summary of files changed>
   >
   > **Automated checks:**
   >
   > - Lint & Typecheck: PASS
   > - RLS Security Check: PASS
   >
   > **Human Verification Checklist:**
   >
   > 1. <Step 1 to test in browser/terminal> -> Expected: <Result>
   > 2. <Step 2 to test in browser/terminal> -> Expected: <Result>
   >
   > _Please test these steps and let me know if everything passes or if anything needs fixing!"_

---

### Phase 3: The Verification Loop

1. **Wait for Human Feedback**: Do not proceed until the user reports their test results.
2. **Iterate on Fixes**:
   - If the user reports a bug, unexpected UI behavior, or requests tweaks, fix the code immediately.
   - Update `docs/PENDING_DOC_UPDATES.md` if the architectural footprint changes.
3. **Do NOT Commit**: Keep the working tree uncommitted while iterating. Never create intermediate "wip" or "fix" commits unless explicitly asked by the user.
4. **Re-Verify**: Ask the user to re-verify the specific fix. Repeat Phase 3 until the user confirms full satisfaction (e.g., _"LGTM"_, _"Verified"_, _"Ready to close"_).

---

### Phase 4: Closure & Cleanup

Once the user explicitly confirms verification passed:

1. **Execute Documentation Updates & Clear Ledger**:
   - Read `docs/PENDING_DOC_UPDATES.md`.
   - Update the actual project documentation in `docs/` and diagrams in `docs/diagrams/` to reflect the new architecture/logic.
   - Remove the resolved entries from `docs/PENDING_DOC_UPDATES.md` so the ledger is clean.
2. **Finalize Test Document**:
   - Update `docs/tests/<task-id-lowercase>-<short-task-slug>.md` with the `## Human Evidence` checklist reflecting the exact user tests performed during the conversation.
3. **Execute Clean 3-Commit Sequence**:
   - **Commit 1 (Implementation)**: Stage code changes (`src/`, `supabase/`, etc.) and commit:
     ```bash
     git commit -m "feat(pX.Y): <short description of feature>"
     ```
   - **Commit 2 (Documentation)**: Stage `docs/`, `docs/diagrams/`, `docs/tests/`, and cleared `docs/PENDING_DOC_UPDATES.md` and commit:
     ```bash
     git commit -m "docs(pX.Y): update docs and verification for <short-task-slug>"
     ```
   - **Commit 3 (Tracking & Close)**: Mark the checkbox `[x]` in `MASTERPLAN.md`, stage `MASTERPLAN.md`, and commit:
     ```bash
     git commit -m "close(pX.Y): close [PX.Y] <short-task-slug>"
     ```
4. **Update GitHub Project Board**:
   - Move the task item to `Done`.
5. **Handoff Next Task (from `what-task`)**:
   - Inspect `MASTERPLAN.md` and the GitHub board for the next eligible unchecked backlog task.
   - Move the upcoming task from `Backlog` to `Ready` on GitHub.
   - Recommend the next task to the user with a plain-language _"Why this matters"_ explanation.

---

## Level 3: Rules of Engagement

- **Never Auto-Commit Early**: Keep a clean Git history. Do not commit during Phase 2 or Phase 3. Only perform the 3-commit sequence in Phase 4 after explicit human verification.
- **Strict Ledger Compliance**: Always write to `docs/PENDING_DOC_UPDATES.md` in Phase 2 and clear it in Phase 4.
- **Tool Fallbacks**: If GitHub MCP lacks Projects scopes, inform the user to run `gh auth refresh -s project`.
- **Be Conversational**: Act as an elite pair-programmer. Be concise, transparent about changes, and clear when handing off testing to the user.
