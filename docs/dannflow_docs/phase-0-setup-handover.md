# DannFlow Phase 0 handover runbook

Use this runbook in order after creating a project from DannFlow. Each section maps to a typical Phase 0 task and ends with a simple completion check. Do not copy secrets into this file, Git, chat, or screenshots.

## Before you start

The handover developer needs access to:

- The project repository.
- The project's Supabase project.
- The project's Google Cloud OAuth project, when Google sign-in is enabled.
- A test email inbox they control.

Keep `DATABASE_URL`, service-role keys, SMTP passwords, OAuth client secrets, and personal tokens in a password manager or approved secret store only.

## P0.1 — Connect Supabase

**Purpose:** Connect the local app to the correct hosted Supabase project.

### Do this

1. Clone the repository and run:

   ```bash
   pnpm install
   cp .env.example .env.local
   ```

2. Use `.env.example` as the configuration contract. Add values through a secure channel; do not add them to this guide.
3. Set the required values in the untracked `.env.local` file:

   | Variable | Obtain it from |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → Data API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → Data API |
   | `SUPABASE_PROJECT_ID` | Supabase → Project Settings → General |
   | `DATABASE_URL` | Supabase → Connect |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → Data API; server-only |
   | `NEXT_PUBLIC_SITE_NAME` | Product configuration |
   | `NEXT_PUBLIC_SITE_URL` | Local or production app origin |

4. Run `pnpm dev`, then open `http://localhost:3000/login`.

### Done when

- The app starts locally.
- The login page loads without a Supabase configuration error.
- No secret was committed or shared in a ticket.

## P0.2 — Configure email authentication

**Purpose:** Let new users confirm their email and recover their account safely.

### Do this in Supabase

1. Open **Authentication → URL Configuration**.
2. Set **Site URL** to `http://localhost:3000`.
3. Add these **Redirect URLs**:

   ```text
   http://localhost:3000/auth/callback
   http://localhost:3000/reset-password
   ```

4. Open **Authentication → Providers**. Keep email/password enabled and choose the project's required email-confirmation setting.
5. Open **Authentication → Emails → SMTP Settings**. Configure the approved project SMTP provider and sender identity; keep its credentials private.
6. Open **Authentication → Emails → Templates**. Use the project's approved confirmation and recovery templates. Keep `{{ .ConfirmationURL }}` unchanged.

### Test it

1. Create a new account with a fresh inbox.
2. Confirm the email returns to the app.
3. Request a password reset, set a new password, and sign in.

### Done when

Confirmation and reset emails arrive, their links work, and the new password can sign in.

## P0.3 — Preserve the approved project UI

**Purpose:** Keep the product's approved visual direction intact while the project changes hands.

### Do this

1. Read `PROJECT_CONTEXT.md` before changing copy, theme, or UI.
2. Preserve the existing page structure, navigation, login behavior, and responsive behavior.
3. Use only Tailwind/Shadcn semantic tokens; do not add hard-coded color utility classes.
4. Check `/login` at mobile width (375px) and desktop width after UI changes.

### Done when

The landing and login screens retain approved product copy and are readable, responsive, and functional.

## P0.4 — Configure Google sign-in

**Purpose:** Allow an approved Google account to sign in through Supabase and reach `/dashboard`.

### A. Do this in Google Cloud

1. Select the dedicated Google OAuth project for this product; do not use a project belonging to another product.
2. Open **Google Auth Platform**.
3. In **Branding**, set the product name, support email, and developer contact email.
4. In **Audience**, use the intended audience. For testing, keep the app in Testing and add the Gmail account used for testing.
5. In **Data Access**, make sure `openid` is present. Do not add sensitive or restricted scopes without a product decision.
6. In **Clients**, create or update a Web application client:

   | Field | Value |
   | --- | --- |
   | Application type | Web application |
   | Name | `<PROJECT_NAME> local development` |
   | Authorized JavaScript origin | `http://localhost:3000` |
   | Authorized redirect URI | The callback shown by Supabase Google provider: `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback` |

7. Copy the Client ID and Client Secret. Keep the secret private.

### B. Do this in Supabase

1. Open **Authentication → Providers → Google**.
2. Enable **Sign in with Google**.
3. Paste the Google Client ID and Client Secret, then save.
4. Recheck **Authentication → URL Configuration** contains the local Site URL and both local redirect URLs from P0.2.

### C. Test it

1. Run `pnpm dev`.
2. Open `http://localhost:3000/login`.
3. Click **Continue with Google** and choose a Google OAuth test user.
4. Confirm the browser ends at `/dashboard`.

### Important distinction

Google Cloud needs the **Google → Supabase** URL:

```text
https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
```

Supabase needs the **Supabase → app** URL:

```text
http://localhost:3000/auth/callback
```

Do not swap these URLs.

### Done when

A Google test user reaches `/dashboard` after clicking **Continue with Google**.

## P0.5 — Hand over hero media

**Purpose:** Deliver approved visual assets without changing existing hero behavior by accident.

### Deliver these files

