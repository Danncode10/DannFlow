# Phase 5 — Super Admin Panel + AI Suggestions

> **Goal:** Build the `admin` panel for managing provinces, agencies, categories, and users. Add Claude Vision Haiku to suggest a category from the uploaded photo (suggestion only, never a blocker).
>
> **Est. time:** 1–2 weeks
>
> **Blockers:** Phase 4 complete.

## Why this phase

After Phase 4, the system is operationally complete for one province. To onboard the next province (and the one after that), we need a UI for adding agencies, assigning provincial_admins, and tweaking categories without touching SQL. AI suggestions add polish — the report form gets smarter without sacrificing reliability.

## Tasks

### 5.1 — Super admin layout
- [ ] `src/app/superadmin/layout.tsx` — sidebar: Provinces, Agencies, Categories, Users, Audit Log, Spam Watch
- [ ] Route guard: `admin` role only

### 5.2 — Provinces management
- [ ] List all 82 provinces with agency count + active reports
- [ ] Toggle `is_pilot` flag (controls landing-page messaging like "Now live in X")
- [ ] No CRUD on provinces themselves — they're reference data

### 5.3 — Agencies CRUD
- [ ] List, filter by province
- [ ] Create / Edit form: name, province, contact_email, contact_phone, is_active, handled categories (multi-select)
- [ ] Soft delete (set `is_active=false`)
- [ ] Test email button (sends a test notification to verify deliverability)

### 5.4 — Incident categories CRUD
- [ ] List with sort_order drag handle
- [ ] Create / Edit: slug, name, description, icon, sort_order, is_active
- [ ] Cannot delete a category with existing reports (FK constraint) — only deactivate

### 5.5 — User management
- [ ] List users with: email, display name, role, province, trust_tier, verified count, joined date
- [ ] Filters: role, trust_tier, province
- [ ] Actions per user:
  - Promote to `provincial_admin` (requires province selection)
  - Demote to `user`
  - Set `trust_tier='trusted'` or `'flagged'`
  - View their reports
- [ ] Every action writes to `audit_events`

### 5.6 — Audit log viewer
- [ ] List `audit_events` newest first
- [ ] Filters: actor, action type, date range
- [ ] Click row → expanded JSON metadata

### 5.7 — Claude Vision category suggestion
- [ ] Server Action `suggestCategoryFromPhoto(photoUrl: string)` calls Claude Haiku Vision
- [ ] Prompt template:
  ```
  You see a photo submitted by a citizen reporting an incident in the Philippines.
  Given the following categories: [list with descriptions],
  return the slug of the most likely category, or "unknown" if no clear match.
  Respond with JSON: {"category_slug": "...", "confidence": 0.0-1.0}
  ```
- [ ] Use prompt caching for the category list (it's stable)
- [ ] Called from `<ReportForm>` after photo upload, in parallel with reverse geocoding
- [ ] Pre-selects the dropdown if confidence > 0.7 (user can override)
- [ ] Shows "Suggested by AI" label next to the pre-selection
- [ ] Logs suggestion + final choice to `category_suggestions` table for accuracy tracking

### 5.8 — Stats dashboard for admin
- [ ] `/superadmin/stats` page
- [ ] Charts: reports per province, reports per category nationwide, resolution rates per agency, average time-to-resolve
- [ ] Time range selector

### 5.9 — Branding tweaks for nationwide
- [ ] Landing page shows "Now in N provinces" dynamic count
- [ ] Province selector on landing page for browsing public stats
- [ ] Add "Request your province" form for users in unsupported areas

## Acceptance criteria

- [ ] Admin can add a new agency for any province via UI
- [ ] Admin can promote a user to `provincial_admin` without SQL
- [ ] Claude Vision suggests categories with > 70% accuracy on test set of 20 sample photos
- [ ] AI suggestion never blocks submission — user can always pick differently
- [ ] All admin actions appear in audit log
- [ ] Photo + suggestion is logged for accuracy tuning

## Cost notes

- Claude Haiku Vision: ~$0.0008 per image (well under $1 per 1k reports)
- Prompt caching reduces token cost on the category list
- Add Anthropic API budget alerts ($5 / $20 / $50)

## Notes

- This is the phase where Fix Pinas becomes a **product**, not just a pilot. Onboarding a new province should take an admin < 15 minutes.
- AI is a force multiplier here, not a gimmick — reduces friction in the report form by 1 tap.

## Future (Post-v1)

After Phase 5 ships, evaluate:
- **Public map / heatmap** — show pinned reports nationwide (anonymized)
- **PWA install + offline queue** — handle low-signal areas in rural PH
- **Agency-facing dashboard** — agencies log in to manage their queue directly
- **SMS notifications via Semaphore PH** — for critical categories
- **Multilingual UI** — Filipino, English, regional languages
- **DILG/LGU API integrations** — leveraging PSGC codes
