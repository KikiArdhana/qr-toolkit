/**
 * Domain types shared across the app. QR input data is modeled as a
 * discriminated union keyed on `type`, so every form, payload builder and
 * validator can narrow on it exhaustively.
 */

export type QRType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "wifi"
  | "contact"
  | "location";

export type WifiSecurity = "WPA" | "WEP" | "nopass";

interface QRBase {
  /** Optional user-facing label. Falls back to a generated summary. */
  title?: string;
}

export interface UrlData extends QRBase {
  type: "url";
  url: string;
}

export interface TextData extends QRBase {
  type: "text";
  text: string;
}

export interface EmailData extends QRBase {
  type: "email";
  email: string;
  subject: string;
  message: string;
}

export interface PhoneData extends QRBase {
  type: "phone";
  phone: string;
}

export interface WifiData extends QRBase {
  type: "wifi";
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}

export interface ContactData extends QRBase {
  type: "contact";
  fullName: string;
  organization: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface LocationData extends QRBase {
  type: "location";
  latitude: string;
  longitude: string;
}

export type QRInputData =
  | UrlData
  | TextData
  | EmailData
  | PhoneData
  | WifiData
  | ContactData
  | LocationData;

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCustomization {
  size: number;
  fgColor: string;
  bgColor: string;
  errorCorrection: ErrorCorrectionLevel;
}

export const DEFAULT_CUSTOMIZATION: QRCustomization = {
  size: 320,
  fgColor: "#16161a",
  bgColor: "#ffffff",
  errorCorrection: "M",
};

/**
 * A saved history entry. `payload` is the encoded string that was rendered
 * into the QR code. Sensitive fields (like a Wi-Fi password) are never
 * embedded here unless the user explicitly opts in when saving — see
 * lib/qr/payload.ts `toDisplaySummary` and the history hook.
 */
export interface QRRecord {
  id: string;
  type: QRType;
  title: string;
  payload: string;
  createdAt: string;
  settings: QRCustomization;
  /** True if the user explicitly chose to persist sensitive fields (e.g. a Wi-Fi password). */
  containsSensitiveData?: boolean;
}

export type ThemeMode = "light" | "dark" | "system";

export type AppMode = "generate" | "scan";
