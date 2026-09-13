<!-- Ledger cleared. Log new pending documentation updates here. -->

---

## [juanStack-P0] JuanStack Phase 0 — Architecture & Governance Setup

**Branch:** `SaaS-Starter`
**Date:** 2026-09-12
**Status:** 🟡 Phase 0 complete — pending human verification (`/verify-task juanstack_masterplan phase0`)

### What Was Done

#### New Files Created

- `docs/juanstack/DANNFLOW_REVISION_PLAN.md` — Full architectural spec for the JuanStack vertical engine revision. Covers 6 revisions: folder structure, `business.json` DNA, AI Manifest system, Namespace Contract, BIR module library, and analytics module library.
- `docs/juanstack/juanstack_masterplan.md` — 8-phase step-by-step implementation masterplan with task IDs `[P0.x]` through `[P8.x]`.
- `docs/juanstack/schemas/business.schema.json` — JSON Schema Draft-07 defining the full contract for the Vertical DNA `business.json` config file (all keys, types, required fields, enums, patterns).
- `docs/juanstack/schemas/ai-manifest.schema.json` — JSON Schema Draft-07 defining the AI Secretary manifest contract including `ObservableState` shape, trigger condition patterns, priority enum, and cooldown rules.

#### Files Modified

- `AGENTS.md` — Appended the **JuanStack Vertical Namespace Rules** section:
  - Locked architecture decisions table (D1–D5)
  - The Golden Rule (which folders each vertical owns)
  - Namespace Convention Table
  - Pre-task and pre-sync checklists
  - Domain Terminology Rule (`useTerm()` / `getTerm()` enforcement)
  - Build-time loading declaration for `business.json`
- `CLAUDE.md` — Appended the exact same **JuanStack Vertical Namespace Rules** section to keep Claude's specific rulebook perfectly in sync with the general `AGENTS.md`.
- `docs/juanstack/juanstack_masterplan.md` — Injected **Phase 1.5: BIR Compliance Research & Schema Expansion** before Phase 2. This ensures we research exact EOPT/ATC/RDO requirements before building the core engine.
- `.agents/skills/source-command-sync-to-upstream/SKILL.md` — Inserted **Step 1.5: JuanStack Owned-Path Validation (HARD BLOCK)**. The sync script now reads `business.json → owned_paths` and stops the PR if any staged file falls outside declared owned paths.
- `dannflow.json` — Bumped `dannflow_version` to `2.0.0-juanstack-alpha`. Added `revision_notes` field describing the JuanStack revision scope.
- `docs/README.md` — Added **Section 7: JuanStack Vertical Engine Revision** linking to all planning docs and schemas.

### Architecture Decisions Locked (D1–D5)

| ID  | Decision                       | Resolution                              |
| --- | ------------------------------ | --------------------------------------- |
| D1  | `business.json` load strategy  | Build-time via `next build`             |
| D2  | Multi-tenancy model            | Separate Supabase projects per vertical |
| D3  | AI Secretary runtime           | Supabase Edge Function with pg_cron     |
| D4  | `sync-to-upstream` enforcement | Hard block on `owned_paths` violations  |
| D5  | Registry location              | Separate `juanstack-portal` repo        |

### What Still Needs to Be Done (Tracked in Masterplan)

- `[P1+]` All remaining phases (folder skeletons, BIR engine, AI Secretary, analytics core, vertical config wiring, attyjuan test, vetstack test, portal).
- The `AGENTS.md` JuanStack section needs to also be copied into `CLAUDE.md` if that file is used as the primary agent context file — verify this is not a duplicate concern.
- Once Phase 6 (`attyjuan`) is complete, create `docs/juanstack/vertical-setup-guide.md`.
- Once Phase 3 (AI Secretary) is complete, create `docs/juanstack/ai-secretary-architecture.md` with a Mermaid diagram of the task-engine flow.

### Clear This Entry When

- All 8 masterplan phases are marked `[x]`
- `docs/juanstack/vertical-setup-guide.md` is written
- `docs/juanstack/ai-secretary-architecture.md` is written
- `docs/juanstack/bir-core-api.md` is written
- `docs/juanstack/analytics-core-api.md` is written

