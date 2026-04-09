-- Supabase Schema Snapshot
-- Generated: 2026-04-09 17:59
-- Project ID: brxpxesnmbrbjlimlehl

-- ── ENUMS ──
CREATE TYPE "public"."user_role" AS ENUM ('admin', 'user');

-- ── FUNCTIONS ──
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
$$;

CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- ── TABLES ──
CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL,
    "email" text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
    "role" "public"."user_role" DEFAULT 'user'::public.user_role,
    "full_name" text,
    "age" integer,
    "birthday" date,
    "gender" text,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

-- ── RLS POLICIES ──
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can update all profiles" ON "public"."profiles"
FOR UPDATE USING ("public"."is_admin"());

CREATE POLICY "Admins can view all profiles" ON "public"."profiles"
FOR SELECT USING ("public"."is_admin"());

CREATE POLICY "Users can view own profile" ON "public"."profiles"
FOR SELECT USING ((auth.uid() = id));

CREATE POLICY "Users can update own profile." ON "public"."profiles"
FOR UPDATE USING ((auth.uid() = id));

CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles"
FOR SELECT USING (true);

-- ── TRIGGERS ──
CREATE TRIGGER "on_auth_user_created"
AFTER INSERT ON "auth"."users"
FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();
