"use client";

import { useEffect, useRef, useState } from "react";
import { QrCode, TriangleAlert } from "lucide-react";
import type { QRCustomization, QRType } from "@/types/qr";
import { renderToCanvas } from "@/lib/qr/download";
import { QrTypeIcon } from "./qr-type-icon";

interface QrPreviewProps {
  type: QRType;
  title: string;
  summary: string;
  payload: string | null;
  settings: QRCustomization;
}

export function QrPreview({ type, title, summary, payload, settings }: QrPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    if (!payload || !canvasRef.current) return;
    let cancelled = false;
    setError(null);
    renderToCanvas(canvasRef.current, payload, settings)
      .then(() => {
        if (!cancelled) setRenderKey((k) => k + 1);
      })
      .catch(() => {
        if (!cancelled) {
          setError("We couldn't generate this QR code. Check your input and try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [payload, settings]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-6">
        {/* Viewfinder corner brackets — recurring motif shared with the scanner */}
        <ViewfinderCorners />

        {payload && !error ? (
          <>
            <canvas ref={canvasRef} className="h-full w-full" role="img" aria-label={`QR code for ${title}`} />
            <span
              key={renderKey}
              className="animate-scan-sweep pointer-events-none absolute left-3 right-3 h-8 bg-gradient-to-b from-transparent via-laser/25 to-transparent motion-reduce:hidden"
              aria-hidden="true"
            />
          </>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <TriangleAlert className="size-6 text-danger" aria-hidden="true" />
            <p className="text-[13px] text-danger">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <QrCode className="size-8 text-text-secondary/50" aria-hidden="true" />
            <p className="text-[13px] text-text-secondary">
              Fill in the form to see a live preview
            </p>
          </div>
        )}
      </div>

      {payload && !error && (
        <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface-2 px-3 py-2.5">
          <QrTypeIcon type={type} className="mt-0.5 size-4 shrink-0 text-text-secondary" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-text">{title}</p>
            <p className="truncate font-mono text-[12px] text-text-secondary">{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewfinderCorners() {
  const cornerClass = "absolute size-4 border-laser/70";
  return (
    <div className="pointer-events-none absolute inset-3" aria-hidden="true">
      <span className={`${cornerClass} left-0 top-0 border-l-2 border-t-2 rounded-tl-sm`} />
      <span className={`${cornerClass} right-0 top-0 border-r-2 border-t-2 rounded-tr-sm`} />
      <span className={`${cornerClass} left-0 bottom-0 border-l-2 border-b-2 rounded-bl-sm`} />
      <span className={`${cornerClass} right-0 bottom-0 border-r-2 border-b-2 rounded-br-sm`} />
    </div>
  );
}
