---
description: Re-applies Ruflo-aware patterns (memory check preamble, parallel agent hints, memory postamble) to the 8 core DannFlow commands. Safe to re-run after /init-update overwrites them.
---

Re-apply Ruflo integration to the 8 DannFlow commands that benefit most from memory and parallel agents:

**Memory + parallel:** `/new-feature`, `/new-page`, `/security-audit`, `/seo-fix`, `/migrate`, `/review`, `/ui`, `/marketing-check`, `/seo-check`
**Parallel only:** `/seed`, `/cleanup`, `/auto-docs`
**Memory guard (pre-run safety):** `/init-update`

Run this when `/init-update` or `/init-claude` has regenerated those files and the Ruflo additions were lost. Also run after adding a new command that should be Ruflo-aware.

## Procedure

1. **Read each of the 5 target files** and detect whether they already contain the Ruflo patterns (look for "Check ruflo memory" or "spawn parallel agents"). Report which are already upgraded and which need the patch.

2. **Show the upgrade plan** before writing anything:

   ```
   📋 ruflo-upgrade plan

   Already Ruflo-aware (no changes):
     ✓ .claude/commands/migrate.md

   Will upgrade (if patterns missing):
     ~ .claude/commands/new-feature.md     — memory + parallel (service/page/component/types) + postamble
     ~ .claude/commands/new-page.md        — memory + parallel (multi-section pages)
     ~ .claude/commands/security-audit.md  — parallel by directory + save CRITICAL findings
     ~ .claude/commands/seo-fix.md         — memory + parallel per-route + save decisions
     ~ .claude/commands/review.md          — memory (conventions) + parallel (lint/typecheck/guardrails) + postamble
     ~ .claude/commands/ui.md              — memory (design decisions) + parallel (multi-component) + postamble
     ~ .claude/commands/seo-check.md       — memory (prior SEO decisions) + parallel per-route
     ~ .claude/commands/marketing-check.md — memory (brand voice) + parallel per-page
     ~ .claude/commands/seed.md            — parallel per-table for "all" case
     ~ .claude/commands/cleanup.md         — parallel scan (exports/components/services, routes/deps, backups/todos)
     ~ .claude/commands/auto-docs.md       — parallel per-scope (commands/skills/scripts/env/stack/structure)
     ~ .claude/commands/init-update.md     — memory guard: check customizations before overwriting

   Proceed? (y/n)
   ```

3. **After confirmation, apply surgical `Edit` calls** — add the three patterns to each file that needs it:

   **Preamble pattern** (Step 0, added before the first numbered step):
   > Check ruflo memory — search for any prior decisions related to `$ARGUMENTS` or its domain before writing code. Apply stored decisions rather than re-inventing them.

   **Parallel agents pattern** (added to the scaffolding/scan step where applicable):
   > Independent subtasks can be parallelized — spawn one agent per [service/section/route/directory]. Merge results at the end.

   **Memory postamble pattern** (added after the final report step):
   > Save key decisions to ruflo memory — one entry per distinct decision made during this run (library choices, schema shape, design direction, "why not" context).

4. **Verify** — re-read each patched file and confirm the three patterns are present and properly placed.

5. **Report:**

   ```
   ✅ ruflo-upgrade complete

   Files patched:
     ~ .claude/commands/new-feature.md
     ~ .claude/commands/new-page.md
     ~ .claude/commands/security-audit.md
     ~ .claude/commands/seo-fix.md

   Already up to date:
     ✓ .claude/commands/migrate.md

   The 5 commands will now:
     - Search ruflo memory before starting
     - Spawn parallel agents for independent subtasks
     - Save decisions to ruflo memory after completing

   Suggested commit:
     chore(claude): re-apply ruflo integration to core DannFlow commands
   ```

## Constraints

- **Plan-then-confirm** — never write without showing the plan first.
- **Surgical edits only** — use `Edit`, never rewrite the whole file. Preserve all existing command logic.
- **Idempotent** — if a pattern already exists in a file, skip it. Don't double-add.
- **Never touch** commands outside the 5 targets without explicit user instruction.
- Never `git add` or `git commit`.
