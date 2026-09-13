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

- `[x]` `[P1A.1]` Create `src/bir/` directory with the following structure:
  - `src/bir/core/` — add `.gitkeep`
  - `src/bir/legal/` — add `.gitkeep` + `OWNERSHIP.md` (states: "Owned by: attyjuan. Do not modify from any other vertical.")
  - `src/bir/veterinary/` — add `.gitkeep` + `OWNERSHIP.md`
  - `src/bir/restaurant/` — add `.gitkeep` + `OWNERSHIP.md`
- `[x]` `[P1A.2]` Create `src/bir/core/form-types.ts` — empty TypeScript file with module doc comment describing its purpose.
- `[x]` `[P1A.3]` Create `src/bir/core/index.ts` — barrel file, re-exports all core modules (empty for now).

### 1B — Analytics Module Library

- `[x]` `[P1B.1]` Create `src/analytics/` directory with:
  - `src/analytics/core/` — add `.gitkeep`
  - `src/analytics/legal/` — add `.gitkeep` + `OWNERSHIP.md`
  - `src/analytics/veterinary/` — add `.gitkeep` + `OWNERSHIP.md`
  - `src/analytics/restaurant/` — add `.gitkeep` + `OWNERSHIP.md`
- `[x]` `[P1B.2]` Create `src/analytics/core/analytics-types.ts` — empty TypeScript file for shared `KPIData` interfaces.
- `[x]` `[P1B.3]` Create `src/analytics/core/index.ts` — barrel file.

### 1C — AI Secretary System

- `[x]` `[P1C.1]` Create `src/ai/` directory with:
  - `src/ai/secretary/` — add `.gitkeep`
  - `src/ai/personas/` — add `.gitkeep`
- `[x]` `[P1C.2]` Create `src/ai/core.ai-manifest.json` — populate with the 3 universal observable states from `DANNFLOW_REVISION_PLAN.md` Revision 2 Tier 1.
- `[x]` `[P1C.3]` Create `src/ai/secretary/types.ts` — empty TypeScript file for `SecretaryTask` and `ObservableState` interfaces.

### 1D — Root Config Files

- `[x]` `[P1D.1]` Create `business.json` at the `dannflow` repo root — populate with the default/blank template (all features set to `false`, `vertical_id: "dannflow-default"`).
- `[x]` `[P1D.2]` Create `businesses.registry.json` at repo root (or portal repo per `[D5]`) — populate with empty `verticals: []` array and `registry_version: "1.0.0"`.

### 1E — Scheduling Module Library

- `[x]` `[P1E.1]` Create `src/scheduling/` directory with:
  - `src/scheduling/core/` — add `.gitkeep`
  - `src/scheduling/legal/` — add `.gitkeep` + `OWNERSHIP.md`
  - `src/scheduling/veterinary/` — add `.gitkeep` + `OWNERSHIP.md`
  - `src/scheduling/restaurant/` — add `.gitkeep` + `OWNERSHIP.md`
- `[x]` `[P1E.2]` Create `src/scheduling/core/scheduling-types.ts` — empty TypeScript file.
- `[x]` `[P1E.3]` Create `src/scheduling/core/index.ts` — barrel file.

- `[x]` `[P1.DOC]` Finalize Phase 1 Documentation — update `docs/juanstack/DANNFLOW_REVISION_PLAN.md` checklist to mark Phase 1 items done.

---

## **PHASE 1.5: BIR Compliance Research & Schema Expansion**

> Goal: Research actual Philippine BIR requirements (RA 11976 EOPT Act, ATC codes, RDOs, specific fields for 2551Q/1701Q/2307) and expand the `business.schema.json` so the AI Secretary has enough real-world data to generate forms later.
> **Dependency:** `[P1D]` must be complete.

