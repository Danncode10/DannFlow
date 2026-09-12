# JuanStack Revision Plan for `dannflow`

> **Branch:** `juanStack-rules`
> **Status:** 🟡 Planning Phase — Do NOT merge to `main` until all revisions are validated across at least one vertical repo (`attyjuan`).
> **Purpose:** This document is the super-detailed instruction set for every architectural addition, rule, and convention that must be introduced into the `dannflow` template engine to support the JuanStack vertical SaaS ecosystem.

---

## 🗺️ Overview of What We Are Building

JuanStack is a **Multi-Tenant Vertical SaaS Ecosystem** (Management as a Service) for the Philippine market. `dannflow` is its core engine — a shared Next.js template that all industry-specific "vertical" repositories inherit from.

The goal of this revision is to evolve `dannflow` from a **generic SaaS starter** into a **vertical library registry** — a system where:

- Industry-specific modules (BIR tax logic, analytics dashboards, AI personas) live in namespaced folders inside `dannflow`.
- Each vertical repo activates only its own modules via a `business.json` config file.
- AI coding assistants (Claude, Codex, Gemini) have strict, hallucination-proof rules about what belongs where.
- A proactive AI Secretary system is natively supported.

---

## 📂 Revised `dannflow` Folder Architecture

This is the **target state** of the `dannflow` source tree after this revision. New folders are marked `[NEW]`.

```
dannflow/
├── src/
│   ├── core/                          # Shared, vertical-agnostic logic
│   │   ├── auth/                      # Supabase auth, session management
│   │   ├── billing/                   # Stripe subscriptions, plan gating
│   │   ├── roles/                     # RBAC: owner, staff, viewer
│   │   └── notifications/             # Email, in-app alerts (Resend / Novu)
│   │
│   ├── bir/                           # [NEW] BIR Tax Module Library
│   │   ├── core/                      # Shared computation engine (tax brackets, EOPT)
│   │   │   ├── eopt-engine.ts         # RA 11976 logic: Micro/Small classification
│   │   │   ├── tax-calculator.ts      # Graduated vs. 8% gross receipt tax
│   │   │   └── form-types.ts          # Shared TypeScript types for all BIR forms
│   │   ├── legal/                     # [NEW] Owned by: attyjuan
│   │   │   ├── form-2307.ts
│   │   │   ├── form-1701Q.ts
│   │   │   └── form-2551Q.ts
│   │   ├── veterinary/                # [NEW] Owned by: vetstack (placeholder)
│   │   │   └── .gitkeep
│   │   └── restaurant/                # [NEW] Owned by: restostack (placeholder)
│   │       └── .gitkeep
│   │
│   ├── analytics/                     # [NEW] Analytics Module Library
│   │   ├── core/                      # Shared: chart wrappers, dashboard shell, KPI card
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── KPICard.tsx
│   │   │   └── ChartWrapper.tsx
│   │   ├── legal/                     # [NEW] Owned by: attyjuan
│   │   │   ├── CaseRevenueChart.tsx
│   │   │   ├── BillableHoursKPI.tsx
│   │   │   └── CollectionRateCard.tsx
│   │   ├── veterinary/                # [NEW] Placeholder
│   │   │   └── .gitkeep
│   │   └── restaurant/                # [NEW] Placeholder
│   │       └── .gitkeep
│   │
│   ├── ai/                            # [NEW] AI Secretary System
│   │   ├── core.ai-manifest.json      # Default observable states (universal)
│   │   ├── secretary/
│   │   │   ├── task-engine.ts         # Background job: reads states, queues tasks
│   │   │   ├── task-queue.ts          # Human-facing task queue interface
│   │   │   └── types.ts               # SecretaryTask, ObservableState types
│   │   └── personas/                  # [NEW] Vertical-specific AI personas
│   │       ├── legal.ai-manifest.json
│   │       ├── veterinary.ai-manifest.json
│   │       └── restaurant.ai-manifest.json
│   │
│   └── services/                      # Existing services layer (keep as-is)
│
├── business.json                      # [NEW] Vertical DNA — overridden per vertical repo
├── businesses.registry.json           # [NEW] Master registry (for the JuanStack portal)
└── dannflow.json                      # Existing version anchor
```

---

## 📋 Revision 1: The `business.json` Vertical DNA System

### What It Is

A config file at the root of every vertical repo that `dannflow` reads at boot time to:

- Toggle feature flags (which modules are active)
- Set domain terminology (Client vs. Patient vs. Customer)
- Define BIR tax rules for that industry
- Load the correct AI persona

