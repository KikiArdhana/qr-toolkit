import type { QRCustomization } from "@/types/qr";
import { ERROR_CORRECTION_OPTIONS } from "@/lib/qr/types";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";

interface QrCustomizationProps {
  settings: QRCustomization;
  onChange: (patch: Partial<QRCustomization>) => void;
}

/** Rough relative luminance contrast check so we can warn before scans fail. */
function hasLowContrast(fg: string, bg: string): boolean {
  const lum = (hex: string) => {
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return 0.5;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255);
    const chan = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
  };
  const l1 = lum(fg) + 0.05;
  const l2 = lum(bg) + 0.05;
  const ratio = l1 > l2 ? l1 / l2 : l2 / l1;
  return ratio < 2.5;
}

export function QrCustomization({ settings, onChange }: QrCustomizationProps) {
  const lowContrast = hasLowContrast(settings.fgColor, settings.bgColor);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label htmlFor="qr-size" className="text-[13px] font-medium text-text">
            Size
          </label>
          <span className="font-mono text-[12px] text-text-secondary">
            {settings.size}px
          </span>
        </div>
        <input
          id="qr-size"
          type="range"
          min={160}
          max={640}
          step={8}
          value={settings.size}
          onChange={(e) => onChange({ size: Number(e.target.value) })}
          className="w-full accent-[var(--accent)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ColorField
          id="qr-fg"
          label="Foreground"
          value={settings.fgColor}
          onChange={(fgColor) => onChange({ fgColor })}
        />
        <ColorField
          id="qr-bg"
          label="Background"
          value={settings.bgColor}
          onChange={(bgColor) => onChange({ bgColor })}
        />
      </div>

      {lowContrast && (
        <p className="flex items-start gap-1.5 rounded-md border border-warning/40 bg-warning-soft px-2.5 py-2 text-[12px] text-warning">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          Low contrast between foreground and background can make this code hard to
          scan. Try a bigger difference in lightness.
        </p>
      )}

      <div>
        <p className="mb-1.5 text-[13px] font-medium text-text">Error correction</p>
        <div className="grid grid-cols-4 gap-1.5">
          {ERROR_CORRECTION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              title={option.detail}
              onClick={() => onChange({ errorCorrection: option.value })}
              className={clsx(
                "rounded-md border px-2 py-1.5 text-[12px] font-medium transition-colors duration-150",
                settings.errorCorrection === option.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-secondary hover:text-text"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-text">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1.5">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-6 shrink-0 cursor-pointer rounded border border-border bg-transparent p-0"
          aria-label={`${label} color`}
        />
        <span className="font-mono text-[12px] uppercase text-text-secondary">
          {value}
        </span>
      </div>
    </div>
  );
}
