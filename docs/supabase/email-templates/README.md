# Supabase Auth Email Templates

These are copy-paste-ready HTML templates for the hosted Supabase Dashboard.
They use `{{ .ConfirmationURL }}`, so Supabase creates and validates the secure,
single-use link and honors the redirect URL sent by the application.

## Install

1. In Supabase, open **Authentication > Emails > Templates**.
2. Select **Confirm sign up**.
3. Keep the subject as `Confirm your DannFlow email`.
4. Replace the email body with the contents of `confirm-signup.html` and save.
5. Select **Reset password**.
6. Keep the subject as `Reset your DannFlow password`.
7. Replace the email body with the contents of `reset-password.html` and save.

## Important

- Do not replace `{{ .ConfirmationURL }}` with a localhost or production URL.
  Supabase supplies the signed confirmation URL and the application's allowed
  redirect destination.
- In **Authentication > URL Configuration**, add the exact local URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/reset-password`
- Send a new test email after saving. Auth links are single-use and old emails
  cannot verify a newly changed configuration.
