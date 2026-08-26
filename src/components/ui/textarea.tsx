import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={clsx(
          "w-full resize-y rounded-md border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-secondary/70",
          "transition-colors duration-150 outline-none min-h-[84px]",
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
Textarea.displayName = "Textarea";
