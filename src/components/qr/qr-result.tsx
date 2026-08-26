"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, MapPin, Phone, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ParsedScanResult } from "@/lib/qr/scan-result";

interface QrResultProps {
  result: ParsedScanResult;
  onScanAgain: () => void;
}

const KIND_LABEL: Record<ParsedScanResult["kind"], string> = {
  url: "Website link",
  wifi: "Wi-Fi network",
  email: "Email address",
  phone: "Phone number",
  location: "Location",
  contact: "Contact card",
  text: "Text",
};

export function QrResult({ result, onScanAgain }: QrResultProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — the value remains selectable in the UI.
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
          {KIND_LABEL[result.kind]}
        </p>
        <p className="mt-2 break-words font-mono text-[14px] text-text">{result.summary}</p>
      </div>

      <div className="flex flex-col gap-2">
        {result.kind === "url" && (
          <Button variant="primary" onClick={() => window.open(result.raw, "_blank", "noopener,noreferrer")}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Open link
          </Button>
        )}
        {result.kind === "phone" && (
          <Button variant="primary" onClick={() => window.open(result.raw, "_self")}>
            <Phone className="size-4" aria-hidden="true" />
            Call
          </Button>
        )}
        {result.kind === "location" && (
          <Button
            variant="primary"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  result.summary.replace("Location: ", "")
                )}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <MapPin className="size-4" aria-hidden="true" />
            Open in Maps
          </Button>
        )}
        {result.kind === "text" && (
          <Button
            variant="secondary"
            onClick={() =>
              window.open(
                `https://www.google.com/search?q=${encodeURIComponent(result.raw)}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <Search className="size-4" aria-hidden="true" />
            Search the web
          </Button>
        )}

        <Button variant="secondary" onClick={handleCopy}>
          {copied ? (
            <Check className="size-4 text-success" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>

        <Button variant="ghost" onClick={onScanAgain}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Scan again
        </Button>
      </div>

      {result.kind === "url" && (
        <p className="text-[12px] text-text-secondary">
          QR Toolkit never opens links automatically — review the address above before
          you continue.
        </p>
      )}
    </div>
  );
}
