---
description: "Interactive interview and setup agent for JuanStack verticals: captures domain context, writes business.json, scaffolds vertical AI manifest, populates PROJECT_CONTEXT.md, and logs to PENDING_DOC_UPDATES.md."
argument-hint: "[vertical-name]"
---

# /juanstack-init

Interactive interview and setup command for initializing a **JuanStack Vertical** SaaS project.

This command guides the developer or founder through an interactive domain interview, captures industry terminology, tax rules, and AI Secretary capabilities, and automatically configures:

1. `business.json` (Vertical DNA, domain nomenclature, feature flags, BIR tax rules, AI rules, owned paths)
2. `PROJECT_CONTEXT.md` (Product vision, problem statement, audience, stack decisions, design rules)
3. `src/ai/personas/{vertical_id}.ai-manifest.json` (Vertical-specific observable states and proactive triggers)
4. `metadata.json` (Workspace branding)
5. Namespace folders (`src/bir/{vertical_id}/`, `src/analytics/{vertical_id}/`)
6. `docs/PENDING_DOC_UPDATES.md` (Documentation ledger update)

---

## Preflight Checks

1. **Verify Project Mode**:
   - Check repo folder name and remotes. This command must **NEVER** run in the template repository (`DannFlow`).
   - If in template mode, stop and warn the user.
2. **Check Schema Availability**:
   - Ensure `docs/juanstack/schemas/business.schema.json` exists for validating configuration.
   - Ensure `docs/juanstack/schemas/ai-manifest.schema.json` exists for AI manifest validation.
3. **Inspect Existing State**:
   - Read current `business.json`, `PROJECT_CONTEXT.md`, and `package.json`.

---

## Interactive Interview Flow

Conduct a conversational interview with the user. If `$ARGUMENTS` provides the vertical name, pre-fill it and ask the remaining questions. Ask questions in structured blocks or one cohesive interview:

### 1. Vertical Identity

- **Display Name**: (e.g., `JuanConstruction`, `AttyJuan`, `VetStack`, `RestoStack`)
- **Vertical ID (`vertical_id`)**: Lowercase snake_case identifier (e.g., `construction`, `legal`, `veterinary`, `restaurant`).
- **One-Liner Description**: What this vertical manages and for whom in 1 sentence.

### 2. Domain Nomenclature

JuanStack strictly forbids hardcoding domain nouns in UI code. Collect the terms that will populate `domain_nomenclature`:

- **Provider**: The professional/service provider (e.g., `General Contractor`, `Lawyer`, `Veterinarian`, `Chef`).
- **Consumer**: The recipient of the service (e.g., `Project Owner`, `Client`, `Pet Owner`, `Diner`).
- **Transaction**: The primary unit of work (e.g., `Construction Project`, `Legal Case`, `Medical Consultation`, `Table Order`).
- **Inventory Item**: The primary goods item if applicable (e.g., `Construction Material`, `Pharmaceutical`, `Menu Item`, or `null` if none).

### 3. Specialized Feature Modules

Which DannFlow modules should be enabled in `dannflow_features`?

- `inventory_management` (true/false) — Product & material inventory CRUD.
- `scheduling_module` (true/false) — Calendar, inspections, appointments.
- `analytics_module` (true/false) — KPI dashboards.
- `bir_module` (true/false) — Philippine BIR tax compliance forms & computations.
- `ai_secretary` (true/false) — Proactive background task & alert system.
- `billing_module` (true/false) — Stripe / subscription plans.
- `pos_terminal` (true/false) — Point-of-sale checkout UI.

### 4. Philippine BIR Tax Compliance

If `bir_module` is enabled:

- **Applicable Laws**: (e.g., `RA 11976 (Ease of Paying Taxes Act)`, `BIR Revenue Regulations No. 2-98`).
- **Default Withholding Tax Rate**: Percentage (e.g., `2.0` for contractors, `10.0` or `15.0` for professional fees, `1.0` for goods).
- **Default ATCs**: Alphanumeric Tax Codes (e.g., `WC 535` / `WI 535` for contractors, `WI 010` for professionals).

