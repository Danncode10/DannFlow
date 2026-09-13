import { createClient } from "@/utils/supabase/server";
import type { Tables, TablesInsert, Json } from "@/types/supabase";

export type AiChat = Tables<"ai_chats">;
export type AiMessage = Tables<"ai_messages">;

export type ChatListItem = {
  id: string;
  title: string;
  createdAt: string;
  visibility: "private" | "public";
};

/**
 * Creates a new chat or ensures an existing chat exists.
 */
export async function createOrGetChat(
  chatId: string,
  title = "New Conversation",
): Promise<AiChat | null> {
  const supabase = await createClient();

  // Try to find existing chat
  const { data: existingChat } = await supabase
    .from("ai_chats")
    .select("*")
    .eq("id", chatId)
    .maybeSingle();

  if (existingChat) {
    return existingChat;
  }

  // Get current user's org
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: orgData } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!orgData) return null;

  const insertPayload: TablesInsert<"ai_chats"> = {
    id: chatId,
    organization_id: orgData.id,
    user_id: user.id,
    title,
    visibility: "private",
  };

  const { data: newChat, error: insertError } = await supabase
    .from("ai_chats")
    .insert(insertPayload)
    .select("*")
    .single();

  if (insertError) {
    console.error("Error creating AI chat:", insertError);
    return null;
  }

  return newChat;
}

/**
 * List paginated chat sessions for the current tenant.
 */
export async function listUserChats(
  page = 0,
  limit = 20,
): Promise<{ chats: ChatListItem[]; hasMore: boolean }> {
  const supabase = await createClient();
  const from = page * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from("ai_chats")
    .select("id, title, created_at, visibility", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error listing user chats:", error);
    return { chats: [], hasMore: false };
  }

  const chats: ChatListItem[] = (data || []).map((c) => ({
    id: c.id,
    title: c.title,
    createdAt: c.created_at,
    visibility: (c.visibility as "private" | "public") || "private",
  }));

  const hasMore = (count ?? 0) > to + 1;
  return { chats, hasMore };
}

/**
 * Fetch all messages for a specific chat session.
 */
export async function getChatMessages(chatId: string): Promise<AiMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }

  return data || [];
}

/**
 * Persist a message to the database.
 */
export async function saveChatMessage(
  chatId: string,
  role: "user" | "assistant" | "system",
  parts: Json,
): Promise<AiMessage | null> {
  const supabase = await createClient();

  // Ensure chat exists before inserting message
  await createOrGetChat(chatId);

  const { data, error } = await supabase
    .from("ai_messages")
    .insert({
      chat_id: chatId,
      role,
      parts,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error saving chat message:", error);
    return null;
  }

  // Update chat updated_at timestamp
  await supabase
    .from("ai_chats")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", chatId);

  return data;
}

/**
 * Delete a specific chat and its cascading messages.
 */
export async function deleteUserChat(chatId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("ai_chats").delete().eq("id", chatId);

  if (error) {
    console.error("Error deleting chat:", error);
    return false;
  }

  return true;
}

/**
 * Update the title of a chat (e.g. from first user prompt).
 */
export async function updateChatTitle(
  chatId: string,
  title: string,
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from("ai_chats")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", chatId);
}
