import type { QRType } from "@/types/qr";

export type FieldErrors = Record<string, string>;

export interface ValidationResult {
  valid: boolean;
  errors: FieldErrors;
}

export interface QRTypeMeta {
  type: QRType;
  label: string;
  description: string;
}

export const QR_TYPE_META: QRTypeMeta[] = [
  { type: "url", label: "URL", description: "Link to a website" },
  { type: "text", label: "Text", description: "Plain text or a note" },
  { type: "email", label: "Email", description: "Pre-filled email draft" },
  { type: "phone", label: "Phone", description: "Dial a phone number" },
  { type: "wifi", label: "Wi-Fi", description: "Join a wireless network" },
  { type: "contact", label: "Contact", description: "Share a vCard" },
  { type: "location", label: "Location", description: "Point on a map" },
];

export const ERROR_CORRECTION_OPTIONS: {
  value: "L" | "M" | "Q" | "H";
  label: string;
  detail: string;
}[] = [
  { value: "L", label: "Low", detail: "~7% recovery — smallest code" },
  { value: "M", label: "Medium", detail: "~15% recovery — good default" },
  { value: "Q", label: "Quartile", detail: "~25% recovery — sturdier" },
  { value: "H", label: "High", detail: "~30% recovery — most resilient" },
];
