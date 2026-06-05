# Phase 3 — Provincial Admin Dashboard

> **Goal:** `provincial_admin` users can log in to a dedicated dashboard, see all reports in their assigned province, filter and update them, and trigger notifications back to the reporter on status changes.
>
> **Est. time:** 1 week
>
> **Blockers:** Phase 2 complete. At least one `provincial_admin` account manually created for Nueva Vizcaya.

## Why this phase

Phase 2 only handles the user side. The agency gets an email but the system has no visibility into what they do with it. The `provincial_admin` is the LGU's eyes inside Fix Pinas — they triage, update status, and close the loop with the reporter.

## Tasks

### 3.1 — Role-aware middleware
- [ ] `middleware.ts` reads `profiles.role` (cached in JWT custom claim or read from DB)
- [ ] Routes:
  - `/dashboard/*` — any authenticated user
  - `/admin/*` — `provincial_admin` or `admin` only
  - `/superadmin/*` — `admin` only (Phase 5)
- [ ] Unauthorized → redirect to `/dashboard` with toast

### 3.2 — Provincial admin layout
- [ ] `src/app/admin/layout.tsx` — sidebar nav with: My Province Overview, All Reports, Pending Review, Categories
- [ ] Header shows assigned province name + agency count
- [ ] Top stat bar: pending count, in_progress count, resolved last 7d

### 3.3 — All Reports page
- [ ] `src/app/admin/reports/page.tsx` (Server Component)
- [ ] Filters: status (multi-select), category, date range, has_verifications
- [ ] Sort: newest, oldest, most verified
- [ ] Pagination: 20 per page
- [ ] Each row: thumbnail, category icon, address, reporter (display_name + trust badge), status badge, "View" button

### 3.4 — Report detail (admin view)
- [ ] `src/app/admin/reports/[id]/page.tsx`
- [ ] Full report info + action panel:
  - Status update dropdown (`received` → `in_progress` → `resolved` / `rejected`)
  - Internal note textarea (Phase 4 — store in `report_notes` table)
  - Re-notify agency button (resends email; logs new `report_notifications` row)
  - Link related reports (Phase 4)

### 3.5 — Status update Server Action
- [ ] `src/app/actions/update-report-status.ts`
- [ ] RLS enforces province scope; double-check with explicit `.eq('province_id', currentProvince)`
- [ ] On transition:
  - `pending_review` → `received`: send agency email (initial routing), notify reporter "approved"
  - `received` → `in_progress`: notify reporter
  - `in_progress` → `resolved`: notify reporter, trigger `bump_verified_count` (already in DB trigger)
  - any → `rejected`: notify reporter with reason
- [ ] Returns updated report row to refresh UI

### 3.6 — Pending review queue
- [ ] `src/app/admin/pending/page.tsx`
- [ ] Lists only `status='pending_review'` in this province
- [ ] Sorted oldest first
- [ ] Inline Approve / Reject buttons (no modal — keep it fast)
- [ ] Bulk select + bulk approve for obvious trusted batches

### 3.7 — Reporter notification emails
- [ ] Templates for: `report-approved`, `report-rejected`, `report-status-updated`
- [ ] Triggered from status update action
- [ ] Each one shows the report photo + new status + admin's optional note

### 3.8 — Provincial overview page
- [ ] `src/app/admin/page.tsx`
- [ ] Charts (use Recharts — already in shadcn ecosystem):
  - Reports per category (bar chart)
  - Reports per status (donut)
  - 30-day submission trend (line)
- [ ] List of agencies in province + their handled categories

### 3.9 — Manual provincial_admin provisioning
- [ ] Since Phase 5 super admin panel isn't built yet, document an SQL snippet for promoting a user:
  ```sql
  update profiles
  set role = 'provincial_admin',
      province_id = (select id from provinces where slug = 'nueva-vizcaya')
  where id = '<user-uuid>';
  ```
- [ ] Add a `npm run promote-padmin <email> <province-slug>` script in `scripts/` for convenience

## Acceptance criteria

- [ ] A `provincial_admin` in Nueva Vizcaya can see only Nueva Vizcaya reports
- [ ] RLS blocks access to reports in other provinces (verified by manual test)
- [ ] Status update triggers the correct reporter email
- [ ] Pending review queue processes approval → triggers agency email correctly
- [ ] Mobile-responsive (LGU staff may be on phones too)
- [ ] Empty states for every list

## Notes

- The `provincial_admin` UI should feel like a triage tool, not a CRM. Optimize for speed of decision: approve, reject, update status, next.
- Avoid over-engineering filters. Status + category + date range covers 95% of triage needs.

## Next phase

→ [phase-4.md](phase-4.md) — Anti-spam mechanisms (phone OTP, trust tier promotion automation, rate limits, community verification).
