-- Migration: 20260912000002_core_modules_multitenant.sql
-- Description: Creates multi-tenant tables for the legacy DannFlow modules (Blog, Services, Gallery, Leads, Bookings).

-- 1. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  seo_title text,
  seo_description text,
  cover_image_url text,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_published boolean NOT NULL DEFAULT false,
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
  CONSTRAINT blog_posts_org_slug_key UNIQUE (organization_id, slug)
);

-- 2. Services
CREATE TABLE IF NOT EXISTS public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  price_from numeric,
  price_to numeric,
  duration_minutes integer,
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);

-- 3. Gallery Items
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  title text,
  caption text,
  service_tag text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT gallery_items_pkey PRIMARY KEY (id)
);

-- 4. Leads
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);

-- 5. Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  booking_date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT bookings_pkey PRIMARY KEY (id)
);

-- RLS Policies

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Blog Posts Policies
CREATE POLICY "Users can read their organization's blog posts" 
ON public.blog_posts FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can insert their organization's blog posts" 
ON public.blog_posts FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can update their organization's blog posts" 
ON public.blog_posts FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can delete their organization's blog posts" 
ON public.blog_posts FOR DELETE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Services Policies
CREATE POLICY "Users can read their organization's services" 
ON public.services FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can insert their organization's services" 
ON public.services FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can update their organization's services" 
ON public.services FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can delete their organization's services" 
ON public.services FOR DELETE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Gallery Items Policies
CREATE POLICY "Users can read their organization's gallery items" 
ON public.gallery_items FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can insert their organization's gallery items" 
ON public.gallery_items FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can update their organization's gallery items" 
ON public.gallery_items FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can delete their organization's gallery items" 
ON public.gallery_items FOR DELETE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Leads Policies
CREATE POLICY "Users can read their organization's leads" 
ON public.leads FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can insert leads into any organization" 
ON public.leads FOR INSERT WITH CHECK (true); -- Public form submission
CREATE POLICY "Users can delete their organization's leads" 
ON public.leads FOR DELETE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Bookings Policies
CREATE POLICY "Users can read their organization's bookings" 
ON public.bookings FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can insert bookings into any organization" 
ON public.bookings FOR INSERT WITH CHECK (true); -- Public form submission
CREATE POLICY "Users can update their organization's bookings" 
ON public.bookings FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can delete their organization's bookings" 
ON public.bookings FOR DELETE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