- `[x]` `[P1.5.1]` Research exact data fields needed for BIR Form 2551Q (Quarterly Percentage Tax), 1701Q (Quarterly Income Tax), and 2307 (Creditable Withholding Tax).
- `[x]` `[P1.5.2]` Update `docs/juanstack/schemas/business.schema.json` to include real-world data points under `bir_rules` (e.g., RDO code, registered address, PSIC/Line of Business, VAT/Non-VAT status, ATCs).
- `[x]` `[P1.5.DOC]` Finalize Phase 1.5 Documentation — document the updated schema and research findings in a new file `docs/juanstack/bir-compliance-research.md`.

---

## **PHASE 2: BIR Core Engine**

> Goal: Build the shared Philippine tax computation engine in `src/bir/core/`. This is the logic that ALL verticals depend on. No vertical-specific code.
> **Dependency:** `[P1A]` must be complete.

- `[x]` `[P2.1]` Implement `src/bir/core/form-types.ts` — define TypeScript interfaces for:
  - `BIRTaxpayerClassification` (Micro | Small | Medium | Large)
  - `BIRForm2307Data`
  - `BIRForm1701QData`
  - `BIRForm2551QData`
  - `EOPTFilingPeriod`
- `[x]` `[P2.2]` Implement `src/bir/core/eopt-engine.ts` — pure function `classifyTaxpayer(annualGrossSales: number): BIRTaxpayerClassification` based on RA 11976 thresholds (Micro < ₱3M, Small ₱3M–₱20M, etc.).
- `[x]` `[P2.3]` Implement `src/bir/core/tax-calculator.ts`:
  - `computeGrossPercentageTax(grossReceipts: number): number` — 3% standard rate
  - `computeEightPercentTax(grossReceipts: number): number` — 8% optional rate
  - `computeGraduatedTax(taxableIncome: number): number` — bracketed rate table
  - `determineOptimalTaxScheme(grossReceipts: number, expenses: number): '8_percent' | 'graduated'` — recommends the lower-tax option
- `[x]` `[P2.4]` Implement `src/bir/core/withholding-tax.ts`:
  - `computeWithholdingTax(amount: number, classification: BIRTaxpayerClassification): number`
  - Include the 10% professional services rate and 5%/10% graduated creditable withholding table.
- `[x]` `[P2.5]` Write unit tests for all `src/bir/core/` functions (Jest). Test edge cases: ₱0 income, exactly at ₱3M threshold, maximum gross sales for Micro classification.
- `[x]` `[P2.6]` Update `src/bir/core/index.ts` to re-export all implemented modules.

- `[x]` `[P2.DOC]` Finalize Phase 2 Documentation — add BIR Core Engine API reference to `docs/juanstack/bir-core-api.md`.

---

## **PHASE 2.5: SaaS Architecture Cleanup**

> Goal: Align schema and documentation with the realization that JuanStack verticals are multi-tenant SaaS platforms. Vertical configuration (`business.json`) must only hold platform-wide settings, while tenant-specific data (e.g., RDO code, taxpayer classification) is deferred to the database.
> **Dependency:** Phase 2 must be complete.

- `[x]` `[P2.5.1]` Modify `docs/juanstack/schemas/business.schema.json` — Remove single-tenant fields (`taxpayer_classification`, `rdo_code`, `registered_address`, `psic_code`, `line_of_business`, `vat_status`, `eligible_for_8_percent_gross`) from `bir_rules`. Consolidate ATCs into `industry_default_atcs`.
- `[x]` `[P2.5.2]` Update `docs/juanstack/juanstack_masterplan.md` to reflect Phase 2.5 and explicitly clarify that initialization wizards are optional.
- `[x]` `[P2.5.DOC]` Update `docs/PENDING_DOC_UPDATES.md` to remove the incorrect Phase 1.5 schema history and log this architectural cleanup.

---

## **PHASE 2.6: Core Database Schema (Supabase)**

