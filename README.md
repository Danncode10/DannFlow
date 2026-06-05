# Fix Pinas

**Snap. Report. Fix.** — The national platform for reporting infrastructure and safety issues in the Philippines.

> Citizens snap a photo, pin the location, and Fix Pinas automatically routes the report to the right government agency.

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## What is Fix Pinas?

Fix Pinas is a national Philippines incident reporting platform. When you see a problem — exposed electrical wires, a broken road, flooding, a fire hazard — you can:

1. **Snap a photo** of the incident
2. **Pin the location** via GPS + Google Maps
3. **Pick the category** (electrical, road, flooding, etc.)
4. **Submit** — the system routes the report to the correct agency for your province automatically

No more wondering who to call. No more reports going nowhere.

---

## Roles

| Role | Description |
|---|---|
| `user` | Submit reports, track own reports, verify others' reports |
| `provincial_admin` | Manage reports within their assigned province |
| `admin` | Full access — all provinces, agencies, categories |

---

## Tech Stack

- **Framework**: Next.js 15+ (App Router), React 19
- **DB / Auth**: Supabase
- **Styling**: Tailwind CSS v4 + Shadcn/UI
- **Maps**: Google Maps JS API + Geocoding
- **Email**: Resend
- **SMS**: Semaphore PH (Phase 3+)
- **Storage**: Supabase Storage (photos)

---

## Project Docs

| Document | Purpose |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Claude Code config — read this first |
| [MASTERPLAN.md](MASTERPLAN.md) | Phased build plan |
| [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) | Audience, design rules, anti-decisions |
| [docs/fixpinas/](docs/fixpinas/) | Technical specs: schema, routing, RLS, anti-spam |

---

## Development Setup

```bash
npm install
cp .env.example .env.local
# Fill in Supabase + Google Maps keys in .env.local
npm run dev
```

**Before touching any code**, run the Zero-Hallucination loop:

```bash
npm run checkpoint    # snapshot live DB schema
npm run update-types  # regenerate src/types/supabase.ts
```

---

## Pilot Province

**Nueva Vizcaya** — agencies configured, `provincial_admin` active. Schema covers all 82 Philippine provinces from day one.

---

*Built with [DannFlow](https://github.com/Danncode10/DannFlow) — Next.js 15 + Supabase vibe-coding starter.*
