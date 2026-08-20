CREATE TABLE "team_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid NOT NULL,
	"target_profile_id" uuid NOT NULL,
	"action" text NOT NULL,
	"previous_values" jsonb,
	"next_values" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "team_audit_logs" ADD CONSTRAINT "team_audit_logs_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_audit_logs" ADD CONSTRAINT "team_audit_logs_target_profile_id_profiles_id_fk" FOREIGN KEY ("target_profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "team_audit_logs_target_profile_id_idx" ON "team_audit_logs" USING btree ("target_profile_id");--> statement-breakpoint
CREATE INDEX "team_audit_logs_created_at_idx" ON "team_audit_logs" USING btree ("created_at");
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.prevent_removing_final_active_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role = 'admin' AND OLD.is_active AND (NEW.role <> 'admin' OR NOT NEW.is_active) THEN
    PERFORM 1
    FROM public.profiles
    WHERE id <> OLD.id AND role = 'admin' AND is_active = true
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'The final active administrator cannot be deactivated or moved to another role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER protect_final_active_admin
  BEFORE UPDATE OF role, is_active ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_removing_final_active_admin();
--> statement-breakpoint
ALTER TABLE public.team_audit_logs ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "admins view team audit logs" ON public.team_audit_logs
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));
--> statement-breakpoint
REVOKE ALL ON TABLE public.team_audit_logs FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
GRANT SELECT ON TABLE public.team_audit_logs TO authenticated;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.prevent_removing_final_active_admin() FROM PUBLIC, anon, authenticated;