> Goal: Establish the foundational Supabase migrations natively inside the `dannflow` template. **CRITICAL:** Verticals DO NOT share a database. The `dannflow` repo simply holds the migration templates. When you clone a new vertical, running `db:migrate` applies this template to that vertical's **completely separate, isolated database**.
> **Dependency:** Phase 2.5 must be complete.

- `[x]` `[P2.6.1]` Create migration `supabase/migrations/*_core_tenant_schema.sql`. Define the `organizations` (or `tenant_profiles`) table. This table will hold the tenant-specific SaaS data shifted out of `business.json` (e.g., `rdo_code`, `taxpayer_classification`, `vat_status`, `registered_address`).
- `[x]` `[P2.6.2]` Create migration `supabase/migrations/*_ai_secretary_schema.sql`. Define the `secretary_tasks` table (`id, user_id, vertical_id, title, description, priority, triggered_by_state_id, status, created_at, updated_at`).
- `[x]` `[P2.6.3]` Apply strict Row Level Security (RLS) policies ensuring cross-tenant isolation (e.g., users can only see their own organization and their own AI tasks).
- `[x]` `[P2.6.DOC]` Finalize Phase 2.6 Documentation — log the DB schema layout in `docs/PENDING_DOC_UPDATES.md`.

---

## **PHASE 2.7: Pre-Phase 3 Architecture Cleanup**

> Goal: Perform a sweeping documentation audit to eliminate architectural contradictions before starting Phase 3.
> **Dependency:** Phase 2.6 must be complete.

- `[x]` `[P2.7.1]` Update Masterplan Phase 3 to rely strictly on Supabase generated types for the AI Secretary instead of duplicating the `SecretaryTask` interface manually.
- `[x]` `[P2.7.2]` Update Masterplan Phase 4 to enforce database migrations for scheduling entities.
- `[x]` `[P2.7.3]` Update Masterplan Phase 10 to ensure the initialization wizard correctly pushes tenant rules (RDO code, etc.) to Supabase instead of `business.json`.
- `[x]` `[P2.7.4]` Clean `DANNFLOW_REVISION_PLAN.md` to remove outdated single-tenant BIR config fields from the JSON example.

---

## **PHASE 2.8: Legacy Module Multi-Tenant Upgrade**

> Goal: Preserve DannFlow's rich starter modules (Blog, Services, Gallery, Leads, Bookings) by upgrading them from single-tenant to multi-tenant tables.
> **Dependency:** Phase 2.6 must be complete.

- `[x]` `[P2.8.1]` Generate `20260912000002_core_modules_multitenant.sql` to recreate legacy modules with `organization_id` and RLS.
- `[x]` `[P2.8.2]` Run `npm run db:migrate` and regenerate `src/types/supabase.ts` so the Next.js UI compiles correctly.
- `[x]` `[P2.8.3]` Generate `20260912000003_fix_core_modules.sql` to auto-assign `organization_id` via Postgres function so the UI TypeScript checks pass cleanly.

---

## **PHASE 3: Conversational AI Secretary System**

> Goal: Build an interactive, conversational AI agent using Vercel AI SDK and Tool Calling. The AI can be chatted with directly in the dashboard and can execute actions (like querying cases or scheduling) on behalf of the user.

- `[x]` `[P3.1]` Setup Tool Manifest (`src/ai/tools.ai-manifest.json`) — acts as the source of truth for which tools are enabled for the current vertical.
- `[x]` `[P3.2]` Implement `src/app/api/chat/route.ts` — a secure Next.js App Router API route using the Vercel AI SDK (`streamText`) with OpenAI integration. Ensure RLS/tenant isolation applies to all AI data queries.
- `[x]` `[P3.3]` Build AI Tools library (`src/ai/tools/`) — implement functions like `getDatabaseSummary` or `scheduleMeeting`.
- `[x]` `[P3.4]` Refactor `src/components/dashboard/tabs/ai-secretary-tab.tsx` — replace the static task queue with a real-time chat interface using `useChat` from `@ai-sdk/react`.
- `[x]` `[P3.DOC]` Finalize Phase 3 Documentation — document the Tool Calling architecture and how to add new vertical-specific tools.

