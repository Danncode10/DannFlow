"use client";

import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { KeyedMutator } from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "@/lib/utils";

export type Chat = {
  id: string;
  title: string;
  createdAt: Date | string;
  visibility?: "private" | "public";
};

export type ChatHistory = {
  chats: Chat[];
  hasMore: boolean;
};

const PAGE_SIZE = 20;

export function getChatHistoryPaginationKey(
  pageIndex: number,
  previousPageData: ChatHistory | null,
): string | null {
  if (previousPageData && !previousPageData.hasMore) return null;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/api/history?page=${pageIndex}&limit=${PAGE_SIZE}`;
}

export function useChatHistory(): {
  history: ChatHistory[];
  isLoading: boolean;
  mutate: KeyedMutator<ChatHistory[]>;
  setSize: (size: number) => void;
  hasMore: boolean;
} {
  const { data, isLoading, mutate, setSize } = useSWRInfinite<ChatHistory>(
    getChatHistoryPaginationKey,
    (url) => fetcher<ChatHistory>(url),
    { revalidateOnFocus: false },
  );

  const hasMore = data ? (data[data.length - 1]?.hasMore ?? false) : false;

  return {
    hasMore,
    history: data ?? [],
    isLoading,
    mutate: mutate as KeyedMutator<ChatHistory[]>,
    setSize,
  };
}

import { Plus, Loader2 } from "lucide-react";

export function SidebarHistory({
  currentChatId,
  onSelectChat,
  onNewChat,
}: {
  currentChatId?: string;
  onSelectChat?: (chatId: string) => void;
  onNewChat?: () => void;
}) {
  const { history, isLoading, mutate } = useChatHistory();
  const allChats = history.flatMap((page) => page?.chats || []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/history?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      mutate();
      if (currentChatId === id && onNewChat) {
        onNewChat();
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-border/50 bg-card/30">
      <div className="flex h-[72px] items-center justify-between px-4 border-b border-border/50">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Chat History
        </h3>
        {onNewChat && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onNewChat}
            title="Start new conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading && allChats.length === 0 ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Loading history...</span>
          </div>
        ) : allChats.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No recent conversations
          </p>
        ) : (
          allChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat?.(chat.id)}
              className={`group relative flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                currentChatId === chat.id
                  ? "bg-muted text-foreground font-medium"
                  : "text-foreground/80 hover:bg-muted/50"
              }`}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1 text-xs">
                {chat.title || "New Conversation"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(chat.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
