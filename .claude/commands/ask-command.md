---
description: Meta-router. Describe what you want; returns the best custom command + a ready-to-paste prompt.
argument-hint: <plain-english description of what you want>
---

The user's goal: **$ARGUMENTS**

## Step 1 — Read available commands

Run `ls .claude/commands/` and read the `description:` frontmatter of every `.md` file except `README.md` and this file. Do NOT read full bodies — descriptions are enough.

## Step 2 — Plan the best approach

Figure out:
- Which command(s) best cover the goal
- Whether multiple commands should be chained (e.g. `/new-feature` → `/ui` → `/review`)
- What arguments or context the user should provide

## Step 3 — Output a ready-to-paste prompt

Your ONLY output is the prompt block below. Nothing before it, nothing after it — no explanations, no meta-commentary. The user will copy this and paste it directly into Claude.

The prompt must:
- Be written in **paragraph form**, not bullet points
- Use **imperative voice** directed at Claude ("Read...", "Run...", "Scaffold...")
- Reference the correct slash command(s) by name so Claude executes them
- Chain commands when the task benefits from it (e.g. build, then make responsive, then review)
- Include concrete specifics inferred from what the user described — don't leave vague placeholders
- Be detailed enough that Claude needs zero clarification to start
- Feel like a senior developer briefing a teammate, not a help-desk ticket

Output format — output ONLY this, nothing else:

---
**Prompt:**

```
<The ready-to-paste prompt here. Paragraph form. Multiple paragraphs if the task is multi-step. Include the slash command(s) inline where appropriate. Be specific and detailed.>
```
---

## If no command fits

If no existing command covers the goal well, output:

---
**Prompt:**

```
Run /make-command "<one-sentence description of the new command needed>". <2–3 sentences explaining what the command should do, what files it should touch, and what output format it should produce — so that /make-command has enough context to scaffold it correctly.>
```
---
