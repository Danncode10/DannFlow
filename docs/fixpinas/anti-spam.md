# Anti-Spam

> Defense in depth. No single mechanism stops everything. Stack them so real users barely notice and bad actors hit walls.

## Threat model

| Threat | Example |
|---|---|
| Fake reports | Bored users submitting joke photos |
| Mass spam | Bot creating 1,000 accounts and submitting fake reports to flood agencies |
| Targeted harassment | Repeated reports against a specific location/person |
| Photo abuse | NSFW or unrelated images uploaded |

## Defenses (layered)

### Layer 1 — Account barrier
**Phone OTP on signup** via Supabase Auth.
- One verified phone = one account
- Filters lazy bots (SMS costs money to acquire numbers)
- Stored in `profiles.phone` + `phone_verified=true`

### Layer 2 — Trust tier (the key mechanism)

`profiles.trust_tier`:
| Tier | How you get it | Effect on report.status |
|---|---|---|
| `new` | Default on signup | Defaults to `pending_review` — agency not notified until `provincial_admin` approves |
| `trusted` | `verified_report_count >= 3` (auto-promoted via trigger) | Reports go straight to `received` — agency notified immediately |
| `flagged` | Manually set by `admin` after spam pattern | Reports auto-rejected; user banned from submitting |

The trigger `bump_verified_count()` promotes `new → trusted` when their 3rd report reaches `resolved`.

**Why this works:** Most spammers won't go through 3 manually-approved reports just to bypass the gate. Real users barely notice — they submit, they get a "your report is being reviewed" message, and within hours a `provincial_admin` approves it.

### Layer 3 — Per-user rate limits

DB-level via `rate_limits` table (Phase 4), eventually moved to Upstash Redis (Phase 6+).

| Bucket | Limit |
|---|---|
| `report_submit` | 5 reports per user per 24 hours |
| `verification_click` | 30 verifications per user per 24 hours |
| `signup_per_ip` | 3 accounts per IP per 24 hours (Edge Function) |

Exceeding the limit returns a friendly error, not a hard ban. Repeated violations → flag for `admin` review.

### Layer 4 — Per-location rate limits

Prevents a single location getting spammed.

- Max **2 distinct reports** within a 50-meter radius per hour (across all users)
- 3rd report in same area within the hour goes to `pending_review` automatically regardless of user trust
- This catches harassment AND legitimate "many users seeing the same incident"

When the 3rd report comes in, the system links them as `related_report_id` (Phase 5 feature) so `provincial_admin` can resolve them together.

### Layer 5 — Community verification ("I see this too")

Other users near the location can confirm a report via `report_verifications`. Effects:
- Each verification adds credibility
- Reports with ≥5 verifications auto-promote from `pending_review` to `received` (skip admin queue)
- High-verification reports surface higher in `provincial_admin` queue

Constraint: verifier must be within ~1km of the report's lat/lng (checked at the API layer using their last known location or a fresh GPS ping).

### Layer 6 — Photo requirement
No report without a photo. Filters drive-by spam where someone just clicks "submit" repeatedly.

Phase 4+: Cloudflare AI Moderation or Claude Vision pre-screen for NSFW/unrelated images. For MVP, photos are visible only to `provincial_admin` and `admin`, not other users, limiting exposure.

### Layer 7 — Admin override (manual)
`admin` can:
- Set any user's `trust_tier = 'flagged'` (ban from submitting)
- Hard-delete spam reports (`reports.deleted_at`)
- View `audit_events` log

## What we're NOT doing in MVP

- CAPTCHA on signup — phone OTP is enough friction
- ML-based spam classifier — overkill until volume justifies it
- IP banning — proxies make this brittle
- Identity verification (ID upload) — too friction-heavy for civic engagement

## The pending_review queue

The single most important UX surface for spam control.

**For users:**
- New users see "Your report is being reviewed. We'll notify the agency once approved."
- Status badge shows `Under Review` with a clock icon
- Estimated approval time visible if known

**For `provincial_admin`:**
- Dedicated `/admin/pending` page
- Sorted by oldest first, with verification count visible
- One-click actions: Approve → triggers agency email, or Reject → notifies user with reason
- Bulk approve for trusted-looking batches

**SLA target:** `pending_review` queue processed within 24h. If it grows beyond 100 items, escalate to `admin` to onboard more `provincial_admin` capacity.
