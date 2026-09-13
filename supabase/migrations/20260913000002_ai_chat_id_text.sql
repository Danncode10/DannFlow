-- Migration: 20260913000002_ai_chat_id_text.sql
-- Purpose: Convert id columns to TEXT so both UUIDs and arbitrary string IDs can be stored without casting errors.

-- 1. Drop dependent policies on ai_messages
DROP POLICY IF EXISTS "Users can view messages of their organization's chats" ON public.ai_messages;
DROP POLICY IF EXISTS "Users can insert messages into their organization's chats" ON public.ai_messages;
DROP POLICY IF EXISTS "Users can update messages of their organization's chats" ON public.ai_messages;
DROP POLICY IF EXISTS "Users can delete messages of their organization's chats" ON public.ai_messages;

-- 2. Drop foreign key constraint
ALTER TABLE public.ai_messages DROP CONSTRAINT IF EXISTS ai_messages_chat_id_fkey;

-- 3. Alter columns to TEXT
ALTER TABLE public.ai_messages ALTER COLUMN chat_id TYPE text;
ALTER TABLE public.ai_chats ALTER COLUMN id TYPE text;
ALTER TABLE public.ai_messages ALTER COLUMN id TYPE text;

-- 4. Re-add foreign key
ALTER TABLE public.ai_messages ADD CONSTRAINT ai_messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.ai_chats(id) ON DELETE CASCADE;

-- 5. Recreate policies
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
