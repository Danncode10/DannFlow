CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" text DEFAULT 'business-template' NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"website" text,
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"app_id" text DEFAULT 'business-template' NOT NULL,
	"organization_id" uuid,
	"email" text,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"role" "user_role" DEFAULT 'user',
	"full_name" text,
	"age" integer,
	"birthday" date,
	"gender" text
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" text DEFAULT 'business-template' NOT NULL,
	"organization_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"page_path" text,
	"referrer" text,
	"user_agent" text,
	"ip_hash" text,
	"session_id" text,
	"properties" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" text DEFAULT 'business-template' NOT NULL,
	"organization_id" uuid NOT NULL,
	"actor_id" uuid,
	"actor_email" text,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"old_data" jsonb,
	"new_data" jsonb,
	"diff" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" text DEFAULT 'business-template' NOT NULL,
	"organization_id" uuid NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text,
	"service_id" uuid,
	"service_name" text NOT NULL,
	"package" text,
	"vehicle_type" text,
	"vehicle_make" text,
	"vehicle_model" text,
	"vehicle_year" text,
	"notes" text,
	"preferred_date" date,
	"preferred_time" text,
	"confirmed_date" date,
	"confirmed_time" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"price_quoted" numeric(10, 2),
	"price_paid" numeric(10, 2),
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"source" text DEFAULT 'website' NOT NULL,
	"lead_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" text DEFAULT 'business-template' NOT NULL,
	"organization_id" uuid NOT NULL,
	"title" text,
	"caption" text,
	"image_url" text NOT NULL,
	"before_image_url" text,
	"service_tag" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" text DEFAULT 'business-template' NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text,
	"service_interest" text,
	"source" text DEFAULT 'contact-form' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" text DEFAULT 'business-template' NOT NULL,
	"organization_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"link" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" text DEFAULT 'business-template' NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"short_desc" text,
	"category" text,
	"price_from" numeric(10, 2),
	"price_to" numeric(10, 2),
	"price_label" text,
	"duration_minutes" integer,
	"is_featured" boolean DEFAULT false,
	"is_published" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"icon" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" text DEFAULT current_setting('app.id', true) NOT NULL,
	"organization_id" uuid,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text DEFAULT '' NOT NULL,
	"cover_image_url" text,
	"seo_title" text,
	"seo_description" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_app_id_slug_idx" ON "organizations" USING btree ("app_id","slug");--> statement-breakpoint
