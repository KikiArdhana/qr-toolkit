import QRCode from "qrcode";
import type { QRCustomization } from "@/types/qr";

function toQrcodeOptions(settings: QRCustomization) {
  return {
    errorCorrectionLevel: settings.errorCorrection,
    margin: 2,
    width: settings.size,
    color: {
      dark: settings.fgColor,
      light: settings.bgColor,
    },
  } as const;
}

/** Renders the QR code onto an existing <canvas> element (used for the live preview). */
export async function renderToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  settings: QRCustomization
): Promise<void> {
  await QRCode.toCanvas(canvas, payload, toQrcodeOptions(settings));
}

export async function generatePngDataUrl(
  payload: string,
  settings: QRCustomization
): Promise<string> {
  return QRCode.toDataURL(payload, {
    ...toQrcodeOptions(settings),
    type: "image/png",
  });
}

export async function generateSvgString(
  payload: string,
  settings: QRCustomization
): Promise<string> {
  return QRCode.toString(payload, {
    ...toQrcodeOptions(settings),
    type: "svg",
  });
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadPng(
  payload: string,
  settings: QRCustomization,
  filename: string
): Promise<void> {
  const dataUrl = await generatePngDataUrl(payload, settings);
  triggerDownload(dataUrl, filename.endsWith(".png") ? filename : `${filename}.png`);
}

export async function downloadSvg(
  payload: string,
  settings: QRCustomization,
  filename: string
): Promise<void> {
  const svg = await generateSvgString(payload, settings);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename.endsWith(".svg") ? filename : `${filename}.svg`);
  URL.revokeObjectURL(url);
}

/** Turns a title into a filesystem-safe base filename. */
export function slugifyFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "qr-code";
}
