---
description: Scaffolds a new App Router page (Server Component) with loading.tsx and error.tsx, wrapped in the Shadcn Card layout.
argument-hint: <route-path>
---

Create a new App Router page at: **$ARGUMENTS** (e.g. `dashboard/billing` → `src/app/dashboard/billing/page.tsx`)

**Procedure:**

0. **Check ruflo memory** — search for layout decisions, design patterns, or prior context related to `$ARGUMENTS` (e.g. "dashboard layout", "card style", the page topic). Apply any stored decisions before writing.

1. **Decide scope** — if the route is under `dashboard/`, it's a protected page (auth-gated). Otherwise public.

2. **Create the directory** `src/app/$ARGUMENTS/` and these three files:

   - **`page.tsx`** — Server Component (no `'use client'` unless explicitly needed)
     - For protected routes: fetch user via `src/utils/supabase/server.ts`; redirect to `/login` if not authed
     - Wrap content in Shadcn `<Card>` with `<CardHeader>` (title + description) and `<CardContent>`
     - If the page needs data, fetch via a function in `src/services/` (do NOT inline Supabase queries here)
     - Use semantic tokens only

   - **`loading.tsx`** — Suspense fallback
     - Centered skeleton or spinner using `<Skeleton />` from Shadcn
     - Match the eventual layout dimensions

   - **`error.tsx`** — Error boundary (`'use client'` required)
     - Centered card with error message
     - Use `text-destructive` for the error text
     - Include a "Try again" button that calls `reset()`

3. **No raw HTML buttons.** Use Shadcn `<Button>` everywhere.

4. **Mobile-first.** Test the layout mentally at 375px width — single column, touch targets ≥48px.

5. **If the page has multiple independent sections** (hero, features, pricing, FAQ, CTA), spawn one agent per section in parallel — they can write simultaneously since each is an isolated component.

6. **Report** the created files and suggest:
   - Adding a nav entry if appropriate
   - Running `/ui` if you want to double-check responsiveness
   - Running `npm run dev` to verify

Do NOT scaffold a form here — that's `/new-feature`'s job. This is a pure page route.
