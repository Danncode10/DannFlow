# JUANSTACK MASTERPLAN — `dannflow` Vertical Engine Revision

> **Branch:** `SaaS-Starter` (planning docs; vertical implementation branches off this)
> **Reference:** See [`DANNFLOW_REVISION_PLAN.md`](./DANNFLOW_REVISION_PLAN.md) for the full architectural specification behind each task.
> **How to use:** Work through each phase in order. Tasks marked `[BLOCKED]` cannot start until the listed dependency is resolved. After each coding session, run `/update-masterplan` to sync this file with any changes.

---

## Status Legend

| Symbol | Meaning                        |
| ------ | ------------------------------ |
| `[ ]`  | Not started                    |
| `[/]`  | In progress                    |
| `[x]`  | Done                           |
| `[!]`  | Blocked — see note             |
| `[?]`  | Needs decision before starting |

---

## Open Decisions (Resolve First — Unblocks All Phases)

These 5 decisions affect the entire architecture. Agree on them before writing any code.

| ID     | Decision                                    | Resolution                                                                                                | Status |
| ------ | ------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------ |
| `[D1]` | How does `business.json` load?              | ✅ **Build-time** — read from filesystem during `next build`. Each vertical is its own deployment.        | `[x]`  |
| `[D2]` | Vertical multi-tenancy model?               | ✅ **Separate Supabase projects** per vertical — true isolation, separate billing, separate API keys.     | `[x]`  |
| `[D3]` | Where does the AI Secretary run?            | ✅ **Supabase Edge Function with pg_cron** — runs close to the data, no extra infra, native to the stack. | `[x]`  |
| `[D4]` | `sync-to-upstream` scope enforcement?       | ✅ **Hard block** — script stops the push entirely if any staged file is outside `owned_paths`.           | `[x]`  |
| `[D5]` | Where does `businesses.registry.json` live? | ✅ **Separate `juanstack-portal` repo** — registry is a portal concern; keeps `dannflow` generic.         | `[x]`  |

---

## **PHASE 0: Pre-Coding Architecture & Decisions**

> Goal: Lock all architectural decisions, document conventions, and update governance files before any folder or file is created. No code shipped in this phase.

- `[x]` **[P0.1]** Resolve all 5 Open Decisions `[D1]`–`[D5]` above and record answers in this file. ✅ All locked — see table above.
- `[x]` **[P0.2]** Write the **Vertical Namespace Contract** rules into `dannflow/AGENTS.md`. ✅
- `[x]` **[P0.3]** Define the final `business.json` schema. Saved as `docs/juanstack/schemas/business.schema.json`. ✅
- `[x]` **[P0.4]** Define the final `core.ai-manifest.json` schema. Saved as `docs/juanstack/schemas/ai-manifest.schema.json`. ✅
- `[x]` **[P0.5]** Write the **Sync-to-Upstream Ownership Rule** into the `sync-to-upstream` skill. ✅
- `[x]` **[P0.6]** Update `dannflow.json` version anchor to `2.0.0-juanstack-alpha`. ✅
- `[x]` **[P0.DOC]** Finalize Phase 0 Documentation — updated `docs/README.md` to reference the juanstack folder. ✅

---

## **PHASE 1: Folder Architecture & Skeleton Files**

> Goal: Create the physical folder structure defined in `DANNFLOW_REVISION_PLAN.md`. No logic yet — only folder creation, `.gitkeep` placeholders, and `index.ts` barrels.

### 1A — BIR Module Library

- `[P1A.1]` Create `src/bir/` directory with the following structure:
  - `src/bir/core/` — add `.gitkeep`
  - `src/bir/legal/` — add `.gitkeep` + `OWNERSHIP.md` (states: "Owned by: attyjuan. Do not modify from any other vertical.")
  - `src/bir/veterinary/` — add `.gitkeep` + `OWNERSHIP.md`
  - `src/bir/restaurant/` — add `.gitkeep` + `OWNERSHIP.md`
