-- Migration: 20260912000000_core_tenant_schema
-- Purpose: Creates the base multi-tenant 'organizations' table for JuanStack SaaS.
-- This table stores tenant-specific BIR configuration data that was intentionally
-- decoupled from the global business.json.

CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    rdo_code TEXT,
    taxpayer_classification TEXT,
    vat_status TEXT,
    registered_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Turn on Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own organizations
CREATE POLICY "Users can read their own organizations"
ON public.organizations
FOR SELECT
USING (auth.uid() = owner_id);

-- Policy: Users can update their own organizations
CREATE POLICY "Users can update their own organizations"
ON public.organizations
FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can insert their own organizations
CREATE POLICY "Users can create their own organizations"
ON public.organizations
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can delete their own organizations
CREATE POLICY "Users can delete their own organizations"
ON public.organizations
FOR DELETE
USING (auth.uid() = owner_id);

-- Trigger to auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
