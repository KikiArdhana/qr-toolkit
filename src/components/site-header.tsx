"use client";

import { QrCode } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { AppMode } from "@/types/qr";

interface SiteHeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function SiteHeader({ mode, onModeChange }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-display text-[15px] font-semibold text-text">
          <span className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <QrCode className="size-4" aria-hidden="true" />
          </span>
          QR Toolkit
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          <NavButton active={mode === "generate"} onClick={() => onModeChange("generate")}>
            Generate
          </NavButton>
          <NavButton active={mode === "scan"} onClick={() => onModeChange("scan")}>
            Scan
          </NavButton>
          <a
            href="#history"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-text"
          >
            History
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 " +
        (active ? "text-text" : "text-text-secondary hover:text-text")
      }
    >
      {children}
    </button>
  );
}