- `[P1A.2]` Create `src/bir/core/form-types.ts` — empty TypeScript file with module doc comment describing its purpose.
- `[P1A.3]` Create `src/bir/core/index.ts` — barrel file, re-exports all core modules (empty for now).

### 1B — Analytics Module Library

- `[P1B.1]` Create `src/analytics/` directory with:
  - `src/analytics/core/` — add `.gitkeep`
  - `src/analytics/legal/` — add `.gitkeep` + `OWNERSHIP.md`
  - `src/analytics/veterinary/` — add `.gitkeep` + `OWNERSHIP.md`
  - `src/analytics/restaurant/` — add `.gitkeep` + `OWNERSHIP.md`
- `[P1B.2]` Create `src/analytics/core/analytics-types.ts` — empty TypeScript file for shared `KPIData` interfaces.
- `[P1B.3]` Create `src/analytics/core/index.ts` — barrel file.

### 1C — AI Secretary System

- `[P1C.1]` Create `src/ai/` directory with:
  - `src/ai/secretary/` — add `.gitkeep`
  - `src/ai/personas/` — add `.gitkeep`
- `[P1C.2]` Create `src/ai/core.ai-manifest.json` — populate with the 3 universal observable states from `DANNFLOW_REVISION_PLAN.md` Revision 2 Tier 1.
- `[P1C.3]` Create `src/ai/secretary/types.ts` — empty TypeScript file for `SecretaryTask` and `ObservableState` interfaces.

### 1D — Root Config Files

- `[P1D.1]` Create `business.json` at the `dannflow` repo root — populate with the default/blank template (all features set to `false`, `vertical_id: "dannflow-default"`).
- `[P1D.2]` Create `businesses.registry.json` at repo root (or portal repo per `[D5]`) — populate with empty `verticals: []` array and `registry_version: "1.0.0"`.

- `[P1.DOC]` Finalize Phase 1 Documentation — update `docs/juanstack/DANNFLOW_REVISION_PLAN.md` checklist to mark Phase 1 items done.

---

## **PHASE 1.5: BIR Compliance Research & Schema Expansion**

> Goal: Research actual Philippine BIR requirements (RA 11976 EOPT Act, ATC codes, RDOs, specific fields for 2551Q/1701Q/2307) and expand the `business.schema.json` so the AI Secretary has enough real-world data to generate forms later.
> **Dependency:** `[P1D]` must be complete.

- `[P1.5.1]` Research exact data fields needed for BIR Form 2551Q (Quarterly Percentage Tax), 1701Q (Quarterly Income Tax), and 2307 (Creditable Withholding Tax).
- `[P1.5.2]` Update `docs/juanstack/schemas/business.schema.json` to include real-world data points under `bir_rules` (e.g., RDO code, registered address, PSIC/Line of Business, VAT/Non-VAT status, ATCs).
- `[P1.5.DOC]` Finalize Phase 1.5 Documentation — document the updated schema and research findings in a new file `docs/juanstack/bir-compliance-research.md`.

---

## **PHASE 2: BIR Core Engine**

> Goal: Build the shared Philippine tax computation engine in `src/bir/core/`. This is the logic that ALL verticals depend on. No vertical-specific code.
> **Dependency:** `[P1A]` must be complete.

- `[P2.1]` Implement `src/bir/core/form-types.ts` — define TypeScript interfaces for:
  - `BIRTaxpayerClassification` (Micro | Small | Medium | Large)
  - `BIRForm2307Data`
  - `BIRForm1701QData`
  - `BIRForm2551QData`
  - `EOPTFilingPeriod`
