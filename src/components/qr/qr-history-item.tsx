"use client";

import { RefreshCw, Trash2 } from "lucide-react";
import type { QRRecord } from "@/types/qr";
import { QrTypeIcon } from "./qr-type-icon";
import { Button } from "@/components/ui/button";

interface QrHistoryItemProps {
  record: QRRecord;
  onRegenerate: (record: QRRecord) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function QrHistoryItem({ record, onRegenerate, onDelete }: QrHistoryItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-secondary">
        <QrTypeIcon type={record.type} className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-text">{record.title}</p>
        <p className="truncate text-[12px] text-text-secondary">
          {formatDate(record.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="px-2"
          onClick={() => onRegenerate(record)}
          aria-label={`Regenerate ${record.title}`}
          title="Regenerate"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 hover:text-danger"
          onClick={() => onDelete(record.id)}
          aria-label={`Delete ${record.title}`}
          title="Delete"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
