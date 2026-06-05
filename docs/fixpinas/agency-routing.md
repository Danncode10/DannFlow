# Agency Routing

> How a submitted report finds the correct agency to notify.

## Inputs

When a report is inserted:
- `province_id` — derived from reverse geocoding the lat/lng
- `category_id` — chosen by the user from the picker

## The match

Find every agency where:
1. `agency.province_id = report.province_id`
2. `agency.is_active = true`
3. The agency has a row in `agency_categories` linking it to `report.category_id`

If multiple agencies match (rare, but possible — e.g. both LGU and DPWH handle "road damage"), notify **all of them**. Each gets its own `report_notifications` row.

```sql
-- the routing query
select a.*
from agencies a
join agency_categories ac on ac.agency_id = a.id
where a.province_id = $1   -- report.province_id
  and ac.category_id = $2  -- report.category_id
  and a.is_active = true;
```

## When no agency matches

Possible reasons:
- Province has no agencies seeded yet (most provinces in MVP — only Nueva Vizcaya is populated)
- Category has no agency assigned in that province

Behavior:
- Report still saves with `status = 'received'` (or `pending_review` if user is new)
- No agency notification fires
- A row is written to `report_notifications` with `status = 'failed'`, `error = 'no_agency_match'`, `agency_id = null` (or skip — see below)
- The `admin` queue surfaces "unrouted reports" for follow-up

Decision: **Skip writing a `report_notifications` row when there's no match.** Instead, surface unrouted reports via a query in the admin panel: `SELECT reports.* FROM reports LEFT JOIN report_notifications n ON n.report_id = reports.id WHERE n.id IS NULL AND reports.status IN ('received','in_progress')`.

## When the report is `pending_review`

**Do not notify any agency.** Wait until a `provincial_admin` approves it (transitions to `received`). The notification fires on that transition.

This is the anti-spam gate. See [anti-spam.md](anti-spam.md).

## Notification flow

```
report INSERT
  ↓
status === 'received'?
  ├─ no  → wait for provincial_admin approval (Phase 4+)
  └─ yes ↓
       run routing query
       ↓
       for each matched agency:
         enqueue email via Resend
         on success → INSERT report_notifications (status='sent')
         on failure → INSERT report_notifications (status='failed', error=...)
```

Implementation options:
- **Phase 2 (MVP):** Trigger the email inline in the Server Action / Route Handler that creates the report. Simple, blocks the response by ~500ms.
- **Phase 4+ (scale):** Move to a Supabase Edge Function triggered by `pg_net` webhook or a queue table (`notification_jobs`). Decouples user-facing latency from email delivery.

## Status transition triggers re-notification?

No. Status updates (received → in_progress → resolved) notify the **reporter**, not the agency. The agency only gets the initial email. Future enhancement: weekly digest to agencies for open reports.

## Edge cases

| Scenario | Behavior |
|---|---|
| Agency `is_active = false` | Excluded from match |
| Reporter is themselves a `provincial_admin` | Still goes through normal routing — no special bypass |
| Lat/lng falls in a province border ambiguity | Trust Google's reverse geocoding result; user can edit pin before submit |
| User picks "Other" category | Routes only to agencies that explicitly list "Other" — otherwise unrouted |
| Multiple municipalities for same lat/lng (shouldn't happen) | Use the closest centroid; this is a data integrity concern, not routing |
