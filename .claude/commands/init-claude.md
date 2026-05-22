---
description: Rewrites the entire Claude environment (CLAUDE.md, SKILLS.md, commands README, individual command files, and the claude-workflow.md command tables) to match the actual project state from README + package.json + src/.
---

Re-bootstrap the **entire** Claude environment so it perfectly matches what this project actually is. This is the full rewrite — touch everything.

## Step 0 — Guard ruflo customizations

Before touching any file, search ruflo memory for project-specific customizations added to CLAUDE.md, SKILLS.md, or individual commands (search: "ruflo", "protocol", "memory protocol", the project name). List what you find.

During the rewrite in Steps 4–5, **preserve these additions** rather than overwriting them. Specifically:
- The "## Ruflo memory protocol" section in CLAUDE.md must survive the rewrite
- Any Step 0 memory-check preambles added to individual commands must survive
- Any parallel-agent hints added to commands must survive

After the rewrite completes, run `/ruflo-upgrade` mentally to verify Ruflo patterns are still intact in the 12 target commands. If any were lost, restore them before reporting.

## Step 1 — Read source-of-truth files

Read in parallel:
- `README.md` — the project pitch and feature set
- `package.json` — actual dependencies and scripts
- `AGENTS.md` — cross-tool standard (for parity)
- List `src/` (one level deep) to confirm structure
- List `.claude/commands/*.md` and read each one's frontmatter `description:` + first ~20 lines of body to understand current command coverage

## Step 2 — Diff against current Claude config

Read current `CLAUDE.md`, `SKILLS.md`, `.claude/commands/README.md`, `docs/dannflow_docs/claude-workflow.md`. Identify drift:
- Outdated tech stack entries
- Missing or stale commands (e.g. `/rls-check` exists but project no longer uses Supabase)
- Missing commands (e.g. project added Stripe → no `/stripe-check`)
- Outdated command bodies (referencing files/patterns that no longer exist)
- Removed features still mentioned

## Step 3 — Show the user the planned changes

Output a bullet list grouped by file. Wait for confirmation unless the user wrote "just do it" / "go" / "yes" in their original invocation. Format:

```
Planned changes:

📝 CLAUDE.md
  - <change>

📝 SKILLS.md
  - <change>

📝 .claude/commands/README.md
  - <change>

🆕 New commands to create:
  - /<name>: <why>

🗑️ Stale commands to remove:
  - /<name>: <why>

✏️ Commands to rewrite:
  - /<name>: <what changes>

📝 docs/dannflow_docs/claude-workflow.md
  - Regenerate command tables from current .claude/commands/

Proceed? (y/n)
```

## Step 4 — Rewrite the core config files

- **`CLAUDE.md`** — keep existing structure (identity, tech stack, project structure, guardrails, RLS, UI standards, semantic tokens, Supabase workflow, MCP requirements, code conventions). Update sections to match reality. Preserve the non-negotiable rules unless the project genuinely no longer needs them (e.g. drop RLS section ONLY if Supabase is fully removed).
- **`SKILLS.md`** — refresh skill recommendations. Add `claude-api` if AI features were added. Remove irrelevant skills.
- **`.claude/commands/README.md`** — regenerate the command table from current frontmatter descriptions in `.claude/commands/*.md`.

## Step 5 — Update individual command files

For each command file in `.claude/commands/`:

- **Stale** (no longer fits the project) → delete the file. Tell the user.
- **Outdated body** (references removed files/patterns) → rewrite the body to match current reality. Preserve the command's intent and frontmatter format.
- **Still accurate** → leave it alone.

For each genuinely missing command implied by the new README:
- Create `.claude/commands/<name>.md` with proper frontmatter (`description:` + optional `argument-hint:`) and a focused prompt body.

**Critical**: each individual command change is shown in the Step 3 plan and only applied after confirmation. Do NOT silently delete or overwrite hand-tuned commands.

## Step 6 — Regenerate the command tables in claude-workflow.md

Read `docs/dannflow_docs/claude-workflow.md`. Find the sections under "## The full command list" with the category tables (Discovery & setup, Security & quality, Supabase workflow, Scaffolding, Housekeeping).

Replace those tables with fresh ones built from the current `.claude/commands/*.md`:

1. Group commands into the existing categories (or add a new category if the project clearly needs one — e.g. "Payments" if Stripe commands were added).
2. For each command, use `description:` from frontmatter as the table's "What it does" column.
3. If `argument-hint:` is present, append it to the command name (e.g. `/new-page <route>`).
4. Keep the rest of `claude-workflow.md` (TL;DR, setup steps, FAQ, when-to-use-what) intact unless a section is clearly stale.

## Step 7 — Report what changed

Concise summary, one bullet per file modified:

```
✅ Claude environment re-bootstrapped.

Modified:
  - CLAUDE.md: <one-line summary>
  - SKILLS.md: <one-line summary>
  - .claude/commands/README.md: <one-line summary>
  - docs/dannflow_docs/claude-workflow.md: regenerated command tables

Commands:
  + created: /<name>, /<name>
  - removed: /<name>
  ~ rewritten: /<name>

Ruflo integrity: ✅ all 12 Ruflo-upgraded commands intact  /  ⚠️ N commands need /ruflo-upgrade

Next steps:
  1. If PROJECT_CONTEXT.md exists at root, verify CLAUDE.md references it.
  2. If Ruflo integrity shows ⚠️, run /ruflo-upgrade now.
  3. Run /no-conflict to verify no documentation drift.

Suggested commit: chore: re-bootstrap Claude environment after <reason>
```

## Hard rules

- **Don't invent stack items** that aren't in `package.json`.
- **Don't remove non-negotiable rules** (RLS, semantic tokens, services layer) unless the project genuinely no longer uses them.
- **Always show the plan first** and wait for confirmation. The exception is when the user wrote "go" / "yes" / "just do it" / "no confirmation" in their invocation.
- **Preserve tone**: direct, opinionated, no fluff. Match the existing voice.
- **Never `git add` or `git commit`** automatically — leave that for the user or `/commit`.
