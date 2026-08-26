export type ScanResultKind = "url" | "wifi" | "email" | "phone" | "location" | "contact" | "text";

export interface ParsedScanResult {
  kind: ScanResultKind;
  raw: string;
  /** Short human summary shown as the headline, e.g. "Network: MyWiFi" */
  summary: string;
}

export function parseScanResult(raw: string): ParsedScanResult {
  const trimmed = raw.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return { kind: "url", raw: trimmed, summary: trimmed };
  }
  if (/^WIFI:/i.test(trimmed)) {
    const match = trimmed.match(/S:((?:\\.|[^;])*);/i);
    const ssid = match ? match[1].replace(/\\(.)/g, "$1") : "network";
    return { kind: "wifi", raw: trimmed, summary: `Network: ${ssid}` };
  }
  if (/^mailto:/i.test(trimmed)) {
    return { kind: "email", raw: trimmed, summary: trimmed.replace(/^mailto:/i, "") };
  }
  if (/^tel:/i.test(trimmed)) {
    return { kind: "phone", raw: trimmed, summary: trimmed.replace(/^tel:/i, "") };
  }
  if (/^geo:/i.test(trimmed)) {
    const coords = trimmed.replace(/^geo:/i, "").split(/[?;]/)[0];
    return { kind: "location", raw: trimmed, summary: `Location: ${coords}` };
  }
  if (/^BEGIN:VCARD/i.test(trimmed)) {
    const nameMatch = trimmed.match(/FN:(.*)/i);
    return { kind: "contact", raw: trimmed, summary: nameMatch ? nameMatch[1].trim() : "Contact card" };
  }

  return {
    kind: "text",
    raw: trimmed,
    summary: trimmed.length > 120 ? `${trimmed.slice(0, 120)}…` : trimmed,
  };
}
