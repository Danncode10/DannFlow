"use client";

import { cn } from "@/lib/utils";

interface TextEditorProps {
  content: string;
  onSaveContent: (content: string) => void;
  status: "streaming" | "idle";
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  suggestions: unknown[];
  className?: string;
}

export const Editor = ({ content, className }: TextEditorProps) => {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none h-full w-full overflow-auto",
        className,
      )}
    >
      <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
};
