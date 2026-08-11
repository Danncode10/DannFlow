# Supabase Email Auth Setup

Use this guide after cloning DannFlow locally or when email confirmation and
password reset links do not return to the app.

## 1. Allow Local Redirect URLs

In the Supabase Dashboard, open **Authentication > URL Configuration**.

Set the local development **Site URL** to:

```text
http://localhost:3000
```

Add both URLs under **Redirect URLs**:

```text
http://localhost:3000/auth/callback
http://localhost:3000/reset-password
```

Save the changes. Supabase only redirects to URLs in this allow list.

## 2. Install the Email Templates

Open **Authentication > Emails > Templates**.

| Supabase template | Subject | Repository file |
| --- | --- | --- |
| Confirm sign up | `Confirm your DannFlow email` | [`confirm-signup.html`](./email-templates/confirm-signup.html) |
| Reset password | `Reset your DannFlow password` | [`reset-password.html`](./email-templates/reset-password.html) |

For each template, replace the email body with the contents of its repository
file and save.

Keep this exact placeholder in the button link:

```html
{{ .ConfirmationURL }}
```

Do not replace it with a localhost URL or a deployed URL. Supabase generates
the signed, single-use URL and then redirects the user to an allowed app URL.

## 3. Verify

1. Create a fresh account using a new email address.
2. Open the newest **Confirm your email** message.
3. Confirm the browser returns to `http://localhost:3000/login` without an error.
4. From login, select **Forgot password**, request a reset link, and confirm the browser opens `http://localhost:3000/reset-password`.

Email links are single-use. Request a new email after changing the URL settings
or templates; an old link cannot test the new configuration.
