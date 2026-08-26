import type {
  ContactData,
  EmailData,
  LocationData,
  PhoneData,
  QRInputData,
  TextData,
  UrlData,
  WifiData,
} from "@/types/qr";
import type { FieldErrors, ValidationResult } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// International-friendly: allow leading +, digits, spaces, hyphens, parens.
const PHONE_RE = /^\+?[0-9()\-\s]{5,20}$/;

export function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const url = new URL(
      /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value) ? value : `https://${value}`
    );
    return Boolean(url.hostname) && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(value.trim()) && value.replace(/\D/g, "").length >= 5;
}

export function isValidLatitude(value: string): boolean {
  const n = Number(value);
  return value.trim() !== "" && Number.isFinite(n) && n >= -90 && n <= 90;
}

export function isValidLongitude(value: string): boolean {
  const n = Number(value);
  return value.trim() !== "" && Number.isFinite(n) && n >= -180 && n <= 180;
}

function validateUrl(data: UrlData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.url.trim()) {
    errors.url = "Enter a URL.";
  } else if (!isValidUrl(data.url)) {
    errors.url = "Enter a valid URL, such as https://example.com";
  }
  return errors;
}

function validateText(data: TextData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.text.trim()) {
    errors.text = "Enter some text.";
  }
  return errors;
}

function validateEmail(data: EmailData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.email.trim()) {
    errors.email = "Enter an email address.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Enter a valid email, such as name@example.com";
  }
  return errors;
}

function validatePhone(data: PhoneData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.phone.trim()) {
    errors.phone = "Enter a phone number.";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  return errors;
}

function validateWifi(data: WifiData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.ssid.trim()) {
    errors.ssid = "Network name is required.";
  }
  if (data.security !== "nopass" && !data.password) {
    errors.password = "Enter the network password, or set security to None.";
  }
  return errors;
}

function validateContact(data: ContactData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.fullName.trim()) {
    errors.fullName = "Enter a name.";
  }
  if (data.email && !isValidEmail(data.email)) {
    errors.email = "Enter a valid email, such as name@example.com";
  }
  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  return errors;
}

function validateLocation(data: LocationData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.latitude.trim()) {
    errors.latitude = "Latitude is required.";
  } else if (!isValidLatitude(data.latitude)) {
    errors.latitude = "Latitude must be between -90 and 90.";
  }
  if (!data.longitude.trim()) {
    errors.longitude = "Longitude is required.";
  } else if (!isValidLongitude(data.longitude)) {
    errors.longitude = "Longitude must be between -180 and 180.";
  }
  return errors;
}

export function validateQRInput(data: QRInputData): ValidationResult {
  let errors: FieldErrors = {};
  switch (data.type) {
    case "url":
      errors = validateUrl(data);
      break;
    case "text":
      errors = validateText(data);
      break;
    case "email":
      errors = validateEmail(data);
      break;
    case "phone":
      errors = validatePhone(data);
      break;
    case "wifi":
      errors = validateWifi(data);
      break;
    case "contact":
      errors = validateContact(data);
      break;
    case "location":
      errors = validateLocation(data);
      break;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
