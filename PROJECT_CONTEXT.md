# Project Context — Fix Pinas

> Read by Claude, skills, and commands before they act on this project.
> Update whenever the product direction changes.

---

## What this app is

**App name:** Fix Pinas

**One-liner:** A national Philippines incident reporting platform where citizens snap a photo, pin the location, and the system routes the report to the correct government agency automatically.

**The problem it solves:**
When Filipinos encounter infrastructure problems — broken roads, exposed electrical wires, flooding, fire hazards — there is no central, accessible way to report them to the right agency. People don't know who to call, reports get lost, and agencies never hear about issues in their jurisdiction. Fix Pinas closes that gap with one app that figures out who to notify and does it for you.

---

## Target audience

**Primary user:** Filipino citizens on mobile (18–45), especially in provincial areas where infrastructure problems are common and underreported.

**What they care most about:**
- Submitting a report in under 60 seconds (photo + location + tap submit)
- Knowing their report actually went somewhere and wasn't ignored
- Seeing the status change (received → in progress → resolved)

**What they don't care about:**
- Complex account management or profile pages
- Dashboards with charts and analytics (that's for admins)
- Social features, likes, comments

**Secondary users:**
- `provincial_admin`: LGU or agency staff managing reports in their province — need a clean queue with filter/status controls
- `admin`: Super admin (initially just the developer) — manages provinces, agencies, categories

---

## Stack decisions

> Supplements CLAUDE.md. Only deviations from DannFlow defaults listed here.

- **Maps**: Google Maps JS API + Geocoding API — server-proxied via Next.js API route. Never expose API key client-side.
- **Email**: Resend (not SendGrid)
- **SMS**: Semaphore PH — Philippines-local, cheaper than Twilio. Phase 3+ only.
- **Photo storage**: Supabase Storage (not S3)
- **State**: TanStack Query only — no Zustand, no Redux
- **Auth**: Supabase email/password + phone OTP for verification. No social providers in MVP.
- **Rate limiting**: Upstash Redis (Phase 6+). Not in MVP — DB-level trust tier handles spam for now.
- **AI classification**: Claude Vision Haiku (Phase 4+). Photo category is user-selected manually in MVP.

---

## Design decisions

- **Mobile-first, camera-optimized**: Primary flow is on a phone. Forms are large, buttons are tall (h-14 minimum), map picker is full-screen.
- **Border radius**: `rounded-xl` for cards, `rounded-lg` for inputs — slightly softer than default
- **Spacing**: `p-6` / `gap-6` as base in main content. `p-4` only in compact list items.
- **Color mode**: Light mode primary. Dark mode is a nice-to-have, not MVP.
- **Tone**: Civic, clear, trustworthy. Not playful. Not corporate. Think gov.ph meets a well-designed app.
- **Report status colors**: `pending_review` → muted, `received` → blue, `in_progress` → amber, `resolved` → green, `rejected` → destructive

---

## Tone & voice

**Brand tone:** Clear, civic, and direct. Speaks to ordinary Filipinos, not tech people. Short sentences. Action-oriented. Filipino-English mix acceptable in UI copy (e.g., "I-report na" for CTA).

**What to avoid:** No government jargon. No legalese. No exclamation mark spam. No "revolutionary" or "game-changing" language.

---

## Anti-decisions

- **NOT building a mobile app** — PWA-capable web only for now. Reduces complexity.
- **NOT pre-seeding all 1,647 municipalities manually** — provinces seeded upfront (82 rows), municipalities populated via reverse geocoding at report submission time.
- **NOT using AI classification in MVP** — user picks category from dropdown. Claude Vision Haiku added in Phase 4 as a *suggestion*, never a blocker.
- **NOT building an agency login dashboard in MVP** — agencies are notified by email. Dashboard comes after agencies confirm they want it.
- **NOT using Twilio** — Semaphore PH is the SMS provider when we get there.
- **NOT adding analytics until Phase 5+** — focus is on the report loop, not metrics.
- **NOT supporting multi-province admins** — one `provincial_admin` account = one province. Keep RLS simple.

---

## Geographic scope

- **Schema**: Province-agnostic from day one. All 82 provinces seeded as reference data.
- **Pilot**: Nueva Vizcaya — agencies configured, `provincial_admin` account active.
- **National rollout**: Phase 5+, driven by agency partnerships and real usage data from the pilot.

---

## Current focus

**Status: Planning / Schema design phase.**

Next steps (in order):
1. Write `docs/fixpinas/` technical specs (schema, roles, routing, anti-spam)
2. Fill `MASTERPLAN.md` with phased plan
3. Create Supabase project + apply Phase 0 migrations
4. Build Phase 0: 2 tables, auth, report submission, email routing

---

*Last updated: 2026-06-05*
