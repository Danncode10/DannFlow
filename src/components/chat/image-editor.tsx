"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
  title: string;
  content: string;
  status: "streaming" | "idle";
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  isInline?: boolean;
  className?: string;
}

export const ImageEditor = ({
  title,
  content,
  isInline,
  className,
}: ImageEditorProps) => {
  if (!content) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm",
          className,
        )}
      >
        No image content
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-muted",
        className,
      )}
    >
      { }
      <img
        alt={title}
        className={cn(
          "object-contain",
          isInline ? "max-h-full max-w-full" : "h-full w-full",
        )}
        src={content}
      />
    </div>
  );
};
