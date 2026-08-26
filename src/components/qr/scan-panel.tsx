import { QrScanner } from "./qr-scanner";

export function ScanPanel() {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-border bg-surface p-5 sm:p-6">
      <QrScanner />
    </div>
  );
}
