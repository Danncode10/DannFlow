---
description: "Apply approved product copy and semantic theme tokens to the existing template without changing its layout, interactions, or hero media."
---

# /design-project

Read `README.md`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, and the existing design system. Interview for the missing project facts, then adapt the existing template with a responsive, project-specific visual direction.

## Existing-template adaptation — mandatory

This command starts from the existing template. It adapts the template to the product; it does **not** assume permission to replace it.

### Non-negotiable preservation contract

Unless the user explicitly requests a named redesign, a `/design-project` run is a **theme and copy pass only**. The following are protected implementation assets and must remain in place and functional:

- the existing page and component hierarchy, section order, route structure, and navigation;
- the existing hero composition, media, video, typewriter, animations, and interaction patterns;
- the existing feature, pricing, blog, CTA, navbar, and footer components, including their current layout behavior; and
- the existing sign-in page at `src/app/login/page.tsx`, including its sign-in, sign-up, password-recovery, Google OAuth, validation, loading, success, and responsive behaviors; and
- existing client/server boundaries, data wiring, loading states, and responsive behavior.

Do not delete a component, replace an entire component implementation, substitute a different preview or visual concept, remove an animation or media asset, or convert one section into a different kind of section. Do not add, remove, merge, or reorder sections. A color/theme update must be expressed through existing semantic tokens; copy updates must stay within the existing component's current content slots. The sign-in page must receive the same project copy and visual treatment as the landing page; preserve its format and all auth behavior while replacing template-branded text and stale visual styling.

### Hero-media freeze — absolute

`/design-project` has **zero authority** over hero media. It must not edit, delete, replace, move, optimize, rename, regenerate, re-encode, add, or change the use of any of these existing assets:

- `public/hero-poster.avif`
- `public/hero-background.mp4`
- `public/hero-background.webm`

It must also preserve the existing hero media loading, fallback, source-selection, poster, playback, and typewriter behavior in `src/components/landing/hero.tsx`. Do not touch the hero's media-related imports, markup, props, hooks, helper functions, CSS classes, or settings. Hero media is handled only by the later dedicated hero-media task; any request to change it during `/design-project` must stop and ask the user to run that task instead.

Before any mutation, list the exact files and explicitly confirm for each one: **"theme/copy-only; hierarchy, media, and interactions preserved."** If the requested visual result cannot be achieved under that contract, stop and ask for separate, explicit redesign permission. Never treat approval of a palette as approval to change layout, motion, media, or component structure.

### 1. Inspect before proposing changes

Before editing, inspect the existing page structure, shared design tokens, navigation, landing sections, relevant components, and current visual behavior. Treat those files as the implementation baseline.

Use the product overview to suggest a fitting visual direction. The proposal must include:

- one recommended color theme, with the product reason behind it;
- the existing semantic tokens that would change;
- the existing template components or copy that would be refined; and
- an explicit statement that page structure, section order, navigation, and template interactions will remain intact.

Offer one or two alternatives only when the product context makes the color decision genuinely subjective. Do not invent a replacement landing-page concept to demonstrate a palette.

### 2. Require design approval before mutation

Wait for the user to approve the recommended color direction and component scope before making visual changes. If the user supplied a color or a specific target component, confirm that scope briefly and proceed. A request to run `/design-project` alone authorizes analysis and a proposal—not a wholesale visual rewrite.

### 3. What is allowed after approval

Adapt the existing template in place. Allowed work includes:

- updating the existing semantic color tokens to the approved palette;
- revising starter copy in its current sections for the product;
- refining existing copy, spacing, typography, borders, and component states to match the approved theme, without changing the component's composition or interaction behavior;
- carrying the approved tokens into related existing surfaces, such as login, forms, and email templates.

The sign-in page is an in-scope dependent surface on every run. Update its existing brand label, headings, explanatory copy, feature list, form and button surfaces, success/error states, and footer to match the product and approved semantic tokens. Do not change the login page's structure, auth handlers, form fields, route, mode switching, or responsive breakpoint behavior.

These refinements must reuse the template's components and preserve its route structure, section order, navigation, footer, media, animations, interactions, and established responsive behavior.

### 4. What requires explicit separate permission

Do not replace the landing page, rebuild its sections, swap the navigation or footer, remove template features, replace the component hierarchy, or rewrite global styling wholesale unless the user explicitly asks for that redesign and identifies the intended scope.

If a proposed change could alter more than a small existing component, stop and show the exact files and template areas that would change. Wait for confirmation before editing.

For email templates or other dependent surfaces, document the approved visual direction first; do not redesign the public UI solely to create a palette.

### 5. Visible verification — mandatory

After editing, run the local app and inspect `/login` at desktop and mobile widths. Show the updated sign-in page to the user through the available browser preview or a rendered screenshot, then report the verified viewports and any unavailable interaction checks. Do not claim the sign-in page has been updated until its project copy and visual treatment are visibly verified.

Use data only through `src/services/`. DannFlow uses one application per Supabase project: do not introduce `app_id`, `organization_id`, tenant filters, or organization setup. Respect the table's actual RLS policy, user ownership where present, and intentional public-read policies.
