---
description: Pull DannFlow updates into a project, exactly mirror template Claude commands, and automatically detect, validate, and apply required template database migrations.
---

# /sync-upstream

Pull selective updates from the DannFlow upstream repo without merging or rebasing. The user's project has rewritten git history (via `guide.sh init`), so **there is no common ancestor with `upstream/main`** — a normal `git merge upstream/main` would be a disaster. This command works around that.

> **Version-aware:** This command reads `dannflow.json` at the project root to know which DannFlow commit you last synced from, so it can show you only what's new since then.

> **Branch flow (the "serving plate stays clean" rule).** Synced changes never land on the current branch. They always land on a fresh `feat/sync-upstream-<short-sha>` branch, created from the project's `base_branch` and opened back into that branch (normally `main`). `dev` is not required or used by this command.

> **Template ownership rule.** `.claude/commands/` is owned by DannFlow. A sync mirrors that directory exactly from `upstream/main`; it is not a selective or mergeable project surface. Put project-only workflow notes outside `.claude/commands/`.

**Successful-output rule:** after the PR is created, output **only its GitHub PR URL**. Do not end with a summary, compare URL, branch name, or next steps.

**Two modes** — file-level is the default and recommended:

| Mode | When to use |
|---|---|
| **File-level (default)** | "Has DannFlow added new commands, skills, scripts, or docs I'm missing?" Safest for forked-and-rewritten repos. |
| **Commit-level (opt-in)** | User explicitly wants to inspect upstream commits and cherry-pick one. Expect conflicts. |

## Argument parsing

The user invokes this command with optional args:

- `/sync-upstream` → file-level mode, scan default paths (see below)
- `/sync-upstream <path>` → file-level mode, scoped to that path (file or dir)
- `/sync-upstream --commits` → commit-level mode (list commits, let user pick)
- `/sync-upstream --commits <N>` → commit-level mode, show last N commits

## Preflight (always run first)

1. **Read `dannflow.json`** to get the base commit:
   ```bash
   cat dannflow.json
   ```
   - If the file is missing, warn:
     ```
     ⚠️ No dannflow.json found. This project has no version anchor.
     Run /update-dannflow to create one before syncing.
     ```
     and stop.
   - Extract `dannflow_commit` (the SHA you last synced from) and `repo` (the upstream URL).
   - Show the user: `Last synced from DannFlow commit: <sha> on <synced_at>`

2. Verify `upstream` remote exists and matches `dannflow.json`'s `repo`:
   ```bash
   git remote get-url upstream
   ```
   - If missing, instruct the user:
     ```
     git remote add upstream <repo from dannflow.json>
     ```
     and stop.
   - If it exists but doesn't match the `repo` field in `dannflow.json`, warn: "upstream remote points to a different repo than dannflow.json expects. Confirm before continuing."

3. Fetch latest upstream (quiet — output is noisy):
   ```bash
   git fetch upstream --quiet
   ```

4. Confirm `upstream/main` exists:
   ```bash
   git rev-parse --verify upstream/main
   ```
   If it doesn't, fall back to whatever default branch upstream has (`git remote show upstream | grep 'HEAD branch'`).

5. **Show commit changelog** — what's new in upstream since your `dannflow_commit`:
   ```bash
   git log <dannflow_commit>..upstream/main --oneline --no-merges
   ```
   If there are no new commits, tell the user: "You're already up to date with DannFlow (at commit <sha>)." and exit.

---

## Mode A — File-level diff (DEFAULT)

This is the right mode for a forked-and-rewritten project. We're asking *"which upstream files are newer or different from mine, and which do I want to copy?"* — not merging history.

### Default scan paths

If the user didn't pass a path, scan these (in this order):

```
.claude/commands/
.claude/agents/
.claude/skills/
.codex/commands/
.codex/context/
.github/
SKILLS.md
CLAUDE.md
AGENTS.md
PROJECT_CONTEXT.md
guide.sh
docs/dannflow_docs/
scripts/
src/prompts/features/
db/migrations/
src/types/supabase.ts
```

