import clsx from "clsx";
import type { QRType } from "@/types/qr";
import { QR_TYPE_META } from "@/lib/qr/types";
import { QrTypeIcon } from "./qr-type-icon";

interface QrTypeSelectorProps {
  value: QRType;
  onChange: (type: QRType) => void;
}

export function QrTypeSelector({ value, onChange }: QrTypeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="QR code type"
      className="grid grid-cols-4 gap-1.5 sm:grid-cols-7"
    >
      {QR_TYPE_META.map((meta) => {
        const active = meta.type === value;
        return (
          <button
            key={meta.type}
            type="button"
            role="tab"
            aria-selected={active}
            title={meta.description}
            onClick={() => onChange(meta.type)}
            className={clsx(
              "flex flex-col items-center gap-1.5 rounded-md border px-2 py-2.5 text-center transition-colors duration-150",
              active
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface text-text-secondary hover:text-text hover:border-text-secondary/40"
            )}
          >
            <QrTypeIcon type={meta.type} className="size-4" />
            <span className="text-[11px] font-medium leading-none">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
