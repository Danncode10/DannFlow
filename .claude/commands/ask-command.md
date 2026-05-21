---
description: Meta-router. Describe what you want; returns the best custom command + a ready-to-paste prompt.
argument-hint: <plain-english description of what you want>
---

The user wants help finding the right custom command for this task: **$ARGUMENTS**

Do this:

1. Run `ls .claude/commands/` to list every command file.
2. For each `.md` file (except this one and `README.md`), read its frontmatter `description:` field. Do NOT read the full bodies — descriptions are enough for routing.
3. Match the user's intent against those descriptions. Pick the single best command.
4. Identify 1–2 alternatives or follow-up commands that compose well (e.g. `/new-page` → then `/ui` to make it responsive).

Then output in this format:

---

**Best match: `/<command-name>`**

```
/<command-name> <suggested args if applicable>
```

Write 2–4 sentences explaining why this is the right command for the task. Be specific — reference what the command actually does (from its description), how it maps to what the user asked for, and what the user should expect to happen when they run it. If the command takes arguments, explain what to put there and give a concrete example based on the user's request.

**Alternatives worth considering:**

`/<other-command>` — Write 1–2 sentences on what this one does differently and when the user would pick it over the best match. Make it clear why it's second and not first.

`/<other-command>` — Same format. Only include this if it genuinely composes well with the task (e.g. a follow-up step like running `/ui` after `/new-page`).

---

If no command fits well, say so in a short paragraph — explain what the closest command covers and where the gap is, then name what a new command could be called and suggest using `/make-command <description>` to create it. Don't invent commands that don't exist in `.claude/commands/`.
