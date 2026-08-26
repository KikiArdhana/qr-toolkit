import { Lock, ShieldOff, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Fast",
    description: "Generate QR codes instantly in your browser.",
  },
  {
    icon: Lock,
    title: "Private",
    description: "Your QR data stays on your device.",
  },
  {
    icon: ShieldOff,
    title: "No account",
    description: "No registration, login, or unnecessary setup.",
  },
];

export function FeatureCards() {
  return (
    <section aria-label="Why QR Toolkit" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, description }) => (
        <div key={title} className="rounded-lg border border-border bg-surface p-5">
          <span className="mb-3 flex size-8 items-center justify-center rounded-md bg-accent/10 text-accent">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h3 className="mb-1 font-display text-[15px] font-semibold text-text">{title}</h3>
          <p className="text-[13px] text-text-secondary">{description}</p>
        </div>
      ))}
    </section>
  );
}