```text
public/hero-poster.avif
public/hero-background.webm
public/hero-background.mp4
```

Also hand over the asset source, licence/usage confirmation, intended desktop/mobile crop, and concise alt text. Review the hero on mobile and desktop, including reduced-motion fallback.

### Done when

The hero text remains readable, the subject survives the mobile crop, and the supplied media has approved usage rights.

## P0.6 — Final quality review

**Purpose:** Catch launch blockers after authentication and hero work are complete.

### Run

```bash
pnpm lint
pnpm build
```

Then check:

- `/login` works on mobile and desktop.
- Email confirmation, password reset, and Google sign-in reach the correct destination.
- No secrets appear in Git, logs, or screenshots.
- The landing page has clear product messaging and accessible image text.

Record any failure as a GitHub issue. Do not mark the review complete based only on a visual glance.

### Done when

The checks pass or every known failure has an assigned follow-up issue.

## P0.7 — Keep this runbook current

When a setting, provider, URL, or workflow changes, update this file in the same pull request. Never add credentials. Update the matching `MASTERPLAN.md` task and GitHub Project card when the work is actually complete.

## P0.8 — Deploy on Vercel and connect authentication

**Purpose:** Publish the app safely and register its final HTTPS origin with every authentication provider that sends users back to the app.

### Before you deploy

1. Run `pnpm lint` and `pnpm build`.
2. Choose one **canonical production origin**. Prefer a verified custom domain; otherwise temporarily use the stable Vercel production domain. Do not use a branch, commit preview, or localhost URL.
3. Keep the origin exact: HTTPS, no path, and no trailing slash. In this section, replace `<PRODUCTION_ORIGIN>` with that value.

### A. Create the Vercel project

1. In Vercel, choose **Add New → Project**, import the project repository, and select the correct team/account.
2. Confirm Vercel detects **Next.js** and keep the repository root as Root Directory unless the app is in a monorepo subdirectory.
3. Open **Project → Settings → Environment Variables**. Use the `VERCEL: COPY` block in `.env.example`; copy those values from private `.env.local`, never the file itself.
4. Deploy. Once it succeeds, copy the stable production domain. A successful initial deployment is not the end of this task.

### Required post-deployment URL handoff

1. The initial deployment uses the current `NEXT_PUBLIC_SITE_URL`. In Vercel, replace it with `<PRODUCTION_ORIGIN>`, then redeploy production.
2. Complete sections B and C below with that same exact origin.
3. Complete the three production authentication tests in section D.

### B. Register the deployed origin in Supabase

1. Open **Supabase → Authentication → URL Configuration**.
2. During testing, keep **Site URL** as `http://localhost:3000` when local development is the intended fallback. This does not prevent production testing when the production redirect URLs below are allow-listed. Set Site URL to `<PRODUCTION_ORIGIN>` only when production becomes the intended public-launch fallback for authentication emails and templates.
3. Retain localhost URLs and add:

   ```text
   <PRODUCTION_ORIGIN>/auth/callback
   <PRODUCTION_ORIGIN>/reset-password
   ```

4. Add a Vercel preview wildcard only when preview authentication is intentionally supported. Keep production URLs exact.

### C. Register the deployed origin in Google Cloud

1. In Google Cloud, search for **Google Auth Platform**, open **Clients**, then open the existing **Web application** client.
2. Under **Authorized JavaScript origins**, click **Add URI** and enter `<PRODUCTION_ORIGIN>` with no path.
3. Keep the **Authorized redirect URI** pointed to Supabase, then click **Save**:

   ```text
   https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
   ```

   Do not add `<PRODUCTION_ORIGIN>/auth/callback` as a Google redirect URI.
4. For a custom production domain, add it to **Branding → Authorized domains** if required and complete any necessary verification before launch.

### D. Redeploy and verify

1. At `<PRODUCTION_ORIGIN>`, test with accounts and an inbox you control:
   - Sign up and confirm the email returns to the app.
   - Request and complete a password reset.
   - Use **Continue with Google** and confirm the user reaches `/dashboard`.
2. Inspect Vercel deployment logs for configuration errors. Do not paste credentials into logs, tickets, or screenshots.

### Done when

The canonical production URL is deployed, its Vercel production variables are configured, and all three authentication flows return to the intended production app route.

### Deployment URL map

| Platform | Setting | Value |
| --- | --- | --- |
| Vercel | `NEXT_PUBLIC_SITE_URL` (Production) | `<PRODUCTION_ORIGIN>` |
| Supabase | Site URL | Keep the intended fallback during testing; set `<PRODUCTION_ORIGIN>` at public launch |
| Supabase | Redirect URLs | `<PRODUCTION_ORIGIN>/auth/callback`, `<PRODUCTION_ORIGIN>/reset-password` |
| Google Cloud | Authorized JavaScript origin | `<PRODUCTION_ORIGIN>` |
| Google Cloud | Authorized redirect URI | `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback` |

## Helpful references

- [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)
- [`social-auth.md`](social-auth.md)
- [`setup-vercel.md`](../../.claude/commands/setup-vercel.md)