### Mandatory template-command mirror

Treat `.claude/commands/` as one required sync bundle whenever upstream changed it since `dannflow_commit` **or** the project copy differs from `upstream/main`:

1. Show a compact summary of added, changed, and locally extra command files.
2. Preserve no project-specific fork inside `.claude/commands/`. Before replacing an extra local command, show its path and require the user to move its content outside the directory if it must be retained.
3. On the sync branch, make the directory an exact upstream mirror:
   ```bash
   git checkout upstream/main -- .claude/commands/
   # Remove only paths that exist locally but not in upstream/main.
   git ls-files .claude/commands | sort > /tmp/local-claude-commands
   git ls-tree -r --name-only upstream/main -- .claude/commands | sort > /tmp/upstream-claude-commands
   comm -23 /tmp/local-claude-commands /tmp/upstream-claude-commands | while read -r path; do
     git rm -- "$path"
   done
   ```
4. After the operation, verify byte-for-byte equality for every command path and verify no extra paths remain:
   ```bash
   git ls-files .claude/commands | sort > /tmp/local-claude-commands-after
   git diff --exit-code upstream/main -- .claude/commands/
   test -z "$(comm -23 /tmp/local-claude-commands-after /tmp/upstream-claude-commands)"
   ```

Never present individual `.claude/commands/` files for selection or offer a manual merge. The exact mirror is required for command consistency across DannFlow projects.

### Automatic schema-sync detection

Compare `dannflow_commit..upstream/main` before the selection table. A template database update is **required** when that range changes any of:

```text
db/migrations/
src/types/supabase.ts
```

Also inspect changed template scripts and command documents for SQL, RLS, functions, triggers, Storage policies, or explicit references to the paths above. Mark the result as either:

- `Schema sync: not required`
- `Schema sync: required — <changed migration paths>`

When required, include the migration files automatically; do not let the user accidentally omit them from the sync selection. Migrations are append-only: if the project already has an upstream migration filename with different contents, or if copying an upstream schema file would overwrite a project change made after `dannflow_commit`, stop and require a manual resolution. Never overwrite or delete project-owned schema work.

**Never auto-touch:** `src/app/`, `src/components/`, `src/services/`, `src/lib/config.ts`, `.env*`, `package.json`, `package-lock.json`, `supabase/`, `public/`, `next.config.ts`, `tsconfig.json`. The user's app code lives here — copying upstream over it would destroy their work. If the user explicitly passes one of these as a path arg, allow it but warn loudly first.

**Project-tuned — diff-only, never auto-pull:** `.github/workflows/ci.yml`. This file was rewritten by `/adopt-dannflow` to match *this* project's package manager, Node version, and scripts. Blindly copying upstream's generic version over it would break the CI gate (and once CI is a required check, that blocks every merge). If it differs from upstream, only ever **show the diff** and let the user hand-merge — never `git checkout upstream/main` over it. The rest of `.github/` (PR template, dependabot) is fine to sync normally.

### Procedure

1. **Build a change report** for the scanned paths:
   ```bash
   # For each scanned dir/file, compare working tree vs upstream/main
   git diff --stat HEAD upstream/main -- <path>
   git diff --name-status HEAD upstream/main -- <path>
   ```

2. **Categorize each file** in the diff into one of:
   - 🆕 **NEW upstream** — file exists in `upstream/main` but not locally
   - ✏️ **MODIFIED** — file exists in both, content differs
   - 🗑️ **DELETED upstream** — file exists locally but upstream removed it (rare; usually means it was renamed)

