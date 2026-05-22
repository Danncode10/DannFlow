---
description: Active rewrite — adds missing SEO essentials (metadata, OG tags, canonical, JSON-LD, alt text, heading fixes) to one route or all routes. Plan-then-confirm flow.
argument-hint: <route path, e.g. /pricing> or "all"
---

Apply the fixes flagged by `/seo-check` for the route(s) named in `$ARGUMENTS`. Plan-then-confirm — always show what will change before writing.

## Procedure

0. **Check ruflo memory** — search for any SEO decisions already made (canonical domain, OG image strategy, siteName, JSON-LD type choices). Apply stored decisions rather than re-inventing them.

1. **Run `/seo-check` internally** on the target scope to get a fresh gap list. Do not show its full output to the user — just collect the gaps.

2. **Build a fix plan grouped by file**, e.g.:

   ```
   📋 SEO fixes proposed for /pricing

   src/app/pricing/page.tsx
     + Add `export const metadata: Metadata = { ... }` (title, description, openGraph, twitter, alternates.canonical)
     + Add JSON-LD: Product + Offer schema
     ~ Fix heading hierarchy: change <h3> on line 42 to <h2>

   src/app/layout.tsx
     ~ Add lang="en" to <html>

   src/app/sitemap.ts
     + Create (currently missing) — generates entries for all top-level routes

   src/app/robots.ts
     + Create (currently missing) — allow all, point to /sitemap.xml

   public/og-pricing.png
     ! Cannot create image file. Action required:
       Generate a 1200×630 OG image and save to public/og-pricing.png
       Or use src/app/pricing/opengraph-image.tsx (dynamic) — I can scaffold this if you'd like

   Proceed? (y/n)
   ```

3. **Wait for confirmation.** If the user wrote "go" / "just do it" / "yes" in the original invocation, skip the prompt.

4. **Apply edits** using `Edit` for surgical changes, `Write` only for new files (sitemap.ts, robots.ts, opengraph-image.tsx).

   **Templates:**

   **Static metadata** (typical page):
   ```ts
   import type { Metadata } from "next";

   export const metadata: Metadata = {
     title: "<title — ≤60 chars>",
     description: "<120–160 chars>",
     alternates: { canonical: "<absolute URL>" },
     openGraph: {
       title: "<title>",
       description: "<description>",
       url: "<absolute URL>",
       siteName: "<from src/lib/config.ts siteConfig.name>",
       images: [{ url: "<og image URL>", width: 1200, height: 630 }],
       type: "website",
     },
     twitter: {
       card: "summary_large_image",
       title: "<title>",
       description: "<description>",
       images: ["<og image URL>"],
     },
   };
   ```

   **`src/app/sitemap.ts`**:
   ```ts
   import type { MetadataRoute } from "next";
   import { siteConfig } from "@/lib/config";

   export default function sitemap(): MetadataRoute.Sitemap {
     const base = siteConfig.url;
     return [
       { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
       // append routes here
     ];
   }
   ```

   **`src/app/robots.ts`**:
   ```ts
   import type { MetadataRoute } from "next";
   import { siteConfig } from "@/lib/config";

   export default function robots(): MetadataRoute.Robots {
     return {
       rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/"] }],
       sitemap: `${siteConfig.url}/sitemap.xml`,
     };
   }
   ```

   **JSON-LD example** (Product on pricing):
   ```tsx
   <script
     type="application/ld+json"
     dangerouslySetInnerHTML={{
       __html: JSON.stringify({
         "@context": "https://schema.org",
         "@type": "Product",
         name: "DannFlow Pro",
         offers: { "@type": "Offer", price: "29", priceCurrency: "USD" },
       }),
     }}
   />
   ```
   > Note: `dangerouslySetInnerHTML` is the canonical Next.js pattern for JSON-LD per official docs. Allowed here despite CLAUDE.md's general caution.

5. **After edits, run a verification pass:**
   - For each edited route, re-run the `/seo-check` checklist mentally; flag anything still missing.
   - Show the user a summary diff.

6. **Report:**

   ```
   ✅ SEO fixes applied: <route(s)>

   Files changed:
     ~ src/app/pricing/page.tsx           (metadata + JSON-LD)
     ~ src/app/layout.tsx                 (lang attribute)
     + src/app/sitemap.ts
     + src/app/robots.ts

   Files still requiring action:
     ! public/og-pricing.png              (generate 1200×630 image)

   Remaining gaps (re-run /seo-check):
     ⚠ OG image is dimension-unverified — open it manually to confirm 1200×630
     ⚠ description is 145 chars — within range but on the long side

   Suggested commit:
     feat(seo): add metadata, sitemap, robots, JSON-LD for /pricing
   ```

**When fixing `all` routes** — spawn one agent per route in parallel; they don't share state and can write simultaneously. Merge reports at the end.

**After fixes** — save any SEO-level decisions to ruflo memory (e.g. "OG images are dynamic via opengraph-image.tsx, not static PNGs", "canonical domain is https://example.com").

## Constraints

- **Plan-then-confirm.** Never write without showing the plan, except when the user explicitly opts out.
- **Use semantic tokens** if any UI markup is touched (per CLAUDE.md — no hex / hardcoded gray).
- **Never invent siteConfig fields.** Read `src/lib/config.ts` first; if `siteConfig.url` doesn't exist, propose adding it to `config.ts` as part of the plan.
- **Don't fabricate descriptions.** If the page lacks clear content to base a description on, ask the user for the one-liner they want.
- **Never generate images** — only write text. For OG images, scaffold `opengraph-image.tsx` (Next.js renders it at build time) or instruct the user to drop a PNG into `public/`.
- **Preserve existing metadata.** If a route already has partial metadata, merge — don't overwrite.
- **App Router only.** Refuse to touch a `pages/` directory.
- Never `git add` or `git commit`.

## Composition

```
/seo-check                       # see the gaps
/seo-fix /pricing                # fix one route
/seo-fix all                     # fix everything (be ready for a long plan)
/review                          # confirm no regressions
/commit
```
