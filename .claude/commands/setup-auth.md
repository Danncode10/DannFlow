---
description: Configure and verify Supabase Auth, selected providers, redirect URLs, branded email templates, and authentication smoke tests for the current SaaS.
---

# /setup-auth

Configure only the authentication methods chosen in `PROJECT_CONTEXT.md`. Read the auth implementation, `docs/dannflow_docs/social-auth.md`, and `docs/supabase/email-templates/` before acting.

1. Verify Supabase MCP and confirm the hosted project from `.env.local`.
2. Configure email/password settings, Site URL, and exact local/production callback and recovery redirect URLs required by the app.
3. If Google OAuth is selected, guide the user through Google Cloud consent-screen setup, a Web OAuth client, allowed JavaScript origins, and Supabase's callback URL. Keep Google client credentials in Supabase, never in browser code or `.env.local`.
4. Ask the user to paste the project-branded HTML from `docs/supabase/email-templates/` into Supabase Authentication > Emails > Templates. Preserve Supabase variables such as `{{ .ConfirmationURL }}`.
5. Run or guide a safe signup, confirmation, password-reset, and selected OAuth smoke test. Verify local and production redirects separately when each URL exists.
6. Report exact dashboard settings confirmed, tests passed, and anything intentionally deferred.

Do not enable an unchosen provider, request unnecessary OAuth scopes, expose credentials, or claim email delivery was verified without a real test email.
