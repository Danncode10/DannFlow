-- Migration: 20260913000001_ai_chat_history.sql
-- Description: Creates ai_chats and ai_messages tables with multi-tenant RLS for AI Secretary chat persistence.

-- 1. Create ai_chats table
CREATE TABLE IF NOT EXISTS public.ai_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE DEFAULT public.get_current_org_id(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
    title TEXT NOT NULL DEFAULT 'New Conversation',
    visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create ai_messages table
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES public.ai_chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    parts JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_chats_org ON public.ai_chats(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_chats_user ON public.ai_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_chat_id ON public.ai_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON public.ai_messages(created_at);

-- 3. Enable Row Level Security
ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for ai_chats
CREATE POLICY "Users can view their organization's chats"
ON public.ai_chats FOR SELECT
USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert their organization's chats"
ON public.ai_chats FOR INSERT
WITH CHECK (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update their organization's chats"
ON public.ai_chats FOR UPDATE
USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete their organization's chats"
ON public.ai_chats FOR DELETE
USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid()));

-- 5. RLS Policies for ai_messages
CREATE POLICY "Users can view messages of their organization's chats"
ON public.ai_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.ai_chats c
        WHERE c.id = ai_messages.chat_id
        AND c.organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid())
    )
);

CREATE POLICY "Users can insert messages into their organization's chats"
ON public.ai_messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.ai_chats c
        WHERE c.id = ai_messages.chat_id
        AND c.organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid())
    )
);

CREATE POLICY "Users can update messages of their organization's chats"
ON public.ai_messages FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.ai_chats c
        WHERE c.id = ai_messages.chat_id
        AND c.organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid())
    )
);

CREATE POLICY "Users can delete messages of their organization's chats"
ON public.ai_messages FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.ai_chats c
        WHERE c.id = ai_messages.chat_id
        AND c.organization_id IN (SELECT id FROM public.organizations WHERE owner_id = auth.uid())
    )
);