---

## **PHASE 3A: AI Conversation Persistence (Database & History)**

> Goal: Set up the essential database tables to persist AI chat sessions and messages so the "History" sidebar functions correctly.

- `[ ]` `[P3A.1]` Create Supabase migration `*_ai_chat_history.sql` to define:
  - `ai_chats` (id, organization_id, user_id, title, created_at, updated_at)
  - `ai_messages` (id, chat_id, role, content, tool_calls, created_at)
- `[ ]` `[P3A.2]` Apply RLS policies ensuring users can only read/write chats belonging to their organization.
- `[ ]` `[P3A.3]` Implement `src/app/api/history/route.ts` to fetch paginated chat history for the sidebar.
- `[ ]` `[P3A.4]` Refactor `src/components/chat/sidebar-history.tsx` to fetch real data from the history API instead of using mock data.

---

## **PHASE 4: Scheduling Core Engine**

> Goal: Build the core scheduling and calendar integration module.
> **Dependency:** `[P1E]` must be complete.

- `[x]` `[P4.1]` Define `src/scheduling/core/scheduling-types.ts`:
  - `MeetingRequest`, `CalendarEvent`, `AvailabilitySlot`
  - _Note: If any of these represent database entities, you must create a Supabase migration (`npm run db:migrate`) and import their types from `src/types/supabase.ts`._
- `[P4.2]` Implement `src/scheduling/core/booking-engine.ts` — handles clash detection and booking constraints based on `business.json` rules.
- `[P4.3]` Implement `src/scheduling/core/gcal-sync.ts` — optional Google Calendar synchronization (stubbed API).
- `[P4.DOC]` Finalize Phase 4 Documentation.

---

## **PHASE 5: Analytics Core Module**

> Goal: Build the shared analytics infrastructure that all vertical dashboards inherit from.
> **Dependency:** `[P1B]` must be complete.

- `[P5.1]` Define `src/analytics/core/analytics-types.ts`:
  - `KPIData`: `{ label, value, unit, trend: 'up' | 'down' | 'flat', change_percentage, period }`
  - `ChartDataPoint`: `{ x: string | number, y: number, label?: string }`
  - `DashboardWidget`: `{ id, title, component, data_service, col_span, row_span }`
- `[P5.2]` Implement `src/analytics/core/KPICard.tsx` — Shadcn `Card`-based stat card. Props: `KPIData`. Shows value, label, trend arrow, and period. Uses only Shadcn semantic tokens.
- `[P5.3]` Implement `src/analytics/core/ChartWrapper.tsx` — Recharts wrapper with loading skeleton (Shadcn `Skeleton`) and empty state. Props: `{ title, children, isLoading, isEmpty }`.
- `[P5.4]` Implement `src/analytics/core/DashboardShell.tsx` — layout component. Reads `business.json → domain_nomenclature` to set the page header title. Renders a grid of `DashboardWidget` components.
- `[P5.5]` Update `src/analytics/core/index.ts` barrel file.

- `[P5.DOC]` Finalize Phase 5 Documentation — add Analytics Core component API to `docs/juanstack/analytics-core-api.md`.

---

## **PHASE 6: `business.json` Runtime Integration**

> Goal: Wire `business.json` into the Next.js app so feature flags, domain terminology, and BIR rules are respected at runtime.
> **Dependency:** `[D1]` must be resolved. `[P1D.1]` must be complete.

- `[P6.1]` Create `src/lib/vertical-config.ts`:
  - `getVerticalConfig(): Promise<VerticalConfig>` — loads and validates `business.json` (either from filesystem at build time or from API at runtime, per `[D1]`).
  - `isFeatureEnabled(feature: keyof DannflowFeatures): boolean` — checks `dannflow_features`.
  - `getTerm(key: keyof DomainNomenclature): string` — resolves domain terminology.
