---
description: Update your DannFlow project to the latest version—pulls new commands, merges skill packs, and preserves your customizations.
argument-hint: "[--no-confirm]"
---

Update an older DannFlow project to the latest version without losing your work.

**What it does:**

1. Clones the latest `.claude/` directory from the main DannFlow repo to a temporary folder
2. Shows you a diff of what will change (new commands, updated SKILLS.md, etc.)
3. Merges updates into your project, preserving your customizations
4. Lists newly available skills and commands
5. Generates a commit ready to review

**Procedure:**

1. **Ask the user to confirm they want to update** their project. If `--no-confirm` is passed, skip the prompt.

2. **Clone the latest `.claude/` from the repo** to a temp directory:
   ```bash
   git clone --depth 1 https://github.com/Danncode10/DannFlow.git /tmp/dannflow-update
   cp -r /tmp/dannflow-update/.claude/commands /tmp/dannflow-update-commands
   ```

3. **Diff the commands** — show user which files are new, changed, or deleted:
   ```bash
   diff -r .claude/commands /tmp/dannflow-update-commands
   ```
   Print the diff in a readable format (color-coded: new in green, deleted in red, changed in yellow).

4. **Merge updated files** (preserve user edits to CLAUDE.md, SKILLS.md):
   - Copy all `.md` files from `/tmp/dannflow-update-commands/` into `.claude/commands/` EXCEPT:
     - `README.md` (regenerate from the new template if requested)
     - Skip any files user has marked as "do not overwrite"
   - If `.claude/CLAUDE.md` exists locally, diff it against the new version and show the user. Ask if they want to merge (often it auto-merges cleanly).
   - If `SKILLS.md` exists, parse it and add any new skill references from the updated version.

5. **Copy skill packs** (if `.claude/skills/` exists in the updated version):
   ```bash
   cp -r /tmp/dannflow-update/.claude/skills/* .claude/skills/ 2>/dev/null || true
   ```

6. **Update package.json scripts** (if the user's `npm run setup` is outdated):
   - Show the diff of new scripts
   - Ask: "Apply updated npm scripts?" (yes/no)
   - If yes, merge them carefully (don't overwrite user-defined scripts)

7. **Generate a commit** ready to review:
   ```bash
   git add .claude/
   git status
   ```
   Draft a commit message:
   ```
   chore(dannflow): update to latest commands, skills, and configuration
   
   Updated files:
   - New commands: [list]
   - Updated commands: [list]
   - New skill packs: [list]
   
   Review the diff in .claude/commands/ before merging.
   ```

8. **Cleanup** — remove temp directories:
   ```bash
   rm -rf /tmp/dannflow-update /tmp/dannflow-update-commands
   ```

9. **Report success** with a summary:
   ```
   ✅ Update complete!
   
   New commands available:
     - /command-1
     - /command-2
   
   Updated commands:
     - /command-3
   
   New skill packs registered:
     - skill-pack-1
   
   Next: Review .claude/commands/ diff, run /review, then git push.
   ```

**Output on failure:**
- If git clone fails: "❌ Failed to fetch latest DannFlow. Check your internet connection."
- If merge conflicts arise: "⚠️  Conflicts detected in [file]. Resolve manually or run: git checkout --theirs .claude/[file]"
- If user cancels: "Update cancelled. No changes made."

**Notes:**

- This command preserves user edits to CLAUDE.md, .env.local, and src/ — it only touches `.claude/`
- If your project is git-clean, the update is reversible: `git reset --hard HEAD` undoes it
- Rerun this command anytime to get the latest version
- For major version upgrades, always review CLAUDE.md changes — architecture may shift
