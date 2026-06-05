# Notifications

> Who gets told what, when. Email via Resend. SMS via Semaphore PH (Phase 3+).

## Notification matrix

| Event | Recipient | Method (MVP) | Method (Phase 3+) |
|---|---|---|---|
| Report submitted (status=`received`) | Matched agency | Email | Email + SMS |
| Report submitted (status=`pending_review`) | Reporter | In-app + Email | In-app + Email |
| `pending_review` → `received` (approved) | Reporter + matched agency | Email | Email |
| `pending_review` → `rejected` | Reporter | Email | Email |
| `received` → `in_progress` | Reporter | Email | Email |
| `in_progress` → `resolved` | Reporter | Email | Email |
| Trust tier promotion (`new` → `trusted`) | User | In-app toast | In-app toast |
| Account flagged | User | Email | Email |

## Email (Resend)

### Setup
- `RESEND_API_KEY` in `.env.local`
- `From` address: `Fix Pinas <noreply@fixpinas.ph>` (verify domain in Resend)
- Reply-To: `support@fixpinas.ph` (Phase 5+)

### Templates

Templates live in `src/lib/email/templates/` as React components rendered via `@react-email/render`. Each template imports a shared layout for header/footer consistency.

| Template | File |
|---|---|
| `report-received-by-agency` | `agency-new-report.tsx` — to the agency |
| `report-status-updated` | `reporter-status-update.tsx` — to the reporter |
| `report-pending-review` | `reporter-pending.tsx` — to the reporter on submit |
| `report-approved` | `reporter-approved.tsx` |
| `report-rejected` | `reporter-rejected.tsx` |
| `account-flagged` | `user-flagged.tsx` |

### Agency notification email (the most important one)

Subject: `[Fix Pinas] New {category} report in {municipality}`

Body must include:
- Photo (inline or linked Supabase Storage signed URL, 24h expiry)
- Lat/lng + Google Maps link
- Address text
- Category + description
- Reporter contact (only if reporter opted in — Phase 5+ feature)
- Direct link to status update page (signed, expires in 7 days — agency doesn't need an account in MVP)

### Sending

In `src/services/notifications.ts`:

```ts
export async function notifyAgencyOfReport(
  reportId: string,
  agencyId: string
): Promise<void> {
  // 1. Load report + agency from DB
  // 2. Render template
  // 3. Call Resend
  // 4. Insert report_notifications row with result
}
```

Called from the report-creation Server Action after a successful insert, looped over matched agencies (see [agency-routing.md](agency-routing.md)).

## SMS (Semaphore PH) — Phase 3+

For when email isn't enough. Semaphore is the Philippine local SMS provider — much cheaper than Twilio for PH numbers.

### Setup
- `SEMAPHORE_API_KEY` in `.env.local`
- Sender name: `FIXPINAS` (must be registered with Semaphore)

### When SMS fires
- Critical agency notifications (fire, electrical hazard categories) — both email AND SMS
- `provincial_admin` daily digest at 8am if queue > 10 items
- Reporter notification on `resolved` (closing the loop matters most here)

### Why not SMS for everything?
- Cost (~₱0.50/SMS)
- 160-char limit forces terse copy
- Phone numbers can change; emails are more stable identifiers

## Phone OTP — Phase 4

Not SMS in the notification sense — used for signup verification only. Supabase Auth handles this natively when `phone_signup` is enabled. Supabase delegates to Twilio by default; we'll switch to Semaphore via a custom provider when their integration is stable.

## Failure handling

- All sends write a `report_notifications` row with `status='sent'` or `status='failed'` + error message
- Failed agency emails appear in admin's "delivery issues" queue
- Auto-retry: once after 5 minutes, then manual intervention required
- Never silently swallow a notification failure — agencies expect to be told

## Rate-limiting outbound

To avoid Resend / Semaphore abuse if a bug causes a loop:
- Max 50 emails per minute per agency (DB-counted)
- Max 10 SMS per minute per recipient
- Circuit breaker: if 20 emails fail in 5 minutes, pause all notifications and page the `admin`
