---
description: "Design and build a bespoke project from README, PROJECT_CONTEXT, and code-owned site configuration."
---

# /design-project

Read `README.md`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, and the existing design system. Interview for the missing project facts, then adapt the existing template with a responsive, project-specific visual direction.

## Existing-template adaptation — mandatory

This command starts from the existing template. It adapts the template to the product; it does **not** assume permission to replace it.

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
- refining existing components, spacing, typography, borders, imagery, and component states to match the approved theme;
- making small, localized layout improvements inside an existing component when they preserve its purpose and surrounding information architecture; and
- carrying the approved tokens into related existing surfaces, such as login, forms, and email templates.

These refinements must reuse the template's components and preserve its route structure, section order, navigation, footer, interactions, and established responsive behavior.

### 4. What requires explicit separate permission

Do not replace the landing page, rebuild its sections, swap the navigation or footer, remove template features, replace the component hierarchy, or rewrite global styling wholesale unless the user explicitly asks for that redesign and identifies the intended scope.

If a proposed change could alter more than a small existing component, stop and show the exact files and template areas that would change. Wait for confirmation before editing.

For email templates or other dependent surfaces, document the approved visual direction first; do not redesign the public UI solely to create a palette.

Use data only through `src/services/`. DannFlow uses one application per Supabase project: do not introduce `app_id`, `organization_id`, tenant filters, or organization setup. Respect the table's actual RLS policy, user ownership where present, and intentional public-read policies.
