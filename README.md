# 🚀 DannFlow (2026 Edition)

**The AI-agent-optimized SaaS Starter.** Built for AI-assisted development with Claude Code, Codex, Cursor, or Antigravity — Next.js 16, Supabase, Tailwind v4, Shadcn UI, with auth, dashboard, RLS-first design, and a reusable command system.

> **Built for Speed. Structured for Agents. Optimized for the Vibe.**

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## ⚡ Quick Start

```bash
curl -sSL https://raw.githubusercontent.com/Danncode10/DannFlow/main/install.sh | bash
```

That's it. The installer:
1. Asks for your app name
2. Clones DannFlow into a new folder
3. Installs npm dependencies + `.env.local`
4. Installs Ruflo globally (run its init wizard separately when you choose to use Ruflo)
5. Installs 8 skill packs (design, SEO, marketing, accessibility)
6. Runs `guide.sh init` to rebrand the project to your app name

**Windows?** Use WSL or Git Bash and run the same command. Or use the PowerShell version:
```powershell
powershell -ExecutionPolicy Bypass -Command "iex (irm https://raw.githubusercontent.com/Danncode10/DannFlow/main/install.ps1)"
```

---

## 🗺️ Build Your SaaS — The Order

Follow these stages in order. Configure the **GitHub MCP** and **Supabase MCP** before Stage 2; they let the commands verify Supabase and connect your work to GitHub Projects. See [MCP setup](docs/dannflow_docs/mcp-setup.md).

> A command written as `/command` runs directly in Claude Code. In Codex, run the same command as `/claude-command command`.

