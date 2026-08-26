"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FeatureCards } from "@/components/feature-cards";
import { Segmented } from "@/components/ui/segmented";
import { GeneratePanel } from "@/components/qr/generate-panel";
import { ScanPanel } from "@/components/qr/scan-panel";
import { QrHistory } from "@/components/qr/qr-history";
import { useQRHistory } from "@/hooks/use-qr-history";
import type { AppMode, QRRecord } from "@/types/qr";
import { QrCode, ScanLine } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<AppMode>("generate");
  const [regenerateSeed, setRegenerateSeed] = useState<QRRecord | null>(null);
  const { items, addRecord, deleteRecord, clearAll, storageAvailable } = useQRHistory();

  function handleRegenerate(record: QRRecord) {
    setMode("generate");
    setRegenerateSeed(record);
    requestAnimationFrame(() => {
      document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <SiteHeader mode={mode} onModeChange={setMode} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <section className="flex flex-col items-center gap-4 text-center">
          <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-text-secondary">
            PRIVATE · FAST · SIMPLE
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            Create. Scan. Done.
          </h1>
          <p className="max-w-lg text-balance text-[15px] text-text-secondary">
            Generate and scan everyday QR codes without an account or cloud storage.
          </p>

          <div id="workspace" className="mt-2 scroll-mt-20">
            <Segmented
              ariaLabel="Mode"
              value={mode}
              onChange={setMode}
              options={[
                { value: "generate", label: "Generate", icon: <QrCode className="size-3.5" /> },
                { value: "scan", label: "Scan", icon: <ScanLine className="size-3.5" /> },
              ]}
            />
          </div>
        </section>

        {/* Workspace */}
        <section aria-label={mode === "generate" ? "Generate a QR code" : "Scan a QR code"}>
          {mode === "generate" ? (
            <GeneratePanel
              onSave={addRecord}
              regenerateSeed={regenerateSeed}
              onSeedConsumed={() => setRegenerateSeed(null)}
            />
          ) : (
            <ScanPanel />
          )}
        </section>

        <QrHistory
          items={items}
          storageAvailable={storageAvailable}
          onRegenerate={handleRegenerate}
          onDelete={deleteRecord}
          onClearAll={clearAll}
        />

        <div>
          <h2 className="mb-4 text-center font-display text-lg font-semibold text-text">
            Why QR Toolkit?
          </h2>
          <FeatureCards />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
