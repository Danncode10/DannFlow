---
description: Conversion-fundamentals audit for landing/marketing pages — hero clarity, CTA, social proof, pricing legibility, friction. Opinionated, judgement-heavy. Reports only.
argument-hint: (optional route path — defaults to / and /pricing if they exist)
---

Audit a landing or marketing page against conversion-fundamentals checklist. This is opinionated and subjective — it surfaces issues a senior growth marketer would call out in a teardown. Reports only; never modifies code.

> **When NOT to use:** product UI, dashboards, settings, internal tools. Use `/ui` and `impeccable` skill for those. `/marketing-check` is specifically for pages whose job is **conversion**.

## Procedure

0. **Check ruflo memory** — search for brand voice decisions, positioning choices, prior audit findings (e.g. "we lead with outcomes not features", "primary audience is indie hackers not enterprise", "last audit flagged weak social proof"). Apply these as additional criteria before scoring.

1. **Determine scope** — if `$ARGUMENTS` is a route, audit that page. Otherwise default to `/` (src/app/page.tsx) and `/pricing` (src/app/pricing/page.tsx) if they exist.

2. **If auditing multiple routes**, spawn one agent per page in parallel — scoring is independent per page. Merge into a single report.

3. **For each page, read the rendered JSX** (top-to-bottom) and the components it imports. Treat what's at the top of the file as "above the fold." Score each fundamental as ✅ / ⚠️ / ❌ with one-line evidence.

3. **Checklist — above the fold (first viewport):**

   - **Headline clarity** — does it answer "what is this, for whom, why care" in <10 seconds? Generic headlines ("Welcome to X", "The future of Y") get ❌.
   - **Subheadline / value prop** — one sentence that says *why now*, *why this*, *what's the outcome*.
   - **Primary CTA** — exactly one, visually dominant, action-verb ("Start free trial" > "Get started"). Two competing primary CTAs above the fold → ⚠️.
   - **Hero visual / proof** — product screenshot, demo, or video. Stock illustration with no product context → ⚠️.
   - **Trust signal in the hero** — "Used by N companies", logos, rating, testimonial snippet. None visible → ⚠️.

4. **Checklist — full page:**

   - **Social proof presence** — testimonials, logos, case studies, ratings, user count. Quantity and quality both matter.
   - **Feature → benefit translation** — features described in customer outcomes, not technical specs ("Sub-100ms responses" → "Customers never wait").
   - **Objection handling** — does the page anticipate and answer the top 2-3 reasons someone wouldn't sign up? (price, security, complexity, vendor lock-in, etc.)
   - **Specificity** — concrete numbers, names, screenshots beat adjectives ("10× faster" > "blazing fast", "Stripe, Vercel, Linear" > "trusted by leading brands").
   - **CTA repetition** — primary CTA reappears at least every viewport-height of scroll.
   - **Friction in the CTA** — does clicking it require credit card / phone / lengthy form? Flag if so.
   - **FAQ section** — does it exist? Does it address real objections or just marketing fluff?

5. **Checklist — pricing pages specifically (if route is /pricing):**

   - **Anchor pricing visible** — at least 3 tiers so the middle one feels like the deal.
   - **Most-popular tier highlighted** — visual emphasis on the intended default.
   - **Annual vs monthly toggle** — present, with the discount % shown.
   - **Free trial / money-back terms** — explicit, not hidden in fine print.
   - **Currency clarity** — `$29/mo` not `29`. Localized currency if international.
   - **Feature comparison table** — for >2 tiers.
   - **"Talk to sales" tier** — for the enterprise option if there is one.

7. **Generate the report** below. No fixes — that's the user's call once they see the audit.

## Output format

```
🎯 Marketing Audit — <route(s)>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROUTE: /
File: src/app/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Above the fold
  ✅ Headline clarity      "AI-Native Next.js SaaS Starter" — clear what + audience
  ⚠️  Subheadline          generic ("Ship faster") — no outcome or proof
  ❌ Primary CTA           two competing buttons: "Get started" + "Read docs"
  ⚠️  Hero visual          uses a stock SVG illustration, not a product screenshot
  ❌ Hero trust signal     none

Full page
  ✅ Social proof          5 customer logos at midpoint
  ⚠️  Feature → benefit    feature grid uses technical terms ("Edge functions", "RLS")
  ❌ Objection handling    no answer to "why not just use Vercel templates?"
  ✅ Specificity           cites concrete numbers ("3x faster setup")
  ⚠️  CTA repetition       only appears at top + bottom — missing in middle scroll
  ✅ CTA friction          "Start free, no card required"
  ❌ FAQ                   none on the page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROUTE: /pricing
File: src/app/pricing/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(pricing-specific checklist...)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP 3 FIXES (by impact)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Resolve competing CTAs above the fold (/) — make "Get started" primary, demote "Read docs" to a text link.
2. Replace stock SVG hero with a real product screenshot or 5s demo loop.
3. Add an FAQ section addressing pricing, security, vendor lock-in.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Critical (❌):  <N>
Warnings (⚠️):  <M>
Solid (✅):     <K>

Recommended next skill triggers:
  - copywriting (coreyhaines31) for headline + subheadline rewrite
  - cro (coreyhaines31) for pricing page tweaks
  - design-taste-frontend / emil-design-eng for visual polish
```

## Constraints

- **Read-only.** Never modify files. The whole point is judgement, not action.
- **Don't grade DannFlow itself** — grade whatever's actually in the route, even if it's still the boilerplate. If the user hasn't customized yet, say so and stop ("Page still uses DannFlow boilerplate — re-run this command once you've written your own marketing copy").
- **Be specific.** Quote the actual headline / CTA text from the code in your evidence — don't be vague.
- **Don't be polite.** A senior growth marketer wouldn't soften an ❌ to a ⚠️ to spare feelings. If two CTAs above the fold compete, it's an ❌.
- **Don't grade product UI.** If the user accidentally targets `/dashboard` or `/settings`, refuse and suggest `/ui` instead.

## Composition

```
/marketing-check                 # default — / and /pricing
/marketing-check /              # one page
# Then either:
# - Use the auto-invoked skills (copywriting, cro, marketing-psychology) for execution
# - Or write the fixes yourself and re-run to confirm
/review                          # before PR
/commit
```
