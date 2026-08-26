import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={clsx(
          "h-9 w-full rounded-md border bg-surface px-3 text-sm text-text placeholder:text-text-secondary/70",
          "transition-colors duration-150 outline-none",
          invalid
            ? "border-danger focus-visible:outline-danger"
            : "border-border focus-visible:border-accent",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