### Full Specification

```json
{
  "vertical_id": "attyjuan",
  "name": "AttyJuan",
  "description": "Smart legal practice management for solo practitioners.",

  "owned_paths": [
    "src/bir/legal/",
    "src/analytics/legal/",
    "src/ai/personas/legal.ai-manifest.json"
  ],

  "domain_nomenclature": {
    "provider": "Lawyer",
    "consumer": "Client",
    "transaction": "Billable Case",
    "inventory_item": null
  },

  "dannflow_features": {
    "auth_module": true,
    "billing_module": true,
    "inventory_management": false,
    "pos_terminal": false,
    "bir_module": true,
    "analytics_module": true,
    "ai_secretary": true
  },

  "bir_rules": {
    "module_path": "src/bir/legal/",
    "taxpayer_classification": "Micro",
    "withholding_tax_percentage": 10.0,
    "eligible_for_8_percent_gross": true,
    "applicable_laws": ["RA 11976 (Ease of Paying Taxes Act)"]
  },

  "ai_rules": {
    "persona_manifest": "src/ai/personas/legal.ai-manifest.json",
    "system_prompt_persona": "You are a proactive legal administrative assistant. You manage the lawyer's schedule, track case deadlines, and monitor tax compliance.",
    "tone": "professional_warm",
    "hard_limits": [
      "Never provide legal advice. Administrative guidance only.",
      "Never access or display another client's case data.",
      "Always confirm before sending any external communication."
    ]
  }
}
```

### AI Coding Rules for `business.json`

- NEVER hardcode domain terminology (e.g., "Client", "Patient") in any `.tsx` component. Always read from `business.json -> domain_nomenclature`.
- NEVER import a BIR module directly by path. Always resolve from `business.json -> bir_rules.module_path`.
- Feature flags in `dannflow_features` are the single source of truth for what is rendered.

---

## 📋 Revision 2: The AI Manifest System

### Tier 1: `core.ai-manifest.json` (Universal Defaults in `dannflow`)

```json
{
  "manifest_version": "1.0.0",
  "description": "Core observable states available to the AI Secretary in all dannflow verticals.",
  "observable_states": [
    {
      "id": "subscription_expiring",
      "table": "subscriptions",
      "trigger_field": "current_period_end",
      "trigger_condition": "within_7_days",
      "semantic_meaning": "The user subscription is expiring within 7 days.",
      "suggested_task": "Notify the owner to renew their subscription.",
      "priority": "high"
    },
    {
      "id": "invoice_overdue",
      "table": "invoices",
      "trigger_field": "payment_status",
      "trigger_condition": "equals: overdue",
      "semantic_meaning": "A client invoice has not been paid past the due date.",
      "suggested_task": "Draft a polite follow-up email to the client.",
      "priority": "medium"
    },
    {
      "id": "document_missing",
      "table": "documents",
      "trigger_field": "upload_status",
      "trigger_condition": "equals: missing",
      "semantic_meaning": "A required document has not been uploaded for an active record.",
      "suggested_task": "Prompt the owner to upload the missing document.",
      "priority": "medium"
    }
  ]
}
```

### Tier 2: `legal.ai-manifest.json` (Vertical-Specific, Owned by `attyjuan`)

```json
{
  "manifest_version": "1.0.0",
  "vertical_id": "attyjuan",
  "extends": "src/ai/core.ai-manifest.json",
  "observable_states": [
    {
      "id": "case_deadline_approaching",
      "table": "cases",
      "trigger_field": "next_hearing_date",
      "trigger_condition": "within_72_hours",
      "semantic_meaning": "A case has a court hearing scheduled within 72 hours.",
      "suggested_task": "Remind the lawyer to prepare documents for Case #[case_id].",
      "priority": "critical"
    },
    {
      "id": "bir_quarter_due",
      "table": "bir_filings",
      "trigger_field": "quarter_end_date",
      "trigger_condition": "within_14_days",
      "semantic_meaning": "A BIR quarterly filing deadline is approaching.",
      "suggested_task": "Auto-generate the 2551Q draft and prompt the lawyer to review.",
      "priority": "high"
    }
  ]
}
```

### AI Coding Rules for the Manifest System

- NEVER add vertical-specific states to `core.ai-manifest.json`.
- NEVER give the AI Secretary write access to any table. Read-only observation only.
- Every new database table that has a monitorable state MUST have a corresponding entry added to the appropriate manifest.
- The `task-engine.ts` background job reads the manifest at startup and registers Supabase Realtime listeners for each observable state.

