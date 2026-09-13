-- Migration: 20260912000001_ai_secretary_schema
-- Purpose: Creates the task queue for the AI Secretary engine.

CREATE TABLE IF NOT EXISTS public.secretary_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'low',
    triggered_by_state_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dismissed', 'done')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Turn on Row Level Security
ALTER TABLE public.secretary_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read tasks belonging to their organizations
CREATE POLICY "Users can read tasks for their organization"
ON public.secretary_tasks
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.organizations o
        WHERE o.id = secretary_tasks.organization_id
        AND o.owner_id = auth.uid()
    )
);

-- Policy: Users can update tasks belonging to their organizations (e.g. mark done)
CREATE POLICY "Users can update tasks for their organization"
ON public.secretary_tasks
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.organizations o
        WHERE o.id = secretary_tasks.organization_id
        AND o.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.organizations o
        WHERE o.id = secretary_tasks.organization_id
        AND o.owner_id = auth.uid()
    )
);

-- Policy: Service role (e.g., Edge Function cron) can insert tasks bypassing normal user RLS
-- Note: Service role automatically bypasses RLS, but if we want specific explicit grants or
-- if we allow authenticated backend systems, we can define an insert policy.
-- For standard Supabase service_role key, no explicit policy is needed, but we'll add one
-- for completeness in case it's called via an authenticated non-service API.
CREATE POLICY "Service role can insert tasks"
ON public.secretary_tasks
FOR INSERT
WITH CHECK (true);

-- Trigger to auto-update 'updated_at' timestamp
CREATE TRIGGER update_secretary_tasks_updated_at
BEFORE UPDATE ON public.secretary_tasks
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
