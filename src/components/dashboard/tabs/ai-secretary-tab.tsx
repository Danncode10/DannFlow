"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Messages } from "@/components/chat/messages";
import { MultimodalInput } from "@/components/chat/multimodal-input";
import { Sparkles } from "lucide-react";
import type { Attachment } from "@/lib/types";

export function AiSecretaryTab() {
  const [input, setInput] = useState("");
  const { messages, setMessages, status, stop, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col bg-background relative overflow-hidden rounded-xl border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 bg-card px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            AI Secretary
          </h2>
          <p className="text-sm text-muted-foreground">
            I can help summarize your database or schedule tasks.
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden relative">
        <Messages
          chatId="secretary-chat"
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
            chatId="secretary-chat"
            input={input}
            setInput={setInput}
            status={status}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages as any}
            setMessages={setMessages as any}
            sendMessage={async (msg: any) => {
              const textPart = msg?.parts?.find((p: any) => p?.type === "text");
              const textContent = textPart
                ? textPart.text
                : typeof msg === "string"
                  ? msg
                  : msg?.content || input || "";

              if (textContent) {
                sendMessage({
                  role: "user",
                  parts: [{ type: "text", text: textContent }],
                } as any);
                setInput("");
              }
            }}
            selectedVisibilityType="private"
            selectedModelId="gpt-4o-mini"
          />
        </div>
      </div>
    </div>
  );
}
