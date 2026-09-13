"use client";

import { cn } from "@/lib/utils";
import type { ArtifactKind } from "./artifact";

interface EditorProps {
  content: string;
  onSaveContent: (content: string) => void;
  status: "streaming" | "idle";
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  suggestions: unknown[];
  className?: string;
}

export const CodeEditor = ({
  content,
  className,
}: EditorProps & { className?: string }) => {
  return (
    <div
      className={cn(
        "h-full w-full overflow-auto bg-zinc-950 font-mono text-xs text-zinc-100",
        className,
      )}
    >
      <pre className="p-4 whitespace-pre-wrap break-words">{content}</pre>
    </div>
  );
};
