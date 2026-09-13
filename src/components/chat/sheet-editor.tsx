"use client";

import { cn } from "@/lib/utils";

interface SpreadsheetEditorProps {
  content: string;
  onSaveContent?: (content: string) => void;
  status: "streaming" | "idle";
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  suggestions: unknown[];
  className?: string;
}

export const SpreadsheetEditor = ({
  content,
  className,
}: SpreadsheetEditorProps) => {
  let rows: string[][] = [];
  try {
    rows = content ? content.split("\n").map((row) => row.split(",")) : [];
  } catch {
    rows = [];
  }

  return (
    <div className={cn("h-full w-full overflow-auto text-xs", className)}>
      <table className="min-w-full border-collapse">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-border px-2 py-1 text-foreground"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