- `[P2.2]` Implement `src/bir/core/eopt-engine.ts` — pure function `classifyTaxpayer(annualGrossSales: number): BIRTaxpayerClassification` based on RA 11976 thresholds (Micro < ₱3M, Small ₱3M–₱20M, etc.).
- `[P2.3]` Implement `src/bir/core/tax-calculator.ts`:
  - `computeGrossPercentageTax(grossReceipts: number): number` — 3% standard rate
  - `computeEightPercentTax(grossReceipts: number): number` — 8% optional rate
  - `computeGraduatedTax(taxableIncome: number): number` — bracketed rate table
  - `determineOptimalTaxScheme(grossReceipts: number, expenses: number): '8_percent' | 'graduated'` — recommends the lower-tax option
- `[P2.4]` Implement `src/bir/core/withholding-tax.ts`:
  - `computeWithholdingTax(amount: number, classification: BIRTaxpayerClassification): number`
  - Include the 10% professional services rate and 5%/10% graduated creditable withholding table.
- `[P2.5]` Write unit tests for all `src/bir/core/` functions (Jest). Test edge cases: ₱0 income, exactly at ₱3M threshold, maximum gross sales for Micro classification.
- `[P2.6]` Update `src/bir/core/index.ts` to re-export all implemented modules.

- `[P2.DOC]` Finalize Phase 2 Documentation — add BIR Core Engine API reference to `docs/juanstack/bir-core-api.md`.

---

## **PHASE 3: AI Secretary System**

> Goal: Build the proactive AI Secretary backbone — the type system, the task engine, and the human-facing task queue. No vertical-specific triggers yet.
> **Dependency:** `[P1C]` must be complete. `[D3]` must be resolved.

- `[P3.1]` Implement `src/ai/secretary/types.ts`:
  - `ObservableState` interface (matches `core.ai-manifest.json` schema)
  - `SecretaryTask` interface: `{ id, title, description, priority, triggered_by, created_at, status: 'pending' | 'dismissed' | 'done' }`
  - `AIManifest` interface (validates the JSON manifest shape)
- `[P3.2]` Implement `src/ai/secretary/task-engine.ts`:
  - `loadManifest(manifestPath: string): AIManifest` — reads and validates the JSON manifest
  - `mergeManifests(core: AIManifest, vertical: AIManifest): AIManifest` — merges `extends` chain
  - `evaluateState(state: ObservableState, dbRow: Record<string, unknown>): boolean` — checks if a trigger condition is met
  - `createTask(state: ObservableState, context: Record<string, unknown>): SecretaryTask` — generates the task object
  - **Note:** The actual scheduler/cron wiring depends on `[D3]`. Implement as a pure function module for now; wiring happens in `[P3.4]`.
- `[P3.3]` Implement `src/ai/secretary/task-queue.ts`:
  - `getOpenTasks(userId: string): Promise<SecretaryTask[]>` — fetches pending tasks from Supabase
  - `dismissTask(taskId: string): Promise<void>`
  - `completeTask(taskId: string): Promise<void>`
- `[P3.4]` Wire the Task Engine to a scheduler _(implementation depends on `[D3]`)_:
  - **If Edge Function cron:** Create `supabase/functions/ai-secretary/index.ts` — runs on a schedule, calls `task-engine.ts`.
  - **If Next.js route handler:** Create `src/app/api/ai-secretary/cron/route.ts` — protected endpoint called by Vercel Cron.
- `[P3.5]` Create the `secretary_tasks` Supabase migration:
  - Table: `secretary_tasks (id, user_id, vertical_id, title, description, priority, triggered_by_state_id, status, created_at, updated_at)`
  - RLS: user can only read/update their own tasks; service role can insert.
- `[P3.6]` Create `src/services/secretary.service.ts` — wraps `task-queue.ts` with proper auth/RLS context.

- `[P3.DOC]` Finalize Phase 3 Documentation — add AI Secretary architecture diagram to `docs/juanstack/ai-secretary-architecture.md`.

---

## **PHASE 4: Analytics Core Module**

> Goal: Build the shared analytics infrastructure that all vertical dashboards inherit from.
> **Dependency:** `[P1B]` must be complete.

