"use client";

import type { KeyedMutator } from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "@/lib/utils";

export type Chat = {
  id: string;
  title: string;
  createdAt: Date | string;
  visibility: "private" | "public";
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

// Sidebar UI stub – rendered by dashboard/shell, not needed for build
export function SidebarHistory() {
  return null;
}
