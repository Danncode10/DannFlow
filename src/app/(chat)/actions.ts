"use server";

/**
 * Server actions for chat feature.
 * Stub — expand as business logic requires.
 */

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}): Promise<void> {
  // TODO: persist visibility change to database
  void chatId;
  void visibility;
}

export async function deleteChat(chatId: string): Promise<void> {
  // TODO: delete chat from database
  void chatId;
}

export async function deleteTrailingMessages({
  id,
}: {
  id: string;
}): Promise<void> {
  // TODO: delete trailing messages from database
  void id;
}
