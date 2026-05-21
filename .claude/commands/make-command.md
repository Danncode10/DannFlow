---
description: Creates a new custom slash command from a plain-English description. Auto-updates claude-workflow.md tables and proposes conflict-avoidance edits to existing commands, CLAUDE.md, or SKILLS.md when needed.
argument-hint: <plain-english description of what the new command should do>
---

The user wants a new custom command: **$ARGUMENTS**

## Step 1 — Understand the request

Parse `$ARGUMENTS` to figure out:
- **What the command should do** (the action)
- **Whether it takes arguments** (e.g. "for a single table" → takes `<table>`)
- **Which category it fits**: Discovery & setup / Security & quality / Supabase workflow / Scaffolding / Housekeeping (these are the categories in `docs/dannflow_docs/claude-workflow.md`). If none fit, propose a new category.

If the request is too vague to act on, ask ONE clarifying question (e.g. "Should this scan only `src/` or the whole repo?") then proceed.

## Step 2 — Pick a name

Generate a short, descriptive, kebab-case name. Rules:
- 1–2 words, ≤16 chars
- Verb-led or noun-led (e.g. `audit-deps`, `stripe-check`, `gen-types`) — match the style of existing commands
- Must not collide with an existing file in `.claude/commands/`
- Don't shorten arbitrarily — `/security-audit` not `/sec`

## Step 3 — Check for conflicts

List `.claude/commands/*.md` and read each frontmatter `description:`. Look for:

- **Duplicate scope** — does an existing command already do this? If yes, suggest *editing the existing command* instead of creating a new one. Show the user the existing command's description and ask which they want.
- **Overlapping responsibility** — e.g. user wants `/check-rls` but `/rls-check` already exists. Propose merging or clarifying boundaries.
- **CLAUDE.md guardrail collision** — does the new command contradict an existing rule? (e.g. user wants `/use-any` but CLAUDE.md says "never use `any`"). Flag this loudly and ask before proceeding.

## Step 4 — Draft the command file

Build the file content with this exact structure:

```markdown
---
description: <one-line summary, used by /ask-command for routing — be specific>
argument-hint: <args if applicable, omit field if no args>
---

<Focused prompt body. Sections to consider including:>

## Procedure
1. <step>
2. <step>

## Output format
<show exactly what the command should output>

## Constraints
- <hard rules>
```

Body rules:
- Match the voice of existing commands — direct, opinionated, no fluff
- Specify the **exact output format** the command should produce
- Include **hard constraints** (e.g. "do NOT modify code, report only" or "always ask before deleting")
- Reference project conventions where relevant (RLS, services layer, semantic tokens, etc.)

## Step 5 — Identify ripple effects

Determine what else needs updating:

1. **`docs/dannflow_docs/claude-workflow.md`** — ALWAYS update. Add the new command to the appropriate category table under "## The full command list" and the "When to use what" section if it fits a workflow there.

2. **`CLAUDE.md`** — update ONLY IF the new command introduces a new guardrail or workflow not already documented (e.g. adding `/stripe-check` for a project that just added Stripe → add a "Payments" section to CLAUDE.md).

3. **`SKILLS.md`** — update ONLY IF the new command makes an existing skill recommendation stale or suggests a new skill (e.g. command involves payment processing → maybe recommend a Stripe-related skill).

4. **`.claude/commands/README.md`** — update the command table.

5. **Other command files** — update ONLY IF this new command overlaps or supersedes them. Either narrow the scope of the existing command or note the relationship in its body.

6. **`./guide.sh commands`** — NO ACTION NEEDED. It reads `.claude/commands/` at runtime and picks up new files automatically.

## Step 6 — Show the plan and confirm

Output:

```
📋 Proposed new command: /<name>

Description: <one-liner>
Arguments: <args or "none">
Category: <category>

Will create:
  .claude/commands/<name>.md

Will update:
  📝 docs/dannflow_docs/claude-workflow.md
     - Add /<name> to <category> table
     - <other changes>

  📝 .claude/commands/README.md
     - Add /<name> to command table

  [conditional sections — only show if relevant]
  📝 CLAUDE.md
     - <change>

  📝 SKILLS.md
     - <change>

  📝 .claude/commands/<other-command>.md
     - <reason — e.g. narrow scope to avoid overlap>

Conflicts detected:
  - <conflict and resolution, or "None">

Proceed? (y/n)
```

Skip the confirmation only if the user wrote "go" / "yes" / "just do it" in their original invocation.

## Step 7 — Apply the changes

Write the new command file, then apply each ripple-effect edit. Use `Edit` for surgical changes to existing files (don't rewrite whole files).

## Step 8 — Report

```
✅ Command created: /<name>

Files changed:
  + .claude/commands/<name>.md
  ~ docs/dannflow_docs/claude-workflow.md
  ~ .claude/commands/README.md
  [list any other changes]

Try it now:
  /<name> <example-args>

Suggested commit: feat(claude): add /<name> command for <purpose>
```

## Hard rules

- Never create a command that contradicts a non-negotiable guardrail in CLAUDE.md (RLS, semantic tokens, service layer) without explicit user override
- Never overwrite an existing command file silently — always show the plan
- Always preserve the project's voice and structure when editing docs
- Never `git add` or `git commit` — leave that for the user or `/commit`
