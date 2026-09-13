-- Migration: 20260913000003_auto_org_creation.sql
-- Purpose: Ensure every user has a default organization, and update handle_new_user to auto-provision an organization upon signup.

-- 1. Backfill organizations for existing users who do not have one
INSERT INTO public.organizations (owner_id, name)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1) || '''s Org', 'Default Organization')
FROM auth.users
WHERE id NOT IN (SELECT owner_id FROM public.organizations WHERE owner_id IS NOT NULL);

-- 2. Update handle_new_user trigger function to create profile AND organization
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() 
RETURNS "trigger"
LANGUAGE "plpgsql" 
SECURITY DEFINER
AS $$
DECLARE
  org_name text;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;

  -- Create default organization
  org_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1) || '''s Org', 'Default Organization');
  
  INSERT INTO public.organizations (owner_id, name)
  VALUES (new.id, org_name)
  ON CONFLICT DO NOTHING;

  RETURN new;
END;
$$;
