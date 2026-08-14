# Social Auth Setup

Tracking issue: [#82](https://github.com/Danncode10/DannFlow/issues/82)  
Implementation branch: `codex/login-improvements`

DannFlow defaults to email/password plus Google OAuth because most client-facing products have more Google users than GitHub users. Keep GitHub OAuth only for developer-first products.

## Current App Flow

- Login and signup live in `src/app/login/page.tsx`.
- Password recovery is handled inline on `/login` with `mode=recovery`; `src/app/forgot-password/page.tsx` redirects there for backwards compatibility.
- OAuth starts through `signInWithOAuthProvider` in `src/services/auth.ts`.
- Supabase returns to `src/app/auth/callback/route.ts`, where the auth code is exchanged for a cookie-based session.
- Successful Google login redirects to `/dashboard` through `/auth/callback?next=/dashboard`.

## Supabase Dashboard

1. Open Supabase Dashboard.
2. Select the project used by `.env.local`.
3. Go to **Authentication > Providers > Google**.
4. Enable Google.
5. Add the Google OAuth Client ID and Client Secret.
6. Save the provider.

Also open **Authentication > URL Configuration** and confirm these values:

- Site URL for local development: `http://localhost:3000`
- Redirect URL for local development: `http://localhost:3000/auth/callback`
- Site URL for production: your deployed app origin
- Redirect URL for production: `https://your-domain.com/auth/callback`

## Email Confirmation Templates

Copy the ready-made templates from [`docs/supabase/email-templates`](../supabase/email-templates/README.md) into **Authentication > Emails > Templates** in Supabase.
Keep `{{ .ConfirmationURL }}` intact in both templates so Supabase can issue the signed, single-use confirmation and reset links.

For the complete local redirect URL and email template setup, use the [Supabase email auth setup guide](../supabase/auth-redirect-and-email-setup.md).

## Google Cloud OAuth

Google sign-in has two redirect layers. Both must be configured, but they belong in different dashboards:

```text
Browser → Google → Supabase Auth callback → app /auth/callback → /dashboard
```

### 1. Create the Google OAuth client

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create or select the product project.
2. Open **Google Auth platform > Branding** (or **OAuth consent screen**) and set the app name, support email, and developer contact email. Add the authorized production domain when one exists.
3. If publishing remains in **Testing**, add each person who will test sign-in under **Audience > Test users**.
4. Open **Google Auth platform > Clients**, create an OAuth Client ID, and choose **Web application**.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `https://your-domain.com`
6. Under **Authorized redirect URIs**, add the exact value shown in Supabase **Authentication > Sign In / Providers > Google**:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

This redirect URI sends Google back to Supabase. It is not the same as the app's `/auth/callback` route.

### 2. Complete Supabase configuration

1. In **Authentication > Sign In / Providers > Google**, enable Google and paste the Google Client ID and Client Secret.
2. In **Authentication > URL Configuration**, set the local Site URL to `http://localhost:3000` and allow:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`
3. Add equivalent production URLs after deployment, including `https://your-domain.com/auth/callback`.

The URL Configuration values are Supabase's approved destinations after it receives the Google response. Keep Google credentials only in Google Cloud and Supabase; do not add them to `.env.local` or source control.

Required Google scopes:

- `openid`
- `email`
- `profile`

Do not request extra Google scopes unless the app genuinely needs Google API access. Extra scopes can trigger a longer verification process.

## Environment Variables

The app does not need Google client secrets in `.env.local` when using hosted Supabase Auth. Keep Google OAuth credentials inside the Supabase Dashboard.

The required app variables remain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` or Google client secrets in browser code.

## Error Handling

The login UI maps common failures to user-facing messages:

- Weak signup password: blocked locally before Supabase is called.
- Supabase unavailable or paused: tells the user to check project status and environment URL.
- Invalid email/password: explains that credentials do not match.
- Google provider not configured: points to Supabase provider and redirect URL setup.
- Google shows an access-blocked or testing message: add the account to the Google OAuth consent screen's test-user list, or publish the consent screen when ready.
- Google reports a redirect mismatch: compare the exact Google authorized redirect URI with the Supabase provider callback URL. Do not use the app's `/auth/callback` URL in Google Cloud.
- Forgot password: reuses the email already entered on the login form and sends a setup link without asking for the old password.

Password signup currently requires at least 3 of these 4 checks:

- 8 characters
- Uppercase letter
- Number
- Symbol

The server action repeats the password check so users cannot bypass it by editing the browser.

## Verification Checklist

- Start the Supabase project used by `.env.local`.
- Run `npm run lint`.
- Open `http://localhost:3000/login`.
- Confirm weak passwords do not submit signup.
- Confirm `Continue with Google` redirects to Google.
- Confirm the Google account is permitted by the consent-screen audience.
- Confirm Google returns through the Supabase callback, then `/auth/callback`, and finally `/dashboard`.
- Open `http://localhost:3000/forgot-password`.
- Confirm the page matches the login theme on mobile and desktop.

## Troubleshooting

If Google redirects to an error page, check the Supabase Google provider first. Most failures are caused by a missing provider secret or a redirect URL mismatch.

If the UI shows that Supabase cannot be reached, confirm the project is active and that `NEXT_PUBLIC_SUPABASE_URL` points to the same project shown in Supabase Dashboard.

If signup still fails after a strong password, check Supabase Auth password policies and email confirmation settings in the Dashboard.