---

## 📋 Revision 3: The Vertical Namespace Contract (Anti-Collision System)

### The Problem

When a vertical repo uses `sync-to-upstream`, it creates a PR to `dannflow`. Without a namespace contract, that PR could accidentally modify files owned by another vertical.

### The Solution: `owned_paths` + Scoped Sync

1. Every vertical declares `owned_paths` in its `business.json`.
2. The `sync-to-upstream` script reads `owned_paths` and ONLY stages files within those paths.
3. `AGENTS.md` enforces this contract at the AI coding level.

### Namespace Convention (Non-Negotiable)

| Module        | Path Pattern                                                   | Owner           |
| ------------- | -------------------------------------------------------------- | --------------- |
| BIR Tax Logic | `src/bir/{vertical_id}/`                                       | That vertical   |
| Analytics     | `src/analytics/{vertical_id}/`                                 | That vertical   |
| Scheduling    | `src/scheduling/{vertical_id}/`                                | That vertical   |
| AI Persona    | `src/ai/personas/{vertical_id}.ai-manifest.json`               | That vertical   |
| Core Engine   | `src/bir/core/`, `src/analytics/core/`, `src/scheduling/core/` | `dannflow` only |

### Hard Rule

> A vertical repo may ONLY sync changes to files within its declared `owned_paths`. Changes to `core/` folders or another vertical's folder are BLOCKED by the sync script.

---

## 📋 Revision 4: BIR Module Library

### `src/bir/core/` — Shared Engine (Never Synced from a Vertical)

| File                 | Purpose                                                     |
| -------------------- | ----------------------------------------------------------- |
| `eopt-engine.ts`     | Micro/Small/Medium classification by gross sales (RA 11976) |
| `tax-calculator.ts`  | 8% gross vs. graduated rates; EOPT reduced penalties        |
| `form-types.ts`      | TypeScript interfaces for all BIR form data structures      |
| `withholding-tax.ts` | 2307 withholding amounts by taxpayer classification         |

### `src/bir/legal/` — Legal Vertical (Owned by `attyjuan`)

| File                    | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `form-2307.ts`          | Certificate of Creditable Tax Withheld (10% professional services) |
| `form-1701Q.ts`         | Quarterly income tax return for self-employed professionals        |
| `form-2551Q.ts`         | Quarterly percentage tax (3% or 8% election)                       |
| `legal-bir-summary.tsx` | Dashboard widget: upcoming BIR deadlines                           |

### BIR Coding Rules

- NEVER import directly from `src/bir/legal/`. Always resolve from `business.json -> bir_rules.module_path`.
- All BIR forms must use types from `src/bir/core/form-types.ts`.
- Tax computation MUST go through `src/bir/core/tax-calculator.ts`. No inline tax math.

---

## 📋 Revision 5: `AGENTS.md` Additions (AI Hallucination Prevention)

The following block must be appended to `dannflow/AGENTS.md` under heading: `## JuanStack Vertical Namespace Rules`.

```
## JuanStack Vertical Namespace Rules

When editing code in a vertical repo (e.g., `attyjuan`), you may ONLY modify:
1. Files within `src/bir/{this_vertical_id}/`
2. Files within `src/analytics/{this_vertical_id}/`
3. Files within `src/scheduling/{this_vertical_id}/`
4. Files named `src/ai/personas/{this_vertical_id}.ai-manifest.json`
5. All other non-namespaced project files

You MUST NEVER modify:
- `src/bir/core/` (requires a direct `dannflow` PR)
- `src/analytics/core/` (requires a direct `dannflow` PR)
- `src/ai/core.ai-manifest.json` (requires a direct `dannflow` PR)
- Any other vertical's namespace folder

Before starting any BIR or Analytics task:
1. Read `business.json` at the repo root.
2. Confirm `vertical_id` to know which namespace folder you own.
3. Confirm which features are enabled in `dannflow_features`.
4. Read the AI manifest at `business.json -> ai_rules.persona_manifest`.

Before syncing to upstream:
1. Read `business.json -> owned_paths`.
2. Verify every staged file is within an owned path.
3. If any staged file is outside owned_paths, STOP and report the conflict.

Domain Terminology Rule:
NEVER hardcode "Client", "Patient", "Customer", "Case", "Appointment", or any domain
noun in a `.tsx` or `.ts` file. Always read from `business.json -> domain_nomenclature`.
```

---

## 📋 Revision 6: Analytics Module Library

