---
description: Generate a human verification checklist for a completed JuanStack masterplan phase. Tells the user exactly what to open, read, and confirm in their editor, terminal, and browser before approving the phase.
argument-hint: "[phase-id] (e.g., phase0, phase1, P0, P1A)"
---

Help the user verify a completed JuanStack masterplan phase before approving it. This command does NOT close the phase, edit code, or commit anything.

User input: **$ARGUMENTS**

## Procedure

1. Read `docs/juanstack/juanstack_masterplan.md` to locate the phase.
2. Identify the phase to verify:
   - Use the phase name/ID from `$ARGUMENTS` (e.g., `phase0`, `P0`, `P1A`).
   - If not provided, look for the most recently completed phase (all tasks marked `[x]`).
   - If ambiguous, ask the user which phase to verify.
3. Read `docs/juanstack/DANNFLOW_REVISION_PLAN.md` for the architectural spec behind the phase's tasks.
4. Inspect the local implementation:
   - `git status --short --branch`
   - List all files changed or created for the phase (use `git diff --name-only` or `git status`)
   - Read each new or modified file relevant to the phase
   - Check `docs/PENDING_DOC_UPDATES.md` to confirm the phase entry is logged
5. Run safe, read-only automated checks relevant to the phase:
   - File existence checks (`ls`, `test -f`)
   - JSON validity checks (`python3 -c "import json; json.load(open(...))"`)
   - Content spot-checks (`grep` for key strings)
   - Do NOT run migrations, builds, or destructive commands.
   - If a check cannot be performed, state why.
6. Convert the phase tasks into a **human verification checklist** — concrete steps the user can perform in their code editor, terminal, or browser:
   - Each check must have an **Expected result** so the user knows what "pass" looks like.
   - Include at least one **negative check** (something that should NOT exist or should be blocked).
   - Scope checks strictly to the verified phase only.
7. Ask the user to perform the checklist and report pass/fail per item.
8. End by telling the user:
   - If every check passes: approve the phase and confirm Phase N+1 is unblocked.
   - If anything fails: paste the failed step/error back into chat so it can be fixed before approval.

## Output Format

```text
Verify:
  [PX] <Phase Title>
  Branch: <current branch>

What changed:
  - <list of new files>
  - <list of modified files>

Automated checks:
  ✅ / ❌ <check description>: pass/fail/not run — <reason>

Human Verification Checklist:
  1. <what to open / where to look>
     Expected: <what you should see>

  2. <what to open / where to look>
     Expected: <what you should see>

  [N. Negative check]
     Expected: <what should NOT be there or should be blocked>

Do NOT approve if:
  - <specific risk or failure condition>
  - <specific content that must be present>

Next:
  If every check passes → Phase [PX] is approved. Phase [PX+1] is now unblocked.
  If anything fails → paste the failed step/error here first. Do not proceed to Phase [PX+1].
```

## Phase-Specific Verification Guides

### Phase 0 — Architecture & Governance

Human checks for Phase 0:

1. **Open `docs/juanstack/juanstack_masterplan.md`**
   - Every `[D1]`–`[D5]` row in the Open Decisions table must show `[x]` and a ✅ resolution.
   - Every Phase 0 task must be marked `[x]`.

2. **Open `AGENTS.md`**
   - Scroll to the bottom. Confirm a section titled `## JuanStack Vertical Namespace Rules` exists.
   - Confirm it contains: "The Golden Rule", the Namespace Convention Table, "Before Running `sync-to-upstream`", and "Domain Terminology Rule".
   - Confirm the file still ends with `<!-- END:nextjs-agent-rules -->`.

3. **Open `docs/juanstack/schemas/business.schema.json`**
   - Confirm it is valid JSON (no parse errors in editor).
   - Confirm `"required"` includes: `vertical_id`, `name`, `owned_paths`, `domain_nomenclature`, `dannflow_features`.
   - Confirm `owned_paths` items are pattern-validated with `"pattern": "^src/"`.

4. **Open `docs/juanstack/schemas/ai-manifest.schema.json`**
   - Confirm it is valid JSON.
   - Confirm the `ObservableState` definition in `"definitions"` requires: `id`, `table`, `trigger_field`, `trigger_condition`, `semantic_meaning`, `suggested_task`, `priority`.
   - Confirm `trigger_condition` has examples showing `"within_72_hours"` and `"equals: overdue"` patterns.

5. **Open `.agents/skills/source-command-sync-to-upstream/SKILL.md`**
   - Confirm `## Step 1.5 — JuanStack Owned-Path Validation (HARD BLOCK)` exists between Step 1 and Step 2.
   - Confirm the error message `🚫 OWNED-PATH VIOLATION DETECTED` is present.
   - Confirm the step ends with `Do not proceed. Do not create a PR. End the command.`

