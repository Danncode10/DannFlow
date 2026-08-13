---
description: "Design and build a bespoke project from README, PROJECT_CONTEXT, and code-owned site configuration."
---

# /design-project

Read `README.md`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, and the existing design system. Interview for the missing project facts, then replace placeholder copy and design with a bespoke, responsive implementation.

Use data only through `src/services/`. DannFlow uses one application per Supabase project: do not introduce `app_id`, `organization_id`, tenant filters, or organization setup. Respect the table's actual RLS policy, user ownership where present, and intentional public-read policies.
