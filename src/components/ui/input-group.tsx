"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import type { ButtonProps } from "./button";

// ─── InputGroup ───────────────────────────────────────────────────────────────
// A flex column that groups a textarea with header/footer addons.

export type InputGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col rounded-xl", className)}
      {...props}
    />
  ),
);
InputGroup.displayName = "InputGroup";

// ─── InputGroupAddon ──────────────────────────────────────────────────────────
// A flex row that lives above ("block-start") or below ("block-end") the textarea.

export type InputGroupAddonProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: "block-start" | "block-end" | "inline-start" | "inline-end";
};

export const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  InputGroupAddonProps
>(({ className, align: _align = "block-end", ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputGroupAddon.displayName = "InputGroupAddon";

// ─── InputGroupTextarea ───────────────────────────────────────────────────────
// The primary textarea inside the group.

export type InputGroupTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  InputGroupTextareaProps
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed outline-none",
      "placeholder:text-muted-foreground",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
InputGroupTextarea.displayName = "InputGroupTextarea";

// ─── InputGroupButton ─────────────────────────────────────────────────────────
// A Button pre-styled for use inside an InputGroup addon row.

export type InputGroupButtonProps = ButtonProps;

export const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(({ className, ...props }, ref) => (
  <Button ref={ref} className={cn(className)} {...props} />
));
InputGroupButton.displayName = "InputGroupButton";
