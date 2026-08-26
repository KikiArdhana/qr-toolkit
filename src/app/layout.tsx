import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QR Toolkit — Create. Scan. Done.",
  description:
    "A lightweight, privacy-first QR utility for generating and scanning everyday QR codes. No account, no database, no unnecessary setup.",
  applicationName: "QR Toolkit",
  keywords: ["QR code", "QR generator", "QR scanner", "privacy", "utility"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#101013" },
  ],
};

// Runs before paint to avoid a light/dark flash. Reads the same storage
// key that useTheme uses, so the two never disagree.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('qr-toolkit:theme');
    var mode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    var resolved = mode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