- `[P4.1]` Define `src/analytics/core/analytics-types.ts`:
  - `KPIData`: `{ label, value, unit, trend: 'up' | 'down' | 'flat', change_percentage, period }`
  - `ChartDataPoint`: `{ x: string | number, y: number, label?: string }`
  - `DashboardWidget`: `{ id, title, component, data_service, col_span, row_span }`
- `[P4.2]` Implement `src/analytics/core/KPICard.tsx` — Shadcn `Card`-based stat card. Props: `KPIData`. Shows value, label, trend arrow, and period. Uses only Shadcn semantic tokens.
- `[P4.3]` Implement `src/analytics/core/ChartWrapper.tsx` — Recharts wrapper with loading skeleton (Shadcn `Skeleton`) and empty state. Props: `{ title, children, isLoading, isEmpty }`.
- `[P4.4]` Implement `src/analytics/core/DashboardShell.tsx` — layout component. Reads `business.json → domain_nomenclature` to set the page header title. Renders a grid of `DashboardWidget` components.
- `[P4.5]` Update `src/analytics/core/index.ts` barrel file.

- `[P4.DOC]` Finalize Phase 4 Documentation — add Analytics Core component API to `docs/juanstack/analytics-core-api.md`.

---

## **PHASE 5: `business.json` Runtime Integration**

> Goal: Wire `business.json` into the Next.js app so feature flags, domain terminology, and BIR rules are respected at runtime.
> **Dependency:** `[D1]` must be resolved. `[P1D.1]` must be complete.

- `[P5.1]` Create `src/lib/vertical-config.ts`:
  - `getVerticalConfig(): Promise<VerticalConfig>` — loads and validates `business.json` (either from filesystem at build time or from API at runtime, per `[D1]`).
  - `isFeatureEnabled(feature: keyof DannflowFeatures): boolean` — checks `dannflow_features`.
  - `getTerm(key: keyof DomainNomenclature): string` — resolves domain terminology.
- `[P5.2]` Create `src/context/VerticalConfigContext.tsx` — React context provider that wraps the app and makes `VerticalConfig` available to all client components without prop drilling.
- `[P5.3]` Create `src/hooks/useVerticalConfig.ts` — convenience hook: `const { getTerm, isFeatureEnabled, birRules } = useVerticalConfig()`.
- `[P5.4]` Create `src/hooks/useTerm.ts` — micro-hook: `const clientLabel = useTerm('consumer')` — returns the domain-specific label for any nomenclature key.
- `[P5.5]` Audit existing `dannflow` components for hardcoded domain nouns. Replace all instances with `useTerm()` or `getTerm()`.
- `[P5.6]` Implement feature flag gating — wrap feature-specific nav items, routes, and components with `isFeatureEnabled()` checks.

- `[P5.DOC]` Finalize Phase 5 Documentation — update `docs/juanstack/DANNFLOW_REVISION_PLAN.md` and write `docs/juanstack/vertical-config-guide.md`.

---

## **PHASE 6: First Vertical Test (`attyjuan`)**

> Goal: Create `attyjuan` as the first real vertical repo. Validate the entire system end-to-end. Fix whatever breaks.
> **Dependency:** All Phases 1–5 must be complete.

- `[P6.1]` Create `attyjuan` GitHub repo and initialize it as a `dannflow` instance (fork or clone + upstream setup).
- `[P6.2]` Create `attyjuan/business.json` with full legal vertical configuration (see `DANNFLOW_REVISION_PLAN.md` Revision 1 for the full spec).
- `[P6.3]` Populate `src/bir/legal/` with legal BIR form implementations:
  - `form-2307.ts` — using types from `src/bir/core/form-types.ts`
  - `form-1701Q.ts`
  - `form-2551Q.ts`
  - `legal-bir-summary.tsx` — dashboard widget