- `[P6.2]` Create `src/context/VerticalConfigContext.tsx` — React context provider that wraps the app and makes `VerticalConfig` available to all client components without prop drilling.
- `[P6.3]` Create `src/hooks/useVerticalConfig.ts` — convenience hook: `const { getTerm, isFeatureEnabled, birRules } = useVerticalConfig()`.
- `[P6.4]` Create `src/hooks/useTerm.ts` — micro-hook: `const clientLabel = useTerm('consumer')` — returns the domain-specific label for any nomenclature key.
- `[P6.5]` Audit existing `dannflow` components for hardcoded domain nouns. Replace all instances with `useTerm()` or `getTerm()`.
- `[P6.6]` Implement feature flag gating — wrap feature-specific nav items, routes, and components with `isFeatureEnabled()` checks.

- `[P6.DOC]` Finalize Phase 6 Documentation — update `docs/juanstack/DANNFLOW_REVISION_PLAN.md` and write `docs/juanstack/vertical-config-guide.md`.

---

## **PHASE 7: First Vertical Test (`attyjuan`)**

> Goal: Create `attyjuan` as the first real vertical repo. Validate the entire system end-to-end. Fix whatever breaks.
> **Dependency:** All Phases 1–6 must be complete.

- `[P7.1]` Create `attyjuan` GitHub repo and initialize it as a `dannflow` instance (fork or clone + upstream setup).
- `[P7.2]` Create `attyjuan/business.json` with full legal vertical configuration (see `DANNFLOW_REVISION_PLAN.md` Revision 1 for the full spec).
- `[P7.3]` Populate `src/bir/legal/` with legal BIR form implementations:
  - `form-2307.ts` — using types from `src/bir/core/form-types.ts`
  - `form-1701Q.ts`
  - `form-2551Q.ts`
  - `legal-bir-summary.tsx` — dashboard widget
- `[P7.4]` Create `src/ai/personas/legal.ai-manifest.json` — extend `core.ai-manifest.json` with the 2 legal-specific triggers (`case_deadline_approaching`, `bir_quarter_due`).
- `[P7.5]` Populate `src/analytics/legal/` with skeleton KPI components:
  - `CaseRevenueChart.tsx`
  - `BillableHoursKPI.tsx`
  - `CollectionRateCard.tsx`
  - `index.ts` barrel
- `[P7.6]` Validate that `sync-to-upstream` **only stages** files inside `owned_paths`. Attempt a sync with a file outside `owned_paths` and confirm it is blocked.
- `[P7.7]` Validate feature flags — toggle `bir_module: false` in `attyjuan/business.json` and confirm the BIR section disappears from the UI without code changes.
- `[P7.8]` Validate domain terminology — confirm every UI label reads "Lawyer", "Client", "Billable Case" and there are zero hardcoded strings.
- `[P7.9]` Test the AI Secretary with a seeded `invoice_overdue` record — confirm the task appears in the human task queue.

- `[P7.DOC]` Finalize Phase 7 Documentation — write `docs/juanstack/vertical-setup-guide.md` as a how-to for creating a new vertical repo from `dannflow`.

---

## **PHASE 8: Second Vertical Smoke Test (`vetstack`)**

> Goal: Prove that the architecture is not attyjuan-specific. Add a second vertical with minimal friction.
> **Dependency:** Phase 7 must pass all validations.

- `[P8.1]` Create `vetstack` GitHub repo and initialize as a `dannflow` instance.
- `[P8.2]` Create `vetstack/business.json` — veterinary configuration with `vertical_id: "veterinary"`, terminology: `provider: "Veterinarian"`, `consumer: "Pet Owner"`, `transaction: "Appointment"`.
- `[P8.3]` Create `src/bir/veterinary/` stub files for the most common vet BIR form.
- `[P8.4]` Create `src/ai/personas/veterinary.ai-manifest.json` with at least 1 vet-specific observable state.
- `[P8.5]` Confirm `attyjuan` and `vetstack` can both sync to upstream independently without collisions.
- `[P8.6]` Measure time to add second vertical. Target: under 2 hours from repo creation to working feature flags and AI persona.

