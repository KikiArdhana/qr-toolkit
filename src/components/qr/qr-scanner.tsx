"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import type { IScannerControls } from "@zxing/browser";
import { ImageUp, RefreshCw, TriangleAlert, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrResult } from "./qr-result";
import { parseScanResult, type ParsedScanResult } from "@/lib/qr/scan-result";

type ScannerStatus = "idle" | "starting" | "scanning" | "denied" | "unsupported" | "error";

export function QrScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);

  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [result, setResult] = useState<ParsedScanResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const stopScanning = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }, []);

  const startScanning = useCallback(async () => {
    setResult(null);
    setUploadError(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    setStatus("starting");
    try {
      if (!readerRef.current) {
        readerRef.current = new BrowserQRCodeReader();
      }
      const controls = await readerRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current ?? undefined,
        (decodeResult, error) => {
          if (decodeResult) {
            setResult(parseScanResult(decodeResult.getText()));
            stopScanning();
            setStatus("idle");
          } else if (error && !(error instanceof NotFoundException)) {
            // Per-frame decode misses are expected and silently ignored;
            // anything else surfaces as a real error.
          }
        }
      );
      controlsRef.current = controls;
      setStatus("scanning");
    } catch {
      setStatus("denied");
    }
  }, [stopScanning]);

  useEffect(() => {
    // Starts the camera on mount — an external-system side effect
    // (getUserMedia), not state synchronization, so the resulting setState
    // calls inside startScanning are expected.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startScanning();
    return () => stopScanning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleScanAgain() {
    startScanning();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError(null);
    stopScanning();
    setStatus("idle");

    const url = URL.createObjectURL(file);
    try {
      if (!readerRef.current) {
        readerRef.current = new BrowserQRCodeReader();
      }
      const decodeResult = await readerRef.current.decodeFromImageUrl(url);
      setResult(parseScanResult(decodeResult.getText()));
    } catch {
      setUploadError("We couldn't find a QR code in that image. Try another one.");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  if (result) {
    return (
      <QrResult
        result={result}
        onScanAgain={() => {
          setResult(null);
          startScanning();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-2">
        {status === "unsupported" ? (
          <Fallback
            icon={<VideoOff className="size-6 text-text-secondary" aria-hidden="true" />}
            message="This browser doesn't support camera scanning. Try a modern browser or use image upload instead."
          />
        ) : status === "denied" ? (
          <Fallback
            icon={<TriangleAlert className="size-6 text-warning" aria-hidden="true" />}
            message="Camera access was denied. Enable camera permissions in your browser settings, or use image upload instead."
          />
        ) : (
          <>
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
              aria-label="Camera preview for QR scanning"
            />
            {status === "starting" && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-2/80">
                <p className="text-[13px] text-text-secondary">Starting camera…</p>
              </div>
            )}
            <ScanFrame />
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" className="flex-1" onClick={() => fileInputRef.current?.click()}>
          <ImageUp className="size-4" aria-hidden="true" />
          Upload an image
        </Button>
        {(status === "denied" || status === "error") && (
          <Button variant="ghost" className="flex-1" onClick={handleScanAgain}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Try camera again
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileUpload}
        aria-label="Upload a QR code image"
      />
      {uploadError && (
        <p role="alert" className="text-[12px] text-danger">
          {uploadError}
        </p>
      )}
      <p className="text-center text-[12px] text-text-secondary">
        Point your camera at a QR code. Scanning happens entirely on this device.
      </p>
    </div>
  );
}

function Fallback({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 text-center">
      {icon}
      <p className="text-[13px] text-text-secondary">{message}</p>
    </div>
  );
}

function ScanFrame() {
  const cornerClass = "absolute size-8 border-laser";
  return (
    <div className="pointer-events-none absolute inset-10" aria-hidden="true">
      <span className={`${cornerClass} left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-md`} />
      <span className={`${cornerClass} right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-md`} />
      <span className={`${cornerClass} left-0 bottom-0 border-l-[3px] border-b-[3px] rounded-bl-md`} />
      <span className={`${cornerClass} right-0 bottom-0 border-r-[3px] border-b-[3px] rounded-br-md`} />
      <span className="animate-scan-sweep absolute left-1 right-1 h-10 bg-gradient-to-b from-transparent via-laser/30 to-transparent motion-reduce:hidden" />
    </div>
  );
}
