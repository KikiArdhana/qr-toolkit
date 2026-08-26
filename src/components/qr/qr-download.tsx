"use client";

import { useState } from "react";
import { Download, FileImage, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { downloadPng, downloadSvg, slugifyFilename } from "@/lib/qr/download";
import type { QRCustomization } from "@/types/qr";

interface SensitiveOption {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface QrDownloadProps {
  payload: string | null;
  title: string;
  settings: QRCustomization;
  onSave: () => void;
  saved: boolean;
  disabled: boolean;
  sensitiveOption?: SensitiveOption;
}

export function QrDownload({
  payload,
  title,
  settings,
  onSave,
  saved,
  disabled,
  sensitiveOption,
}: QrDownloadProps) {
  const [busy, setBusy] = useState<"png" | "svg" | null>(null);
  const [downloadError, setDownloadError] = useState(false);

  async function handleDownload(format: "png" | "svg") {
    if (!payload) return;
    setBusy(format);
    setDownloadError(false);
    try {
      const filename = slugifyFilename(title);
      if (format === "png") {
        await downloadPng(payload, settings, filename);
      } else {
        await downloadSvg(payload, settings, filename);
      }
    } catch {
      setDownloadError(true);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="primary"
          onClick={() => handleDownload("png")}
          disabled={disabled || busy !== null}
        >
          <Download className="size-4" aria-hidden="true" />
          {busy === "png" ? "Preparing…" : "Download PNG"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleDownload("svg")}
          disabled={disabled || busy !== null}
        >
          <FileImage className="size-4" aria-hidden="true" />
          {busy === "svg" ? "Preparing…" : "Download SVG"}
        </Button>
      </div>
      {sensitiveOption && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-warning/40 bg-warning-soft px-3 py-2">
          <p className="text-[12px] text-warning">
            Save the Wi-Fi password in this history entry too? It will be stored in
            this browser only.
          </p>
          <Switch
            checked={sensitiveOption.checked}
            onChange={sensitiveOption.onChange}
            label="Save Wi-Fi password to history"
          />
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={onSave} disabled={disabled}>
        <Save className="size-3.5" aria-hidden="true" />
        {saved ? "Saved to history" : "Save to history"}
      </Button>
      {downloadError && (
        <p role="alert" className="text-[12px] text-danger">
          We couldn&apos;t generate this QR code. Check your input and try again.
        </p>
      )}
    </div>
  );
}
