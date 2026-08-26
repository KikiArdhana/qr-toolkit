import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            "h-9 w-full appearance-none rounded-md border border-border bg-surface pl-3 pr-8 text-sm text-text",
            "transition-colors duration-150 outline-none focus-visible:border-accent",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
      </div>
    );
  }
);
Select.displayName = "Select";