CREATE INDEX "idx_analytics_app_id" ON "analytics_events" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "idx_analytics_organization_id" ON "analytics_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_analytics_event_type" ON "analytics_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_analytics_created_at" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_app_id" ON "audit_logs" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_organization_id" ON "audit_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_action" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_bookings_app_id" ON "bookings" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "idx_bookings_organization_id" ON "bookings" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_bookings_status" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_gallery_app_id" ON "gallery_items" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "idx_gallery_organization_id" ON "gallery_items" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_leads_app_id" ON "leads" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "idx_leads_organization_id" ON "leads" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_leads_status" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_leads_created_at" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_app_id" ON "notifications" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_organization_id" ON "notifications" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_is_read" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE UNIQUE INDEX "services_app_id_slug_idx" ON "services" USING btree ("app_id","slug");--> statement-breakpoint
CREATE INDEX "idx_services_app_id" ON "services" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "idx_services_organization_id" ON "services" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_services_is_published" ON "services" USING btree ("is_published");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_posts_app_id_slug_idx" ON "blog_posts" USING btree ("app_id","slug");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_auth_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "public"."is_admin"()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT (role = 'admin')
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "public"."update_updated_at"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;--> statement-breakpoint
CREATE TRIGGER "on_auth_user_created"
AFTER INSERT ON "auth"."users"
FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();--> statement-breakpoint
CREATE TRIGGER "organizations_updated_at"
BEFORE UPDATE ON "public"."organizations"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();--> statement-breakpoint
CREATE TRIGGER "leads_updated_at"
BEFORE UPDATE ON "public"."leads"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();--> statement-breakpoint
CREATE TRIGGER "services_updated_at"
BEFORE UPDATE ON "public"."services"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();--> statement-breakpoint
CREATE TRIGGER "bookings_updated_at"
BEFORE UPDATE ON "public"."bookings"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();--> statement-breakpoint
CREATE TRIGGER "gallery_items_updated_at"
BEFORE UPDATE ON "public"."gallery_items"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();--> statement-breakpoint
CREATE TRIGGER "blog_posts_updated_at"
BEFORE UPDATE ON "public"."blog_posts"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();--> statement-breakpoint
ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."analytics_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."gallery_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Users can view own profile" ON "public"."profiles"
FOR SELECT TO authenticated
USING (auth.uid() = id);--> statement-breakpoint
CREATE POLICY "Users can update own profile" ON "public"."profiles"
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);--> statement-breakpoint
CREATE POLICY "Admins can view all profiles" ON "public"."profiles"
FOR SELECT TO authenticated
USING ("public"."is_admin"());--> statement-breakpoint
CREATE POLICY "Admins can update all profiles" ON "public"."profiles"
FOR UPDATE TO authenticated
USING ("public"."is_admin"())
WITH CHECK ("public"."is_admin"());--> statement-breakpoint
CREATE POLICY "tenant isolation" ON "public"."organizations"
FOR ALL TO authenticated
USING (app_id = current_setting('app.id', true)::text)
WITH CHECK (app_id = current_setting('app.id', true)::text);--> statement-breakpoint
CREATE POLICY "tenant isolation" ON "public"."leads"
FOR ALL TO authenticated
USING (app_id = current_setting('app.id', true)::text)
WITH CHECK (app_id = current_setting('app.id', true)::text);--> statement-breakpoint
CREATE POLICY "tenant isolation" ON "public"."bookings"
FOR ALL TO authenticated
USING (app_id = current_setting('app.id', true)::text)
WITH CHECK (app_id = current_setting('app.id', true)::text);--> statement-breakpoint
CREATE POLICY "tenant isolation" ON "public"."analytics_events"
FOR ALL TO authenticated
USING (app_id = current_setting('app.id', true)::text)
WITH CHECK (app_id = current_setting('app.id', true)::text);--> statement-breakpoint
CREATE POLICY "tenant isolation" ON "public"."notifications"
FOR ALL TO authenticated
USING (app_id = current_setting('app.id', true)::text)
WITH CHECK (app_id = current_setting('app.id', true)::text);--> statement-breakpoint
CREATE POLICY "tenant isolation" ON "public"."audit_logs"
FOR ALL TO authenticated
USING (app_id = current_setting('app.id', true)::text)
WITH CHECK (app_id = current_setting('app.id', true)::text);--> statement-breakpoint
CREATE POLICY "public read published services" ON "public"."services"
FOR SELECT TO anon, authenticated
USING (app_id = current_setting('app.id', true)::text AND is_published = true);--> statement-breakpoint
CREATE POLICY "admins manage services" ON "public"."services"
FOR ALL TO authenticated
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
);--> statement-breakpoint
CREATE POLICY "public read published gallery items" ON "public"."gallery_items"
FOR SELECT TO anon, authenticated
USING (app_id = current_setting('app.id', true)::text AND is_published = true);--> statement-breakpoint
CREATE POLICY "admins manage gallery items" ON "public"."gallery_items"
FOR ALL TO authenticated
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
);--> statement-breakpoint
CREATE POLICY "public read published blog posts" ON "public"."blog_posts"
FOR SELECT TO anon, authenticated
USING (is_published = true AND app_id = current_setting('app.id', true)::text);--> statement-breakpoint
CREATE POLICY "admins manage blog posts" ON "public"."blog_posts"
FOR ALL TO authenticated
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
);--> statement-breakpoint
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;--> statement-breakpoint
CREATE POLICY "authenticated users can upload blog images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images');--> statement-breakpoint
CREATE POLICY "authenticated users can update blog images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');--> statement-breakpoint
CREATE POLICY "authenticated users can delete blog images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'blog-images');--> statement-breakpoint
CREATE POLICY "public can read blog images" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'blog-images');
