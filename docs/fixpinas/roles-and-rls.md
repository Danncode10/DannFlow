# Roles & RLS

> Authoritative role definitions and Row Level Security policy per table. RLS is ON for every table. No exceptions.

## Roles

| Role | Who | Scope |
|---|---|---|
| `user` | Default. Any citizen who signs up. | Own reports + public reference data |
| `provincial_admin` | LGU / agency staff manually promoted by `admin` | Reports in their assigned `province_id` |
| `admin` | Platform owner | Everything |

Role lives on `profiles.role`. Helper SQL functions used in policies:

```sql
-- current user's role
create function public.current_role() returns text language sql stable
as $$ select role::text from profiles where id = auth.uid() $$;

-- current user's assigned province (NULL for non-provincial_admin)
create function public.current_province() returns uuid language sql stable
as $$ select province_id from profiles where id = auth.uid() $$;

-- is admin?
create function public.is_admin() returns bool language sql stable
as $$ select role = 'admin' from profiles where id = auth.uid() $$;
```

## RLS policy matrix

| Table | `user` | `provincial_admin` | `admin` |
|---|---|---|---|
| `profiles` | SELECT/UPDATE own | SELECT all in same province | ALL |
| `provinces` | SELECT all | SELECT all | ALL |
| `municipalities` | SELECT all, INSERT (via geocoding upsert) | SELECT all | ALL |
| `incident_categories` | SELECT where `is_active` | SELECT all | ALL |
| `agencies` | SELECT (public for transparency) | SELECT all | ALL |
| `agency_categories` | SELECT | SELECT | ALL |
| `reports` | SELECT/INSERT own | SELECT/UPDATE in own province | ALL |
| `report_notifications` | none | SELECT in own province | ALL |
| `report_verifications` | SELECT all, INSERT own | SELECT all in own province | ALL |
| `rate_limits` | SELECT/INSERT own | none | ALL |
| `audit_events` | none | none | ALL |

## Policy templates

### `reports` — most important table

```sql
-- user can SELECT own non-deleted reports
create policy "users_select_own_reports" on reports for select
using (
  deleted_at is null
  and user_id = auth.uid()
);

-- provincial_admin can SELECT all reports in their province
create policy "padmin_select_province_reports" on reports for select
using (
  deleted_at is null
  and current_role() = 'provincial_admin'
  and province_id = current_province()
);

-- admin SELECT all
create policy "admin_select_all_reports" on reports for select
using (is_admin());

-- user INSERT own report only
create policy "users_insert_own_reports" on reports for insert
with check (user_id = auth.uid());

-- provincial_admin UPDATE reports in their province (status changes)
create policy "padmin_update_province_reports" on reports for update
using (
  current_role() = 'provincial_admin'
  and province_id = current_province()
);

-- only admin can hard-delete
create policy "admin_delete_reports" on reports for delete
using (is_admin());
```

### `profiles`

```sql
create policy "users_select_own_profile" on profiles for select
using (id = auth.uid());

create policy "padmin_select_same_province" on profiles for select
using (
  current_role() = 'provincial_admin'
  and province_id = current_province()
);

create policy "admin_select_all_profiles" on profiles for select
using (is_admin());

create policy "users_update_own_profile" on profiles for update
using (id = auth.uid())
with check (
  -- users cannot escalate their own role or province
  id = auth.uid()
  and role = (select role from profiles where id = auth.uid())
  and province_id is not distinct from (select province_id from profiles where id = auth.uid())
);

create policy "admin_update_any_profile" on profiles for update
using (is_admin());
```

### Reference tables (`provinces`, `incident_categories`)

```sql
-- everyone authenticated can read
create policy "all_select_provinces" on provinces for select
using (auth.uid() is not null);

create policy "all_select_active_categories" on incident_categories for select
using (auth.uid() is not null and is_active = true);

-- only admin writes
create policy "admin_write_provinces" on provinces for all
using (is_admin()) with check (is_admin());
```

### `report_verifications`

```sql
create policy "all_select_verifications" on report_verifications for select
using (auth.uid() is not null);

create policy "users_insert_own_verification" on report_verifications for insert
with check (
  user_id = auth.uid()
  -- can't verify own report
  and exists (
    select 1 from reports
    where reports.id = report_id and reports.user_id != auth.uid()
  )
);
```

## Service layer rules

Every Supabase call in `src/services/` must:

1. **Use the server client** (`src/utils/supabase/server.ts`) when running in Server Components / Route Handlers — it forwards the user's session cookie so RLS applies.
2. **Never use the service-role key** in service files. Only Edge Functions or Next.js API routes with explicit elevated needs may use it (e.g. cron jobs).
3. **Filter explicitly even when RLS would catch it** — defense in depth. Example:
   ```ts
   await supabase.from('reports').select('*').eq('user_id', userId)
   ```

## Promotion / demotion

- A `user` becomes `provincial_admin` via an admin action that:
  1. Updates `profiles.role = 'provincial_admin'`
  2. Sets `profiles.province_id`
  3. Logs an `audit_events` row
- A `provincial_admin` cannot promote themselves — RLS on `profiles` denies role/province changes by non-admins.