---

- Verified Phase 0 tasks complete

---

## [juanStack-Architecture] Scheduling Module Architecture Addition

**Branch:** `SaaS-Starter`
**Date:** 2026-09-12
**Status:** 🟢 Architecture expanded — pending implementation

### What Was Done

#### Schema Updates

- Added `scheduling_module` feature flag to `business.schema.json`.
- Added `scheduling_rules` block to schema for configuring meeting duration, owner approval requirement, and Google Calendar sync toggle.
- Added `scheduling_module: false` to the root `business.json` template.

#### Masterplan & Architecture Docs

- Updated `docs/juanstack/juanstack_masterplan.md`:
  - Inserted Phase 1E (Scheduling Module Library scaffolding).
  - Updated Phase 3 (AI Secretary System) to include `SchedulingIntent` in the type definitions.
  - Inserted a brand new Phase 4 (Scheduling Core Engine) handling conflict detection and API stubs.
  - Bumped subsequent phases accordingly (we now have 9 phases).
- Updated `docs/juanstack/DANNFLOW_REVISION_PLAN.md`:
  - Added Revision 7 (Scheduling Module Library) and corresponding folder tree.
  - Inserted Phase 4 into the checklist.
  - Added `src/scheduling/` to the namespace rules block.

#### Scaffolding

- Generated the base folder skeleton: `src/scheduling/core/`, `src/scheduling/legal/`, `src/scheduling/veterinary/`, `src/scheduling/restaurant/`.
- Placed `OWNERSHIP.md` guards in vertical directories to enforce `sync-to-upstream` namespace blocks.
- Created `src/scheduling/core/scheduling-types.ts` and `index.ts`.

## [juanStack-P1.5] JuanStack Phase 1.5 — BIR Compliance Research & Schema Expansion

**Branch:** `SaaS-Starter`
**Date:** 2026-09-12
**Status:** 🟢 Phase 1.5 complete — pending human verification

### What Was Done

#### Research & Documentation

- Created `docs/juanstack/bir-compliance-research.md` containing research on RA 11976 (EOPT Act) changes (Micro/Small/Medium/Large classifications, file-and-pay anywhere).
- Documented exact field requirements for BIR Forms 2551Q, 1701Q, and 2307.

#### Schema Updates

- Expanded `docs/juanstack/schemas/business.schema.json`. Added base industry rules. Note: Tenant-specific fields originally planned here were moved out of the schema config per Phase 2.5 SaaS Architecture rules.

#### Checklists Updated

- `docs/juanstack/juanstack_masterplan.md` — Marked Phase 1.5 tasks (`[P1.5.1]` to `[P1.5.DOC]`) as done `[x]`.

## [juanStack-P1] JuanStack Phase 1 — Folder Architecture & Skeleton Files

**Branch:** `SaaS-Starter`
**Date:** 2026-09-12
**Status:** 🟢 Phase 1 complete — pending human verification

### What Was Done

#### New Directories & Skeleton Files Created

- `src/bir/` ecosystem: `core/`, `legal/`, `veterinary/`, `restaurant/` folders with `.gitkeep` and `OWNERSHIP.md` guards. Created `form-types.ts` and `index.ts` barrels in `core/`.
- `src/analytics/` ecosystem: `core/`, `legal/`, `veterinary/`, `restaurant/` folders with `.gitkeep` and `OWNERSHIP.md` guards. Created `analytics-types.ts` and `index.ts` barrels in `core/`.
- `src/ai/` ecosystem: `secretary/` and `personas/` folders with `.gitkeep`.
- `src/ai/secretary/types.ts` — Defined `SecretaryTask`, `ObservableState`, and `AIManifest` TypeScript interfaces.
- `src/ai/core.ai-manifest.json` — Populated with 3 universal observable states (`subscription_expiring`, `invoice_overdue`, `document_missing`) following the schema.
- `business.json` — Created root config file populated with the generic default template.
- `businesses.registry.json` — Created root registry file with empty verticals array.

#### Checklists Updated

