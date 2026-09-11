# Technical Architecture & API Specs

**Project Name:** [Your Project Name] (Built on DannFlow)
**Date:** [YYYY-MM-DD]

> **⚠️ REPOSITORY MODE RULE:**
>
> - If you are in the `DannFlow` template repository, **DO NOT** add specific product APIs, third-party integrations, or custom architecture here. Keep this file as the generic baseline.
> - If you are in a **Project Mode** repository (built from DannFlow), you **MUST** update this file to reflect your specific application's technical architecture.

---

## 1. The DannFlow "Holy Trinity" Architecture

This project enforces a strict, three-layer architectural pattern:

### A. The Database Layer (Supabase)

- **Source of Truth:** The database schema is the ultimate source of truth.
- **Migrations:** All schema changes must happen via `.sql` files in `supabase/migrations/` and be applied using `npm run db:migrate`.
- **Security:** RLS (Row Level Security) is assumed active on EVERY table.

### B. The Type Layer (`src/types/`)

- **Generation:** Types are automatically generated from the Supabase schema using `npm run db:types`.
- **Usage:** TypeScript types from `src/types/supabase.ts` must be used for all data structures. Never use `any`.

### C. The Service Layer (`src/services/`)

- **Logic Isolation:** All business logic, data formatting, and direct Supabase API calls must live exclusively in `src/services/`.
- **No Direct DB Calls in UI:** UI components (even Server Components) must NEVER call Supabase directly. They must invoke a function from the Service Layer.

## 2. Server vs. Client Components

- **Default to Server Components:** All pages and components are Server Components by default to handle data fetching securely and efficiently.
- **'use client' Restriction:** Only use `'use client'` when interactivity, client state (useState/useEffect), or specific browser APIs are strictly required. Keep client components as small and low in the tree as possible.

## 3. Project-Specific APIs & Services

_(Document any custom API routes, third-party webhooks, or complex service layer functions built for your specific app here.)_

- **Service:** `[Name of Service]` -> `[What it does]`
- **API Route:** `[Route path]` -> `[Method & Purpose]`
- **External Integration:** `[e.g., Stripe, Resend]` -> `[Purpose]`
