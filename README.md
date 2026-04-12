# 🚀 DannFlow (2026 Edition)

DannFlow is an open-source Next.js 15 & Supabase starter optimized for "Vibe Coding." It features my own "Zero-Hallucination" methodology—using npm run checkpoint and update-types to force AI agents to stay in sync with the live database schema. By providing the agent with a perfect snapshot of RLS policies, triggers, and types, it eliminates the guesswork that usually breaks AI-generated code. With a custom "Engineering Edge" UI and a tactical ./guide.sh CLI, it moves you from a blank terminal to a production-ready SaaS in minutes.
> **The High-Performance AI-Native SaaS Starter.** Built with TanStack caching, Mobile-First Bento UI, and designed strictly for Vibe Coding.


[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## Quick Start 

Boot up your project and set your App Name with a single command:

```bash
curl -sSL https://raw.githubusercontent.com/Danncode10/DannFlow/main/install.sh | bash
```

This automates the entire setup: clones the repo, installs dependencies, sets up environment variables, and interactive rebranding with a fresh Git history.

### The Initial Commit

The `./guide.sh init` command automatically handles rebranding and resets your Git history so you can start fresh. **Run it only once.**

If you prefer to do it manually:
```bash
rm -rf .git
git init
git add .
git commit -m "this projects initialized Dannflow"
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Supabase — Project Settings > Data API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Site Branding
NEXT_PUBLIC_SITE_NAME=YourAppName
NEXT_PUBLIC_SITE_URL=https://yourapp.vercel.app
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
```

---

## 🏗️ What's Included

| Feature | Location | Details |
|---|---|---|
| **Auth (Login / Signup)** | `src/app/login/` | Email + password via Supabase Auth |
| **Forgot Password** | `src/app/forgot-password/` | Sends reset email via Gmail SMTP |
| **Reset Password** | `src/app/reset-password/` | Session-guarded — handles expired links gracefully |
| **Dashboard** | `src/app/dashboard/` | Protected route, server-rendered |
| **PillTabs & Bento UI** | `src/components/` | Mobile-first smooth interfaces with Shadcn constraints |
| **Profile Settings** | `src/components/profile-form.tsx` | Full name, age, birthday, gender |
| **Security Settings** | `src/components/security-form.tsx` | Re-auth gate → change password |
| **Version Control Tab** | `dashboard-shell.tsx` | Paginated GitHub repos (5/page) |
| **Internal Docs Tab** | `dashboard-shell.tsx` | Live documentation for all features |
| **TanStack Query** | `src/hooks/` | Client caching + optimistic mutations |
| **Cursor Pagination** | `Dashboard > Database` | Infinite scroll via Intersection Observer |
| **Toast Notifications** | Global | Sonner — success, error, descriptions |
| **Gmail SMTP** | Supabase Auth settings | Free auth emails on any domain |

---

## 🎨 Personalize It (5 Steps)

### 1. Site name & branding
```
src/lib/config.ts  →  siteConfig.name / githubUrl / description
```
Or set env vars: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_GITHUB_URL`

### 2. Show YOUR GitHub repos
The **GitHub MCP** and **Version Control** tabs show repos from `creatorRepos` in `src/lib/config.ts`.

To replace them with your own, prompt your AI:
```
"Use the GitHub MCP to fetch all public repos for <your-github-username>,
 pick the 20 most interesting ones, and update the creatorRepos array
 in src/lib/config.ts. Each entry: { name, url, description }"
```

### 3. Favicon
Replace `src/app/favicon.ico` with your brand icon.

### 4. Color theme
Edit CSS variables in `src/app/globals.css` under `@theme`:
```css
--color-primary: #2563eb;   /* your brand blue */
--color-background: #ffffff;
```

### 5. Database schema
Run `npm run update-types` after any Supabase schema change to regenerate `src/types/supabase.ts`.

---

## 🔐 Security Features

### Password Recovery Flow
1. `/forgot-password` → triggers `resetPasswordForEmail` via Gmail SMTP
2. `/reset-password` → session-guarded (expired links show a "Link Expired" state, not a blank form)

### Re-authentication Gate
Changing your password in the Dashboard **requires your current password first**:
- Silent `signInWithPassword` → verify identity
- If passes → `updateUser` with new password
- Gmail sends a "Password Changed" notification email

### Password Visibility Toggles
All password inputs have Eye/EyeOff icons. Browser-native password reveal icons are suppressed globally via `globals.css` to prevent clash.

---

## 📧 Gmail SMTP Setup (Free Auth Emails)

No custom domain? No problem. Use Gmail SMTP instead of Supabase's default mailer:

1. Enable **2-Step Verification** on your Google account
2. Go to Google Account → Security → **App Passwords** → create a 16-char password
3. In Supabase Dashboard → **Auth → SMTP Settings**:
   - Host: `smtp.gmail.com`
   - Port: `465`
   - Username: your Gmail address
   - Password: the 16-char app password
4. In **Auth → Email Templates** — enable:
   - ✅ Reset Password
   - ✅ Password Change (for security notifications)

---

## 🗃️ Database Workflow

```bash
# After changing schema in Supabase
npm run update-types       # regenerates src/types/supabase.ts

# Before big changes — snapshots your live schema
npm run checkpoint         # saves to supabase/backups/schema-MM-DD-YYYY-HH-MM.sql
```

### Row Level Security
All queries respect RLS by default. Every service in `src/services/` includes `.eq('id', userId)` unless building a public endpoint.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Protected dashboard
│   ├── login/              # Auth pages
│   ├── forgot-password/
│   ├── reset-password/
│   └── globals.css         # Theme tokens + browser icon suppression
├── components/             # UI components
│   ├── dashboard-shell.tsx # Main dashboard with all tabs
│   ├── profile-form.tsx    # Profile settings form
│   ├── security-form.tsx   # Password change with re-auth
│   └── features-tabs.tsx   # Landing page feature showcase
├── services/               # Business logic (no UI code here)
│   ├── auth.ts             # Login, logout, updatePassword
│   ├── users.ts            # updateProfile
│   └── dashboard.ts        # Data fetching
├── lib/
│   └── config.ts           # ← CENTRAL CONFIG: siteConfig + creatorRepos
├── types/
│   └── supabase.ts         # Auto-generated — never edit manually
└── utils/
    └── supabase/           # Supabase client helpers
```

---

## 🤖 Vibe Coding Workflow (AI-Assisted Dev)

DannFlow follows the **Trinity Model**:

| Layer | What | Where |
|---|---|---|
| 👁️ **The Eyes** | TypeScript types mirroring your DB | `src/types/supabase.ts` |
| 📋 **The Blueprint** | SQL snapshots for disaster recovery | `supabase/backups/` |
| ⚡ **The Action** | Pure business logic, no UI leakage | `src/services/` |

### Daily loop:
```
1. npm run checkpoint          → save DB state
2. Describe feature to your AI → AI reads types + services
3. npm run update-types        → after any schema change
```

### MCP Agent Setup (Antigravity/Cursor/Claude)
DannFlow enforces the **AGENTS.md Standard**. When using AI tools:
1. Connect the **Supabase MCP** (for schema live reads).
2. Connect the **GitHub MCP** (for branch history and PRs).
3. Connect the **Terminal MCP** (for running `npm run checkpoint`).
4. **Always** point your AI to read `AGENTS.md` before it touches any code.

---

## 📚 Extended Documentation

| Doc | What it covers |
|---|---|
| [docs/methodology.md](docs/methodology.md) | Vibe Coding philosophy |
| [docs/the-holy-trinity.md](docs/the-holy-trinity.md) | Eyes, Blueprint, Action explained |
| [docs/mcp-setup.md](docs/mcp-setup.md) | Step-by-step MCP tool setup |
| [docs/backups-and-sync.md](docs/backups-and-sync.md) | Checkpoint & schema sync loop |
| [docs/production-features.md](docs/production-features.md) | Gmail SMTP, SEO, and Toasts |

---

## 🚀 Deploy to Vercel

1. Push your repo to GitHub
2. Import into [vercel.com](https://vercel.com) → add all `.env.local` vars as Vercel Environment Variables
3. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain (needed for password reset email links)
4. Deploy

> **Important:** Update Supabase → Auth → URL Configuration → add your Vercel URL to **Redirect URLs**.

---

*Built for speed. Structured for Agents. Optimized for the Vibe.*