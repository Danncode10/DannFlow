"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { memo, useCallback } from "react";
import type { ChatMessage } from "@/lib/types";
import type { VisibilityType } from "./visibility-selector";

interface SuggestedActionsProps {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  sendMessage:
    UseChatHelpers<ChatMessage>["sendMessage"] | (() => Promise<void>);
}

const suggestions = [
  {
    heading: "Summarize",
    subheading: "a long document or article",
    prompt: "Can you summarize a long document or article for me?",
  },
  {
    heading: "Draft",
    subheading: "a professional email",
    prompt: "Help me draft a professional email.",
  },
  {
    heading: "Explain",
    subheading: "a complex concept simply",
    prompt: "Explain a complex concept in simple terms.",
  },
  {
    heading: "Write",
    subheading: "a creative story",
    prompt: "Write a short creative story.",
  },
];

function PureSuggestedActions({
  chatId: _chatId,
  selectedVisibilityType: _selectedVisibilityType,
  sendMessage,
}: SuggestedActionsProps) {
  return (
    <div
      className="grid grid-cols-2 gap-2 w-full"
      data-testid="suggested-actions"
    >
      {suggestions.map((suggestion) => (
        <SuggestedActionButton
          key={suggestion.heading}
          prompt={suggestion.prompt}
          heading={suggestion.heading}
          subheading={suggestion.subheading}
          sendMessage={sendMessage}
        />
      ))}
    </div>
  );
}

function SuggestedActionButton({
  heading,
  subheading,
  prompt,
  sendMessage,
}: {
  heading: string;
  subheading: string;
  prompt: string;
  sendMessage:
    UseChatHelpers<ChatMessage>["sendMessage"] | (() => Promise<void>);
}) {
  const handleClick = useCallback(() => {
    sendMessage({
      parts: [{ text: prompt, type: "text" }],
      role: "user",
    } as Parameters<UseChatHelpers<ChatMessage>["sendMessage"]>[0]);
  }, [prompt, sendMessage]);

  return (
    <button
      className="flex flex-col gap-0.5 rounded-xl border border-border/40 bg-card/50 px-3 py-2.5 text-left text-sm transition-colors hover:border-border/70 hover:bg-card"
      onClick={handleClick}
      type="button"
    >
      <span className="font-medium text-foreground">{heading}</span>
      <span className="text-xs text-muted-foreground">{subheading}</span>
    </button>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);
