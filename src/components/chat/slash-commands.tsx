"use client";

import {
  MoonIcon,
  PlusIcon,
  SquareIcon,
  TrashIcon,
  WrenchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SlashCommandAction =
  "new" | "clear" | "rename" | "model" | "theme" | "delete" | "purge";

export interface SlashCommand {
  name: string;
  description: string;
  action: SlashCommandAction;
  icon: React.ReactNode;
}

export const slashCommands: SlashCommand[] = [
  {
    action: "new",
    description: "Start a new chat",
    icon: <PlusIcon className="size-3.5" />,
    name: "new",
  },
  {
    action: "clear",
    description: "Clear current conversation",
    icon: <SquareIcon className="size-3.5" />,
    name: "clear",
  },
  {
    action: "model",
    description: "Change the AI model",
    icon: <WrenchIcon className="size-3.5" />,
    name: "model",
  },
  {
    action: "theme",
    description: "Toggle dark / light theme",
    icon: <MoonIcon className="size-3.5" />,
    name: "theme",
  },
  {
    action: "delete",
    description: "Delete this chat",
    icon: <TrashIcon className="size-3.5" />,
    name: "delete",
  },
  {
    action: "purge",
    description: "Delete all chats",
    icon: <TrashIcon className="size-3.5" />,
    name: "purge",
  },
];

interface SlashCommandMenuProps {
  query: string;
  selectedIndex: number;
  onSelect: (cmd: SlashCommand) => void;
  onClose: () => void;
}

export function SlashCommandMenu({
  query,
  selectedIndex,
  onSelect,
}: SlashCommandMenuProps) {
  const filtered = slashCommands.filter((cmd) =>
    cmd.name.startsWith(query.toLowerCase()),
  );

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 z-50 mb-1 w-64 overflow-hidden rounded-xl border border-border/50 bg-popover shadow-lg">
      <ul className="py-1" role="listbox">
        {filtered.map((cmd, index) => (
          <li
            aria-selected={index === selectedIndex}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition-colors",
              index === selectedIndex
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
            key={cmd.name}
            onClick={() => onSelect(cmd)}
            role="option"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted-foreground/10 text-muted-foreground">
              {cmd.icon}
            </span>
            <span className="font-medium">/{cmd.name}</span>
            <span className="ml-auto truncate text-xs text-muted-foreground/60">
              {cmd.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
