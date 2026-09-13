"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Messages } from "@/components/chat/messages";
import { MultimodalInput } from "@/components/chat/multimodal-input";
import { Sparkles } from "lucide-react";
import type { Attachment } from "@/lib/types";
import { DataStreamProvider } from "@/components/chat/data-stream-provider";
import {
  SidebarHistory,
  useChatHistory,
} from "@/components/chat/sidebar-history";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import { useEffect } from "react";

export function AiSecretaryTab() {
  const [currentChatId, setCurrentChatId] = useState<string>(
    () => "chat-" + Date.now(),
  );
  const [input, setInput] = useState("");
  const { mutate: mutateHistory } = useChatHistory();

  const { messages, setMessages, status, stop, sendMessage, error } = useChat({
    id: currentChatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: () => {
      mutateHistory();
    },
    onError: (err) => {
      console.error("Chat streaming error:", err);
      toast.error(err.message || "Failed to receive response from AI");
    },
  });

  // Automatically refresh history in sidebar as soon as message is submitted
  useEffect(() => {
    if (status === "submitted" || status === "streaming") {
      const timer = setTimeout(() => {
        mutateHistory();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [status, mutateHistory]);

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleSelectChat = async (selectedId: string) => {
    setCurrentChatId(selectedId);
    try {
      const res = await fetch(
        `/api/history?chatId=${encodeURIComponent(selectedId)}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          const formatted = data.messages.map((m: any) => ({
            id: m.id,
            role: m.role,
            parts: m.parts || [{ type: "text", text: "" }],
          }));
          setMessages(formatted);
        }
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

  const handleNewChat = () => {
    const newId = "chat-" + Date.now();
    setCurrentChatId(newId);
    setMessages([]);
    setInput("");
  };

  return (
    <DataStreamProvider>
      <div className="flex h-[calc(100vh-6rem)] w-full flex-col md:flex-row bg-background relative overflow-hidden rounded-xl border border-border">
        {/* Left Sidebar (History) */}
        <SidebarHistory
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
        />

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/50 bg-card px-6 py-4 h-[72px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground leading-tight">
                AI Secretary
              </h2>
              <p className="text-xs text-muted-foreground leading-tight">
                I can help summarize your database or schedule tasks.
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <Messages
              chatId={currentChatId}
              messages={messages as any}
              setMessages={setMessages as any}
              status={status}
              isReadonly={false}
              isArtifactVisible={false}
              isLoading={status === "streaming" || status === "submitted"}
            />
          </div>

          {/* Chat Input */}
          <div className="border-t border-border/50 bg-card/50 p-4">
            <div className="mx-auto max-w-3xl">
              <MultimodalInput
                chatId={currentChatId}
                input={input}
                setInput={setInput}
                status={status}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages as any}
                setMessages={setMessages as any}
                sendMessage={sendMessage}
                selectedVisibilityType="private"
                selectedModelId="gpt-4o-mini"
              />
            </div>
          </div>
        </div>
      </div>
    </DataStreamProvider>
  );
}
