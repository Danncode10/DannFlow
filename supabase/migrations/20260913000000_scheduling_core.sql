-- Migration: 20260913000000_scheduling_core.sql
-- Description: Creates multi-tenant tables for the Scheduling Core Engine (Phase 4).

-- 1. Calendar Events
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  attendee_name text,
  attendee_email text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT calendar_events_pkey PRIMARY KEY (id)
);

-- 2. Availability Slots
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT availability_slots_pkey PRIMARY KEY (id)
);

-- RLS Policies
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- Calendar Events Policies
CREATE POLICY "Users can read their organization's calendar events" 
ON public.calendar_events FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can insert their organization's calendar events" 
ON public.calendar_events FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can update their organization's calendar events" 
ON public.calendar_events FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can delete their organization's calendar events" 
ON public.calendar_events FOR DELETE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Availability Slots Policies
CREATE POLICY "Users can read their organization's availability slots" 
ON public.availability_slots FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can insert their organization's availability slots" 
ON public.availability_slots FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can update their organization's availability slots" 
ON public.availability_slots FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can delete their organization's availability slots" 
ON public.availability_slots FOR DELETE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);
