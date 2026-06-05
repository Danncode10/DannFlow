# Phase 4 — Anti-Spam & Trust System

> **Goal:** Implement every layer described in [anti-spam.md](anti-spam.md). Phone OTP, trust tier transitions, rate limiting, community verification, photo moderation.
>
> **Est. time:** 1–2 weeks
>
> **Blockers:** Phase 3 complete. Need Supabase Auth phone provider configured (Twilio interim).

## Why this phase

Up to Phase 3, the only spam defense is the `pending_review` queue + admin discretion. That works for one province with low volume, but won't scale. We need automated friction at signup and submission to keep `provincial_admin` queues sane as we expand.

## Tasks

### 4.1 — Phone OTP on signup
- [ ] Enable Phone provider in Supabase Auth
- [ ] Configure Twilio for OTP (Semaphore PH integration later)
- [ ] Update signup flow: `email + password + phone` → email confirmed → phone OTP step → `phone_verified=true` written to profile
- [ ] Block report submission if `phone_verified=false`

### 4.2 — Trust tier automation
- [ ] Confirm `bump_verified_count` trigger from Phase 1 still works
- [ ] Add UI toast when user is promoted to `trusted`
- [ ] Add badge on user profile / report list

### 4.3 — Rate limits (DB-level)
- [ ] Create `rate_limits` table per [schema.md](schema.md)
- [ ] Helper function `check_rate_limit(user_id uuid, bucket text, max_count int, window_seconds int) returns bool`
- [ ] Apply in submit-report action:
  - `report_submit`: 5 per 24h per user
  - `verification_click`: 30 per 24h per user
- [ ] Return friendly error: "You've reached the daily report limit. Try again tomorrow."

### 4.4 — Per-location rate limits
- [ ] Pre-insert check in submit-report action:
  ```sql
  select count(*) from reports
  where created_at > now() - interval '1 hour'
    and st_dwithin(
      st_makepoint(lng, lat)::geography,
      st_makepoint($1, $2)::geography,
      50
    );
  ```
- [ ] If count >= 2, force `status='pending_review'` regardless of user trust tier
- [ ] Enable PostGIS extension if not already on

### 4.5 — Community verification UI
- [ ] "I see this too" button on public report cards (Phase 5 will add public list; for now show on user's own dashboard for reports in their general area)
- [ ] Server Action `verifyReport(reportId)`:
  - Checks user is within 1km via lat/lng
  - Inserts `report_verifications` row (unique constraint prevents dupes)
  - If new count >= 5 and report is `pending_review` → auto-promote to `received`, fire agency email
- [ ] Show verification count on report detail

### 4.6 — IP-based signup throttle (Edge Function)
- [ ] Supabase Edge Function `signup-throttle` invoked from a Postgres webhook on `auth.users` insert
- [ ] Tracks IP via Cloudflare / Vercel header
- [ ] Max 3 signups per IP per 24h
- [ ] Excess → auto-set `trust_tier='flagged'` (let admin review)

### 4.7 — Photo moderation
- [ ] Integrate Cloudflare AI Moderation (or Google Vision SafeSearch as alternative)
- [ ] Server Action: after upload, before report insert, screen the photo
- [ ] If flagged NSFW/violent → reject submission with generic error
- [ ] Log to `photo_moderation_events` table for audit

### 4.8 — Admin spam queue
- [ ] `/admin/spam-watch` page for `provincial_admin` + `admin`
- [ ] Surfaces: users with high rejection rates, IPs with many signups, reports rejected as spam
- [ ] One-click "flag user" action → sets `trust_tier='flagged'` + logs to `audit_events`

### 4.9 — Flagged user UX
- [ ] When user with `trust_tier='flagged'` opens `/dashboard`: show banner "Your account is under review. New reports are disabled."
- [ ] Submit form is disabled
- [ ] Provide a "contact support" CTA

## Acceptance criteria

- [ ] Cannot submit a report without verified phone
- [ ] Submitting 6 reports in 24h returns rate limit error on the 6th
- [ ] 3rd report within 50m radius within 1h auto-routes to `pending_review`
- [ ] 5 community verifications on a `pending_review` report auto-approves it
- [ ] Photo moderation rejects an obvious NSFW test image
- [ ] Trust tier promotion to `trusted` fires correctly on 3rd resolved report
- [ ] Flagged user cannot submit reports
- [ ] All anti-spam triggers logged to `audit_events` for traceability

## Notes

- Don't over-rotate on bots — Filipino civic apps are far more likely to be spammed by bored teenagers than by automated bots. The trust tier system handles the human case best.
- If Twilio SMS gets expensive, Phase 5 evaluates Semaphore as a custom Supabase Auth provider.
- PostGIS extension makes location queries trivial but adds a small DB cost. Worth it for this app.

## Next phase

→ [phase-5.md](phase-5.md) — Super admin panel + Claude Vision category suggestions.
