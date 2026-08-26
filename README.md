# QR Toolkit

**Create. Scan. Done.**

A lightweight, privacy-first QR utility for everyday use — generate and scan the QR codes you actually need (links, Wi-Fi, contacts, locations) without creating an account, without a database, and without your data ever leaving your device.

> This project intentionally does not use a backend because its requirements do not justify one.

---

## Screenshots

*(Add screenshots or a short screen recording here — homepage hero, the Generate workspace in light and dark mode, and the Scan flow.)*

```
/docs/screenshot-generate.png
/docs/screenshot-scan.png
/docs/screenshot-history.png
```

---

## What it does

**Generate** — Build a QR code for a URL, plain text, email, phone number, Wi-Fi network, contact card (vCard), or location. Every type gets its own purpose-built form with inline validation, so you're never guessing at a format. Customize size, foreground/background color, and error-correction level, then download as PNG or SVG.

**Scan** — Point your camera at a QR code, or upload an image of one. The result is decoded entirely on your device, classified by type (link, Wi-Fi, phone, location, contact, or plain text), and shown with clear next actions — QR Toolkit never opens a link automatically.

**History** — Recently generated codes are listed locally so you can re-download or regenerate them later. Nothing is synced anywhere; it's just `localStorage`.

---

## Key features

- Seven dedicated generator forms: URL, Text, Email, Phone, Wi-Fi, Contact, Location
- Live preview that renders as you type, with adjustable size, colors, and ECC level
- PNG and SVG export
- Camera-based scanning with an image-upload fallback for browsers or situations where camera access isn't available
- Type-aware scan results with explicit actions (open, call, copy, search, view on a map) — nothing happens automatically
- Local history (max 20 items) with regenerate, delete, and clear-all
- Wi-Fi passwords are excluded from saved history by default; saving one requires an explicit, clearly-labeled opt-in
- Light, dark, and system themes, persisted locally
- Fully responsive, keyboard-navigable, and built with `prefers-reduced-motion` in mind

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | Fast static output, no server code required |
| Language | TypeScript (strict) | Discriminated unions keep the seven QR types honest end-to-end |
| Styling | Tailwind CSS v4 | Compact utility styling, CSS-variable-driven theming |
| QR generation | [`qrcode`](https://www.npmjs.com/package/qrcode) | Mature, dependency-light, supports canvas/PNG/SVG output |
| QR scanning | [`@zxing/browser`](https://www.npmjs.com/package/@zxing/browser) | Battle-tested, browser-native camera decoding, no server round-trip |
| Icons | `lucide-react` | Consistent, tree-shakeable icon set |
| Persistence | `localStorage` | The only storage this app needs — see below |

No Supabase, no Prisma, no auth, no analytics SDK, no API routes. Just a static site that runs entirely in the browser.

---

## Architecture

```
src/
  app/                    # Single route: the whole app lives on one page
    page.tsx
    layout.tsx
    globals.css           # Design tokens (CSS variables) + Tailwind v4 theme

  components/
    qr/
      forms/              # One dedicated form per QR type
      qr-type-selector.tsx
      qr-form.tsx         # Dispatches to the right form via the discriminated union
      qr-preview.tsx       # Live canvas preview + scan-line signature animation
      qr-customization.tsx
      qr-download.tsx
      qr-history.tsx / qr-history-item.tsx
      qr-scanner.tsx        # Camera + image-upload scanning
      qr-result.tsx         # Type-aware decoded result + actions
      generate-panel.tsx / scan-panel.tsx
    ui/                    # Small local primitives (Button, Input, Field, Switch…)

  hooks/
    use-qr-history.ts     # Versioned localStorage read/write, corruption-safe
    use-theme.ts           # Light/dark/system, persisted, no FOUC

  lib/qr/
    payload.ts            # Builds the exact encoded string per QR type
    validation.ts          # Per-field validators
    download.ts            # Canvas/PNG/SVG rendering via `qrcode`
    scan-result.ts          # Classifies a decoded string (URL, Wi-Fi, vCard, etc.)
    defaults.ts             # Empty-state factories per type
    types.ts                # QR-type metadata, error-correction options

  types/qr.ts              # The discriminated union (`QRInputData`) plus
                            # `QRRecord`, `QRCustomization`, `ThemeMode`
```

Business logic (payload encoding, validation, storage) is kept out of the UI layer so it can be tested, reused, or ported independently of React.

---

## Privacy approach

The core rule: **no QR content is ever uploaded to a server.**

- QR generation happens entirely client-side, using the `qrcode` package to render onto a `<canvas>` and export PNG/SVG.
- Scanning decodes frames from your camera (or an uploaded image) locally, in the browser — nothing is sent anywhere for recognition.
- There's no analytics SDK, no third-party API call, and no console logging of payload contents.
- Wi-Fi passwords are the one genuinely sensitive field in this app. They're **never saved to history by default** — the "Save to history" flow strips the password out of the stored record. Saving the password anyway requires an explicit, visibly-labeled toggle at the moment of saving, so nothing sensitive is persisted by accident.
- Scanned links are never opened automatically. You always see the decoded content and choose an action.

## Why `localStorage` instead of a database

Recent history is inherently per-device, disposable, and low-value data — exactly the profile that doesn't need durability, multi-device sync, or a server round-trip. Introducing a database (and the auth, hosting, and migration overhead that comes with it) would add real operational cost to solve a problem `localStorage` already solves for free, while working against the app's actual promise: nothing about your QR codes leaves your browser. `localStorage` also means the app keeps working if the network is slow, blocked, or entirely offline once loaded.

If a future version genuinely needed cross-device history, that's an argument for a very small, explicit "export/import as JSON" feature — not a backend.

---

## Notable design decisions

- **Discriminated unions everywhere.** `QRInputData` is a union of seven interfaces keyed on `type`. Every form, validator, and payload builder switches on that key, so TypeScript will flag any QR type that's missing a case.
- **A shared visual motif ties Generate and Scan together.** Both the live QR preview and the camera scanner use the same "viewfinder corner" bracket treatment and a scan-line sweep animation (respecting `prefers-reduced-motion`) — a small, deliberate signature rather than a decorative flourish.
- **Regenerate is best-effort by design.** History only stores the encoded payload and title, not raw form fields (to avoid duplicating sensitive data). Regenerating a history item reconstructs form fields by parsing the payload back apart where that's reversible (URL, text, phone, email, location, contact, and Wi-Fi SSID) — a Wi-Fi password that was never saved simply comes back empty, which is the correct, privacy-respecting behavior.
- **Contrast checking, not hard blocking.** Extreme foreground/background color combinations produce a warning rather than being disallowed outright, since QR error correction can tolerate more than a naive contrast check assumes.
- **Versioned storage key (`qr-toolkit:v1`).** Malformed JSON, an unrecognized shape, or a future version number all fall back to an empty history rather than throwing — corrupted `localStorage` can never crash the app.

---

## Future possibilities

- Optional logo/image overlay in the QR code, with an automatic bump to a higher error-correction level when a logo is present
- Batch generation (e.g. a CSV of URLs → a ZIP of QR codes)
- Export/import history as a JSON file, for anyone who wants to move it between browsers manually
- A "recently scanned" history alongside "recently generated"
- PWA/offline install support

---

## Setup

```bash
pnpm install
pnpm dev       # http://localhost:3000
```

```bash
pnpm lint      # ESLint
pnpm build     # Production build (static output)
pnpm start     # Serve the production build
```

No environment variables, no API keys, and no external services are required.

---

## Known limitations & browser notes

- Camera scanning requires `getUserMedia` support and a secure context (HTTPS, or `localhost` in development). Unsupported or blocked browsers fall back to image upload.
- The `color` input used for foreground/background pickers renders with the browser's native color picker UI, which varies in style across browsers.
- Very low-contrast foreground/background combinations are flagged with a warning, not blocked — some devices' cameras may still struggle to read those codes.
- Wi-Fi QR codes follow the widely-supported `WIFI:` URI convention; a small number of older devices don't parse it.
- `geo:` QR codes are opened via a Google Maps search link on scan for maximum compatibility, rather than relying on the OS to have a default `geo:` handler.
