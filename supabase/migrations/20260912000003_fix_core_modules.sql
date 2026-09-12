-- Migration: 20260912000003_fix_core_modules.sql
-- Description: Fixes TypeScript compilation errors by setting a default organization_id via a helper function, and enforcing NOT NULL on blog content. Also corrects the RLS policies from migration 000002.

-- 1. Create a stable function to get the current user's organization_id
CREATE OR REPLACE FUNCTION public.get_current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT id FROM public.organizations WHERE owner_id = auth.uid() LIMIT 1;
$$;

-- 2. Set the default value on all tenant tables so the frontend Insert payloads don't require it
ALTER TABLE public.blog_posts ALTER COLUMN organization_id SET DEFAULT public.get_current_org_id();
ALTER TABLE public.services ALTER COLUMN organization_id SET DEFAULT public.get_current_org_id();
ALTER TABLE public.gallery_items ALTER COLUMN organization_id SET DEFAULT public.get_current_org_id();
ALTER TABLE public.leads ALTER COLUMN organization_id SET DEFAULT public.get_current_org_id();
ALTER TABLE public.bookings ALTER COLUMN organization_id SET DEFAULT public.get_current_org_id();

-- 3. Fix the nullability of blog content to match the Next.js UI expectations
UPDATE public.blog_posts SET content = '' WHERE content IS NULL;
ALTER TABLE public.blog_posts ALTER COLUMN content SET NOT NULL;

-- 4. Fix RLS Policies (Migration 000002 incorrectly referenced profiles.organization_id instead of organizations.owner_id)
DROP POLICY IF EXISTS "Users can read their organization's blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can insert their organization's blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can update their organization's blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can delete their organization's blog posts" ON public.blog_posts;

CREATE POLICY "Users can read their organization's blog posts" 
ON public.blog_posts FOR SELECT USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can insert their organization's blog posts" 
ON public.blog_posts FOR INSERT WITH CHECK (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can update their organization's blog posts" 
ON public.blog_posts FOR UPDATE USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can delete their organization's blog posts" 
ON public.blog_posts FOR DELETE USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));

-- Services
DROP POLICY IF EXISTS "Users can read their organization's services" ON public.services;
DROP POLICY IF EXISTS "Users can insert their organization's services" ON public.services;
DROP POLICY IF EXISTS "Users can update their organization's services" ON public.services;
DROP POLICY IF EXISTS "Users can delete their organization's services" ON public.services;

CREATE POLICY "Users can read their organization's services" 
ON public.services FOR SELECT USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can insert their organization's services" 
ON public.services FOR INSERT WITH CHECK (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can update their organization's services" 
ON public.services FOR UPDATE USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can delete their organization's services" 
ON public.services FOR DELETE USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));

-- Gallery Items
DROP POLICY IF EXISTS "Users can read their organization's gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Users can insert their organization's gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Users can update their organization's gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Users can delete their organization's gallery items" ON public.gallery_items;

CREATE POLICY "Users can read their organization's gallery items" 
ON public.gallery_items FOR SELECT USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can insert their organization's gallery items" 
ON public.gallery_items FOR INSERT WITH CHECK (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can update their organization's gallery items" 
ON public.gallery_items FOR UPDATE USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can delete their organization's gallery items" 
ON public.gallery_items FOR DELETE USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));

-- Leads
DROP POLICY IF EXISTS "Users can read their organization's leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete their organization's leads" ON public.leads;

CREATE POLICY "Users can read their organization's leads" 
ON public.leads FOR SELECT USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can delete their organization's leads" 
ON public.leads FOR DELETE USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));

-- Bookings
DROP POLICY IF EXISTS "Users can read their organization's bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their organization's bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their organization's bookings" ON public.bookings;

CREATE POLICY "Users can read their organization's bookings" 
ON public.bookings FOR SELECT USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can update their organization's bookings" 
ON public.bookings FOR UPDATE USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
CREATE POLICY "Users can delete their organization's bookings" 
ON public.bookings FOR DELETE USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));
