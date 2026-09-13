import * as React from "react";
import { cn } from "@/lib/utils";

// ─── ButtonGroup ────────────────────────────────────────────────────────────

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

/**
 * Groups related buttons into a visual unit with merged borders.
 *
 * Usage:
 *   <ButtonGroup orientation="horizontal">
 *     <Button>Prev</Button>
 *     <ButtonGroupText>1 of 3</ButtonGroupText>
 *     <Button>Next</Button>
 *   </ButtonGroup>
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-background shadow-sm",
        // Flatten interior borders so adjacent buttons share a single border
        orientation === "horizontal"
          ? "[&>*:not(:first-child)]:border-l [&>*:not(:first-child)]:border-border [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*]:border-0 [&>*]:shadow-none"
          : "flex-col [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-border [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*]:border-0 [&>*]:shadow-none",
        className,
      )}
      {...props}
    />
  ),
);
ButtonGroup.displayName = "ButtonGroup";

// ─── ButtonGroupText ─────────────────────────────────────────────────────────

export interface ButtonGroupTextProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * A non-interactive text label rendered inside a ButtonGroup,
 * styled to match the height and padding of adjacent buttons.
 */
export const ButtonGroupText = React.forwardRef<
  HTMLSpanElement,
  ButtonGroupTextProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex h-7 items-center border border-border bg-background px-2 text-xs text-muted-foreground shadow-sm select-none",
      className,
    )}
    {...props}
  />
));
ButtonGroupText.displayName = "ButtonGroupText";
