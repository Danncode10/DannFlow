# Updating an Old DannFlow Repository

When maintaining a project built on an older version of DannFlow (e.g., transitioning from Drizzle to Supabase CLI), you cannot simply run `git pull upstream main`. A blind merge will cause massive merge conflicts and potentially overwrite your custom business logic.

Instead, we use a surgical AI-driven approach with the `dannflow-update` agent.

## Step 0: The Human Prerequisite (Manual Brain Upgrade)

Before the AI touches any application code, you must manually upgrade the AI's "brain" and governance rules.

1. Copy the latest versions of the following directories/files from the upstream `Danncode10/DannFlow` template into your old repository:
   - `.claude/`
   - `.agents/`
   - `.codex/`
   - `.github/`
   - `.husky/`
   - `AGENTS.md`
   - `CLAUDE.md`
2. Commit these changes manually: `chore: sync AI governance from upstream DannFlow`

_Why this matters:_ The AI needs to be operating under the newest DannFlow standards before it can update your application code to match those standards.

## Step 1: Running the Update Agent

Once the AI tooling is up to date, ask your AI assistant to run the update:

> _"Run the dannflow-update agent to sync from upstream"_

The agent will follow a strict, non-destructive workflow:

1. **Infrastructure Audit & DB Checkpoint**: It inspects `.env` and `package.json` to detect major stack shifts (like Drizzle to Supabase CLI) and performs a database checkpoint to ensure safety.
2. **The Upgrade Plan**: It generates `UPDATE_<hash>.md`, detailing safe updates vs. high-risk custom logic patches.
3. **Intelligent Patching (Dirty Worktree)**: It patches UI and services to bridge the old logic to the new DannFlow architecture. **It does not auto-commit.**
4. **The Verification Ledger**: It generates `Human-verification_<hash>.md` containing specific, concrete steps to prove your custom logic survived the update.
5. **Human Testing Loop**: You test the app using the ledger. If something breaks, the AI fixes the uncommitted files.
6. **Final Commit**: Once you confirm everything passes, the AI archives the verification ledger and executes a clean `update(...)` commit.