3. **Present a table** to the user:

   Always place the mandatory `.claude/commands/` mirror and the automatic schema-sync result above this table. Neither is an optional numbered choice.

   ```
   File-level diff: HEAD vs upstream/main

   #   Status      Path                                    +/-
   1   🆕 NEW      .claude/commands/foo.md                 +120
   2   ✏️ MODIFIED .claude/commands/commit.md              +14 / -3
   3   ✏️ MODIFIED SKILLS.md                                +40 / -2
   4   🆕 NEW      docs/dannflow_docs/new-thing.md          +88
   5   🗑️ DELETED  .claude/commands/old.md                   -50
   ```

4. **Ask the user which to pull**, accepting:
   - Numbers: `1,3,5` or `1-3`
   - `all`
   - `none` / `q` to quit
   - For each modified file, also offer `view N` to show the diff before deciding

5. **Create the hash-named landing branch first**, from the project's configured base branch (normally `main`):
   ```bash
   UPSTREAM_SHA=$(git rev-parse upstream/main)
   SHORT_SHA=$(git rev-parse --short upstream/main)
   BASE_BRANCH=$(node -p "require('./dannflow.json').base_branch || 'main'")
   TARGET_BRANCH="$BASE_BRANCH"
   if git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
     TARGET_REF="$BASE_BRANCH"
   elif git show-ref --verify --quiet "refs/remotes/origin/$BASE_BRANCH"; then
     TARGET_REF="origin/$BASE_BRANCH"
   else
     echo "Configured base branch '$BASE_BRANCH' does not exist locally or on origin."
     exit 1
   fi
   git switch -c "feat/sync-upstream-$SHORT_SHA" "$TARGET_REF"
   ```

6. **Apply the user's choices** onto that branch, file by file:
   - Run the mandatory `.claude/commands/` mirror first when it is required.
   - 🆕 NEW: `git checkout upstream/main -- <path>` (creates the file locally)
   - ✏️ MODIFIED:
     - First show `git diff HEAD upstream/main -- <path>` so user sees what changes
     - Ask: replace entirely (`git checkout upstream/main -- <path>`), merge manually, or skip
     - If "merge manually": copy upstream version to `<path>.upstream` next to the local file so user can diff them in their editor
   - 🗑️ DELETED: just inform the user — do NOT delete their local file unless they explicitly say to

7. **Apply a required schema sync before committing.** This is automatic once the user approves the sync branch; do not treat it as an optional documentation copy.
   - Copy reviewed, non-conflicting template appended `db/migrations/` files.
   - Do **not** copy `src/types/supabase.ts` from the template. It is generated from the target project's live database after migration.
   - Confirm a non-placeholder `DATABASE_URL` is available for the target project. If it is missing or unreachable, stop before commit/push/PR and report the exact migration blocker.
   - Run the project’s normal tracked schema flow, using its detected package manager:
     ```bash
     <package-manager> run db:migrate
     <package-manager> run db:types
     <package-manager> exec tsc --noEmit
     <package-manager> run build
     ```
   - Verify the new tables, columns, functions, triggers, and RLS policies against the target database. Record the result for the PR body. Do not report a successful sync if a required migration or verification fails.

8. **Update `dannflow.json`** with the new upstream HEAD SHA, preserving the existing branch fields:
   ```json
   {
     "dannflow_commit": "<new upstream/main SHA>",
     "synced_at": "<ISO timestamp>",
     "repo": "<repo from existing dannflow.json>",
     "base_branch": "<base_branch from existing dannflow.json, default main>",
     "dev_branch": "<dev_branch from existing dannflow.json, default dev>"
   }
   ```
   Tell the user: "Updated dannflow.json: now tracking DannFlow at `<new sha>`"

9. **Commit on the sync branch** with provenance trailers (see the canonical spec in `/adopt-dannflow`). Stage only the touched files plus `dannflow.json` — never `git add -A`:
   ```
   chore(sync): pull upstream updates to .claude/commands/ and SKILLS.md

   DannFlow-Action: sync-upstream
   DannFlow-Source: Danncode10/DannFlow@<UPSTREAM_SHA>

   Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
   ```
   The subject describes *what files changed*; the trailers record *which template commit it came from*. The `DannFlow-Source` SHA must match `dannflow.json`'s `dannflow_commit`.