1. Install DannFlow

   ```bash
   curl -sSL https://raw.githubusercontent.com/Danncode10/DannFlow/main/install.sh | bash
   ```

   This creates your local DannFlow project, installs dependencies, copies `.env.local`, and applies your app name. On Windows, use WSL or Git Bash with the same command, or the PowerShell command in [Quick Start](#-quick-start).

2. Describe and connect your SaaS — `/new-project`

   ```text
   /new-project
   ```

   This captures what you are building, updates the project identity and context, connects the GitHub repository and dedicated Supabase project, applies tracked database migrations, and verifies the database/types are ready.

3. Create your GitHub Project — Kanban/Board layout

   Create the Project yourself in GitHub. Use a Kanban/Board layout with these Status values: `Backlog`, `Ready`, `In progress`, and `Done`.

   This is the visual execution board for real task Issues. DannFlow does not create a Project or use draft cards for you.

4. Initialize the masterplan — `/masterplan-init`

   ```text
   /masterplan-init
   ```

   This detects that `/new-project` has finished, finds and connects your existing GitHub Project, creates a detailed Phase 0 in `MASTERPLAN.md`, and syncs each Phase 0 task as a real GitHub Issue on the board. It stops and tells you what to create if it cannot find a suitable Kanban Project.

5. Expand future phases — `/make-masterplan`

   ```text
   /make-masterplan Phase 1
   ```

   Use this only when you are ready to plan the next phase. It expands Phase 1 (then Phase 2 through Phase X as needed) without overwriting the completed or active work in Phase 0.

After Stage 4, run `/what-task` to select the first Phase 0 task.

For the dashboard settings, verification checks, and deployment handoff that
complete Phase 0, follow the [Phase 0 setup handover runbook](docs/dannflow_docs/phase-0-setup-handover.md).

Then start development:
```bash
npm run dev
```

### Database setup for contributors

DannFlow keeps Supabase as the database/auth layer. Database schema is authored in TypeScript with Drizzle:

```text
db/schema/*.ts
```

Generated SQL migrations live in:

```text
db/migrations/*.sql
```

For a fresh local clone:

```bash
pnpm install
cp .env.example .env.local
pnpm db:setup
pnpm dev
```

`pnpm db:setup` starts local Supabase, applies `db/migrations/`, and regenerates `src/types/supabase.ts` from the local database. Hosted projects can use `pnpm db:types:remote` after setting `SUPABASE_PROJECT_ID` in `.env.local`.

When you change `db/schema/*.ts`:

```bash
pnpm db:generate add_profiles_table
pnpm db:migrate
```

`pnpm db:generate` writes SQL into `db/migrations/`. `pnpm db:migrate` applies those migrations to Supabase with `DATABASE_URL` and refreshes remote types.

**Want Claude to design the whole site for you?** Your detailed Phase 0 will direct you to **`/design-project`** at the right point. It reads your `README`, `PROJECT_CONTEXT`, and code configuration, then designs and builds a bespoke project.

---

## Codex Workflow

DannFlow keeps the existing `.claude/commands/` library as the command source of
truth and adds a thin `.codex/` compatibility layer for Codex.

Use Codex commands like this:

```text
/claude-command <claude-command> [arguments]
```

Examples:

```text
/claude-command ui src/components/BillingForm.tsx
/claude-command new-feature billing
/claude-command sync-upstream --commits 3
```

If you do not know which command fits, ask Codex to route it:

```text
/ask-claude-command make the pricing page responsive and review it
```

Codex will read `AGENTS.md`, load the exact matching `.claude/commands/*.md`
prompt, replace `$ARGUMENTS`, and translate Claude-only concepts such as Ruflo
memory, Claude hooks, and swarms using `.codex/context/claude-compatibility.md`.

---

## 🔗 Template Chain (Build Your Own Templates)

DannFlow is designed to be **forked into specialized templates**. Each template inherits from its parent and can sync updates back up the chain.

```
DannFlow  (core SaaS framework)
    ↓
business-template  (your reusable client template)
    ↓
restaurant-website  (a specific client project)
```

**Create a template from DannFlow:**
```bash
# 1. Clone DannFlow as a starting point
git clone https://github.com/Danncode10/DannFlow.git my-template
cd my-template

# 1a. Record the installed template revision for future safe syncs
DANNFLOW_COMMIT=$(git rev-parse HEAD)
DANNFLOW_SYNCED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
printf '{\n  "dannflow_commit": "%s",\n  "synced_at": "%s",\n  "repo": "https://github.com/Danncode10/DannFlow",\n  "base_branch": "main",\n  "dev_branch": "dev"\n}\n' "$DANNFLOW_COMMIT" "$DANNFLOW_SYNCED_AT" > dannflow.json

# 2. Label DannFlow as "upstream" (where updates come from)
git remote rename origin upstream
git remote set-url --push upstream DISABLED

# 3. Create your own GitHub repo and set it as origin
git remote add origin https://github.com/YOUR_USERNAME/my-template.git
git push -u origin main
```

**Already have a repo that *didn't* start from DannFlow?** Adopt it in one command:
```bash
/adopt-dannflow   # installs CI, creates the dannflow.json anchor + dev branch, then syncs
```

**Sync updates from the parent later:**
```bash
/sync-upstream   # pulls selective updates from upstream into your project
```

`/sync-upstream` only touches safe files (commands, docs, scripts) — never your app code.

### Clean by default: the `feat → dev → main` flow

Adopted projects get a branch flow that keeps `main` always shippable:

```
feat/*  →  dev  →  main
  prep      test    release
```

Every promotion runs the CI check (`.github/workflows/ci.yml`), so nothing reaches `main` un-tested. `/sync-upstream` always creates a `feat/sync-*` branch and targets the configured project base branch (normally `main`); it never pushes synced files straight onto that branch. DannFlow itself stays on `main`-only (no `dev`) so the template is always green.

→ Full details in [docs/dannflow_docs/branching-and-sync.md](docs/dannflow_docs/branching-and-sync.md).

---

## 🧠 Ruflo Setup (Beta)

Ruflo gives Claude Code persistent memory, an MCP server, and swarms/hooks/agents per project.

**The installer handles this automatically.** If setting up manually:

```bash
# 1. Global install (once per machine)
npm install -g ruflo@latest
claude mcp add ruflo -- npx ruflo@latest mcp start

# 2. Per-project init (in each repo)
npx ruflo@latest init wizard
```

> ⚠️ Ruflo is pre-1.0 — APIs may shift. Always install `ruflo@latest`.

**What the wizard adds to your repo:**

| Location | Purpose | Commit? |
|---|---|---|
| `.claude-flow/config.yaml`, `agents/`, `hooks/`, `workflows/` | Ruflo project config | ✅ Yes |
| `.claude-flow/data/`, `logs/`, `sessions/`, `metrics/` | Runtime state | ❌ Gitignored |
| `.claude/agents/`, `.claude/skills/`, `.claude/helpers/` | Agents + skills + hook handler | ✅ Yes |
| `.claude/settings.json` | Hook wiring into Claude Code | ✅ Yes |

---

## 🎨 Skill Packs (Auto-Installed)

The installer ships 8 skill packs across 3 categories:

**Design Taste**
| Pack | What it adds |
|---|---|
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 12 design skills — minimalist UI, high-end visual design, redesign guidance |
| [emilkowalski/skill](https://github.com/emilkowalski/skill) | Animation + micro-interaction craft (pairs with Framer Motion) |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 27 UI anti-pattern rules + `npx impeccable detect` CLI ⚠️ Medium risk |

**Code Quality**
| Pack | What it adds |
|---|---|
| `anthropics/claude-api` | Anthropic SDK guidance — prompt caching, tool use, model IDs |
| `shadcn/ui` | Official Shadcn component docs + composition patterns |
| `alirezarezvani/a11y-audit` | WCAG 2.2 scanning + fixes for React/Next.js |

**SEO + Marketing**
| Pack | What it adds |
|---|---|
| `coreyhaines31/marketingskills` | 30+ skills — SEO, copywriting, CRO, pricing, launch, ads, emails |
| `addyosmani/web-quality-skills` | Technical SEO + Core Web Vitals (from Google Chrome team) |

**Update all packs:**
```bash
./guide.sh skills-update
```

---

## 🔑 Environment Variables

Copy `.env.example` → `.env.local` and fill in:

```env
# Supabase — Project Settings > Data API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Site Branding
NEXT_PUBLIC_SITE_NAME=YourAppName
NEXT_PUBLIC_SITE_URL=https://yourapp.vercel.app
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername

# Rate Limiting (Upstash Redis) — console.upstash.com
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AAAx...
```

---

## 🗃️ Database Workflow (Zero-Hallucination Loop)

Never let your AI guess about your database schema. Schema changes start in `db/schema/*.ts` and flow through reviewed SQL:

```bash
# Edit schema
$EDITOR db/schema/*.ts

# Generate and review SQL
pnpm db:generate        # writes db/migrations/*.sql

# Apply to Supabase and refresh generated app types
pnpm db:migrate         # applies db/migrations/ + refreshes src/types/supabase.ts

# Before risky/destructive work
pnpm checkpoint         # snapshots live schema → supabase/backups/

# Verify before committing
/review                 # lint + typecheck + guardrail check
```

**Session starter prompt** (paste this to Claude at the start of every session):
```
Read CLAUDE.md before doing anything. For schema changes, edit
db/schema/*.ts first, generate SQL with pnpm db:generate, then apply
with pnpm db:migrate. Use Supabase MCP only to read, verify, checkpoint,
or inspect the live project.
```

---

## 🏗️ What's Included

| Feature | Location |
|---|---|
| Auth (login, signup, forgot/reset password) | `src/app/login/`, `forgot-password/`, `reset-password/` |
| Protected Dashboard | `src/app/dashboard/` |
| Profile + Security Settings | `src/components/profile-form.tsx`, `security-form.tsx` |
| GitHub Repos Tab | `dashboard-shell.tsx` — paginated, 5/page |
| TanStack Query caching | `src/hooks/` |
| Toast notifications | Sonner — global |
| Rate limiting | Upstash Redis helper for production-sensitive paths |
| RLS-first service layer | `src/services/` |

---

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages (Server Components by default)
├── components/       # UI components (Shadcn-based)
├── services/         # ⚡ ALL business logic + Supabase queries live here
├── lib/config.ts     # Central config — siteConfig + creatorRepos
├── types/supabase.ts # Auto-generated — never edit manually
└── utils/supabase/   # Supabase client helpers

db/
├── schema/           # Drizzle schema source of truth
├── migrations/       # Generated/reviewed SQL migrations
└── migrate.ts        # Applies migrations with DATABASE_URL

supabase/
└── backups/          # Live schema snapshots from pnpm checkpoint

.claude/
├── commands/         # 34 DannFlow slash commands
├── agents/           # Ruflo agent definitions
├── skills/           # Installed skill packs
└── settings.json     # Ruflo hook wiring

.codex/
├── commands/         # Codex commands that load .claude command prompts
├── context/          # DannFlow + Claude compatibility notes for Codex
└── adapters/         # Command-loading contract
```

---

## ⚡ Slash Commands

Run `./guide.sh commands` or read `.claude/commands/README.md` to see the core
DannFlow commands. The repository also includes additional command packs under
`.claude/commands/`. Key ones:

| Command | When to use |
|---|---|
| `/ask-command <intent>` | Don't know which command? This routes you. |
| `/init-claude` | Tailor CLAUDE.md + SKILLS.md to your project |
| `/make-command <name>` | Create a new slash command |
| `/adopt-dannflow` | Bootstrap a non-DannFlow repo: CI + dannflow.json + dev branch, then sync |
| `/sync-upstream` | Pull selective updates from the parent template (hash-named branch → configured base branch) |
| `/checkpoint` | Snapshot DB before risky schema changes |
| `/sync-types` | Regenerate Supabase types when needed |
| `/migrate` | Edit `db/schema/*.ts`, generate SQL, apply with `pnpm db:migrate` |
| `/new-feature <name>` | Scaffold service + page + form |
| `/review` | Pre-commit lint + typecheck + guardrail check |
| `/commit` | Stage + draft conventional commit message |
| `/rls-check` | Audit RLS policies for missing ownership or admin authorization |

### Running Claude commands from Codex

Use the Codex bridge instead of duplicating command files:

```text
/claude-command <command> [arguments]
```

For example, `/claude-command sync-upstream` loads
`.claude/commands/sync-upstream.md` and runs it under Codex with DannFlow's
agent guardrails.

---

## 🚀 Deploy to Vercel

1. Push your repo to GitHub
2. Import into [vercel.com](https://vercel.com) → add all `.env.local` vars as Environment Variables
3. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain (needed for password reset links)
4. In Supabase → Auth → URL Configuration → add your Vercel URL to **Redirect URLs**
5. Deploy

---

## 📚 Docs

| Doc | What it covers |
|---|---|
| [docs/dannflow_docs/claude-workflow.md](docs/dannflow_docs/claude-workflow.md) | **START HERE** — daily loop, all 34 commands |
| [docs/dannflow_docs/methodology.md](docs/dannflow_docs/methodology.md) | Vibe Coding + Zero-Hallucination philosophy |
| [docs/dannflow_docs/the-holy-trinity.md](docs/dannflow_docs/the-holy-trinity.md) | Types + Schema + Services model |
| [docs/dannflow_docs/mcp-setup.md](docs/dannflow_docs/mcp-setup.md) | Supabase + GitHub MCP setup |
| [docs/dannflow_docs/branching-and-sync.md](docs/dannflow_docs/branching-and-sync.md) | **Branch flow** (feat→dev→main), CI gate, adopt/sync/contribute model |
| [docs/dannflow_docs/updating-old-projects.md](docs/dannflow_docs/updating-old-projects.md) | Bring an **old DannFlow project** current — bootstrap new commands, then upgrade |
| [docs/dannflow_docs/backups-and-sync.md](docs/dannflow_docs/backups-and-sync.md) | Checkpoint + sync-types loop |
| [docs/dannflow_docs/ui-system.md](docs/dannflow_docs/ui-system.md) | Semantic tokens + UI standards |

---

*Built for speed. Structured for Agents. Optimized for the Vibe.*
