---
name: "DannFlow Masterplan & Architecture Orchestrator"
description: "SaaS onboarding, Phase 0 readiness, Masterplan generation, and GitHub Project sync orchestrator for DannFlow. Use when asked to 'start a new project', 'initialize masterplan', 'plan next phase', 'sync github board', or configure foundational infrastructure (Supabase, Auth, Vercel)."
---

# DannFlow Masterplan & Architecture Orchestrator (`dannflow-masterplan`)

## What This Skill Does

This skill instructs you (the AI Agent) to act as an elite Technical Product Manager and Cloud Architect for **DannFlow**. You orchestrate the complete inception and architectural lifecycle of a SaaS product by directly executing the authoritative procedures in `.claude/commands/` (`new-project.md`, `masterplan-init.md`, `make-masterplan.md`, `update-masterplan.md`, `setup-supabase.md`, `setup-auth.md`, and `setup-vercel.md`).

## Prerequisites

- You must be operating in a DannFlow-compatible environment.
- Access to GitHub MCP or authenticated `gh` CLI with `project` scope (`gh auth refresh -s project`).
- Access to Supabase MCP / CLI.

---

## How This Skill Executes Commands

Whenever a mode is triggered, **you must read and adhere to the matching command file in `.claude/commands/`** as your primary procedure:

| Mode / Task                         | Authoritative Command File              |
| :---------------------------------- | :-------------------------------------- |
| **New Project Inception**           | `.claude/commands/new-project.md`       |
| **Initialize Masterplan (Phase 0)** | `.claude/commands/masterplan-init.md`   |
| **Plan Future Phases (Phase 1+)**   | `.claude/commands/make-masterplan.md`   |
| **Sync Board & Issues**             | `.claude/commands/update-masterplan.md` |
| **Connect Supabase Keys**           | `.claude/commands/setup-supabase.md`    |
| **Auth & Google OAuth Setup**       | `.claude/commands/setup-auth.md`        |
| **Vercel Deployment Setup**         | `.claude/commands/setup-vercel.md`      |

---

## The 4 Core Operating Modes

---

### Mode A: New SaaS Project Inception

Use when starting a fresh product from the DannFlow starter.

1. **Execute `.claude/commands/new-project.md`**:
   - Collect product name, description, target URL/repo, and GitHub visibility.
   - Update `package.json`, `PROJECT_CONTEXT.md`, `src/lib/config.ts`, and `README.md`.
   - Set the project's `origin` Git remote to the user's repository and ensure `upstream` points to `Danncode10/DannFlow` (fetch-only).
2. **Require GitHub Project Board**:
   - Verify the user has created a GitHub Project board in Kanban layout with columns: `Backlog`, `Ready`, `In progress`, `Done`.
   - Bind the non-secret `GITHUB_PROJECT_URL` in `.env.local`.
3. **Execute `.claude/commands/masterplan-init.md`**:
   - Check if an existing Supabase project ID exists or guide provisioning.
   - Store non-secret `SUPABASE_PROJECT_ID` in `.env.local`.
   - Generate standard Phase 0 tasks (`[P0.1]` through `[P0.7]`) in `MASTERPLAN.md`.
   - Sync all Phase 0 tasks as real GitHub Issues in `Backlog`.
4. **End-of-Task Documentation & Ledger Update**:
   - Update `PROJECT_CONTEXT.md` with product summary and setup state.
   - Append an onboarding note to `docs/PENDING_DOC_UPDATES.md`.
   - Commit initial onboarding changes with `chore(setup): initialize project context and masterplan`.

---

### Mode B: Masterplan Expansion & Phase Planning

Use when expanding the SaaS beyond Phase 0 (e.g., _"Plan Phase 1: Database & Core Workflow"_).

