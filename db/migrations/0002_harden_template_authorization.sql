-- Custom SQL migration file, put your code below! --
-- Keep authorization state in the database, not in user-editable metadata or
-- application-only route guards. These helpers run with table-owner rights to
-- avoid recursive RLS lookups, but are kept in a non-exposed schema.
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.is_active_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
      AND is_active = true
  )
$$;

CREATE OR REPLACE FUNCTION private.is_own_profile_identity_unchanged(
  next_role public.user_role,
  next_is_active boolean,
  next_email text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT role IS NOT DISTINCT FROM next_role
    AND is_active IS NOT DISTINCT FROM next_is_active
    AND email IS NOT DISTINCT FROM next_email
  FROM public.profiles
  WHERE id = (SELECT auth.uid())
$$;

REVOKE ALL ON FUNCTION private.is_active_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_own_profile_identity_unchanged(public.user_role, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_active_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_own_profile_identity_unchanged(public.user_role, boolean, text) TO authenticated;

DROP POLICY IF EXISTS "users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "admins manage profiles" ON public.profiles;
CREATE POLICY "users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK (
    (SELECT auth.uid()) = id
    AND (SELECT private.is_own_profile_identity_unchanged(role, is_active, email))
  );
CREATE POLICY "active admins manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING ((SELECT private.is_active_admin()))
  WITH CHECK ((SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins manage leads" ON public.leads;
CREATE POLICY "active admins manage leads" ON public.leads
  FOR ALL TO authenticated
  USING ((SELECT private.is_active_admin()))
  WITH CHECK ((SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins manage services" ON public.services;
CREATE POLICY "active admins manage services" ON public.services
  FOR ALL TO authenticated
  USING ((SELECT private.is_active_admin()))
  WITH CHECK ((SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins manage bookings" ON public.bookings;
CREATE POLICY "active admins manage bookings" ON public.bookings
  FOR ALL TO authenticated
  USING ((SELECT private.is_active_admin()))
  WITH CHECK ((SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins manage analytics" ON public.analytics_events;
CREATE POLICY "active admins manage analytics" ON public.analytics_events
  FOR ALL TO authenticated
  USING ((SELECT private.is_active_admin()))
  WITH CHECK ((SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins manage gallery items" ON public.gallery_items;
CREATE POLICY "active admins manage gallery items" ON public.gallery_items
  FOR ALL TO authenticated
  USING ((SELECT private.is_active_admin()))
  WITH CHECK ((SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins manage notifications" ON public.notifications;
CREATE POLICY "active admins manage notifications" ON public.notifications
  FOR ALL TO authenticated
  USING ((SELECT private.is_active_admin()))
  WITH CHECK ((SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins manage audit logs" ON public.audit_logs;
CREATE POLICY "active admins manage audit logs" ON public.audit_logs
  FOR ALL TO authenticated
  USING ((SELECT private.is_active_admin()))
  WITH CHECK ((SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins manage blog posts" ON public.blog_posts;
CREATE POLICY "active admins manage blog posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING ((SELECT private.is_active_admin()))
  WITH CHECK ((SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins manage blog images" ON storage.objects;
CREATE POLICY "active admins manage blog images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'blog-images' AND (SELECT private.is_active_admin()))
  WITH CHECK (bucket_id = 'blog-images' AND (SELECT private.is_active_admin()));

DROP POLICY IF EXISTS "admins view team audit logs" ON public.team_audit_logs;
CREATE POLICY "active admins view team audit logs" ON public.team_audit_logs
  FOR SELECT TO authenticated
  USING ((SELECT private.is_active_admin()));

-- Every policy has now been switched to the private helper, so the exposed
-- SECURITY DEFINER helper can be removed safely.
DROP FUNCTION IF EXISTS public.is_admin();

-- The final-active-admin guard is also privileged and must not be an exposed
-- RPC. Recreate its trigger against the private function.
DROP TRIGGER IF EXISTS protect_final_active_admin ON public.profiles;
CREATE OR REPLACE FUNCTION private.prevent_removing_final_active_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF OLD.role = 'admin' AND OLD.is_active AND (NEW.role <> 'admin' OR NOT NEW.is_active) THEN
    PERFORM 1
    FROM public.profiles
    WHERE id <> OLD.id
      AND role = 'admin'
      AND is_active = true
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'The final active administrator cannot be deactivated or moved to another role.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_final_active_admin
  BEFORE UPDATE OF role, is_active ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION private.prevent_removing_final_active_admin();

REVOKE ALL ON FUNCTION private.prevent_removing_final_active_admin() FROM PUBLIC, anon, authenticated;
DROP FUNCTION IF EXISTS public.prevent_removing_final_active_admin();

-- Trigger functions do not need API callers. Removing execute rights does not
-- prevent PostgreSQL from firing the auth trigger.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
