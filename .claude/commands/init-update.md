---
description: Update your DannFlow project to the latest version—pull new commands, scripts, guide, skills, and more while preserving your code.
argument-hint: "[--all] [--no-confirm]"
---

Update an older DannFlow project to the latest version without losing your work.

**What it does:**

Pulls the latest from the DannFlow repo and selectively merges updates across:
- `.claude/` (commands, CLAUDE.md, SKILLS.md, skill packs)
- Shell scripts (install.sh, guide.sh)
- Package.json (new npm scripts like `npm run setup`)
- Docs (dannflow_docs/ and README sections)

Shows diffs, asks which updates you want, and generates a clean commit for review.

**Flags:**
- `--all` — update everything without asking (sensible defaults)
- `--no-confirm` — skip the final "apply changes?" prompt

**Procedure:**

0. **Guard ruflo customizations** — before pulling anything, search ruflo memory for project-specific customizations baked into commands, CLAUDE.md, or SKILLS.md (e.g. "ruflo memory protocol section added to CLAUDE.md", "new-feature upgraded with parallel agents"). List them. After the update completes, verify these customizations survived — if any were overwritten, re-apply them automatically or prompt the user to run `/ruflo-upgrade`.

1. **Clone the latest DannFlow** to a temp directory:
   ```bash
   git clone --depth 1 https://github.com/Danncode10/DannFlow.git /tmp/dannflow-latest
   ```

2. **Ask the user what they want to update** (unless `--all` is passed).
   Show menu:
   ```
   ✅ .claude/        (commands, CLAUDE.md, SKILLS.md, skill packs)
   ✅ Shell scripts   (install.sh, guide.sh)
   ✅ npm scripts     (package.json scripts)
   ✅ Docs            (README.md sections, dannflow_docs/)
   ```
   Default: all checked. User can uncheck any category.

3. **For each selected category, show a diff:**

   **A) .claude/ updates:**
   - Diff `.claude/commands/` → show new, changed, deleted commands
   - Diff `.claude/CLAUDE.md` → show changes to project config
   - Show which skill packs are new/updated
   - Ask: "Merge .claude/ updates?" (yes/no)

   **B) Shell scripts:**
   - Diff `install.sh` and `guide.sh` against latest
   - Highlight new features (e.g., "guide.sh now has ./guide.sh skills-update")
   - Ask: "Update install.sh and guide.sh?" (yes/no)

   **C) npm scripts:**
   - Show new scripts being added (e.g., `npm run setup`, `npm run setup:env`, etc.)
   - Merge into package.json intelligently (preserve user-defined scripts)
   - Ask: "Add new npm scripts?" (yes/no)

   **D) Docs:**
   - Diff README.md → show new sections (e.g., Windows Setup, Quick Reference updates)
   - Offer to merge dannflow_docs/ changes (new files, updated tutorials)
   - Ask: "Update README and docs?" (yes/no)

4. **Merge all approved updates:**
   - Copy files from `/tmp/dannflow-latest/` into the project
   - For `.claude/CLAUDE.md`, `.env.example`, `package.json`: use smart merge (show conflicts, ask user to resolve)
   - Preserve user edits to `src/`, `.env.local`, custom commands, and project-specific config

5. **Generate a single commit** with a clear summary:
   ```bash
   git add .claude/ install.sh guide.sh package.json README.md docs/ 2>/dev/null || true
   git commit -m "chore(dannflow): update to latest version
   
   Updated:
   - .claude/: 3 new commands, 2 updated, 5 new skill packs
   - Shell scripts: guide.sh + install.sh enhancements
   - npm scripts: added npm run setup and helpers
   - Docs: Windows setup guide, updated tutorial
   
   Review changes with: git diff HEAD~1
   Revert with: git reset --hard HEAD~1"
   ```

6. **Report what changed:**
   ```
   ✅ Update complete!
   
   .claude/ updates:
     New commands: /init-update, /new-feature
     Updated: /checkpoint (better error handling)
     New skill packs: claude-api, shadcn, a11y-audit
   
   Shell script improvements:
     install.sh: now supports PowerShell
     guide.sh: added skills-update, vibe-check commands
   
   npm scripts added:
     npm run setup          (one-command setup for Windows)
     npm run setup:env      (cross-platform .env.local init)
     npm run setup:ruflo    (Ruflo global + project init)
     npm run setup:skills   (install all 8 skill packs)
   
   Docs updated:
     README.md: Windows Setup guide added
     docs/dannflow_docs/: 2 new tutorials, 1 updated
   
   Next: Review the commit, test with npm run dev, then git push.
   ```

**Output on failure:**
- If git clone fails: "❌ Failed to fetch latest DannFlow. Check your internet connection."
- If merge conflicts arise: "⚠️  Conflicts detected in [file]. Manually resolve or skip this file."
- If user cancels: "Update cancelled. No changes made."

**Notes:**

- **Comprehensive update:** Pulls new commands, guides, scripts, npm helpers, and docs—everything your old project needs to match the latest DannFlow
- **Preserves your work:** User code in `src/`, `.env.local`, custom env vars, and any personal config remain untouched
- **Reversible:** If your repo is clean before running, undo with `git reset --hard HEAD` if something breaks
- **Safe merging:** Shows all diffs before applying, asks permission for each category
- **Fastest path to modern DannFlow:** One command replaces manual edits across 5+ files
- Use `--all` to skip the menu and update everything at once (sensible defaults)
- Rerun anytime DannFlow releases new features
