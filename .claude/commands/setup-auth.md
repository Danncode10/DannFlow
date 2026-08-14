---
description: Configure and verify the existing DannFlow template's email authentication, Google sign-in, redirect URLs, and branded Supabase email templates without changing database schema.
---

# /setup-auth

Configure the auth flow already shipped by the DannFlow template. Read `PROJECT_CONTEXT.md`, `.env.local`, `src/services/auth.ts`, `src/app/auth/callback/route.ts`, `docs/dannflow_docs/social-auth.md`, and `docs/supabase/email-templates/` before acting.

## Scope

This Phase 0 command configures the template's existing email/password and Google sign-in flows. It does not add providers, alter database schema, create tables, change RLS, or modify application code.

## Procedure

1. Verify Supabase MCP is connected and `.env.local` has non-placeholder `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_PROJECT_ID`. Do not print values.
2. Explain the template's expected auth behavior before changing dashboard settings: email/password sign-in, confirmation and recovery handling, `/auth/callback` for OAuth, and `/reset-password` for recovery.
3. In Supabase **Authentication > URL Configuration**, guide the user to set the local Site URL to `http://localhost:3000` and allow these local redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`
   Add the equivalent production URLs only after the deployed URL is known. Explain that the Site URL must be changed to the production origin at launch.
4. In Supabase **Authentication > Providers**, keep email/password enabled. Explain the Email Confirm setting and ask the user whether to require confirmation before allowing new accounts; record the chosen behavior in `PROJECT_CONTEXT.md`.
5. Configure the included Google provider:
   - In Google Cloud Console, configure the OAuth consent screen with the product's name, support email, and authorized domain when one exists.
   - Create a **Web application** OAuth client.
   - Add `http://localhost:3000` as an authorized JavaScript origin and add the production origin later.
   - Add the exact Supabase callback URL shown in Supabase's Google provider panel, normally `https://<project-ref>.supabase.co/auth/v1/callback`, as an authorized redirect URI.
   - In Supabase **Authentication > Providers > Google**, enable Google and paste the Client ID and Client Secret. Keep these credentials in Google Cloud and Supabase only—never in `.env.local`, source, or Git.
   - Use only `openid`, `email`, and `profile` unless a later feature explicitly needs more scopes.
6. Configure Gmail SMTP for Supabase auth emails:
   - Ask the user to enable 2-Step Verification on the sending Google account and create a Google App Password.
   - In Supabase **Authentication > Emails > SMTP Settings**, enable **Custom SMTP** and enter `smtp.gmail.com` on port `465`, the sender email address and display name, the Gmail address as the username, and the App Password as the password.
   - Enter SMTP credentials only in Supabase. Do not print, place in `.env.local`, or commit the Gmail password or App Password.
   - Explain Gmail's sending limit (up to 500 emails/day for a standard Gmail account) and confirm the sender address belongs to the configured Gmail account.
7. In Supabase **Authentication > Emails > Templates**, ask the user to paste the project-branded HTML from `docs/supabase/email-templates/` into **Confirm sign up** and **Reset password**. Preserve `{{ .ConfirmationURL }}` exactly. Do not paste templates automatically or claim they were saved without user confirmation.
8. Run or guide smoke tests with an inbox the user controls: sign up with email/password and verify the confirmation link; request and complete a password reset; sign in with Google and confirm the browser returns through `/auth/callback` to `/dashboard`. State which tests cannot be completed until a production domain is available.
9. Summarize enabled settings, deferred production settings, and test results. Store no secrets in tracked files.

## Constraints

- Do not add a new auth provider or edit database schema in Phase 0.
- Do not print or commit OAuth client secrets, service-role keys, SMTP credentials, database URLs, or tokens.
- Do not claim a Google or email test passed unless it was actually performed.
