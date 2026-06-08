-- ============================================================================
-- Blog feature — posts table, RLS, and image storage bucket
-- Depends on: 20260531_002_dashboard_tables.sql (app_id/profiles conventions)
-- ============================================================================

-- ─── blog_posts table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id          text NOT NULL DEFAULT current_setting('app.id', true),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,

  -- Content
  title           text NOT NULL,
  slug            text NOT NULL,
  excerpt         text,
  content         text NOT NULL DEFAULT '',   -- TipTap HTML output
  cover_image_url text,

  -- SEO
  seo_title       text,
  seo_description text,

  -- State
  is_published    boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  UNIQUE (app_id, slug)
);

-- ─── RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public (anon + authenticated) may read ONLY published posts for this app
DROP POLICY IF EXISTS "public read published blog posts" ON public.blog_posts;
CREATE POLICY "public read published blog posts"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true AND app_id = current_setting('app.id', true)::text);

-- Admins may fully manage their app's posts (mirrors the "admin manage" pattern
-- used by services/gallery_items in 20260531_002 — DannFlow has no
-- current_app_id()/current_org_id() helpers, unlike business-template's
-- RLS-hardening migration)
DROP POLICY IF EXISTS "members manage blog posts" ON public.blog_posts;
CREATE POLICY "members manage blog posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (
    app_id = current_setting('app.id', true)::text
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
        AND app_id = current_setting('app.id', true)::text
    )
  )
  WITH CHECK (
    app_id = current_setting('app.id', true)::text
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
        AND app_id = current_setting('app.id', true)::text
    )
  );

-- ─── updated_at trigger ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_blog_posts_updated_at();

-- ─── Storage bucket for cover/inline images ────────────────────────────────
-- Public bucket, 5 MB limit (images are compressed client-side before upload).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "authenticated users can upload blog images" ON storage.objects;
CREATE POLICY "authenticated users can upload blog images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "authenticated users can update blog images" ON storage.objects;
CREATE POLICY "authenticated users can update blog images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "authenticated users can delete blog images" ON storage.objects;
CREATE POLICY "authenticated users can delete blog images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "public can read blog images" ON storage.objects;
CREATE POLICY "public can read blog images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'blog-images');
