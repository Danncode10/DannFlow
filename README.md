# 🚀 DannFlow (2026 Edition)

**The Claude Code-Optimized SaaS Starter.** Built for AI-assisted development with Claude Code, Cursor, or Antigravity — Next.js 15+, Supabase, Tailwind v4, Shadcn UI, with auth, dashboard, RLS-first design, and 34 built-in slash commands.

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
4. Installs Ruflo globally + registers its MCP server
5. Runs the Ruflo init wizard
6. Installs 8 skill packs (design, SEO, marketing, accessibility)
7. Runs `guide.sh init` to rebrand the project to your app name

**Windows?** Use WSL or Git Bash and run the same command. Or use the PowerShell version:
```powershell
powershell -ExecutionPolicy Bypass -Command "iex (irm https://raw.githubusercontent.com/Danncode10/DannFlow/main/install.ps1)"
```

---

## 🗺️ After Install — 5 Steps to Make It Yours

Run these **once** in Claude Code after the installer finishes:

```
1. Edit README.md          → describe YOUR project (Claude reads this first)
2. /init-claude            → rewrites CLAUDE.md + SKILLS.md to match your project
3. Fill PROJECT_CONTEXT.md → audience, stack decisions, design rules, anti-decisions
4. /ruflo-upgrade          → adds memory + parallel-agent patterns to commands
5. /no-conflict            → verify docs and code are in sync
```

Then start building:
```bash
npm run dev
```

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

# 2. Label DannFlow as "upstream" (where updates come from)
git remote rename origin upstream

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

Every promotion runs the CI check (`.github/workflows/ci.yml`), so nothing reaches `main` un-tested. `/sync-upstream` respects this — synced changes land on a `feat/sync-*` branch and open a PR into `dev`, never straight onto `main`. DannFlow itself stays on `main`-only (no `dev`) so the template is always green.

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

Never let your AI guess about your database schema. Run this loop:

```bash
# Before risky schema changes
npm run checkpoint      # snapshots live schema → supabase/backups/

# After any schema change
npm run update-types    # regenerates src/types/supabase.ts from live DB

# Verify before committing
/review                 # lint + typecheck + guardrail check
```

**Session starter prompt** (paste this to Claude at the start of every session):
```
Read CLAUDE.md before doing anything. Confirm my Supabase MCP is
connected by listing all tables in the public schema, and check that
src/types/supabase.ts is up to date with the live schema.
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
| Rate limiting | Optional (Upstash Redis — deferred to Phase 8+) |
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

supabase/
└── backups/          # Schema snapshots from npm run checkpoint

.claude/
├── commands/         # 34 DannFlow slash commands
├── agents/           # Ruflo agent definitions
├── skills/           # Installed skill packs
└── settings.json     # Ruflo hook wiring
```

---

## ⚡ Slash Commands

Run `./guide.sh commands` to see all 34 commands. Key ones:

| Command | When to use |
|---|---|
| `/ask-command <intent>` | Don't know which command? This routes you. |
| `/init-claude` | Tailor CLAUDE.md + SKILLS.md to your project |
| `/make-command <name>` | Create a new slash command |
| `/adopt-dannflow` | Bootstrap a non-DannFlow repo: CI + dannflow.json + dev branch, then sync |
| `/sync-upstream` | Pull selective updates from the parent template (PRs into `dev`) |
| `/checkpoint` | Snapshot DB before risky schema changes |
| `/sync-types` | Regenerate types after schema changes |
| `/new-feature <name>` | Scaffold service + page + form |
| `/review` | Pre-commit lint + typecheck + guardrail check |
| `/commit` | Stage + draft conventional commit message |
| `/rls-check` | Audit RLS policies for missing tenant filters |

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
| [docs/dannflow_docs/backups-and-sync.md](docs/dannflow_docs/backups-and-sync.md) | Checkpoint + sync-types loop |
| [docs/dannflow_docs/ui-system.md](docs/dannflow_docs/ui-system.md) | Semantic tokens + UI standards |

---

*Built for speed. Structured for Agents. Optimized for the Vibe.*