10. **Open a PR into the project base branch** (use the GitHub MCP or `gh pr create`), so CI gates the sync. Ask before pushing. Do not auto-merge it. If neither tool can create a PR, stop with an error; never substitute a compare URL:
   ```bash
   git push -u origin "feat/sync-upstream-$SHORT_SHA"
   gh pr create --base "$TARGET_BRANCH" --head "feat/sync-upstream-$SHORT_SHA" \
     --title "chore(sync): DannFlow @$SHORT_SHA" --body "Synced from Danncode10/DannFlow@$SHORT_SHA"
   ```
   Once created, end the command response with the PR URL alone.

### Safety rules for file-level mode

- **Never** `git checkout upstream/main -- .` (whole tree). Always scoped paths.
- **Always** mirror `.claude/commands/` exactly when command synchronization is required; never retain an unreviewed local fork in that directory.
- **Always** detect template schema changes and apply their reviewed, non-conflicting migrations to the target project before opening the sync PR.
- **Never** copy generated `src/types/supabase.ts` from upstream; regenerate it from the target project after the migration.
- **Never** land synced changes directly on the project base branch. Always use `feat/sync-upstream-<sha>` → PR into that branch.
- **Never** auto-merge the sync PR to `main` — that promotion is a human checkpoint after CI passes.
- **Never** `git checkout upstream/main` over `.github/workflows/ci.yml` — diff-only (it's project-tuned).
- **Never** auto-overwrite a modified file without showing the diff first.
- If a target file has uncommitted local changes (`git status --porcelain <path>` is non-empty), warn and require explicit confirmation before overwriting.
- After every checkout, stage only what was touched — never use `git add -A`.

---

## Mode B — Commit-level cherry-pick (OPT-IN: `--commits`)

For when the user explicitly wants to see upstream commits and pick one. **Expect conflicts** — there's no common ancestor.

### Procedure

1. List recent upstream commits (default 20, or `<N>` from args):
   ```bash
   git log upstream/main --oneline -n 20 --no-merges
   ```

2. For each commit, also show the files it touched (`git show --stat <sha> --format=`) so the user can judge relevance before picking.

3. Ask user to pick one or more SHAs.

4. For each picked SHA, run:
   ```bash
   git cherry-pick -x <sha>
   ```
   - `-x` adds a "(cherry picked from commit ...)" trailer so provenance is recorded.

5. **If cherry-pick conflicts** (likely):
   - Show `git status` so the user sees the conflicted files
   - Offer three options:
     - **Resolve manually** — leave them in conflict state, instruct on `git add` + `git cherry-pick --continue`
     - **Abort** — `git cherry-pick --abort`
     - **Take theirs (upstream version) for specific files** — `git checkout --theirs <path> && git add <path>`
   - Do NOT auto-resolve.

6. After all cherry-picks complete (or abort), summarize what landed.

### Safety rules for commit-level mode

- **Never** cherry-pick multiple commits without confirming each one.
- If a commit touches files in the "never auto-touch" list above (`src/app/`, `package.json`, etc.), warn before cherry-picking.
- Never run `git cherry-pick --continue` automatically — let the user do it after they resolve.

---

## Output style

- Be concise. Tables and short prompts beat walls of text.
- Always show file paths and SHAs verbatim (never abbreviate truncated forms).
- During inspection and selection, report the necessary table, diffs, and decision prompts. After a successful PR creation, end with the PR URL alone; do not append a commit suggestion.

## When to refuse

- If `git status` shows a dirty working tree at start, refuse and tell the user to commit or stash first. Sync over uncommitted work is too easy to lose.
- If `upstream` points anywhere other than the DannFlow repo, warn and ask the user to confirm before proceeding.

---

## See also

- `/sync-to-upstream` — the **reverse** flow: contribute your local improvements back to the DannFlow upstream repo.
