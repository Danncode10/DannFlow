---
description: Auto-rewrites CLAUDE.md, SKILLS.md, and .claude/commands/README.md to match the actual project state (README + src + package.json).
---

Re-bootstrap the Claude environment for this repo so it stays in sync with reality.

Do this in order:

1. **Read source-of-truth files:**
   - `README.md` — project pitch, features, structure
   - `package.json` — actual dependencies and scripts
   - `AGENTS.md` — cross-tool standard (for parity)
   - List `src/` recursively (one level deep is fine for top dirs) to confirm the structure
   - List `.claude/commands/*.md` and read their frontmatter descriptions

2. **Diff against current Claude config:**
   - Read current `CLAUDE.md`, `SKILLS.md`, `.claude/commands/README.md`
   - Identify drift: outdated tech stack entries, missing new commands, removed features, structural changes

3. **Show the user the planned changes** as a bullet list before writing. Wait for confirmation unless the user said "just do it" or similar in their original invocation.

4. **Rewrite the three files:**
   - `CLAUDE.md` — keep the existing structure (tech stack, guardrails, RLS, UI standards, semantic tokens, Supabase workflow, MCP requirements, code conventions). Update only what actually changed.
   - `SKILLS.md` — refresh skill recommendations based on what the project now does (e.g. add `claude-api` skill if AI features were added).
   - `.claude/commands/README.md` — regenerate the command table from current frontmatter descriptions.

5. **Report what changed** — concise diff summary, one bullet per file.

Rules:
- Don't invent stack items that aren't in `package.json`.
- Don't remove the non-negotiable rules (RLS, semantic tokens, services layer) unless the user explicitly asks.
- Preserve the tone of the existing files — direct, opinionated, no fluff.
