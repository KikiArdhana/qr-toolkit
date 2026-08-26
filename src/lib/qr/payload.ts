import type { QRInputData } from "@/types/qr";

/** Escapes characters that are structurally significant in WIFI:/vCard payloads. */
function escapeSpecial(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
}

function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return `${hasPlus ? "+" : ""}${digits}`;
}

/** Builds the exact string that gets encoded into the QR code. */
export function buildPayload(data: QRInputData): string {
  switch (data.type) {
    case "url":
      return normalizeUrl(data.url);

    case "text":
      return data.text;

    case "email": {
      const params = new URLSearchParams();
      if (data.subject) params.set("subject", data.subject);
      if (data.message) params.set("body", data.message);
      const query = params.toString();
      return `mailto:${data.email.trim()}${query ? `?${query}` : ""}`;
    }

    case "phone":
      return `tel:${normalizePhone(data.phone)}`;

    case "wifi": {
      const security = data.security === "nopass" ? "nopass" : data.security;
      const password =
        data.security === "nopass" ? "" : `P:${escapeSpecial(data.password)};`;
      return `WIFI:T:${security};S:${escapeSpecial(data.ssid)};${password}${
        data.hidden ? "H:true;" : ""
      };`;
    }

    case "contact": {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${escapeSpecial(data.fullName)}`,
        `FN:${escapeSpecial(data.fullName)}`,
      ];
      if (data.organization) lines.push(`ORG:${escapeSpecial(data.organization)}`);
      if (data.phone) lines.push(`TEL;TYPE=CELL:${normalizePhone(data.phone)}`);
      if (data.email) lines.push(`EMAIL:${data.email.trim()}`);
      if (data.website) lines.push(`URL:${normalizeUrl(data.website)}`);
      if (data.address) lines.push(`ADR:;;${escapeSpecial(data.address)};;;;`);
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "location": {
      const lat = data.latitude.trim();
      const lon = data.longitude.trim();
      const label = data.title?.trim();
      const query = label
        ? `?q=${lat},${lon}(${encodeURIComponent(label)})`
        : "";
      return `geo:${lat},${lon}${query}`;
    }
  }
}

/**
 * A short, human-readable summary of the payload for previews and history
 * rows. Deliberately omits sensitive fields (e.g. a Wi-Fi password) so it's
 * safe to display without exposing secrets.
 */
export function toDisplaySummary(data: QRInputData): string {
  switch (data.type) {
    case "url":
      return normalizeUrl(data.url);
    case "text":
      return data.text.length > 80 ? `${data.text.slice(0, 80)}…` : data.text;
    case "email":
      return data.email;
    case "phone":
      return data.phone;
    case "wifi":
      return `Network: ${data.ssid}`;
    case "contact":
      return data.fullName;
    case "location":
      return `${data.latitude}, ${data.longitude}`;
  }
}

/**
 * Removes the password segment from a WIFI: payload before it's persisted to
 * history, since Wi-Fi passwords are never saved by default (see the
 * "Save to history" flow in GeneratePanel).
 */
export function stripWifiPassword(payload: string): string {
  return payload.replace(/P:(?:\\.|[^;])*;/i, "P:;");
}

/**
 * Best-effort reconstruction of form fields from a previously-built payload,
 * used to repopulate the generator when a history item is regenerated.
 * Falls back to an empty record of the right type if parsing isn't possible
 * (e.g. a Wi-Fi password that was intentionally never saved).
 */
export function parsePayloadToData(
  type: QRInputData["type"],
  payload: string,
  title: string
): QRInputData {
  switch (type) {
    case "url":
      return { type, url: payload, title };
    case "text":
      return { type, text: payload, title };
    case "phone":
      return { type, phone: payload.replace(/^tel:/i, "") };
    case "email": {
      const [address, query = ""] = payload.replace(/^mailto:/i, "").split("?");
      const params = new URLSearchParams(query);
      return {
        type,
        email: address,
        subject: params.get("subject") ?? "",
        message: params.get("body") ?? "",
      };
    }
    case "location": {
      const coords = payload.replace(/^geo:/i, "").split(/[?;]/)[0];
      const [latitude = "", longitude = ""] = coords.split(",");
      return { type, latitude, longitude, title };
    }
    case "wifi": {
      const ssidMatch = payload.match(/S:((?:\\.|[^;])*);/i);
      const secMatch = payload.match(/T:([^;]*);/i);
      const hidden = /H:true/i.test(payload);
      const security = secMatch?.[1] === "WEP" ? "WEP" : secMatch?.[1] === "nopass" ? "nopass" : "WPA";
      return {
        type,
        ssid: ssidMatch ? ssidMatch[1].replace(/\\(.)/g, "$1") : "",
        password: "",
        security,
        hidden,
      };
    }
    case "contact": {
      const fnMatch = payload.match(/FN:(.*)/i);
      const orgMatch = payload.match(/ORG:(.*)/i);
      const telMatch = payload.match(/TEL[^:]*:(.*)/i);
      const emailMatch = payload.match(/EMAIL:(.*)/i);
      const urlMatch = payload.match(/URL:(.*)/i);
      const adrMatch = payload.match(/ADR:(?:[^;]*;){2}([^;]*)/i);
      return {
        type,
        fullName: fnMatch?.[1].trim() ?? "",
        organization: orgMatch?.[1].trim() ?? "",
        phone: telMatch?.[1].trim() ?? "",
        email: emailMatch?.[1].trim() ?? "",
        website: urlMatch?.[1].trim() ?? "",
        address: adrMatch?.[1].trim() ?? "",
      };
    }
  }
}

export function defaultTitleFor(data: QRInputData): string {
  switch (data.type) {
    case "url":
      try {
        return new URL(normalizeUrl(data.url)).hostname.replace(/^www\./, "");
      } catch {
        return "URL";
      }
    case "text":
      return data.text.slice(0, 32) || "Text";
    case "email":
      return data.email || "Email";
    case "phone":
      return data.phone || "Phone";
    case "wifi":
      return data.ssid || "Wi-Fi";
    case "contact":
      return data.fullName || "Contact";
    case "location":
      return "Location";
  }
}
