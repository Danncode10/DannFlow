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

const MOCK_CHATS: Chat[] = [
  { id: "1", title: "Summarize pending leads", createdAt: new Date() },
  { id: "2", title: "Schedule meeting with John", createdAt: new Date() },
  {
    id: "3",
    title: "Review Q3 Analytics",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
];

export function SidebarHistory() {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);

  const handleDelete = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-border/50 bg-card/30">
      <div className="flex h-[72px] items-center px-4 border-b border-border/50">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Chat History
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chats.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No recent chats
          </p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className="group relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted/50 transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="truncate flex-1 text-foreground/80">
                {chat.title}
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
