import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <Loader2
        ref={ref as any}
        className={cn("h-4 w-4 animate-spin", className)}
        {...props}
      />
    );
  },
);
Spinner.displayName = "Spinner";
