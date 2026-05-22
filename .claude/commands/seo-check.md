---
description: Audits Next.js App Router routes for SEO completeness — metadata, OG tags, canonicals, sitemap.ts, robots.ts, JSON-LD, alt text, heading hierarchy. Reports gaps only.
argument-hint: (optional route path, e.g. /pricing — defaults to all routes under src/app/)
---

Per-route SEO audit for DannFlow's Next.js 15 App Router. Reports gaps — never modifies code. Use `/seo-fix <route>` to apply the fixes.

## Procedure

0. **Check ruflo memory** — search for prior SEO decisions (canonical domain, OG image strategy, siteName, JSON-LD type choices per route). Apply these as expected values during the audit rather than flagging them as gaps.

1. **Determine scope** — if `$ARGUMENTS` is a route like `/pricing`, audit only `src/app/pricing/page.tsx`. Otherwise audit every `page.tsx` under `src/app/` excluding API routes, layout files, and `(group)` segments unless they have their own metadata.

2. **For each route, check the following:**

   ### Metadata (Next.js App Router conventions)
   - [ ] Exports `metadata` (static) or `generateMetadata` (dynamic) from `page.tsx` or the closest `layout.tsx`
   - [ ] `title` set (string or template object, ≤60 chars rendered)
   - [ ] `description` set, 120–160 chars
   - [ ] `openGraph` block with `title`, `description`, `images`, `url`, `siteName`, `type`
   - [ ] `twitter` block with `card`, `title`, `description`, `images`
   - [ ] OG image exists at the path referenced (check `public/` or a dynamic `opengraph-image.tsx`)
   - [ ] OG image is ≥1200×630 (note if smaller; can't always check from text)
   - [ ] `alternates.canonical` set for non-root pages

   ### Site-wide files
   - [ ] `src/app/sitemap.ts` exists and exports a default function
   - [ ] `src/app/robots.ts` exists
   - [ ] `src/app/opengraph-image.tsx` or fallback `public/og.png` exists

   ### Structured data (JSON-LD)
   - [ ] Page includes appropriate `<script type="application/ld+json">` — `WebSite` on homepage, `Product`/`Article`/`FAQPage`/`Organization` per route purpose
   - [ ] If pricing page: `Product` + `Offer` schema
   - [ ] If blog/article: `Article` schema

   ### Content semantics
   - [ ] Exactly one `<h1>` per page
   - [ ] Heading hierarchy doesn't skip levels (h1 → h2 → h3, no h1 → h3)
   - [ ] All `<img>` / `<Image>` have non-empty `alt` (decorative images use `alt=""`)
   - [ ] No `<a>` without descriptive text ("click here", "read more" are flagged)
   - [ ] `lang` attribute on `<html>` in root `layout.tsx`

   ### Performance proxies (read-only checks)
   - [ ] `next/image` used instead of raw `<img>`
   - [ ] `next/font` used for custom fonts (no raw `<link rel="stylesheet">` to Google Fonts)
   - [ ] `loading="lazy"` on below-fold images (or implicit via `next/image`)

3. **When auditing multiple routes**, spawn one agent per route in parallel — each route audit is fully independent. Merge all route reports before producing the final summary.

4. **Generate the report** in the format below.

5. **Do not modify any files.** This is a read-only audit.

## Output format

```
🔍 SEO Audit — <scope>
Routes audited: <N>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SITE-WIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ src/app/sitemap.ts
✗ src/app/robots.ts                MISSING
✓ Fallback OG image: public/og.png
✗ <html lang="..."> on root        MISSING in src/app/layout.tsx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROUTE: /
File: src/app/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Metadata
  ✓ title              "DannFlow — AI-Native Next.js SaaS Starter"
  ⚠ description        87 chars (recommend 120–160)
  ✗ openGraph block    MISSING
  ✗ twitter block      MISSING
  ✗ canonical          MISSING (alternates.canonical)

Structured data
  ✗ JSON-LD            no <script type="application/ld+json"> found
    Suggested: WebSite + Organization schema

Content semantics
  ✓ One <h1>
  ⚠ Heading skip       h1 → h3 (line 42 in src/app/page.tsx)
  ✗ alt missing        src/components/Hero.tsx:23 <img src="/hero.png">

Performance
  ✓ next/image used
  ✓ next/font used

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROUTE: /pricing
... (same structure)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Critical (fix before launch):   <N>
Warnings:                       <M>
Routes clean:                   <K> / <total>

Fix this route:  /seo-fix /
Fix all routes:  /seo-fix all
```

## Constraints

- **Read-only.** Never modify files.
- **App Router only.** If you detect Pages Router (`pages/` dir), stop and warn — this command targets `src/app/`.
- Don't flag missing OG images on dynamic routes that use `opengraph-image.tsx` — that's the right pattern.
- Don't flag a missing `metadata` export on a route if the closest `layout.tsx` covers it (Next.js merges parent metadata).
- If the user passed an invalid route, list available routes and stop.
- Never `git add` or `git commit` — leave that for the user.

## Composition

```
/seo-check                       # full site audit
/seo-fix /pricing                # apply the fixes for one route
/review                          # before PR — confirms no regressions
```

Pairs well with the `seo-audit` (coreyhaines31) and `seo` (addyosmani/web-quality-skills) auto-invoked skills — they bring strategic context; this command enforces the per-route checklist.
