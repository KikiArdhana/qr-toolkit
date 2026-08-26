"use client";

import { History, ShieldCheck } from "lucide-react";
import type { QRRecord } from "@/types/qr";
import { QrHistoryItem } from "./qr-history-item";
import { Button } from "@/components/ui/button";

interface QrHistoryProps {
  items: QRRecord[];
  storageAvailable: boolean;
  onRegenerate: (record: QRRecord) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function QrHistory({
  items,
  storageAvailable,
  onRegenerate,
  onDelete,
  onClearAll,
}: QrHistoryProps) {
  return (
    <section id="history" aria-label="Recent QR codes" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-text">Recent QR codes</h2>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        )}
      </div>

      {!storageAvailable && (
        <p className="rounded-md border border-warning/40 bg-warning-soft px-3 py-2 text-[13px] text-warning">
          Local history isn&apos;t available in this browser. QR generation still works
          normally.
        </p>
      )}

      {storageAvailable && items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
          <History className="size-6 text-text-secondary/50" aria-hidden="true" />
          <p className="text-[13px] font-medium text-text">No saved QR codes yet.</p>
          <p className="text-[12px] text-text-secondary">
            Generate one and it will appear here.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto thin-scrollbar pr-1">
          {items.map((record) => (
            <QrHistoryItem
              key={record.id}
              record={record}
              onRegenerate={onRegenerate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <p className="flex items-center gap-1.5 text-[12px] text-text-secondary">
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
          Your history is stored locally in this browser. Nothing is uploaded to a
          server.
        </p>
      )}
    </section>
  );
}