```
src/analytics/
├── core/
│   ├── DashboardShell.tsx     # Layout wrapper, sidebar nav, header
│   ├── KPICard.tsx            # Reusable stat card with trend indicator
│   ├── ChartWrapper.tsx       # Recharts wrapper with loading/error states
│   └── analytics-types.ts    # Shared TypeScript interfaces for KPI data
├── legal/                     # Owned by: attyjuan
│   ├── CaseRevenueChart.tsx
│   ├── BillableHoursKPI.tsx
│   ├── CollectionRateCard.tsx
│   └── index.ts               # Re-exports all legal analytics components
├── veterinary/
│   └── .gitkeep
└── restaurant/
    └── .gitkeep
```

### Analytics Coding Rules

- All new KPI components must accept a standardized `KPIData` prop from `analytics-types.ts`.
- Data fetching must live in `src/services/analytics-{vertical_id}.service.ts` — never inside the component.
- NEVER put raw Supabase queries inside an analytics component.

---

---

## 📋 Revision 7: Scheduling Module Library

```
src/scheduling/
├── core/
│   ├── booking-engine.ts      # Conflict detection and constraints
│   ├── gcal-sync.ts           # Google Calendar integration stub
│   ├── scheduling-types.ts    # MeetingRequest, CalendarEvent
│   └── index.ts
├── legal/                     # Owned by: attyjuan
│   └── .gitkeep
├── veterinary/
│   └── .gitkeep
└── restaurant/
    └── .gitkeep
```

### Scheduling Coding Rules

- All booking actions must use the core engine.
- AI Secretary must confirm bookings via UI skill if `requires_owner_approval` is true.
- Google Calendar sync logic must live in `gcal-sync.ts`.

## ✅ Implementation Checklist

### Phase 1 — Foundation (Do This First)

- [x] Create `src/bir/` folder structure with `core/` and vertical placeholders
- [x] Create `src/analytics/` folder structure with `core/` and vertical placeholders
- [x] Create `src/ai/` folder structure with `core.ai-manifest.json` template
- [x] Create `business.json` default template at `dannflow` root
- [x] Update `dannflow.json` version anchor

### Phase 2 — BIR Core Engine

- [ ] Implement `src/bir/core/eopt-engine.ts`
- [ ] Implement `src/bir/core/tax-calculator.ts`
- [ ] Define `src/bir/core/form-types.ts` TypeScript interfaces

### Phase 3 — AI Secretary System

- [ ] Define `src/ai/core.ai-manifest.json` with universal observable states
- [ ] Implement `src/ai/secretary/types.ts`
- [ ] Implement `src/ai/secretary/task-engine.ts` (background job skeleton)
- [ ] Implement `src/ai/secretary/task-queue.ts` (human-facing task queue)

### Phase 4 — Scheduling Core Engine

- [ ] Define `src/scheduling/core/scheduling-types.ts`
- [ ] Implement `src/scheduling/core/booking-engine.ts`
- [ ] Implement `src/scheduling/core/gcal-sync.ts`

### Phase 5 — AGENTS.md Update

- [ ] Append JuanStack Vertical Namespace Rules to `dannflow/AGENTS.md`
- [ ] Add `owned_paths` enforcement note to `sync-to-upstream` skill

### Phase 6 — First Vertical Test (`attyjuan`)

- [ ] Create `attyjuan/business.json` with full configuration
- [ ] Populate `src/bir/legal/` with BIR form skeletons
- [ ] Populate `src/analytics/legal/` with KPI component skeletons
- [ ] Create `src/ai/personas/legal.ai-manifest.json`
- [ ] Validate `sync-to-upstream` respects `owned_paths`

---

## ⚠️ Open Questions (Resolve Before Coding)

| #   | Question                                                                                       | Impact                                     |
| --- | ---------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | Does `business.json` load at **build time** (env var) or **runtime** (API fetch)?              | Affects how feature flags gate components  |
| 2   | Are verticals **separate Supabase projects** or **separate schemas** in one project?           | Affects RLS design and multi-tenancy model |
| 3   | Does the AI Secretary run as a **Supabase Edge Function cron** or a **Next.js route handler**? | Affects deployment architecture            |
| 4   | Should `owned_paths` enforcement in `sync-to-upstream` be a **hard block** or a **warning**?   | Affects developer experience               |
| 5   | Should `businesses.registry.json` live in `dannflow` or a separate `juanstack-portal` repo?    | Affects how verticals are discovered       |

---

_This document is living and will be updated as decisions are made. Do not delete — it is the source of truth for the `juanStack-rules` branch._
