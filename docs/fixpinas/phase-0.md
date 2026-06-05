# Phase 0 — Foundation & Auth Wiring

> **Goal:** Strip the DannFlow template content, confirm Supabase auth works for Fix Pinas, create the production Supabase project, and apply the baseline schema (just `profiles` and `reports` — enough to prove the pipeline).
>
> **Est. time:** 1 weekend
>
> **Blockers:** Need Supabase + Resend + Google Maps accounts ready before starting.

## Why this phase exists

The repo is still 90% generic SaaS template content (bookings, gallery, leads tabs). Before any Fix Pinas feature work, we need a clean slate that's still authenticated and Supabase-wired. We also want a *minimum* schema live so Phase 1 only deals with adding tables, never bootstrapping from zero.

## Pre-flight checklist

- [ ] Supabase account created
- [ ] Resend account created + domain verified (or use test sender for MVP dev)
- [ ] Google Cloud project with Maps JS + Geocoding APIs enabled
- [ ] `.env.local` populated with placeholders for: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `GOOGLE_MAPS_SERVER_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`

## Tasks

### 0.1 — Strip generic template content
- [ ] Delete `src/app/dashboard/leads/`, `pages/`, `team/`
- [ ] Delete `src/components/dashboard/tabs/{analytics,bookings,gallery,leads,services,settings}-tab.tsx`
- [ ] Keep `overview-tab.tsx` as starting point (will be replaced in Phase 2 with reports list)
- [ ] Delete `src/services/{bookings,gallery,leads,services,analytics,dashboard-stats,dashboard}.ts`
- [ ] Keep `src/services/{auth-server,auth,notifications,users}.ts` (auth + base utilities)

### 0.2 — Rebrand landing page
- [ ] Update `src/components/landing/hero.tsx` — Fix Pinas headline, civic tone
- [ ] Update `src/components/landing/how-it-works.tsx` — 4 steps: snap, locate, submit, track
- [ ] Delete `src/components/landing/pricing.tsx` (no pricing for civic app)
- [ ] Update `src/components/footer.tsx` — Fix Pinas branding
- [ ] Update `src/components/navbar.tsx` — Fix Pinas brand

### 0.3 — Create Supabase project
- [ ] Use Supabase MCP `list_organizations` → choose org
- [ ] `get_cost` → `confirm_cost` → `create_project` (name: "fix-pinas-prod" or similar)
- [ ] Copy project URL + anon + service role key into `.env.local`
- [ ] Run `npm run dev` and confirm app loads

### 0.4 — Baseline schema migration
- [ ] Create migration with:
  - `user_role` enum
  - `trust_tier` enum
  - `report_status` enum
  - `profiles` table (matching [schema.md](schema.md) but with `province_id` nullable for now since `provinces` doesn't exist yet)
  - `reports` table (without `province_id` / `municipality_id` / `category_id` FKs — those come in Phase 1; for now lat/lng + photo_url + status only)
  - `handle_new_user` trigger
  - `set_updated_at` trigger on profiles + reports
- [ ] Apply via Supabase MCP `apply_migration`
- [ ] Run `npm run checkpoint` to snapshot
- [ ] Run `npm run update-types` to regenerate `src/types/supabase.ts`

### 0.5 — Verify auth flow
- [ ] Sign up a test user via `/login`
- [ ] Verify `profiles` row was auto-created via trigger
- [ ] Confirm session persists across reload
- [ ] Confirm logout works

### 0.6 — Initial RLS
- [ ] Apply RLS policies for `profiles` and `reports` (basic version from [roles-and-rls.md](roles-and-rls.md) — user-only at this stage)
- [ ] Test from browser: can the test user read their own profile? Insert a report?

## Acceptance criteria

- [ ] Repo has zero references to generic SaaS features (bookings, gallery, leads, etc.)
- [ ] Landing page is Fix Pinas branded
- [ ] Supabase project live, `profiles` + `reports` tables exist
- [ ] User can sign up, log in, log out
- [ ] `profiles` row is created automatically on signup
- [ ] RLS blocks reading another user's profile when tested
- [ ] `supabase/backups/` has at least one timestamped DDL snapshot
- [ ] `src/types/supabase.ts` reflects the live schema

## Notes / decisions to record

- Confirm exact Supabase project name
- Confirm Resend sending domain
- Record Google Cloud project ID
- Note any RLS gotchas discovered while testing

## Next phase

→ [phase-1.md](phase-1.md) — Add the full schema (provinces, municipalities, agencies, categories) + seed reference data.
