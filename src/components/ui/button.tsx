import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-border bg-background text-foreground hover:bg-muted",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", type = "button", ...props }, ref) => (
  <button ref={ref} type={type} className={cn("inline-flex min-h-12 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", variantClasses[variant], className)} {...props} />
));
Button.displayName = "Button";

export { Button };
