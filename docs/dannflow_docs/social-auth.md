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

Create a Google OAuth client:

1. Open Google Cloud Console.
2. Configure the OAuth consent screen for the app brand.
3. Create an OAuth Client ID with type **Web application**.
4. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://your-domain.com`
5. Add the authorized redirect URI from the Supabase Google provider screen:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
6. Copy the Client ID and Client Secret into the Supabase Google provider.

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
- Confirm Google returns to `/auth/callback` and then `/dashboard`.
- Open `http://localhost:3000/forgot-password`.
- Confirm the page matches the login theme on mobile and desktop.

## Troubleshooting

If Google redirects to an error page, check the Supabase Google provider first. Most failures are caused by a missing provider secret or a redirect URL mismatch.

If the UI shows that Supabase cannot be reached, confirm the project is active and that `NEXT_PUBLIC_SUPABASE_URL` points to the same project shown in Supabase Dashboard.

If signup still fails after a strong password, check Supabase Auth password policies and email confirmation settings in the Dashboard.
