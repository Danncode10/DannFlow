# Phase 1 — Full Schema + Reference Data

> **Goal:** Apply the rest of the schema (provinces, municipalities, categories, agencies, and their join tables + notification/verification tables). Seed all 82 provinces and the Nueva Vizcaya pilot agency data.
>
> **Est. time:** 1 week
>
> **Blockers:** Phase 0 complete. Need PSGC dataset for province seed.

## Why this phase

Phase 0 left us with `profiles` + a stub `reports`. To wire routing in Phase 2, we need all the FK targets in place: provinces, municipalities (lazy), categories, agencies. We also seed Nueva Vizcaya agencies because the pilot can't function without them.

## Tasks

### 1.1 — Reference data dataset prep
- [ ] Download PSGC province dataset (PSA: psa.gov.ph)
- [ ] Convert to SQL inserts (82 rows): `psgc_code`, `name`, `region`, `slug`, `is_pilot=true` for Nueva Vizcaya
- [ ] Save as `supabase/seeds/01_provinces.sql`
- [ ] Draft Nueva Vizcaya agencies list — minimum:
  - Nueva Vizcaya DPWH
  - Nueva Vizcaya BFP (Bureau of Fire Protection)
  - Nueva Vizcaya PNP
  - Provincial Health Office
  - Provincial Environment & Natural Resources Office
  - Provincial Engineering Office
- [ ] For each agency, confirm `contact_email` (use placeholder until verified)

### 1.2 — Schema migration (all remaining tables)
- [ ] Apply migration that creates:
  - `municipality_type` enum
  - `notification_method` enum
  - `notification_status` enum
  - `provinces` table
  - `municipalities` table
  - `incident_categories` table
  - `agencies` table
  - `agency_categories` join table
  - `report_notifications` table
  - `report_verifications` table
  - Add `province_id`, `municipality_id`, `category_id` columns to `reports` (nullable for now to handle pre-existing test rows)
  - All indexes from [schema.md](schema.md)
- [ ] Backfill `is_pilot` flag on Nueva Vizcaya
- [ ] Run `npm run checkpoint` + `npm run update-types`

### 1.3 — Seed reference data
- [ ] Seed `provinces` (82 rows) via `seeds/01_provinces.sql`
- [ ] Seed `incident_categories` (10 starter categories from [schema.md](schema.md))
- [ ] Seed `agencies` for Nueva Vizcaya (~6 agencies)
- [ ] Seed `agency_categories` — link each Nueva Vizcaya agency to the categories it handles:
  - DPWH → road damage, traffic obstruction
  - BFP → fire hazard, electrical hazard
  - PNP → public safety/crime
  - Provincial Health → garbage/sanitation, water supply
  - PENRO → flooding/drainage
  - Provincial Engineering → streetlight outage, electrical hazard
- [ ] Verify seeded counts via SQL query

### 1.4 — Apply full RLS policy set
- [ ] Apply all RLS policies from [roles-and-rls.md](roles-and-rls.md)
- [ ] Create helper functions: `current_role()`, `current_province()`, `is_admin()`
- [ ] Test RLS as anon, as user, as admin (manually elevate one test account)

### 1.5 — Storage bucket setup
- [ ] Create Supabase Storage bucket `report-photos`
- [ ] Set bucket policy: authenticated users can upload, only owner + provincial_admin (same province) + admin can read
- [ ] Set max upload size: 5 MB
- [ ] Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### 1.6 — Triggers
- [ ] `bump_verified_count()` trigger on `reports` AFTER UPDATE
- [ ] Logic: when `OLD.status != 'resolved' AND NEW.status = 'resolved'` → increment `profiles.verified_report_count`, promote `trust_tier` to `'trusted'` if count >= 3
- [ ] Test via SQL: update a report to `resolved`, confirm profile counter ticked

## Acceptance criteria

- [ ] All 82 provinces visible in `provinces` table with valid PSGC codes
- [ ] 10 categories seeded
- [ ] At least 6 Nueva Vizcaya agencies seeded with `agency_categories` mapping
- [ ] RLS policies pass smoke test (user can't read another user's report)
- [ ] Storage bucket exists with correct policies
- [ ] `bump_verified_count` trigger fires correctly on status change to `resolved`
- [ ] `npm run update-types` reflects all new tables in `src/types/supabase.ts`
- [ ] Latest snapshot in `supabase/backups/` contains the full schema

## Notes

- The `provinces` PSGC codes are stable government IDs — they should never change.
- Municipalities stay **empty** at the end of this phase. Phase 2's reverse geocoding will populate them lazily.
- Agency emails can start as personal/test addresses for the dev team while real partnerships are pending.

## Next phase

→ [phase-2.md](phase-2.md) — Build the report submission flow end-to-end.