1. **Execute `.claude/commands/make-masterplan.md`**:
   - Deconstruct the feature requirements into granular, testable tasks.
   - **Enforce Stable Task IDs**: Every task MUST use a stable prefix: `[P1.1]`, `[P1.2]`, `[P2.1]`, `[P3A.1]`. NEVER create bare phase tasks like `[P1]` or `[P2]`.
   - Structure each task in `MASTERPLAN.md` with: Goal, Scope, Dependencies, Acceptance Criteria, and affected files/services.
2. **Execute `.claude/commands/update-masterplan.md`**:
   - Create real GitHub Issues for new tasks and link them to the Project board under `Backlog`.
3. **End-of-Task Documentation & Ledger Update**:
   - Update `docs/PENDING_DOC_UPDATES.md` with the new phase roadmap.
   - Commit changes with `chore(masterplan): expand phase <X> in masterplan and sync board`.

---

### Mode C: Phase 0 Infrastructure & Cloud Setup

Use when executing foundational setup commands.

1. **Supabase Setup (`.claude/commands/setup-supabase.md`)**:
   - Verify keys in `.env.local` without modifying application schema or running ad-hoc migrations.
2. **Auth & Google OAuth Setup (`.claude/commands/setup-auth.md`)**:
   - Configure Gmail SMTP (port 465, App Password) in Supabase.
   - Set up Google Cloud OAuth client + dual callback mapping:
     - Google Cloud Authorized Origin: `http://localhost:3000`
     - Google Cloud Authorized Redirect URI: `https://<supabase-ref>.supabase.co/auth/v1/callback`
     - Supabase Redirect URLs: `http://localhost:3000/auth/callback` & `/reset-password`
   - Configure project email templates from `docs/supabase/email-templates/`.
3. **Vercel Deployment (`.claude/commands/setup-vercel.md`)**:
   - Verify build exits 0 (`npm run build`).
   - Guide user to copy runtime variables to Vercel (never `DATABASE_URL` or secrets into client-safe vars).
   - Register canonical production HTTPS origin (`https://app.vercel.app`) in Supabase Redirect URLs and Google Cloud JavaScript origins.
4. **End-of-Task Documentation & Handover Update**:
   - Create or update `docs/handover/phase-0-setup-handover.md` recording non-secret setup statuses, canonical URLs, and OAuth provider status.
   - Log completion in `docs/PENDING_DOC_UPDATES.md`.

---

### Mode D: Masterplan & GitHub Board Synchronization

Use whenever `MASTERPLAN.md` is edited, tasks are added, or cards drift out of sync.

1. **Execute `.claude/commands/update-masterplan.md`**:
   - Parse all tasks in `MASTERPLAN.md` and validate stable IDs `[PX.Y]`.
   - Fetch Project items and match by stable ID prefix.
   - Reconcile states (`[x]` -> `Done`, active -> `In progress`/`Ready`, new -> `Backlog`).
2. **End-of-Task Documentation & Commit**:
   - Commit board synchronization changes: `chore(tasks): sync masterplan task board`.

---

## Level 3: Architectural Guardrails & Governance

- **Command Authority**: Always read the referenced `.claude/commands/*.md` file before performing actions.
- **Mandatory End-of-Task Docs**: Every setup mode MUST conclude with updating the corresponding documentation (`PROJECT_CONTEXT.md`, `docs/handover/`, or `MASTERPLAN.md`) and logging to `docs/PENDING_DOC_UPDATES.md`.
- **Stable IDs are Law**: Every task must begin with `[PX.Y]`. Never sync bare phase cards.
- **Real GitHub Issues Only**: Cards must be backed by real repository GitHub Issues, never Project draft cards.
- **Zero Secret Exposure**: Never write API keys, service-role keys, database passwords, or SMTP secrets into git-tracked files (`.env.example`, `PROJECT_CONTEXT.md`, `README.md`, `docs/handover/`) or chat outputs.
- **Strict Separation of Phase 0 vs Phase 1+**: Phase 0 is strictly template readiness; custom database schemas and feature code belong strictly in Phase 1+.
