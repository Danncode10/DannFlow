# Schema

> Full DB schema for Fix Pinas. Source of truth lives in `supabase/backups/` after `npm run checkpoint`. This doc describes intent.

## Overview

```
┌──────────┐      ┌─────────────────┐      ┌───────────────────┐
│ provinces│──┬──>│ municipalities  │      │incident_categories│
└──────────┘  │   └─────────────────┘      └───────────────────┘
              │            │                         │
              │            │                         │
              ├──> agencies ────agency_categories ───┘
              │            ▲
              │            │
              │      ┌─────┴────┐
              ├──────│ reports  │<── report_notifications
              │      └──────────┘<── report_verifications
              │            ▲
              │            │
              └──> profiles (FK auth.users)
```

## Tables

### `profiles`
Extends `auth.users`. Created via `handle_new_user` trigger on signup.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | = `auth.users.id` |
| `role` | `user_role` enum | default `'user'` |
| `province_id` | `uuid` FK provinces | NULL for `user` and `admin`; required for `provincial_admin` |
| `display_name` | `text` | |
| `phone` | `text` | E.164 format |
| `phone_verified` | `bool` | default `false` (set true after OTP) |
| `trust_tier` | `trust_tier` enum | default `'new'` (see [anti-spam.md](anti-spam.md)) |
| `verified_report_count` | `int` | denormalized — incremented when a report reaches `resolved` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | trigger-updated |

**Enums:**
- `user_role`: `'user' | 'provincial_admin' | 'admin'`
- `trust_tier`: `'new' | 'trusted' | 'flagged'`

---

### `provinces`
Reference data — seeded once with all 82 PH provinces.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `psgc_code` | `text` UNIQUE | Philippine Standard Geographic Code |
| `name` | `text` | e.g. "Nueva Vizcaya" |
| `region` | `text` | e.g. "Region II (Cagayan Valley)" |
| `slug` | `text` UNIQUE | e.g. "nueva-vizcaya" |
| `is_pilot` | `bool` | default `false`; `true` for Nueva Vizcaya |

---

### `municipalities`
Populated lazily via reverse geocoding (Phase 2+). Not pre-seeded.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `province_id` | `uuid` FK provinces | NOT NULL |
| `psgc_code` | `text` UNIQUE | nullable until matched with PSGC dataset |
| `name` | `text` | |
| `type` | `municipality_type` enum | `'city' \| 'municipality'` |
| `created_at` | `timestamptz` | |

Unique constraint: `(province_id, name)`.

---

### `incident_categories`
Reference data — seeded once.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `slug` | `text` UNIQUE | e.g. `'electrical_hazard'` |
| `name` | `text` | e.g. "Electrical hazard" |
| `description` | `text` | shown to user when picking |
| `icon` | `text` | lucide-react icon name |
| `sort_order` | `int` | display order in picker |
| `is_active` | `bool` | default `true` |

**Starter categories (Phase 1 seed):**
1. Road damage (potholes, broken pavement)
2. Electrical hazard (exposed wires, broken posts)
3. Flooding / drainage
4. Fire hazard
5. Garbage / sanitation
6. Public safety / crime
7. Water supply issue
8. Traffic obstruction (fallen trees, debris)
9. Streetlight outage
10. Other (catch-all)

---

### `agencies`
Government agencies that handle reports per province.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `province_id` | `uuid` FK provinces | NOT NULL |
| `name` | `text` | e.g. "Nueva Vizcaya DPWH" |
| `contact_email` | `text` | required (Phase 2 routing) |
| `contact_phone` | `text` | E.164, used in Phase 3+ for SMS |
| `is_active` | `bool` | default `true` |
| `created_at` | `timestamptz` | |

Unique constraint: `(province_id, name)`.

---

### `agency_categories` (join)
Which categories each agency handles.

| Column | Type | Notes |
|---|---|---|
| `agency_id` | `uuid` FK agencies | |
| `category_id` | `uuid` FK incident_categories | |

Composite PK: `(agency_id, category_id)`.

---

### `reports`
The core operational table.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK profiles | reporter |
| `photo_url` | `text` | Supabase Storage path |
| `lat` | `numeric(9,6)` | |
| `lng` | `numeric(9,6)` | |
| `address_text` | `text` | from reverse geocoding |
| `province_id` | `uuid` FK provinces | derived from lat/lng |
| `municipality_id` | `uuid` FK municipalities | nullable; upserted on submit |
| `category_id` | `uuid` FK incident_categories | |
| `description` | `text` | optional user description |
| `status` | `report_status` enum | default `'pending_review'` or `'received'` based on user trust |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | trigger-updated |
| `resolved_at` | `timestamptz` | nullable |
| `deleted_at` | `timestamptz` | nullable, soft-delete |

**Enum** `report_status`: `'pending_review' \| 'received' \| 'in_progress' \| 'resolved' \| 'rejected'`

**Indexes:**
- `(user_id, created_at DESC)` — user's own reports
- `(province_id, status, created_at DESC)` — provincial_admin queue
- `(category_id)` — analytics
- GIST on `(lat, lng)` if/when heatmap added (Phase 5+)

---

### `report_notifications`
Audit log of what was sent to whom.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `report_id` | `uuid` FK reports | |
| `agency_id` | `uuid` FK agencies | |
| `method` | `notification_method` enum | `'email' \| 'sms'` |
| `recipient` | `text` | email or phone at send time |
| `status` | `notification_status` enum | `'sent' \| 'failed'` |
| `error` | `text` | nullable |
| `sent_at` | `timestamptz` | |

---

### `report_verifications`
Other users confirming "I see this too." Boosts credibility.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `report_id` | `uuid` FK reports | |
| `user_id` | `uuid` FK profiles | |
| `created_at` | `timestamptz` | |

Unique constraint: `(report_id, user_id)` — one verification per user per report.

---

### `rate_limits` (Phase 4)
DB-level rate limiting before Upstash is wired.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK profiles | |
| `bucket` | `text` | e.g. `'report_submit'` |
| `count` | `int` | |
| `window_start` | `timestamptz` | |

Unique constraint: `(user_id, bucket, window_start)`.

---

### `audit_events` (Phase 5)
Admin action log.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `actor_id` | `uuid` FK profiles | |
| `action` | `text` | e.g. `'promote_provincial_admin'` |
| `target_type` | `text` | e.g. `'profile'`, `'report'` |
| `target_id` | `uuid` | |
| `metadata` | `jsonb` | |
| `created_at` | `timestamptz` | |

---

## Triggers

- `handle_new_user()` — on `auth.users` insert, create `profiles` row with `role='user'`
- `set_updated_at()` — generic trigger on `profiles` and `reports`
- `bump_verified_count()` — when `reports.status` transitions to `'resolved'`, increment `profiles.verified_report_count` for the reporter; may also promote `trust_tier` from `'new'` to `'trusted'` (see [anti-spam.md](anti-spam.md))