- `[P8.DOC]` Finalize Phase 8 Documentation — update `docs/juanstack/vertical-setup-guide.md` with any friction points found during `vetstack` setup.

---

## **PHASE 9: `businesses.registry.json` & JuanStack Portal**

> Goal: Build the discovery layer that connects all verticals to a central portal.
> **Dependency:** `[D5]` must be resolved. Phase 8 must be complete.

- `[P9.1]` Populate `businesses.registry.json` with entries for `attyjuan` and `vetstack`.
- `[P9.2]` Implement a registry reader utility: `src/lib/registry.ts` — `fetchRegistry(): Promise<VerticalRegistry>`.
- `[P9.3]` _(If portal is a separate repo)_ Initialize `juanstack-portal` as a new Next.js app — minimal UI: a search bar and vertical cards pulled from `businesses.registry.json`.
- `[P9.4]` Implement dynamic routing: clicking a vertical card routes the user to the correct vertical's app URL.

- `[P9.DOC]` Finalize Phase 9 Documentation — write `docs/juanstack/registry-guide.md`.

---

## **PHASE 10: Codex Command Alignment**

> Goal: Ensure all `.claude/commands/` (especially initialization commands) are fully aware of JuanStack rules, the BIR core engine, and the `business.schema.json`.
> **Dependency:** All previous core phases should be complete so the architecture is stable.

- `[ ]` `[P10.1]` Review `.claude/commands/masterplan-init.md` and update it to prompt the user for BIR/JuanStack specific fields (e.g., RDO code, line of business, tax classification) when starting a new vertical. **Crucially, the command must insert these fields into the live Supabase `organizations` table using a seed script, because they are no longer allowed in `business.json`.**
- `[ ]` `[P10.2]` Review and update `.claude/commands/new-project.md` to ensure it generates a valid `business.json` that complies with the schema.
- `[ ]` `[P10.3]` Audit other AI agent commands in `.claude/commands/` to ensure they respect the vertical namespace rules (`OWNERSHIP.md`) and do not modify `core/` folders when operating in a vertical.
- `[ ]` `[P10.4]` **Optional**: Create a dedicated `juanstack-init` command/agent. This is an _optional user tooling wizard_, not a mandatory system component. It acts as an interactive wizard, interviewing the user about the new vertical (domain names, features needed) and automatically scaffolding the namespace folders, `business.json`, and initial database schema.
- `[ ]` `[P10.5]` Create a `juanstack-doctor` (or `juanstack-db-sync`) command. This AI agent command will read `business.json` and `ai-manifest.json` (the source of truth), pull the live Supabase schema via MCP, and compare them. If the JSON enables a feature/AI trigger but the database lacks the required table or RLS policy, the agent will automatically generate the missing SQL migration to keep Supabase perfectly in sync with the JSON.
- `[ ]` `[P10.DOC]` Finalize Phase 10 Documentation — summarize command updates in `docs/PENDING_DOC_UPDATES.md`.

---

## **Notes**

- Task IDs follow the pattern `[PX.Y]` for sequential tasks and `[PXA.Y]` / `[PXB.Y]` for lettered subphases.
- Every phase ends with a mandatory `[PX.DOC]` task.
- Do not start Phase N+1 until Phase N's validation gates pass (marked `[x]`).
- Decisions `[D1]`–`[D5]` in Phase 0 are the single most important items in this masterplan. Coding before they are resolved will require rework.
- After any edit to this file, notify the team and optionally sync to a GitHub Project board.

---

_Source of truth for the `juanStack-rules` branch. Keep this in sync with `DANNFLOW_REVISION_PLAN.md`._
