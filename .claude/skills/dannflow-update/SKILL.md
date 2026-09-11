---
name: "DannFlow Upstream Synchronizer"
description: "Conversational, highly granular agent for updating old/legacy DannFlow repositories (like those using Drizzle) from the upstream DannFlow template. Use when asked to 'run the dannflow-update agent', 'sync from upstream', or 'update this old repo'."
---

# DannFlow Upstream Synchronizer (`dannflow-update`)

## What This Skill Does

This skill instructs you (the AI Agent) to act as an interactive, elite migration specialist. You safely pull architectural improvements from the upstream `Danncode10/DannFlow` repository and merge them into an older, heavily customized project repository.

**Core Philosophy**: You are a _conversational engine_. Do not rush to patch everything silently. You must analyze the risks of each component, explain the trade-offs to the human, and ask for explicit approval before patching. You break the update down into small, logical, granular commits rather than one massive commit.

---

## The 6-Phase Conversational Update Workflow

### Phase 1: The AI Governance Check (Step 0 Validation)

1. **Check Local vs Upstream Governance**: Compare the local `.claude/`, `.agents/`, `.codex/`, `.github/`, `.husky/`, `AGENTS.md`, and `CLAUDE.md` against upstream `Danncode10/DannFlow`.
2. **Warn on Mismatch**: If they do not match exactly, **STOP** and tell the user:
   > _"I detected that your AI governance files (.claude/, .agents/, etc.) do not perfectly match the upstream DannFlow template."_
   > _"It is strongly recommended that you manually copy these folders from upstream to avoid AI hallucinations during this large update."_
   > _"Alternatively, I can attempt to do an EXACT DUPLICATE copy for you right now, but manual copying is safer for large drifts. How would you like to proceed?"_
3. Do not proceed to Phase 2 until the governance files are completely synced.

### Phase 2: Upstream Audit & Interactive Planning

1. **Read `dannflow.json`**: Extract `dannflow_commit` and `repo`.
2. **Fetch Upstream & Diff**: Run `git fetch upstream` and `git log <dannflow_commit>..upstream/main --oneline`.
3. **The Audit**: Analyze the git log to understand _all_ new features and tech migrations (e.g., Drizzle to Supabase CLI, UI changes, Team tabs).
4. **Database Checkpoint**: If a database is active, force a local schema snapshot (`npm run checkpoint`) before touching code.
5. **Conversational Risk Assessment**: Generate `UPDATE_<hash>.md` breaking down the upstream features. For high-risk items, **ask the user**:
   > _"I see upstream moved from Drizzle to Supabase CLI. Doing this will require rewriting your custom `getLawyerSchedule()` function. Do you approve this specific migration?"_
6. Wait for user approval on the plan before touching application code.

### Phase 3: The `/sync-upstream` Core & Dependencies

1. **Create Sync Branch**: Switch to a new `feat/sync-upstream-<short-sha>` branch (respecting `/sync-upstream` rules).
2. **Smart `package.json` Merge**: Intelligently merge dependencies. **CRITICAL**: Upstream core scripts (like `db:migrate` or `db:types`) have higher weight and MUST override old custom scripts to ensure the new DannFlow engine works.
3. **Commit**: `update(deps): sync package.json and upstream dependencies`

### Phase 4: Granular, Conversational Patching

Do not patch all files at once. Group them by feature (e.g., Auth, UI Primitives, Database Services) and handle them one by one.

1. **For each feature group**:
   - Explain what you are about to do and ask for approval: _"I am about to patch the Auth service. This touches `auth.ts` where you have custom role logic. I will merge the upstream improvements while preserving your roles. Shall I proceed?"_
   - Once approved, intelligently patch the files, preserving custom logic.
   - Run `npm run lint` and `npx tsc --noEmit`. Fix errors.
2. **Commit Granularly**: Execute a commit for just that feature group (e.g., `update(auth): migrate auth service to supabase native`).
3. Repeat until all feature groups are patched.

### Phase 5: The Verification Ledger

1. **Create the Ledger**: Generate `Human-verification_<hash>.md`.
2. **Write Specific Tests**: Document exactly what custom logic was preserved across the various granular commits, providing concrete, step-by-step testing instructions.
3. **Present to User**: Pause execution. Ask the user to run through the verification ledger and report any failures.

### Phase 6: Finalization & PR

1. **Iterative Fixes**: If the user reports failures, fix the issues and commit them (e.g., `fix(auth): restore lawyer role routing`).
2. **Archive**: Once the user confirms all tests pass, move `Human-verification_<hash>.md` to `docs/tests/updates/`.
3. **Update Version**: Update `dannflow_commit` in `dannflow.json` to the new upstream SHA.
4. **Open PR**: Push the `feat/sync-upstream-<sha>` branch and open a Pull Request as mandated by `/sync-upstream` rules.
