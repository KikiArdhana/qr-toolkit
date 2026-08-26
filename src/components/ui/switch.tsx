import clsx from "clsx";

interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hideLabel?: boolean;
}

export function Switch({ id, checked, onChange, label, hideLabel }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-150",
        checked ? "bg-accent border-accent" : "bg-surface-2 border-border"
      )}
    >
      <span className={hideLabel ? "sr-only" : "sr-only"}>{label}</span>
      <span
        aria-hidden="true"
        className={clsx(
          "inline-block size-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-150",
          checked ? "translate-x-[18px]" : "translate-x-1"
        )}
      />
    </button>
  );
}
