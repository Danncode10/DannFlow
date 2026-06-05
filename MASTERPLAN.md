# MASTERPLAN — Fix Pinas

> **Last updated:** 2026-06-05
> **Status:** Planning → Phase 0 next
> **Owner:** Dann

A national Philippines incident reporting platform. Snap a photo → pin location → auto-route to the right agency. Pilot in Nueva Vizcaya. Schema covers all 82 provinces from day one.

---

## 📚 Technical Specs (read before building)

| Spec | What's in it |
|---|---|
| [docs/fixpinas/schema.md](docs/fixpinas/schema.md) | Full DB schema — tables, columns, enums, indexes, FKs |
| [docs/fixpinas/roles-and-rls.md](docs/fixpinas/roles-and-rls.md) | Role matrix + RLS policies per table |
| [docs/fixpinas/agency-routing.md](docs/fixpinas/agency-routing.md) | How a submitted report finds its agency (category × province) |
| [docs/fixpinas/anti-spam.md](docs/fixpinas/anti-spam.md) | Trust tiers, pending_review queue, rate limits, community verification |
| [docs/fixpinas/maps-integration.md](docs/fixpinas/maps-integration.md) | Google Maps + reverse geocoding flow (server-proxied) |
| [docs/fixpinas/notifications.md](docs/fixpinas/notifications.md) | Resend email templates + Semaphore SMS (Phase 3+) |

---

## 🗺️ Phases

Each phase has its own doc with tasks, acceptance criteria, and dependencies. Tick boxes here as phases complete.

### **PHASE 0 — Foundation & Auth Wiring** → [docs/fixpinas/phase-0.md](docs/fixpinas/phase-0.md)

**Goal:** Strip DannFlow template content, confirm auth works, create Supabase project, apply baseline schema (profiles + reports only).
**Est. time:** 1 weekend
**Status:** ⬜ Not started

- [ ] Strip generic SaaS dashboard tabs (leads, gallery, bookings, etc.)
- [ ] Rebrand landing page hero/CTA to Fix Pinas
- [ ] Create Supabase project, apply baseline migration (profiles + reports)
- [ ] Verify auth flow (signup → login → dashboard) end-to-end
- [ ] Run `npm run checkpoint` + `npm run update-types`

---

### **PHASE 1 — Full Schema + Reference Data** → [docs/fixpinas/phase-1.md](docs/fixpinas/phase-1.md)

**Goal:** Apply complete schema (provinces, municipalities, agencies, categories, verifications, notifications). Seed all 82 provinces. Seed Nueva Vizcaya agencies + categories.
**Est. time:** 1 week
**Status:** ⬜ Not started

- [ ] Apply full schema migration via Supabase MCP
- [ ] Seed `provinces` (82 rows from PSGC dataset)
- [ ] Seed `incident_categories` (8–10 starter categories)
- [ ] Seed Nueva Vizcaya `agencies` + `agency_categories`
- [ ] Apply RLS policies for all tables

---

### **PHASE 2 — Report Submission Flow (MVP loop)** → [docs/fixpinas/phase-2.md](docs/fixpinas/phase-2.md)

**Goal:** End-to-end report submission. User logs in → snaps photo → GPS pins location → picks category → submits → Resend emails the matched agency.
**Est. time:** 2 weeks
**Status:** ⬜ Not started

- [ ] `ReportForm` client component (camera + GPS + map picker + category)
- [ ] Supabase Storage bucket for photos with RLS
- [ ] `src/services/reports.ts` — create, list, get
- [ ] `src/services/agencies.ts` — lookup by province + category
- [ ] Server-proxied Google Maps reverse geocoding API route
- [ ] Resend email template + send on report insert
- [ ] User dashboard: list of own reports with status badges

---

### **PHASE 3 — Provincial Admin Dashboard** → [docs/fixpinas/phase-3.md](docs/fixpinas/phase-3.md)

**Goal:** `provincial_admin` role can view, filter, and update reports in their assigned province. Status transitions notify the reporter.
**Est. time:** 1 week
**Status:** ⬜ Not started

- [ ] Role-aware routing in `middleware.ts`
- [ ] `/admin/reports` page with filters (status, category, date)
- [ ] Status update action (received → in_progress → resolved/rejected)
- [ ] Resend notification to reporter on status change
- [ ] Manual `provincial_admin` provisioning (admin assigns province)

---

### **PHASE 4 — Anti-Spam & Trust System** → [docs/fixpinas/phase-4.md](docs/fixpinas/phase-4.md)

**Goal:** Stop spam at scale without hurting real users. Trust tiers, pending_review queue, phone OTP, rate limits.
**Est. time:** 1–2 weeks
**Status:** ⬜ Not started

- [ ] Phone OTP via Supabase Auth
- [ ] `trust_tier` on profiles (new / trusted / flagged)
- [ ] New users → reports default to `pending_review`
- [ ] `provincial_admin` approval flow → triggers agency email on approve
- [ ] Community verification ("I see this too" button)
- [ ] Per-user + per-location rate limits (DB-level or Upstash)

---

### **PHASE 5 — Super Admin + AI Suggestions** → [docs/fixpinas/phase-5.md](docs/fixpinas/phase-5.md)

**Goal:** `admin` panel to manage provinces, agencies, categories, users. Optional Claude Vision Haiku for category suggestion.
**Est. time:** 1–2 weeks
**Status:** ⬜ Not started

- [ ] `/superadmin` panel (CRUD for provinces, agencies, categories)
- [ ] User management (promote to `provincial_admin`, assign province)
- [ ] Claude Vision Haiku integration → category suggestion only (not a blocker)
- [ ] Audit log table (`audit_events`) for admin actions

---

## 🚀 Future Phases (Post-v1)

- [ ] Public report map / heatmap by province
- [ ] PWA install + offline-first photo queue
- [ ] SMS notifications via Semaphore PH
- [ ] Agency-facing dashboard (agencies log in directly)
- [ ] National expansion beyond Nueva Vizcaya
- [ ] DILG/LGU API integrations via PSGC codes
- [ ] Multilingual UI (Filipino / English / regional)

---

## 📌 Notes

- **Always run `npm run checkpoint` + `npm run update-types` before touching code** that depends on schema.
- **Schema is province-agnostic** — never hardcode `province_id` or province names in business logic. Reference [roles-and-rls.md](docs/fixpinas/roles-and-rls.md).
- **One phase at a time.** Don't pre-build Phase 4 in Phase 2.
- **The MVP loop is sacred:** snap → locate → route. Everything else is optional until that works in production with one real agency.
