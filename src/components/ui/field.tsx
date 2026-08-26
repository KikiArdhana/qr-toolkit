import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, optional, children }: FieldProps) {
  const errorId = `${htmlFor}-error`;
  const hintId = `${htmlFor}-hint`;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-text">
          {label}
        </label>
        {optional && (
          <span className="text-[11px] text-text-secondary">Optional</span>
        )}
      </div>
      <div
        aria-describedby={clsxIds(error ? errorId : undefined, hint ? hintId : undefined)}
      >
        {children}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-[12px] text-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-[12px] text-danger"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function clsxIds(...ids: (string | undefined)[]): string | undefined {
  const joined = ids.filter(Boolean).join(" ");
  return joined || undefined;
}
