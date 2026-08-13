---
description: Contribute local improvements back to DannFlow upstream. Classifies generic changes, refreshes command help when command prompts changed, commits clean docs first, and opens a PR.
argument-hint: (optional --dry-run to preview without touching git)
---

# /sync-to-upstream

Push improvements from your project back to the DannFlow upstream repo. This is the **reverse** of `/sync-upstream`.

Use this when:
- You improved a `.claude/commands/` or `.codex/commands/` file that would benefit every DannFlow project
- You wrote a new doc, script, or skill that belongs in the template
- You found and fixed a bug that exists in the upstream source

Because your project has **rewritten git history** (via `guide.sh init`), you cannot open a normal PR from this project checkout. This command handles that: it classifies your changes, refreshes generated command help when command prompts changed, extracts only the generic ones, and opens a clean PR from a clean clone.

Strict output rule: `/sync-to-upstream` must end with either a GitHub PR URL or a clear blocker explaining why a PR could not be created. Do not present email patching or "patch saved for later" as a successful final output.

---

## Argument parsing

- `/sync-to-upstream` → interactive mode — scans default paths, classifies, asks which to include
- `/sync-to-upstream --dry-run` → show the classification report, make no git changes
- `/sync-to-upstream <path>` → scope the scan to one file or directory

---

## Step 1 — Preflight checks

1. **Read `dannflow.json`** to get the base commit:
   ```bash
   cat dannflow.json
   ```
   - If the file is missing, warn:
     ```
     ⚠️ No dannflow.json found. Cannot determine what changed since your last sync.
     Run /update-dannflow to create a version anchor first.
     ```
     and stop.
   - Show: `Base DannFlow commit: <dannflow_commit> (synced <synced_at>)`

2. Verify working tree is clean:
   ```bash
   git status --porcelain
   ```
   If dirty, stop: tell the user to commit or stash first. Do not proceed over uncommitted work.

3. Verify `upstream` remote exists and matches `dannflow.json`'s `repo` field:
   ```bash
   git remote get-url upstream
   ```
   - If missing: tell the user to add it and stop.
   - If pointing elsewhere: warn loudly and ask for confirmation before continuing.

4. Fetch latest upstream:
   ```bash
   git fetch upstream --quiet
   ```

---

## Step 2 — Scan for candidate files

Scan these paths for files that differ between your `HEAD` and `upstream/main`:

```
.claude/commands/        (top-level .md files only — exclude Ruflo subdirectories)
.claude/agents/
.claude/skills/
.codex/commands/
.codex/context/
CLAUDE.md
SKILLS.md
AGENTS.md
guide.sh
docs/dannflow_docs/
scripts/
src/prompts/features/
```

> Keep this list in sync with `/sync-upstream`'s default scan paths — the two commands should cover the same file set in both directions. **Exception:** `.github/workflows/ci.yml` is intentionally excluded here. Your project's `ci.yml` is tuned to *your* package manager and scripts; pushing it up would pollute the generic template. Contribute CI *improvements* by hand, not the tuned file.

**Exclude from scanning (always business-specific — never upstream candidates):**

```
src/app/
src/components/
src/services/
src/lib/config.ts
src/lib/siteConfig.ts
.env*
package.json
package-lock.json
supabase/
public/
MASTERPLAN.md
TEST.md
PROJECT_CONTEXT.md
next.config.ts
tsconfig.json
```

Build the candidate list using the `dannflow_commit` SHA from `dannflow.json` as the base — this is more precise than `upstream/main` because it reflects exactly what you last synced from, not the current tip:
```bash
git diff --name-status <dannflow_commit> HEAD -- <each-scanned-path>
```
If a file changed both in upstream (since `dannflow_commit`) and locally, flag it as 🟡 REVIEW NEEDED — it may conflict.

---

## Step 3 — Classify each candidate

For each file in the candidate list, classify it. Apply these rules **in order** — first match wins:

### Rule 1: Is it a new file or a modified file?