- `[P6.4]` Create `src/ai/personas/legal.ai-manifest.json` — extend `core.ai-manifest.json` with the 2 legal-specific triggers (`case_deadline_approaching`, `bir_quarter_due`).
- `[P6.5]` Populate `src/analytics/legal/` with skeleton KPI components:
  - `CaseRevenueChart.tsx`
  - `BillableHoursKPI.tsx`
  - `CollectionRateCard.tsx`
  - `index.ts` barrel
- `[P6.6]` Validate that `sync-to-upstream` **only stages** files inside `owned_paths`. Attempt a sync with a file outside `owned_paths` and confirm it is blocked.
- `[P6.7]` Validate feature flags — toggle `bir_module: false` in `attyjuan/business.json` and confirm the BIR section disappears from the UI without code changes.
- `[P6.8]` Validate domain terminology — confirm every UI label reads "Lawyer", "Client", "Billable Case" and there are zero hardcoded strings.
- `[P6.9]` Test the AI Secretary with a seeded `invoice_overdue` record — confirm the task appears in the human task queue.

- `[P6.DOC]` Finalize Phase 6 Documentation — write `docs/juanstack/vertical-setup-guide.md` as a how-to for creating a new vertical repo from `dannflow`.

---

## **PHASE 7: Second Vertical Smoke Test (`vetstack`)**

> Goal: Prove that the architecture is not attyjuan-specific. Add a second vertical with minimal friction.
> **Dependency:** Phase 6 must pass all validations.

- `[P7.1]` Create `vetstack` GitHub repo and initialize as a `dannflow` instance.
- `[P7.2]` Create `vetstack/business.json` — veterinary configuration with `vertical_id: "veterinary"`, terminology: `provider: "Veterinarian"`, `consumer: "Pet Owner"`, `transaction: "Appointment"`.
- `[P7.3]` Create `src/bir/veterinary/` stub files for the most common vet BIR form.
- `[P7.4]` Create `src/ai/personas/veterinary.ai-manifest.json` with at least 1 vet-specific observable state.
- `[P7.5]` Confirm `attyjuan` and `vetstack` can both sync to upstream independently without collisions.
- `[P7.6]` Measure time to add second vertical. Target: under 2 hours from repo creation to working feature flags and AI persona.

- `[P7.DOC]` Finalize Phase 7 Documentation — update `docs/juanstack/vertical-setup-guide.md` with any friction points found during `vetstack` setup.

---

## **PHASE 8: `businesses.registry.json` & JuanStack Portal**

> Goal: Build the discovery layer that connects all verticals to a central portal.
> **Dependency:** `[D5]` must be resolved. Phase 7 must be complete.

- `[P8.1]` Populate `businesses.registry.json` with entries for `attyjuan` and `vetstack`.
- `[P8.2]` Implement a registry reader utility: `src/lib/registry.ts` — `fetchRegistry(): Promise<VerticalRegistry>`.
- `[P8.3]` _(If portal is a separate repo)_ Initialize `juanstack-portal` as a new Next.js app — minimal UI: a search bar and vertical cards pulled from `businesses.registry.json`.
- `[P8.4]` Implement dynamic routing: clicking a vertical card routes the user to the correct vertical's app URL.

- `[P8.DOC]` Finalize Phase 8 Documentation — write `docs/juanstack/registry-guide.md`.

---

## **Notes**

- Task IDs follow the pattern `[PX.Y]` for sequential tasks and `[PXA.Y]` / `[PXB.Y]` for lettered subphases.
- Every phase ends with a mandatory `[PX.DOC]` task.
- Do not start Phase N+1 until Phase N's validation gates pass (marked `[x]`).
- Decisions `[D1]`–`[D5]` in Phase 0 are the single most important items in this masterplan. Coding before they are resolved will require rework.
- After any edit to this file, notify the team and optionally sync to a GitHub Project board.

---

_Source of truth for the `juanStack-rules` branch. Keep this in sync with `DANNFLOW_REVISION_PLAN.md`._
