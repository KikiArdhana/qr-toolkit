"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThemeMode } from "@/types/qr";

const THEME_KEY = "qr-toolkit:theme";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage unavailable — fall back silently.
  }
  return "system";
}

function applyResolvedTheme(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Reads the persisted theme on mount — browser-only, so this hydration
    // effect intentionally calls setState once to sync React state with
    // localStorage/matchMedia.
    const initial = readStoredTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(initial);
    const resolved = initial === "system" ? (getSystemPrefersDark() ? "dark" : "light") : initial;
    setResolvedTheme(resolved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = media.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyResolvedTheme(resolved);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [mounted, theme]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    const resolved = next === "system" ? (getSystemPrefersDark() ? "dark" : "light") : next;
    setResolvedTheme(resolved);
    applyResolvedTheme(resolved);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // localStorage unavailable — theme still applies for this session.
    }
  }, []);

  return { theme, resolvedTheme, setTheme, mounted };
}
