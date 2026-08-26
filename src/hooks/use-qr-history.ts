"use client";

import { useCallback, useEffect, useState } from "react";
import type { QRRecord } from "@/types/qr";

const STORAGE_KEY = "qr-toolkit:v1";
const STORAGE_VERSION = 1;
const MAX_ITEMS = 20;

interface StoredHistory {
  version: number;
  items: QRRecord[];
}

function isQRRecord(value: unknown): value is QRRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.type === "string" &&
    typeof record.title === "string" &&
    typeof record.payload === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.settings === "object" &&
    record.settings !== null
  );
}

function detectStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "qr-toolkit:__test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/** Reads and validates history from localStorage. Never throws — corrupted
 * or unrecognized data is treated as empty history rather than crashing. */
function readHistory(): QRRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<StoredHistory>;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      parsed.version !== STORAGE_VERSION ||
      !Array.isArray(parsed.items)
    ) {
      // Unknown/future version or malformed shape — start fresh rather than
      // risk rendering bad data.
      return [];
    }
    return parsed.items.filter(isQRRecord).slice(0, MAX_ITEMS);
  } catch {
    // Malformed JSON or a storage read error.
    return [];
  }
}

function writeHistory(items: QRRecord[]): boolean {
  try {
    const payload: StoredHistory = { version: STORAGE_VERSION, items };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function useQRHistory() {
  const [items, setItems] = useState<QRRecord[]>([]);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Reads localStorage on mount — browser-only state that can't be known
    // during server rendering, so this hydration effect intentionally
    // calls setState once.
    const available = detectStorageAvailable();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStorageAvailable(available);
    if (available) {
      setItems(readHistory());
    }
    setLoaded(true);
  }, []);

  const addRecord = useCallback(
    (record: QRRecord) => {
      if (!storageAvailable) return;
      setItems((prev) => {
        const next = [record, ...prev.filter((item) => item.id !== record.id)].slice(
          0,
          MAX_ITEMS
        );
        writeHistory(next);
        return next;
      });
    },
    [storageAvailable]
  );

  const deleteRecord = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      writeHistory(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    writeHistory([]);
  }, []);

  return { items, addRecord, deleteRecord, clearAll, storageAvailable, loaded };
}
