---
description: Deploy the existing DannFlow app on Vercel, configure only required runtime environment variables, and register the canonical production URL with Supabase Auth and Google OAuth.
argument-hint: "[production-origin]"
---

# /setup-vercel

Deploy the configured DannFlow project to Vercel and safely connect its canonical production HTTPS origin to authentication settings. Do not change application schema or source code as part of this command.

User input: **$ARGUMENTS**

## Required reading

Read `.env.example`, `.env.local`, `src/lib/config.ts`, `src/services/auth-server.ts`, `src/app/auth/callback/route.ts`, `docs/handover/phase-0-setup-handover.md`, and `docs/dannflow_docs/social-auth.md` before acting. Confirm the matching `MASTERPLAN.md` task and linked GitHub Project card before changing tracked work status.

## Procedure

1. Run `pnpm lint` and `pnpm build`. Stop and report failures before creating or changing a production deployment.
2. Guide the user in Vercel: **Add New → Project**, import the correct Git repository, choose the correct team/account, verify Next.js detection, and leave the root directory at the repository root unless the app is intentionally in a monorepo subdirectory.
3. In **Project → Settings → Environment Variables**, ask the user to copy only the required deployment runtime values from their private `.env.local` into Vercel rather than sharing values in chat. Never copy the entire file. Configure the appropriate deployment environments:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_NAME`, and `NEXT_PUBLIC_GITHUB_URL` for Production and any Preview environment that will be tested.
   - `SUPABASE_SERVICE_ROLE_KEY`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` only where the deployed server runtime requires them. They must never use the `NEXT_PUBLIC_` prefix.
   - Copy the current `NEXT_PUBLIC_SITE_URL` value from `.env.local` for the initial deployment, even when it is the local development origin. Once Vercel reveals the canonical HTTPS production origin, replace the Production value in step 5. Preview can use a deliberately configured preview value only when the app supports it.
   - Do not add `DATABASE_URL`, `SUPABASE_PROJECT_ID`, or GitHub Project board variables merely for deployment. Migrations must not run from Vercel builds.
4. Deploy, or accept a production URL the user supplies after deploying. Determine the canonical production origin from the supplied argument, a verified custom domain, or the stable Vercel production domain. Reject preview, branch, commit, and localhost URLs as the canonical production origin. A live deployment is an intermediate checkpoint: do not report this task complete until steps 5–10 are finished.
5. In **Vercel → Project → Settings → Environment Variables**, replace the initial `NEXT_PUBLIC_SITE_URL` value with `<PRODUCTION_ORIGIN>`, then create a new production deployment. Do not treat the deployment that revealed the URL as using this new value.
6. In **Supabase → Authentication → URL Configuration**:
   - Set **Site URL** to `<PRODUCTION_ORIGIN>`.
   - Retain localhost entries and add exact redirect URLs: `<PRODUCTION_ORIGIN>/auth/callback` and `<PRODUCTION_ORIGIN>/reset-password`.
   - Add `https://*-<team-or-account-slug>.vercel.app/**` only if preview authentication is intentionally supported; keep production paths exact.
7. In **Google Cloud → Google Auth Platform → Clients**, add `<PRODUCTION_ORIGIN>` under **Authorized JavaScript origins**. Keep the **Authorized redirect URI** as the exact Supabase provider callback: `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`. Do not replace it with the app callback URL.
8. When a custom production domain is used, add it in Google Auth Platform **Branding → Authorized domains** if required. Complete any required brand verification before public launch.
9. Test email confirmation, password recovery, and Google sign-in on the new production deployment, verifying Google reaches `/dashboard` through `/auth/callback`.
10. Record only non-secret configuration status, canonical origin, and test results in the handover or task record. Do not paste credentials, API keys, database URLs, or full `.env.local` contents into tracked files, tickets, logs, or chat.

## URL map

| Platform | Setting | Value |
| --- | --- | --- |
| Vercel | `NEXT_PUBLIC_SITE_URL` | `<PRODUCTION_ORIGIN>` |
| Supabase | Site URL | `<PRODUCTION_ORIGIN>` |
| Supabase | Redirect URLs | `<PRODUCTION_ORIGIN>/auth/callback`, `<PRODUCTION_ORIGIN>/reset-password` |
| Google Cloud | Authorized JavaScript origin | `<PRODUCTION_ORIGIN>` |
| Google Cloud | Authorized redirect URI | `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback` |

## Completion criteria

- The production deployment is live at one canonical HTTPS origin.
- Vercel has all and only the required runtime environment variables for that deployment.
- Supabase and Google Cloud contain the correct, distinct production URL settings.
- Email confirmation, password recovery, and Google sign-in pass in production.
