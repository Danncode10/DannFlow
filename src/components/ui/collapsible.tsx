"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null,
);

const useCollapsible = () => {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error(
      "Collapsible sub-components must be used inside <Collapsible>",
    );
  }
  return ctx;
};

// ─── Collapsible ─────────────────────────────────────────────────────────────

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled default */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Support both controlled and uncontrolled usage
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;

    const handleOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    const ctxValue = React.useMemo<CollapsibleContextValue>(
      () => ({ disabled, onOpenChange: handleOpenChange, open: open ?? false }),
      [disabled, handleOpenChange, open],
    );

    return (
      <CollapsibleContext.Provider value={ctxValue}>
        <div
          ref={ref}
          data-state={open ? "open" : "closed"}
          className={cn("", className)}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  },
);
Collapsible.displayName = "Collapsible";

// ─── CollapsibleTrigger ───────────────────────────────────────────────────────

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ className, onClick, children, ...props }, ref) => {
  const { open, onOpenChange, disabled } = useCollapsible();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        onOpenChange(!open);
      }
    },
    [onClick, onOpenChange, open],
  );

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      disabled={disabled}
      className={cn("", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";

// ─── CollapsibleContent ───────────────────────────────────────────────────────

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When false the content is unmounted (default). When true it stays mounted but hidden. */
  forceMount?: boolean;
}

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ className, forceMount = false, children, ...props }, ref) => {
  const { open } = useCollapsible();

  if (!forceMount && !open) {
    return null;
  }

  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      hidden={forceMount && !open}
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";
