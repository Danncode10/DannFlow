# 📚 DannFlow Documentation Center

Welcome to the central documentation hub for **DannFlow** — the Next.js 16 + Supabase starter built for AI-native Vibe Coding.

---

## 🧭 Navigation Index

### 🚀 1. Getting Started & Operations

- [**Setup Flow**](dannflow_docs/setup-flow.md) — Comprehensive step-by-step setup guide.
- [**MCP Setup & Configuration**](dannflow_docs/mcp-setup.md) — Model Context Protocol configuration for Supabase, GitHub, and local tooling.
- [**Updating Old Projects**](dannflow_docs/updating-old-projects.md) — Guide for upgrading existing projects to the latest DannFlow standards.

### 🏗️ 2. Architecture & Design Systems

- [**The Holy Trinity**](dannflow_docs/the-holy-trinity.md) — Schema, Types, and Service Layer architecture.
- [**UI System & Design Rules**](dannflow_docs/ui-system.md) — Tailwind v4, Shadcn, and semantic design tokens.
- [**Database Workflow**](dannflow_docs/database-workflow.md) — Supabase CLI migrations, types generation, and live checkpoints.
- [**Redis Rate Limiting**](dannflow_docs/redis-rate-limiting.md) — Rate-limiting production endpoints with Upstash Redis.
- [**Social Auth & Security**](dannflow_docs/social-auth.md) — OAuth setup and Row Level Security (RLS) constraints.
- [**Production Features**](dannflow_docs/production-features.md) — Production-ready modules and integrations.

### 🔄 3. Workflows & Synchronization

- [**Branching & Upstream Sync**](dannflow_docs/branching-and-sync.md) — Git workflow, `dev`/`main` branches, and syncing with `DannFlow` upstream.
- [**Backups & Checkpoints**](dannflow_docs/backups-and-sync.md) — Schema snapshotting and emergency backup protocols.
- [**Claude & Agent Workflow**](dannflow_docs/claude-workflow.md) — AI agent slash commands and execution pipelines.
- [**Methodology**](dannflow_docs/methodology.md) — Core principles of the Vibe-Coding architecture.

### 📊 4. System Diagrams

- [**Use Case Diagram**](diagrams/use-case-diagram.md) — Visual map of actors and system interactions.
- [**Activity & Workflow Diagrams**](diagrams/activity-workflows.md) — Sequential flows for Auth, Masterplan Task Lifecycle, and Upstream Sync.
- [**Domain & Service Architecture**](diagrams/domain-architecture.md) — Component, Service Layer, and Supabase Entity relationship map.

### 📋 5. Templates & Governance

- [**Feature Documentation Template**](templates/feature-doc-template.md) — Standardized template for new feature documentation.
- [**Architecture Decision Record (ADR) Template**](templates/adr-template.md) — Template for logging major tech decisions.
- [**Requirements Document Template**](templates/requirements-document-template.md) — Template for scoping user needs and specs.
- [**Design Document Template**](templates/design-document-template.md) — Template for UML diagrams and structural plans.
- [**Technical Document Template**](templates/technical-document-template.md) — Template for source code logic and DB architectures.
- [**User Manual Template**](templates/user-manual-template.md) — Template for end-user instruction guides.

### 📝 6. Project Documentation (`project/`)

> _Store all project-specific documents in the `project/` folder. These files come pre-filled with DannFlow's baseline features to act as your starting point._

- [**Requirements Document**](project/requirements-document.md) — Catalogs all user needs and system specifications.
- [**Design Document**](project/design-document.md) — Archives all UML diagrams and architectural structural plans.
- [**Technical Document**](project/technical-document.md) — Explains source code logic and database architectures.
- [**User Manual**](project/user-manual.md) — The operational guide for end-users interacting with the system.

---

## 📜 Documentation Governance & Post-Merge Rules

To ensure documentation remains updated as the project evolves:

1. **Masterplan Milestone Standard**: Every phase in `MASTERPLAN.md` must conclude with a mandatory final task: `[PX.DOC] Finalize Phase X Documentation & Diagrams`.
2. **Pre-Merge Verification**: Before a pull request or task is marked `Done` and merged into `main`, the developer or AI agent must verify that changed services, schemas, or APIs are reflected in `docs/` and `docs/diagrams/`.
