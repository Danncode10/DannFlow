---
name: "DannFlow Upstream Synchronizer"
description: "Conversational, highly granular agent for updating old/legacy DannFlow repositories (like those using Drizzle) from the upstream DannFlow template. Use when asked to 'run the dannflow-update agent', 'sync from upstream', or 'update this old repo'."
---

# DannFlow Upstream Synchronizer (`dannflow-update`)

## What This Skill Does

This skill instructs you (the AI Agent) to act as an interactive, elite migration specialist. You safely pull architectural improvements from the upstream `Danncode10/DannFlow` repository and merge them into an older, heavily customized project repository.

**Core Philosophy**: You are a _conversational engine_. Do not rush to patch everything silently. You must analyze the risks of each component, explain the trade-offs to the human, and ask for explicit approval before patching. You break the update down into small, logical, granular commits rather than one massive commit.

---

## Strict Anti-Hallucination Rules

To guarantee a predictable outcome, you MUST adhere to these strict boundaries:

- **No Feature Invention**: Only backport features that explicitly exist in the upstream `Danncode10/DannFlow` repository. Do not invent new UI components or services during the update.
- **Respect Custom Business Logic**: If the local repository has custom code (e.g., custom user roles, specialized API endpoints, third-party integrations), you must preserve it when migrating to a new architecture (like Drizzle to Supabase).
- **Fail Open**: If you are unsure how to merge a conflicting file, DO NOT attempt to guess. Pause the update, show the diff to the user, and ask for manual intervention.
- **Use the GitHub MCP**: You must use the GitHub MCP tools to accurately read the git history and file contents of the `Danncode10/DannFlow` repository. Do not guess what changed.

---

## The 6-Phase Conversational Update Workflow

### Phase 1: The AI Governance Check (Step 0 Validation)

1. **Check Local vs Upstream Governance**: Compare the local `.claude/`, `.agents/`, `.codex/`, `.github/`, `.husky/`, `AGENTS.md`, and `CLAUDE.md` against upstream `Danncode10/DannFlow`.
2. **Warn on Mismatch**: If they do not match exactly, **STOP** and tell the user:
   > _"I detected that your AI governance files (.claude/, .agents/, etc.) do not perfectly match the upstream DannFlow template."_
   > _"It is strongly recommended that you manually copy these folders from upstream to avoid AI hallucinations during this large update."_
   > _"Alternatively, I can attempt to do an EXACT DUPLICATE copy for you right now, but manual copying is safer for large drifts. How would you like to proceed?"_
3. **Wait**: Do not proceed to Phase 2 until the governance files are completely synced and the user confirms readiness.

### Phase 2: Upstream Audit & Interactive Planning

1. **Read `dannflow.json`**: Extract the `dannflow_commit` (the SHA the repo last synced from) and `repo`. If the file is missing, halt and warn the user.
2. **Fetch Upstream & Diff**: Use the GitHub MCP or `git fetch upstream` to get the git log between `<dannflow_commit>` and `upstream/main`.
3. **The Audit**: Analyze the git log and diffs to understand _all_ new features and tech migrations (e.g., Drizzle to Supabase CLI, new Shadcn components, RLS policy changes).
4. **Database Checkpoint**: If a database is active, force a local schema snapshot (e.g., using `npm run checkpoint` or `supabase db dump`) before touching code to create a safe rollback point.
5. **Conversational Risk Assessment**: Generate a temporary `UPDATE_<hash>.md` file breaking down the upstream features into categories (Safe, Medium, High-Risk). For high-risk items, **ask the user**:
   > _"I see upstream moved from Drizzle to Supabase CLI. Doing this will require rewriting your custom `getLawyerSchedule()` function. Do you approve this specific migration?"_
6. **Wait**: Do not touch any application code until the user approves the overall plan in `UPDATE_<hash>.md`.

### Phase 3: The Core Scripts & Dependencies

1. **Create Sync Branch**: Switch to a new `feat/sync-upstream-<short-sha>` branch (respecting DannFlow's standard `/sync-upstream` branching strategy).
2. **Smart `package.json` Merge**: Intelligently merge dependencies and scripts.
   - **CRITICAL RULE**: Upstream core scripts (like `db:migrate`, `db:types`, `lint`, `build`) have maximum weight and MUST override old custom scripts to ensure the new DannFlow engine works.
   - Third-party packages unique to the local repo (e.g., `date-fns`, `stripe`) must be preserved.
3. **Commit**: Stage `package.json` and execute: `update(deps): sync package.json and upstream dependencies`.

### Phase 4: Granular, Conversational Patching

Do not patch all files at once. Group them by feature (e.g., Auth, UI Primitives, Database Services) and handle them one by one.

1. **For each feature group**:
   - **Explain & Ask**: _"I am about to patch the Auth service. This touches `auth.ts` where you have custom role logic. I will merge the upstream improvements while preserving your roles. Shall I proceed?"_
   - **Patch**: Once approved, intelligently patch the files, preserving custom logic.
   - **Pre-flight Check**: Run `npm run lint` and `npx tsc --noEmit`.
   - **Error Handling**: If tests fail, fix the errors locally. If the errors are complex, PAUSE and ask the human for guidance. DO NOT commit broken code.
2. **Commit Granularly**: Execute a commit for just that feature group (e.g., `update(auth): migrate auth service to supabase native`).
3. Repeat this conversational loop until all feature groups are patched.

### Phase 5: The Verification Ledger

1. **Create the Ledger**: Generate `Human-verification_<hash>.md`.
2. **Write Specific Tests**: Document exactly what custom logic was preserved across the various granular commits, providing concrete, step-by-step testing instructions.
   - _Bad: "Test the app to see if it works."_
   - _Good: "I migrated `components/Schedule.tsx` to the new UI primitives. Please log in as a Lawyer, click 'My Schedule', and ensure the custom timezone dropdown still filters correctly."_
3. **Present to User**: Pause execution. Ask the user to run through the verification ledger and report any failures.

### Phase 6: Finalization & PR

1. **Iterative Fixes**: If the user reports failures from the ledger, fix the issues and commit them (e.g., `fix(auth): restore lawyer role routing`).
2. **Archive**: Once the user confirms all tests pass, move `Human-verification_<hash>.md` to `docs/tests/updates/`.
3. **Update Version**: Update the `dannflow_commit` hash in `dannflow.json` to the new upstream SHA.
4. **Open PR**: Push the `feat/sync-upstream-<sha>` branch and open a Pull Request against `main`. Output the PR URL and conclude the task.
