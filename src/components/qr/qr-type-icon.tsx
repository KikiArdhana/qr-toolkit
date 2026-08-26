import {
  Contact,
  Link2,
  Mail,
  MapPin,
  Phone,
  Type,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { QRType } from "@/types/qr";

export const QR_TYPE_ICONS: Record<QRType, LucideIcon> = {
  url: Link2,
  text: Type,
  email: Mail,
  phone: Phone,
  wifi: Wifi,
  contact: Contact,
  location: MapPin,
};

export function QrTypeIcon({
  type,
  className,
}: {
  type: QRType;
  className?: string;
}) {
  const Icon = QR_TYPE_ICONS[type];
  return <Icon className={className} aria-hidden="true" />;
}