- **New locally (A — Added):** You created this file; upstream doesn't have it. Prime candidate.
- **Modified locally (M):** Both you and upstream have it; yours differs. Need to extract your delta.
- **Deleted locally (D):** You removed it. Rarely relevant upstream — skip unless user explicitly wants it.

### Rule 2: Does it contain business-specific content?

Scan the file content for signals that it's project-specific:

**Business-specific signals (classify as 🔒 KEEP LOCAL):**
- Hardcoded domain names, brand names, or client names
- References to `siteConfig`, project-specific names
- MASTERPLAN.md task references or project-specific phase names
- Supabase project IDs or keys
- References to specific client verticals (restaurant, realtor, etc.)
- API keys, tokens, or secrets of any kind

**Generic signals (classify as 🟢 UPSTREAM CANDIDATE):**
- Command is about git workflow, schema, auth, RLS, types
- Command describes a general development pattern (not project-specific)
- Docs describe DannFlow methodology (not your client's requirements)
- Script improves DannFlow developer tooling (checkpoint, update-types, etc.)
- Skill adds general-purpose capability any DannFlow project would want

**Ambiguous (classify as 🟡 REVIEW NEEDED):**
- Mix of generic and specific content
- Not sure — let the user decide

---

## Step 4 — Present classification table

Show the user a table:

```
/sync-to-upstream — Change Classification Report
HEAD vs upstream/main

#   Status   Class              Path
─────────────────────────────────────────────────────────────────
1   Added    🟢 UPSTREAM        .claude/commands/update-masterplan.md
2   Added    🟢 UPSTREAM        .codex/commands/claude-command.md
3   Modified 🟡 REVIEW NEEDED   .claude/commands/commit.md
4   Modified 🔒 KEEP LOCAL      .claude/commands/new-page.md
5   Added    🔒 KEEP LOCAL      docs/dannflow_docs/your-client-guide.md

Totals: 2 upstream candidates · 1 needs review · 2 keep local
```

Then ask:
```
Which would you like to contribute to upstream?
- Enter numbers: 1,2 or 1-3
- all (only applies to 🟢 files — 🔒 files require explicit override)
- view N  — show the diff for file N before deciding
- none / q — exit
```

---

## Step 5 — Refresh generated command help when needed

Before extracting the upstream patch, check whether the selected upstream candidates include any added or modified top-level Claude command prompt:

```text
.claude/commands/*.md
```

Exclude `.claude/commands/help-dannflow.md` itself from this trigger to avoid a self-refresh loop.

If one or more selected files are new or edited Claude commands:

1. Regenerate `.claude/commands/help-dannflow.md` from the current command set before preparing the upstream contribution.
   - Read every top-level `.claude/commands/*.md` file.
   - Use each file's frontmatter `description` and `argument-hint` when available.
   - Keep the output clean, concise, categorized, and report-only.
   - Include newly added commands and remove deleted commands.
   - Update the Mermaid graph so the catalog and graph agree.
2. Show the user the exact command-help diff:
   ```bash
   git diff -- .claude/commands/help-dannflow.md
   ```
3. Create a dedicated local docs commit before continuing:
   ```bash
   git add .claude/commands/help-dannflow.md
   git commit -m "docs(commands): refresh DannFlow help catalog"
   ```
4. Then tell the user:
   ```text
   I've already updated /help-dannflow for the command changes and committed that clean docs refresh locally. Next I will include it in the upstream contribution PR with the selected command changes.
   ```
5. Continue the sync-to-upstream flow using the new `HEAD`, so the help refresh commit is included in the clean upstream PR.

If `.claude/commands/help-dannflow.md` is already up to date, say so and do not create an empty commit.

This is mandatory. Never contribute new or edited Claude commands upstream without the matching `/help-dannflow` catalog update.

---

## Step 6 — Extract a clean patch

For each file the user selects:

1. If **Added** (new file): the whole file is the patch — straightforward.
2. If **Modified**: show the diff and let the user decide:
   - **Full file** — contribute your entire version (replaces upstream)
   - **Delta only** — extract just your additions as a standalone patch (advanced)
   - **Skip** — leave it for now

Create a patch directory:
```bash
mkdir -p /tmp/dannflow-upstream-patch
```

For each selected file:
```bash
# Get upstream's version of the file (or empty if new)
git show upstream/main:<path> > /tmp/dannflow-upstream-patch/<filename>.upstream 2>/dev/null || true

# Get your version
cp <path> /tmp/dannflow-upstream-patch/<filename>.local

# Generate a unified diff
git diff upstream/main HEAD -- <path> > /tmp/dannflow-upstream-patch/<filename>.patch
```

---

## Step 7 — Prepare the contribution

**Required method: Clean clone + new branch + PR**

Since your project has rewritten history, you can't open a PR directly from this checkout. Use a clean clone and create the PR from there.

```
Contribution Summary
────────────────────────────────────────────────────────────
Files selected for upstream: N
Patch files saved to: /tmp/dannflow-upstream-patch/
```

Proceed directly with the PR flow unless a required tool or permission is missing:

1. Run the clone + branch creation:
   ```bash
   git clone https://github.com/Danncode10/DannFlow.git /tmp/dannflow-contrib
   cd /tmp/dannflow-contrib
   git checkout -b <branch-name>
   ```

2. Copy selected files to their target paths (same relative path as in your project). If Step 5 refreshed `.claude/commands/help-dannflow.md`, include that file even if it was not in the user's original selection.

3. Run `git diff` in the clean clone to confirm only the right changes are staged.

4. Create a commit with provenance trailers (see the canonical spec in `/adopt-dannflow`). Record where the contribution came FROM — the origin repo and commit — so DannFlow history shows which project each improvement originated in:
   ```
   feat: <contribution description>

   DannFlow-Action: contribute
   DannFlow-Origin: <origin repo slug>@<your HEAD short sha>

   Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
   ```
   Get the origin slug + sha from the *project* repo before cloning: `git remote get-url origin` and `git rev-parse --short HEAD`.
   ```bash
   git add <specific files only>
   git commit -F <message-file>
   ```

5. Tell the user the clean docs refresh is included when applicable:
   ```text
   I've already updated /help-dannflow for the command changes and included that clean docs refresh in this upstream PR branch.
   ```

6. Ask before pushing:
   ```
   Ready to push branch '<branch-name>' to origin (Danncode10/DannFlow)?
   This will create a branch on the remote. (y/n)
   ```

7. If confirmed: `git push origin <branch-name>`

8. Open the PR directly via the GitHub MCP (`create_pull_request`) or `gh pr create --repo Danncode10/DannFlow --base main --head <branch-name>` — DannFlow has no `dev` branch, so contributions PR straight into `main`, where its CI gate keeps the template clean. If neither is available, print the compare URL as a blocker, not as success:
   ```
   https://github.com/Danncode10/DannFlow/compare/<branch-name>
   ```

---

## Safety rules

- **Never** `git push` without asking first.
- **Never** push to `main` or `upstream/main`. Always a feature branch.
- **Never** finish successfully without a PR URL. A compare URL is only a blocker/fallback that still needs user action.
- **Never** contribute new or edited top-level `.claude/commands/*.md` files without first refreshing and locally committing `.claude/commands/help-dannflow.md`.
- **Never** include files from the "never auto-touch" list unless the user typed the path explicitly.
- **Never** include files with API keys, secrets, or env vars. Scan each selected file for common patterns (`sk-`, `eyJ`, `SUPABASE_`, `NEXT_PUBLIC_`) before including.
- **Always** show the final file list and diffs before committing in the clean clone.
- If a 🔒 KEEP LOCAL file is explicitly selected by the user, warn once: *"This file has business-specific content. Confirm you want to contribute it to the public DannFlow repo?"* Then proceed only if confirmed.

---

## Output style

- Tables over paragraphs.
- Show file paths verbatim.
- End with a one-line summary of what was contributed (or skipped and why).