### 5. AI Secretary Persona & Boundaries

If `ai_secretary` is enabled:

- **System Persona**: High-level prompt describing the AI assistant's role.
- **Tone**: `professional_warm` | `formal` | `casual` | `technical`.
- **Hard Limits**: 2-3 non-negotiable restrictions (e.g., "Never approve structural changes without engineer verification", "Never provide legal advice").
- **Core Observable States**: 3-4 proactive triggers to watch (e.g., low inventory, missing daily logs, deadline approaching, tax due).

### 6. Target Audience & Design Constraints

- Who are the primary field or office users?
- Outdoor / mobile site usage requirements (e.g., high-contrast, $\ge 48\text{px}$ touch targets)?
- Anti-decisions (what the app will explicitly NOT do in v1)?

---

## Execution Steps

Once the user approves the interview responses:

### Step 1: Write `business.json`

Generate `business.json` at the repo root with:

```json
{
  "vertical_id": "<vertical_id>",
  "name": "<name>",
  "description": "<description>",
  "owned_paths": [
    "src/bir/<vertical_id>/",
    "src/analytics/<vertical_id>/",
    "src/ai/personas/<vertical_id>.ai-manifest.json"
  ],
  "domain_nomenclature": {
    "provider": "<provider>",
    "consumer": "<consumer>",
    "transaction": "<transaction>",
    "inventory_item": "<inventory_item>"
  },
  "dannflow_features": { ... },
  "scheduling_rules": { ... },
  "bir_rules": { ... },
  "ai_rules": { ... }
}
```

Validate JSON syntax and confirm against schema.

### Step 2: Scaffold Vertical AI Manifest

Create `src/ai/personas/<vertical_id>.ai-manifest.json` with the collected observable states:

```json
{
  "manifest_version": "1.0.0",
  "vertical_id": "<vertical_id>",
  "description": "<description>",
  "observable_states": [
    {
      "id": "<state_id>",
      "table": "<table_name>",
      "trigger_field": "<field>",
      "trigger_condition": "<condition>",
      "semantic_meaning": "<meaning>",
      "suggested_task": "<task>",
      "priority": "high"
    }
  ]
}
```

### Step 3: Populate `PROJECT_CONTEXT.md`

Fill in all sections of `PROJECT_CONTEXT.md`:

- App name & One-liner
- Problem it solves
- Target audience & pain points
- Stack decisions & domain nomenclature reference
- Design decisions (mobile-first, touch targets, semantic tokens)
- Tone & voice
- Anti-decisions
- Current focus roadmap

### Step 4: Update `metadata.json`

Set `name` to the app display name and `description` to the one-liner description.

### Step 5: Scaffold Namespace Folders

Ensure namespace directories exist with `.gitkeep` or skeleton files:

- `src/bir/<vertical_id>/`
- `src/analytics/<vertical_id>/`

### Step 6: Log Documentation Ledger

Append a detailed initialization entry to `docs/PENDING_DOC_UPDATES.md`:

```markdown
## [Vertical Init] <App Name> Vertical Configuration & AI Manifest

- **Files changed:** `business.json`, `PROJECT_CONTEXT.md`, `src/ai/personas/<vertical_id>.ai-manifest.json`, `metadata.json`
- **Description:** ...
- **Affected Documentation to Update:** `docs/` architecture documents and Phase 0/1 guides.
```

### Step 7: Next Step Handoff

Instruct the user on next steps:

1. Ensure cloud Supabase project credentials are in `.env.local`.
2. Create a Kanban GitHub Project board with `Backlog`, `Ready`, `In progress`, `Done`.
3. Run `/masterplan-init` to initialize Phase 0 readiness and sync tasks to GitHub.
