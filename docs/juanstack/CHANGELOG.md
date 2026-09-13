# JuanStack Engine Implementation Changelog

This document archives the full development ledger and architectural updates across all completed phases of the JuanStack vertical SaaS engine.

---

## Phase 0: Architecture & Governance Setup

- **Date**: 2026-09-12
- **Specifications & Schemas**:
  - `docs/juanstack/DANNFLOW_REVISION_PLAN.md` — Full architectural spec for the JuanStack vertical engine revision (folder structure, `business.json` DNA, AI Manifest system, Namespace Contract, BIR module library, and analytics module library).
  - `docs/juanstack/juanstack_masterplan.md` — Implementation roadmap.
  - `docs/juanstack/schemas/business.schema.json` — Draft-07 JSON Schema for `business.json`.
  - `docs/juanstack/schemas/ai-manifest.schema.json` — Draft-07 JSON Schema for AI Secretary observable states and triggers.
- **Rules & Upstream Guards**:
  - `AGENTS.md` & `CLAUDE.md`: Embedded JuanStack Vertical Namespace Rules, Architecture Decisions D1–D5, and domain nomenclature rules.
  - `.agents/skills/source-command-sync-to-upstream/SKILL.md`: Added hard block on `owned_paths` violations.

---

## Phase 1 & 1.5: Folder Architecture, Skeleton Files & BIR Research

- **Date**: 2026-09-12
- **BIR Compliance Research**:
  - Researched RA 11976 (Ease of Paying Taxes Act) requirements and documented Form 2551Q, 1701Q, and 2307 requirements in `docs/juanstack/bir-compliance-research.md`.
- **Directory Structure & Skeleton Files**:
  - Created `src/bir/` (`core/`, `legal/`, `veterinary/`, `restaurant/`) with `OWNERSHIP.md` guards and `form-types.ts`.
  - Created `src/analytics/` (`core/`, `legal/`, `veterinary/`, `restaurant/`) with `analytics-types.ts`.
  - Created `src/scheduling/` (`core/`, `legal/`, `veterinary/`, `restaurant/`) with `scheduling-types.ts`.
  - Created `src/ai/secretary/types.ts` and `src/ai/core.ai-manifest.json`.

---

## Phase 2: BIR Core Engine

- **Date**: 2026-09-12
- **Tax Calculation Core**:
  - Implemented standard Philippine tax computations in `src/bir/core/` (EOPT Engine, Tax Calculator with Graduated/8% rules, Withholding tax logic).
  - Documented API reference in `docs/juanstack/bir-core-api.md`.

---

## Phase 2.5–2.8: Multi-Tenant Database Architecture & Legacy Module Upgrade

- **Date**: 2026-09-12
- **Multi-Tenant Schema**:
  - Created `supabase/migrations/20260912000000_core_tenant_schema.sql` (`organizations` table) with Row Level Security (RLS).
  - Created `supabase/migrations/20260912000001_ai_secretary_schema.sql` (`secretary_tasks` table) with RLS.
- **Legacy Modules Multi-Tenant Upgrade**:
  - Migrations `20260912000002_core_modules_multitenant.sql` and `20260912000003_fix_core_modules.sql` upgraded starter modules (`blog_posts`, `services`, `gallery_items`, `leads`, `bookings`) with `organization_id` foreign keys and `public.get_current_org_id()` auto-assignment.

---

## Phase 3: Conversational AI Secretary System Backbone

- **Date**: 2026-09-13
- **Tool Calling & Autonomous Agent**:
  - Defined tool manifest in `src/ai/tools.ai-manifest.json`.
  - Created tool registry in `src/ai/tools/index.ts` with `getDatabaseSummary` and `createSchedule`.
  - Built streaming API route in `src/app/api/chat/route.ts` using Vercel AI SDK (`streamText`) with multi-step tool calls.
  - Implemented Edge Function scheduler in `supabase/functions/ai-secretary/`.
  - Documented architecture in `docs/juanstack/ai-secretary-architecture.md` and `docs/juanstack/ai-tools-architecture.md`.

---

## Phase 3A: AI Conversation Persistence & Multi-Tenant RLS

- **Date**: 2026-09-13
- **Database Migrations & Typing**:
  - `supabase/migrations/20260913000001_ai_chat_history.sql` & `20260913000002_ai_chat_id_text.sql`: Created `public.ai_chats` and `public.ai_messages` with cascading foreign keys and multi-tenant RLS.
  - `supabase/migrations/20260913000003_auto_org_creation.sql`: Backfilled missing organizations for existing users and updated `handle_new_user()` trigger to automatically create both `profiles` and `organizations` on signup.
  - Regenerated types in `src/types/supabase.ts`.
- **Service & API Layer**:
  - Created `src/services/ai-chat.service.ts` for database CRUD, chat listing, and message persistence.
  - Created `src/app/api/history/route.ts` for paginated chat history and cascading deletion.
- **Frontend Chat History**:
  - Refactored `src/components/chat/sidebar-history.tsx` with live SWR pagination, session switching, and active session highlight.
  - Added delete confirmation modal via `ConfirmationDialog` with destructive styling.
  - Added real-time ChatGPT-style sidebar synchronization upon submission and stream completion.
  - Documented test verification in `docs/tests/p3a-ai-conversation-persistence.md`.

---

## Phase 3B: Dashboard Stabilization, Under-Construction Stubs & RBAC (Pre-Merge Gate)

- **Date**: 2026-09-13
- **RBAC Roles Specification**:
  - Created canonical source of truth in `src/config/roles.json` for `super_admin`, `admin`, and `member` roles.
  - Restricted Platform Blog management strictly to `super_admin`.
  - Allowed tenant administration (`bir`, `analytics`, `team`) to `admin` and `super_admin`.
- **Decluttering Legacy Starter Modules**:
  - Marked legacy starter modules (`services`, `leads`, `bookings`) as `isLegacyStarter: true` in `src/lib/dashboard-features.ts` and hid them from the default JuanStack sidebar.
- **Under-Construction Module Previews**:
  - Built `src/components/dashboard/tabs/under-construction-tab.tsx` featuring milestone badges, upcoming feature teasers, and a direct CTA to the AI Secretary.
  - Wired preview screens for `schedule` (Phase 4 teaser) and `bir` (Phase 6 teaser) into `src/components/dashboard-shell.tsx`.
- **JSON Source of Truth Architecture**:
  - Documented the declarative JSON architecture and the upcoming Phase 10 `juanstack-rules-sync` command in `docs/juanstack/json-source-of-truth-architecture.md`.
