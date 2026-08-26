"use client";

import { useEffect, useMemo, useState } from "react";
import type { QRCustomization, QRRecord, QRType, WifiData } from "@/types/qr";
import { DEFAULT_CUSTOMIZATION } from "@/types/qr";
import { createEmptyData } from "@/lib/qr/defaults";
import { validateQRInput } from "@/lib/qr/validation";
import {
  buildPayload,
  defaultTitleFor,
  parsePayloadToData,
  stripWifiPassword,
  toDisplaySummary,
} from "@/lib/qr/payload";
import { QrTypeSelector } from "./qr-type-selector";
import { QrForm } from "./qr-form";
import { QrPreview } from "./qr-preview";
import { QrCustomization } from "./qr-customization";
import { QrDownload } from "./qr-download";

interface GeneratePanelProps {
  onSave: (record: QRRecord) => void;
  regenerateSeed: QRRecord | null;
  onSeedConsumed: () => void;
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `qr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function GeneratePanel({ onSave, regenerateSeed, onSeedConsumed }: GeneratePanelProps) {
  const [type, setType] = useState<QRType>("url");
  const [data, setData] = useState(() => createEmptyData("url"));
  const [settings, setSettings] = useState<QRCustomization>(DEFAULT_CUSTOMIZATION);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);
  const [includePassword, setIncludePassword] = useState(false);

  // Re-seed the form when the user clicks "regenerate" on a history item.
  useEffect(() => {
    if (!regenerateSeed) return;
    // One-time hydration of form state from a history record — this effect
    // exists specifically to synchronize with an external trigger (the
    // "regenerate" click), so setState here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setType(regenerateSeed.type);
    setSettings(regenerateSeed.settings);
    setData(parsePayloadToData(regenerateSeed.type, regenerateSeed.payload, regenerateSeed.title));
    setTouched(true);
    setSaved(false);
    setIncludePassword(false);
    onSeedConsumed();
  }, [regenerateSeed, onSeedConsumed]);

  function handleTypeChange(nextType: QRType) {
    setType(nextType);
    setData(createEmptyData(nextType));
    setTouched(false);
    setSaved(false);
    setIncludePassword(false);
  }

  const validation = useMemo(() => validateQRInput(data), [data]);
  const payload = useMemo(
    () => (validation.valid ? buildPayload(data) : null),
    [validation.valid, data]
  );
  const title = data.title?.trim() || defaultTitleFor(data);
  const summary = payload ? toDisplaySummary(data) : "";

  const isWifiWithPassword =
    type === "wifi" &&
    (data as WifiData).security !== "nopass" &&
    Boolean((data as WifiData).password);

  function handleSave() {
    if (!payload) return;
    const sensitive = isWifiWithPassword && includePassword;
    const recordPayload =
      type === "wifi" && !sensitive ? stripWifiPassword(payload) : payload;
    onSave({
      id: makeId(),
      type,
      title,
      payload: recordPayload,
      createdAt: new Date().toISOString(),
      settings,
      containsSensitiveData: sensitive,
    });
    setSaved(true);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div>
          <h2 className="mb-3 text-[13px] font-medium text-text">QR type</h2>
          <QrTypeSelector value={type} onChange={handleTypeChange} />
        </div>

        <div className="h-px bg-border" />

        <div onBlurCapture={() => setTouched(true)}>
          <QrForm
            data={data}
            errors={touched ? validation.errors : {}}
            onChange={(next) => {
              setData(next);
              setSaved(false);
            }}
          />
        </div>

        <div className="h-px bg-border" />

        <div>
          <h2 className="mb-3 text-[13px] font-medium text-text">Customize</h2>
          <QrCustomization settings={settings} onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))} />
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface-2 p-5 sm:p-6 lg:sticky lg:top-20 lg:self-start">
        <QrPreview type={type} title={title} summary={summary} payload={payload} settings={settings} />
        <QrDownload
          payload={payload}
          title={title}
          settings={settings}
          onSave={handleSave}
          saved={saved}
          disabled={!payload}
          sensitiveOption={
            isWifiWithPassword
              ? { checked: includePassword, onChange: setIncludePassword }
              : undefined
          }
        />
      </div>
    </div>
  );
}
