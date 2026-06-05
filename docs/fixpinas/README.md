# Fix Pinas — Technical Specs Index

> All technical specs and phase breakdowns for Fix Pinas. The root [MASTERPLAN.md](../../MASTERPLAN.md) links here.

## Specs (cross-cutting — read these before any phase)

| Doc | Covers |
|---|---|
| [schema.md](schema.md) | Full DB schema: tables, columns, enums, indexes, foreign keys |
| [roles-and-rls.md](roles-and-rls.md) | Role definitions + RLS policy per table |
| [agency-routing.md](agency-routing.md) | How reports find their agency (category × province match) |
| [anti-spam.md](anti-spam.md) | Trust tiers, pending_review queue, rate limits, community verification |
| [maps-integration.md](maps-integration.md) | Google Maps + reverse geocoding (server-proxied) |
| [notifications.md](notifications.md) | Resend email templates + Semaphore SMS plan |

## Phase docs (sequential — build one at a time)

| Phase | Doc | Goal |
|---|---|---|
| 0 | [phase-0.md](phase-0.md) | Strip template, wire auth, baseline schema |
| 1 | [phase-1.md](phase-1.md) | Full schema + seed reference data |
| 2 | [phase-2.md](phase-2.md) | MVP loop: snap → locate → route → email |
| 3 | [phase-3.md](phase-3.md) | Provincial admin dashboard |
| 4 | [phase-4.md](phase-4.md) | Anti-spam (OTP, trust tiers, rate limits) |
| 5 | [phase-5.md](phase-5.md) | Super admin panel + Claude Vision suggestions |

## Conventions

- **PSGC codes** = Philippine Standard Geographic Codes. Every province/municipality row carries one for future government API integrations.
- **`province_id`** is on every operational row (reports, agencies, profiles for provincial_admins). Never branch logic on province *name*.
- **Soft delete** = `deleted_at timestamptz NULL`. Hard deletes only for admin-confirmed spam.
- All timestamps `timestamptz`, default `now()`.
- All IDs `uuid` with `gen_random_uuid()` default.
