import type { QRInputData } from "@/types/qr";
import type { FieldErrors } from "@/lib/qr/types";
import { UrlForm } from "./forms/url-form";
import { TextForm } from "./forms/text-form";
import { EmailForm } from "./forms/email-form";
import { PhoneForm } from "./forms/phone-form";
import { WifiForm } from "./forms/wifi-form";
import { ContactForm } from "./forms/contact-form";
import { LocationForm } from "./forms/location-form";

interface QrFormProps {
  data: QRInputData;
  errors: FieldErrors;
  /** Receives the full, merged replacement — avoids Partial<Union> narrowing issues. */
  onChange: (next: QRInputData) => void;
}

export function QrForm({ data, errors, onChange }: QrFormProps) {
  switch (data.type) {
    case "url":
      return (
        <UrlForm data={data} errors={errors} onChange={(patch) => onChange({ ...data, ...patch })} />
      );
    case "text":
      return (
        <TextForm data={data} errors={errors} onChange={(patch) => onChange({ ...data, ...patch })} />
      );
    case "email":
      return (
        <EmailForm data={data} errors={errors} onChange={(patch) => onChange({ ...data, ...patch })} />
      );
    case "phone":
      return (
        <PhoneForm data={data} errors={errors} onChange={(patch) => onChange({ ...data, ...patch })} />
      );
    case "wifi":
      return (
        <WifiForm data={data} errors={errors} onChange={(patch) => onChange({ ...data, ...patch })} />
      );
    case "contact":
      return (
        <ContactForm data={data} errors={errors} onChange={(patch) => onChange({ ...data, ...patch })} />
      );
    case "location":
      return (
        <LocationForm data={data} errors={errors} onChange={(patch) => onChange({ ...data, ...patch })} />
      );
  }
}
