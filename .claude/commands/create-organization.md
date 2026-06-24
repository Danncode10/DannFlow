# /create-organization

You are setting up the Supabase tenant for this project. Follow every step in order. Do not skip steps. Ask for confirmation before running any destructive SQL.

> Current DannFlow schema rule: app-owned schema lives in `db/schema/*.ts` and `db/migrations/*.sql`. This command may insert tenant data such as an organization row, but it must not create or alter tables with Supabase MCP. If required tables are missing, run `pnpm db:migrate` with the target project's `DATABASE_URL` instead of applying ad hoc SQL.

---

## STEP 1 — Read the repo context

Read these files to understand the project:
- `business.json` — business name, slug, appId, website, features, services
- `src/lib/config.ts` — siteConfig (name, url, contact)
- `.env.example` — confirm NEXT_PUBLIC_APP_ID value
- `.env.local` (if it exists) — get the actual Supabase project ref/URL in use

Extract and store these values for use in all later steps:
- `APP_ID` = `deployment.appId` from business.json (e.g. `chris-auto-shine`)
- `ORG_NAME` = `business.name` from business.json
- `ORG_SLUG` = same as APP_ID (kebab-case)
- `ORG_WEBSITE` = `contact.website` from business.json
- `FEATURES` = the `features` object from business.json (shows which tables are needed)

---

## STEP 2 — Connect to Supabase and identify the project

Use `mcp__supabase-mcp-server__list_projects` to list all Supabase projects.

Look for the shared Dannflow project (it will be the one whose URL matches `NEXT_PUBLIC_SUPABASE_URL` from `.env.local`, or the project named something like "dannflow", "business-template", or "shared").

Display the project name and ref to the user, and confirm: **"Is this the correct Supabase project?"** before continuing.

Store the `project_id` for all subsequent MCP calls.

---

## STEP 3 — Verify the schema is ready

Use `mcp__supabase-mcp-server__list_tables` to check which tables exist in the `public` schema.

Confirm these foundation tables exist (they come from the business-template migration):
- `organizations`
- `profiles`

If either is missing, stop and tell the user: **"The tracked Drizzle migrations have not been applied to this Supabase project. Set DATABASE_URL and SUPABASE_PROJECT_ID, then run `pnpm db:migrate` first."**

If both exist, continue.

---

## STEP 4 — Check if the organization already exists

Run this SQL via `mcp__supabase-mcp-server__execute_sql`:

```sql
SELECT id, name, slug, app_id, website, created_at
FROM public.organizations
WHERE app_id = '<APP_ID>'
  AND slug = '<ORG_SLUG>';
```

- If a row is returned: tell the user the org already exists, show the row, and ask if they want to update it or skip to table creation (Step 6).
- If no row: continue to Step 5.

---

## STEP 5 — Create the organization row (the tenant anchor)

Run this SQL to register this project as a tenant:

```sql
INSERT INTO public.organizations (app_id, name, slug, website)
VALUES (
  '<APP_ID>',
  '<ORG_NAME>',
  '<ORG_SLUG>',
  '<ORG_WEBSITE>'
)
ON CONFLICT (app_id, slug) DO NOTHING
RETURNING id, name, slug, app_id, created_at;
```

Show the user the returned row. Store the returned `id` as `ORG_ID`.

Then update `business.json` — set `supabase.organizationSlug` to `<ORG_SLUG>`.

---

## STEP 6 — Confirm tracked feature tables

Do not create or alter feature tables from this command. Feature tables are tracked schema and must be added through the normal migration workflow:

```bash
/claude-command migrate "describe the table or column change"
# or manually:
# edit db/schema/*.ts
# pnpm db:generate
# review db/migrations/*.sql
# pnpm db:migrate
```

Use this command only to create or update the tenant row in `public.organizations` and `business.json`.

If the user's requested organization setup depends on missing feature tables, stop and report the missing tables. Suggest running `/migrate` for schema changes before retrying organization setup.

---

## STEP 7 — Verify organization setup

After creating or updating the organization row:

1. Query `public.organizations` for `<APP_ID>` and `<ORG_SLUG>`.
2. Confirm the row has the expected `name`, `slug`, `app_id`, and `website`.
3. Confirm `business.json` has `supabase.organizationSlug` set to `<ORG_SLUG>`.
4. Do not report success until the organization row and local config are both verified.

## Output

```text
✅ Organization ready: <ORG_NAME>

Supabase:
  - organization id: <ORG_ID>
  - app_id: <APP_ID>
  - slug: <ORG_SLUG>

Local config:
  - business.json supabase.organizationSlug updated

Schema note:
  - No tables were created or altered by this command. Use /migrate for tracked schema changes.
```
