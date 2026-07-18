---
name: "source-command-sync-commands"
description: "Scans .Codex/commands/ for orphaned commands missing from documentation or guide.sh. Identifies gaps and optionally auto-patches."
---

# source-command-sync-commands

Use this skill when the user asks to run the migrated source command `sync-commands`.

## Command Template

Scan the `.Codex/commands/` directory and cross-reference command metadata against `Codex-workflow.md` and `./guide.sh`. Identify any commands that exist on disk but are missing from these documentation/exposure sources, then produce a detailed report grouped by remediation type.

> **Scope: DannFlow-curated commands only.** Ruflo (`npx ruflo@latest init wizard`) installs ~60+ commands into subdirectories of `.Codex/commands/` (`agents/`, `analysis/`, `automation/`, `coordination/`, `github/`, `hive-mind/`, `hooks/`, `memory/`, `monitoring/`, `optimization/`, `sparc/`, `swarm/`, `workflows/`) plus three top-level files (`Codex-flow-help.md`, `Codex-flow-memory.md`, `Codex-flow-swarm.md`). These belong to a separate, Ruflo-managed namespace and **must be excluded** from this audit. They are not "orphans" and must never be reported as missing from DannFlow docs.

## Procedure

1. **Scan .Codex/commands/ directory (top level only)** — for each `.md` file directly in `.Codex/commands/`, extract the command name (filename without extension) and the `description:` field from YAML frontmatter.
   - **Exclude:** `README.md`, every subdirectory, and the three Ruflo files `Codex-flow-help.md`, `Codex-flow-memory.md`, `Codex-flow-swarm.md`.

2. **Cross-reference against Codex-workflow.md** — check if each command appears in one of the category tables (Discovery & setup, Security & quality, Supabase workflow, Scaffolding, Housekeeping). Note which commands are missing.

3. **Cross-reference against ./guide.sh** — run `grep -o "/[a-z-]*" ./guide.sh` to extract all exposed commands. Identify any `.md` commands not listed.

4. **Categorize gaps** — group findings by:
   - Missing from `Codex-workflow.md` only
   - Missing from `./guide.sh` only (rare — typically a guide.sh bug)
   - Missing from both (orphaned entirely)

5. **Generate report** — output a human-readable summary showing:
   - Total commands on disk vs. documented
   - Each gap with the command name, description, and required remediation
   - Suggested markdown entry (formatted for copy-paste into the appropriate category table)

6. **Optional auto-patch** — if the user passed `--fix`, read the current category assignments (from the command metadata or by inferring from description), then append the missing entries to the appropriate tables in `Codex-workflow.md`. Ask for confirmation before writing.

## Output format

```
📋 Command Documentation Audit

Total commands on disk: N
Total documented in Codex-workflow.md: M
Total exposed in guide.sh: K

Missing from documentation:
  - /command-name
    Description: <extracted from frontmatter>
    Suggested category: <inferred from purpose>
    Add to Codex-workflow.md: | `/command-name` | <description> |

Missing from guide.sh:
  (none found, or list any)

Orphaned entirely (missing from both):
  (none found, or list any)

Summary:
  ✓ All commands are documented and exposed
  OR
  ⚠ <N> gaps detected. Run /sync-commands --fix to auto-patch Codex-workflow.md

```

## Constraints

- Do NOT modify `.md` files in `.Codex/commands/` — this audit is read-only by default.
- Do NOT delete any commands — only report gaps.
- If `--fix` is passed, always ask for confirmation before writing to `Codex-workflow.md`. Show the exact insertions and the target location.
- Preserve the existing formatting of `Codex-workflow.md` (markdown table syntax, section headers, order).
- If a command's category is ambiguous, ask the user to clarify before patching.