- `docs/juanstack/juanstack_masterplan.md` — Marked all Phase 1 tasks (`[P1A.1]` to `[P1.DOC]`) as done `[x]`.
- `docs/juanstack/DANNFLOW_REVISION_PLAN.md` — Marked Phase 1 checklist at the bottom as `[x]`.

### Phase 2: BIR Core Engine Complete

- **Date**: 2026-09-12
- **Changes**: Implemented standard Philippine tax computations in `src/bir/core/` (EOPT Engine, Tax Calculator with Graduated/8% rules, Withholding tax logic). Added `bir-core-api.md` as API reference.
- **Impact**: All verticals will now import compute functions from this central core.

### Phase 2.5: SaaS Architecture Cleanup

- **Date**: 2026-09-12
- **Changes**: Cleaned up `business.schema.json` to strip out single-tenant data fields from the platform config, reinforcing the multi-tenant SaaS architecture. Made the `juanstack-init` wizard completely optional in the masterplan.

### Phase 2.6: Core Database Schema (Supabase)

- **Date**: 2026-09-12
- **Changes**: Created `20260912000000_core_tenant_schema.sql` (organizations table) and `20260912000001_ai_secretary_schema.sql` (secretary_tasks table) in `dannflow` template. Both tables include Row Level Security (RLS) policies for cross-tenant data isolation.
- **Impact**: Any vertical cloned from `dannflow` can now run `db:migrate` to instantly provision its own database with tenant profiles and the AI task queue.

- Human Verified Phase 2.6

### Phase 2.7: Pre-Phase 3 Architecture Cleanup

- **Date**: 2026-09-12
- **Changes**: Swept the entire masterplan and revision docs for architectural conflicts following the multi-tenant database shift. Corrected Phase 3 to rely on Supabase generated types instead of manual typing. Updated Phase 4 to enforce DB migrations for scheduling records. Updated Phase 10 to mandate that initialization tools push tenant data into the Supabase database instead of `business.json`. Scrubbed `DANNFLOW_REVISION_PLAN.md` to remove old single-tenant BIR rules.

### Phase 2.8: Legacy Module Multi-Tenant Upgrade

- **Date**: 2026-09-12
- **Changes**: Generated SQL migrations `20260912000002_core_modules_multitenant.sql` and `20260912000003_fix_core_modules.sql` to resurrect and upgrade DannFlow's legacy starter modules (`blog_posts`, `services`, `gallery_items`, `leads`, `bookings`). Each table was re-created with an `organization_id` foreign key. We also created a Postgres function `public.get_current_org_id()` to auto-assign the tenant ID on inserts, which allowed the Next.js UI to compile cleanly without needing to manually pass `organization_id` from the frontend.
- **Impact**: The legacy dashboard UI components will now compile successfully without TypeScript errors, and DannFlow retains its powerful built-in "SaaS-in-a-box" features while safely adhering to the JuanStack multi-tenant architecture.

### Phase 3: AI Secretary System Backbone

- **Date**: 2026-09-13
- **Changes**: Implemented the core engine for the AI Secretary. This included defining `types.ts`, building a pure-TypeScript `task-engine.ts` in `supabase/functions/_shared/`, and creating the `ai-secretary` Edge Function to act as the cron scheduler. Added `task-queue.ts` and `secretary.service.ts` to expose the tasks to the React frontend. Created `docs/juanstack/ai-secretary-architecture.md`.
- **Impact**: The backend infrastructure for proactive AI task generation is complete. The system can now read `core.ai-manifest.json`, scan tables, and generate `secretary_tasks` securely. Next step is Phase 3A (UI Implementation).

### Pre-Phase 3A: Inspiration Folder Protocol

- **Date**: 2026-09-13
- **Changes**: Added `inspirations/` to `.gitignore`. Updated `AGENTS.md`, `CLAUDE.md`, and `docs/dannflow_docs/workflows/claude-workflow.md` to enforce the Inspiration Folder Protocol for all major UI tasks. Inserted step `[P3A.0]` into `juanstack_masterplan.md`.
- **Impact**: AI agents are now required to ask the user if they want to clone a reference GitHub repository into `inspirations/` before beginning complex UI tasks, conserving tokens and providing a solid design baseline.
