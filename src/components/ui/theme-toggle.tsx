"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import type { ThemeMode } from "@/types/qr";
import clsx from "clsx";

const OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light theme", icon: <Sun className="size-3.5" /> },
  { value: "dark", label: "Dark theme", icon: <Moon className="size-3.5" /> },
  { value: "system", label: "Match system theme", icon: <Monitor className="size-3.5" /> },
];

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  return (
    <div
      className="inline-flex items-center rounded-md border border-border bg-surface-2 p-0.5"
      role="radiogroup"
      aria-label="Theme"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={mounted && theme === option.value}
          title={option.label}
          onClick={() => setTheme(option.value)}
          className={clsx(
            "inline-flex size-7 items-center justify-center rounded transition-colors duration-150",
            mounted && theme === option.value
              ? "bg-surface text-text shadow-sm"
              : "text-text-secondary hover:text-text"
          )}
        >
          {option.icon}
          <span className="sr-only">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
