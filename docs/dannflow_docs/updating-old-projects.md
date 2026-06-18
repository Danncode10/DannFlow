# Updating an Old DannFlow Project

Got a project that was built on an **older version of DannFlow** — one that doesn't have the newer commands (`/adopt-dannflow`), the `feat → dev → main` branch flow, or an up-to-date `/sync-upstream`? This guide gets it current.

> **Which guide do I need?**
> - Project **already is** a DannFlow project (built from the template) but is *behind* → **you're in the right place.**
> - Repo that was **never** a DannFlow project → see [branching-and-sync.md](branching-and-sync.md) and use `/adopt-dannflow`.

---

## The chicken-and-egg problem

A slash command can't install itself. If your old project doesn't have the new `/adopt-dannflow` or an up-to-date `/sync-upstream`, you can't just "run the new command" — it isn't there yet. So the **first step is always to get the latest command files in by hand**, then run them normally.

---

## Step 1 — Open the project and point it at DannFlow

```bash
cd ~/path/to/your-old-project
claude
```

Inside the session, check that DannFlow is set as `upstream`:

```bash
git remote -v
```

If there's **no `upstream`** line pointing to DannFlow, add it:

```bash
git remote add upstream https://github.com/Danncode10/DannFlow.git
```

---

## Step 2 — Pull in the latest command files (by hand)

This is the bootstrap step. Copy **only** the commands folder from DannFlow — nothing else:

```bash
git fetch upstream
git checkout upstream/main -- .claude/commands/
```

> ⚠️ **Copy `.claude/commands/` ONLY — never the whole `.claude/` folder.**
> The rest of `.claude/` is personal to your project:
>
> | Inside `.claude/` | Copy it? |
> |---|---|
> | `commands/` | ✅ Yes — the files you need |
> | `settings.json` | ❌ No — wires *your* hooks + permissions; overwriting can break them |
> | `agents/`, `skills/` | ⚠️ No — may hold project-specific or installed packs |
>
> Copying the whole folder can also **wipe any custom commands you wrote yourself**. The `git checkout` above touches only `commands/`, so your settings and custom files stay safe.

---

## Step 3 — Restart Claude Code

New command files only load on a **fresh start**. Close and reopen:

```bash
# exit the session, then
claude
```

Now the new commands (`/adopt-dannflow`, the updated `/sync-upstream`, etc.) actually exist in this project.

---

## Step 4 — Run the upgrade

You have two things to bring current: the **files** and the **setup**.

**a) Update the rest of the template files** (docs, scripts, blueprints):
```
/sync-upstream
```
This pulls everything new since your last sync. It works no matter how far behind you are — 3 changes or 300.

**b) Add the modern setup** (the part copying files alone doesn't give you — `dannflow.json` version anchor, CI workflow, the `dev` branch):
```
/adopt-dannflow --force
```
`--force` is made for exactly this: a project that's *already* a DannFlow project but predates the newer setup. It adds what's missing without starting over.

---

## The short version

```
copy commands/  →  restart claude  →  /sync-upstream  →  /adopt-dannflow --force
```

- **Copying `commands/`** gets you the *commands*.
- **Running them** gets you the *setup*.

You need both.

---

## If the old `/sync-upstream` chokes

Very old projects may have a sync command too outdated to run. That's fine — Step 2's `git checkout upstream/main -- .claude/commands/` replaces it with the current one. After the restart in Step 3, the new `/sync-upstream` is what runs.

---

## See also

- [branching-and-sync.md](branching-and-sync.md) — the full branch flow + adopt/sync model.
- `/adopt-dannflow`, `/sync-upstream`, `/update-dannflow` — the commands themselves.
