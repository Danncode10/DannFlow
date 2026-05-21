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

Then output exactly this format — nothing else, no preamble:

```
Best match: /<command-name>
Copy-paste this:
  /<command-name> <suggested args if applicable>

Why: <one sentence on why this fits>

Alternatives:
  /<other-command> — <one-line reason>
  /<other-command> — <one-line reason>
```

If no command fits well, say so plainly and suggest the closest match plus what a new command might be called. Don't invent commands that don't exist in `.claude/commands/`.
