# Phase 2 — Report Submission Flow (MVP Loop)

> **Goal:** A logged-in user can submit a report end-to-end. The system routes it via [agency-routing.md](agency-routing.md) and emails the matched agency via Resend. The user sees their report in a list with its status.
>
> **Est. time:** 2 weeks
>
> **Blockers:** Phase 1 complete. Storage bucket + agencies seeded.

## Why this phase

This is **the MVP loop**: snap → locate → route → email. If this works for one province with one agency, the rest of the project is just scale and polish. Everything else is optional until this works in production.

## Tasks

### 2.1 — `src/services/reports.ts`
- [ ] `createReport(input: CreateReportInput): Promise<Report>` — inserts report, returns the row
- [ ] `getReportById(id: string)` — RLS-scoped
- [ ] `listReportsForUser(userId: string)` — own reports, ordered by `created_at desc`
- [ ] No agency-side logic here yet — that goes through `agencies.ts`

### 2.2 — `src/services/agencies.ts`
- [ ] `findAgenciesForReport(provinceId: string, categoryId: string)` — runs the routing query from [agency-routing.md](agency-routing.md)
- [ ] Returns array of agencies (may be empty)

### 2.3 — `src/services/notifications.ts`
- [ ] `notifyAgencyOfReport(report: Report, agency: Agency)` — renders template, sends via Resend, logs `report_notifications`
- [ ] Failure handling: catch, log row with `status='failed'`, never throw to caller

### 2.4 — Reverse geocoding API route
- [ ] `src/app/api/geocode/reverse/route.ts` (POST)
- [ ] Validates auth (`auth.uid()` must exist)
- [ ] Accepts `{ lat, lng }` body
- [ ] Calls Google Geocoding API server-side using `GOOGLE_MAPS_SERVER_KEY`
- [ ] Matches province → upserts municipality → returns `{ address_text, province_id, municipality_id }`
- [ ] Logs to `unmatched_province_lookups` table on failures (create this debug table here)

### 2.5 — Photo upload
- [ ] `src/services/storage.ts` → `uploadReportPhoto(file: File, userId: string)` returns the storage path
- [ ] Client compresses to max 1920px wide + JPEG quality 80 before upload (saves cost + speed)
- [ ] Returns signed URL for inline preview during the form flow

### 2.6 — `<ReportForm>` client component
- [ ] `src/components/reports/report-form.tsx` ('use client')
- [ ] Steps (single page with progressive disclosure):
  1. **Photo** — `<input type="file" capture="environment">` for native camera, with preview
  2. **Location** — embed `<ReportLocationPicker>` (sub-component, also 'use client')
  3. **Category** — Shadcn `<Select>` populated from `incident_categories`
  4. **Description** — optional textarea
  5. **Submit** — calls Server Action that orchestrates upload + insert + routing
- [ ] Form-level validation: photo required, lat/lng required, category required
- [ ] Loading states for each step
- [ ] Error states (camera denied, GPS denied, network failure)

### 2.7 — `<ReportLocationPicker>` component
- [ ] Loads Google Maps JS with browser key
- [ ] Auto-centers on user GPS via `navigator.geolocation.getCurrentPosition`
- [ ] Draggable pin
- [ ] On pin release (debounced 500ms): call `/api/geocode/reverse`
- [ ] Shows resolved address + "Confirm location" button
- [ ] Reports back `{ lat, lng, province_id, municipality_id, address_text }` to parent form

### 2.8 — Server Action for submit
- [ ] `src/app/actions/submit-report.ts`
- [ ] Server Action that:
  1. Validates input (Zod schema)
  2. Uploads photo to Storage
  3. Inserts report row with `status` derived from user's `trust_tier`:
     - `'new'` → `'pending_review'`
     - `'trusted'` → `'received'`
     - `'flagged'` → throw / reject
  4. If status === `'received'` AND `province_id` is set: run routing query, loop matched agencies, fire emails
  5. Returns `{ reportId, status }` to the form
- [ ] Wrap notification calls in `Promise.allSettled` so a failing email doesn't fail the submit

### 2.9 — User dashboard: "My Reports" list
- [ ] Replace `overview-tab.tsx` with `MyReportsList` Server Component
- [ ] Lists user's reports newest first, with status badge + thumbnail + category + address
- [ ] Click → `/reports/[id]` detail page

### 2.10 — Report detail page
- [ ] `src/app/reports/[id]/page.tsx` (Server Component)
- [ ] Shows photo, status timeline (Submitted → Reviewed → In Progress → Resolved), location (Static Maps image)
- [ ] Shows which agency was notified (from `report_notifications`)
- [ ] No edit actions for user — just view

### 2.11 — Email template
- [ ] `src/lib/email/templates/agency-new-report.tsx` using `@react-email/components`
- [ ] Includes: signed photo URL (24h expiry), lat/lng + Google Maps link, address, category, description, Fix Pinas branding

## Acceptance criteria

- [ ] A test user can submit a report from a phone browser in under 60 seconds
- [ ] The agency receives an email with all the required info
- [ ] `report_notifications` row is written with `status='sent'`
- [ ] If reverse geocoding fails, the user gets a clear error (not a generic 500)
- [ ] If no agency matches, the report still saves and appears in the user's list
- [ ] The user's dashboard shows the new report with the correct status badge
- [ ] All Supabase queries respect RLS (test by trying to read another user's report)
- [ ] Photo upload works on Safari iOS + Chrome Android

## Test plan

- [ ] Submit from mobile Safari (iOS)
- [ ] Submit from Chrome Android
- [ ] Deny camera permission → form shows fallback (file upload)
- [ ] Deny GPS permission → form shows manual map picker
- [ ] Submit with `trust_tier='new'` → status is `pending_review`, no email fires
- [ ] Manually promote to `trusted`, submit again → status is `received`, email fires
- [ ] Submit a category with no matching agency → report saves, no email, no error

## Notes

- The MVP loop should feel **faster than calling 911**. Optimize the form for speed: pre-warm the map, pre-fetch categories, don't make the user wait.
- Photos can be heavy. Always compress client-side before upload.
- Pre-warm the geocoding API on form open (warm DNS / TLS) to shave latency.

## Next phase

→ [phase-3.md](phase-3.md) — Provincial admin dashboard for managing reports.