6. **Open `dannflow.json`**
   - Confirm `"dannflow_version"` is `"2.0.0-juanstack-alpha"`.
   - Confirm `"revision_notes"` field is present and mentions JuanStack.

7. **Open `docs/README.md`**
   - Confirm Section 7 titled `JuanStack Vertical Engine Revision` exists.
   - Confirm it links to `juanstack_masterplan.md`, `DANNFLOW_REVISION_PLAN.md`, `business.schema.json`, and `ai-manifest.schema.json`.

8. **Open `docs/PENDING_DOC_UPDATES.md`**
   - Confirm the `[juanStack-P0]` entry is present.
   - Confirm it lists all new files and all modified files.
   - Confirm the "Clear This Entry When" conditions are listed.

**Negative check — Phase 0:**

- Open `src/` — confirm NO new folders (`bir/`, `analytics/`, `ai/`) exist yet. Phase 0 is docs/governance only. No code was supposed to be written.

### Phase 1 — Folder Architecture & Skeleton Files

Human checks for Phase 1:

1. **In terminal, run:** `find src/bir src/analytics src/ai -type f | sort`
   - Expected: shows `.gitkeep`, `OWNERSHIP.md`, `index.ts`, `form-types.ts`, and `analytics-types.ts` files across all three module trees. No logic yet — skeleton files only.

2. **Open `src/bir/legal/OWNERSHIP.md`**
   - Expected: states "Owned by: attyjuan. Do not modify from any other vertical."

3. **Open `business.json` at the dannflow root**
   - Expected: valid JSON matching the schema in `docs/juanstack/schemas/business.schema.json`. `vertical_id` should be `"dannflow-default"`. All feature flags should be `false`.

4. **Open `src/ai/core.ai-manifest.json`**
   - Expected: valid JSON with at least 3 entries in `observable_states`: `subscription_expiring`, `invoice_overdue`, `document_missing`.

5. **Negative check:** Open `src/bir/core/` — confirm NO implementation logic yet. `form-types.ts` should exist but be empty or contain only a doc comment.

### Phase 2 — BIR Core Engine

Human checks for Phase 2:

1. **Run:** `npx tsc --noEmit`
   - Expected: no TypeScript errors in `src/bir/core/`.

2. **Open `src/bir/core/eopt-engine.ts`**
   - Expected: exports a `classifyTaxpayer(annualGrossSales: number): BIRTaxpayerClassification` function. Confirm Micro threshold is `3_000_000` (₱3M per RA 11976).

3. **Open `src/bir/core/tax-calculator.ts`**
   - Expected: exports `computeEightPercentTax`, `computeGraduatedTax`, and `determineOptimalTaxScheme`. No hardcoded magic numbers without comments referencing the law.

4. **Run unit tests:** `npm test -- src/bir/core`
   - Expected: all tests pass. Edge cases tested: ₱0, exactly ₱3M, above ₱3M threshold.

5. **Negative check:** Confirm NO BIR computation logic exists in `src/bir/legal/`. Legal forms must only use types and call the core engine — they may not contain their own tax math.

### Phase 3 — AI Secretary System

Human checks for Phase 3:

1. **Open `src/ai/secretary/types.ts`**
   - Expected: exports `ObservableState`, `SecretaryTask`, and `AIManifest` interfaces. `SecretaryTask.status` must be typed as `'pending' | 'dismissed' | 'done'`.

2. **Open `src/ai/secretary/task-engine.ts`**
   - Expected: exports `loadManifest`, `mergeManifests`, `evaluateState`, `createTask` as pure functions. No Supabase client direct call in this file — it must remain framework-agnostic.

3. **Check Supabase migration:** `cat supabase/migrations/*secretary*`
   - Expected: creates `secretary_tasks` table with columns: `id`, `user_id`, `vertical_id`, `title`, `description`, `priority`, `triggered_by_state_id`, `status`, `created_at`, `updated_at`. RLS policy allows user to read own tasks; service role can insert.

4. **Open `supabase/functions/ai-secretary/index.ts`** (if Edge Function approach was used)
   - Expected: imports and calls `task-engine.ts`. Reads manifest from `src/ai/core.ai-manifest.json`. Handles `extends` chain for vertical manifests.

5. **Negative check:** Confirm the task engine has NO write operations to any table other than `secretary_tasks`. The AI Secretary is read-only on all business data tables.

---

## Constraints

- Do not edit application code.
- Do not commit or stage files.
- Do not mark masterplan tasks done.
- Do not run migrations or builds.
- Keep verification checklist scoped strictly to the verified phase.
- Never auto-approve — always present the checklist and wait for the user to confirm.
