---
name: "JuanStack Vertical Onboarding & DNA Configurator"
description: "Interactive interview and setup orchestrator for initializing new JuanStack vertical SaaS projects. Configures business.json, PROJECT_CONTEXT.md, AI personas manifest, BIR compliance rules, and namespace paths."
---

# JuanStack Vertical Onboarding & DNA Configurator (`dannflow-juanstack-init`)

## What This Skill Does

This skill instructs you (the AI Agent) to act as an elite Domain Modeler and System Architect for **JuanStack Verticals** built on DannFlow. You guide the user through initializing a specialized vertical (such as JuanConstruction, AttyJuan, VetStack, or RestoStack) by executing `.claude/commands/juanstack-init.md`.

## Core Responsibilities

1. **Conduct the Domain Discovery Interview**:
   - Vertical Identity (name, `vertical_id` slug, description).
   - Domain Nomenclature (`provider`, `consumer`, `transaction`, `inventory_item`).
   - Feature Modules (`inventory_management`, `scheduling_module`, `analytics_module`, `bir_module`, `ai_secretary`).
   - Philippine BIR Compliance (applicable laws like RA 11976, withholding tax rate, ATCs).
   - AI Secretary Persona (system prompt, tone, safety boundaries, observable triggers).
   - Target Audience & UI Constraints (touch targets $\ge 48\text{px}$, high-contrast, mobile-first).

2. **Synchronize All Configuration Files**:
   - Write `business.json` strictly validating against `docs/juanstack/schemas/business.schema.json`.
   - Scaffold `src/ai/personas/{vertical_id}.ai-manifest.json` conforming to `docs/juanstack/schemas/ai-manifest.schema.json`.
   - Update `PROJECT_CONTEXT.md` with complete specifications.
   - Update `metadata.json` with workspace branding.
   - Create namespace directory skeletons (`src/bir/{vertical_id}/`, `src/analytics/{vertical_id}/`).
   - Append an entry to `docs/PENDING_DOC_UPDATES.md`.

3. **Enforce JuanStack Guardrails**:
   - NEVER hardcode domain nouns in `.tsx` components; ensure the user understands that `getTerm()` and `useTerm()` must be used.
   - Never run in the DannFlow template repository checkout; only in project vertical checkouts.
   - Hand off cleanly to `/masterplan-init` for database linking and task board setup.
