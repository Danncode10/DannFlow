# Project Context

> This file is read by Claude, skills, and commands before they act on your project.
> Fill it in once after running `/init-claude`. Update it when your product direction changes.
> Do NOT edit `.claude/skills/` files directly — put project-specific context here instead.

---

## What this app is

**App name:** <!-- e.g. "Trello for freelancers" -->

**One-liner:** <!-- What it does, for whom, and the outcome. Max 1 sentence. -->
<!-- Example: "Helps freelance designers track client revisions without email chaos." -->

**The problem it solves:**
<!-- 2-3 sentences. What's broken without this app? -->

---

## Target audience

**Primary user:**
<!-- Job title / persona. e.g. "Indie SaaS founders who code solo" -->

**What they care most about:**
<!-- Top 1-2 outcomes. e.g. "Shipping fast without breaking auth or losing data." -->

**What they don't care about:**
<!-- Helps Claude avoid over-engineering. e.g. "Enterprise SSO, complex RBAC, audit logs." -->

---

## Stack decisions (supplement CLAUDE.md)

> Only add decisions that differ from DannFlow defaults or that you want emphasized.

<!-- Examples:
- Email: Resend (not SendGrid)
- Payments: Lemon Squeezy (not Stripe)
- State: TanStack Query only — no Zustand, no Redux
- Auth: Supabase email/password only — no social providers yet
- File uploads: Supabase Storage (not S3)
-->

---

## Design decisions

> These override or supplement the UI standards in CLAUDE.md.
> Commands like /ui and /new-feature read this before applying styles.

<!-- Examples:
- Border radius: rounded-2xl for cards, rounded-xl for inputs (not rounded-lg)
- Spacing: p-6/gap-6 as base — never p-4/gap-4 in main content areas
- Typography: text-lg for body copy, not text-base
- Buttons: h-14 (not h-12) — we target iPad touch users
- Color mode: dark mode first, light mode secondary
-->

---

## Tone & voice

> For /marketing-check, copywriting, and seo-fix.

**Brand tone:**
<!-- e.g. "Confident and direct. No fluff. Talk like a senior engineer, not a marketing team." -->

**What to avoid:**
<!-- e.g. "No buzzwords like 'revolutionary' or 'game-changing'. No exclamation marks." -->

---

## Anti-decisions (things we're NOT doing)

> Saves Claude from suggesting them. Equally important as the decisions above.

<!-- Examples:
- NOT adding a mobile app — web only for now
- NOT supporting multi-tenancy — single user per account
- NOT using Prisma — Supabase types only
- NOT adding analytics until we have 100 users
-->

---

## Current focus / what's being built right now

> Update this as the project evolves. Helps Claude prioritize suggestions.

<!-- e.g. "Phase 1: auth + onboarding. Phase 2: core CRUD. Not thinking about billing yet." -->

---

*Last updated: <!-- YYYY-MM-DD -->*
