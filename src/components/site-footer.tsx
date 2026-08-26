export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-1.5 px-4 py-10 text-center sm:px-6">
        <p className="font-display text-[14px] font-semibold text-text">
          QR Toolkit
        </p>

        <p className="text-[13px] text-text-secondary">Create. Scan. Done.</p>

        <p className="mt-2 max-w-md text-[12px] text-text-secondary">
          QR generation and history are handled locally in your browser.
        </p>

        <p className="mt-5 text-[11px] text-text-secondary">
          © {new Date().getFullYear()} Kiki Ardhana. Built with curiosity.
        </p>
      </div>
    </footer>
  );
}
