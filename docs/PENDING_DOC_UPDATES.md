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

## [juanStack-P1.5] JuanStack Phase 1.5 — BIR Compliance Research & Schema Expansion

**Branch:** `SaaS-Starter`
**Date:** 2026-09-12
**Status:** 🟢 Phase 1.5 complete — pending human verification

### What Was Done

#### Research & Documentation

- Created `docs/juanstack/bir-compliance-research.md` containing research on RA 11976 (EOPT Act) changes (Micro/Small/Medium/Large classifications, file-and-pay anywhere).
- Documented exact field requirements for BIR Forms 2551Q, 1701Q, and 2307.

#### Schema Updates

- Expanded `docs/juanstack/schemas/business.schema.json`. Added 8 new real-world data points to the `bir_rules` object:
  - `rdo_code`
  - `registered_address`
  - `psic_code`
  - `line_of_business`
  - `vat_status`
  - `atc_percentage_tax`
  - `atc_income_tax`
  - `atc_withholding_tax`

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
