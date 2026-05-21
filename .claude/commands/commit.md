---
description: Stages changes and drafts a conventional commit message based on what changed.
---

Create a git commit for the current changes.

**Procedure:**

1. **Run in parallel:**
   - `git status` (untracked + modified files — never use `-uall`)
   - `git diff` (unstaged)
   - `git diff --staged` (already staged)
   - `git log -5 --oneline` (to match repo's commit style)

2. **Analyze the changes:**
   - What's the dominant change type? (`feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`)
   - Is there a single coherent story, or multiple unrelated changes? If multiple, suggest splitting into separate commits and ask the user before lumping them.

3. **Safety filter:**
   - Do NOT stage `.env*` files, credentials, or anything matching obvious secret patterns
   - Do NOT use `git add -A` or `git add .` — stage files explicitly by name
   - If you see something that looks sensitive, stop and ask

4. **Draft the message** — conventional commit format, one-line subject, focused on the WHY:

   ```
   <type>: <short imperative subject under 70 chars>
   ```

   Examples that match this repo's style:
   - `feat: implement DannFlow Auth redesign with split layout, animations`
   - `fix: remove Github lucide icon (export not available in lucide-react version)`
   - `refactor: use Tailwind semantic tokens instead of hardcoded colors`

5. **Show the user** the staged files and the proposed message. Wait for confirmation unless the user said "just commit" in the invocation.

6. **Commit** using a HEREDOC for clean formatting:
   ```bash
   git commit -m "$(cat <<'EOF'
   <type>: <subject>
   EOF
   )"
   ```

7. **Verify** with `git status` and report the new commit hash.

**Hard rules:**
- Never `--amend` unless the user explicitly asks
- Never `--no-verify` unless the user explicitly asks
- Never push — that's a separate decision
- If a pre-commit hook fails, FIX the underlying issue and create a NEW commit. Don't bypass.
