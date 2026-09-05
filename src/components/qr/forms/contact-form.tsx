import type { ContactData } from "@/types/qr";
import type { FieldErrors } from "@/lib/qr/types";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ContactFormProps {
  data: ContactData;
  errors: FieldErrors;
  onChange: (patch: Partial<ContactData>) => void;
}

export function ContactForm({ data, errors, onChange }: ContactFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Full name" htmlFor="contact-name" error={errors.fullName}>
        <Input
          id="contact-name"
          type="text"
          placeholder="Kiki Ardhana"
          value={data.fullName}
          invalid={Boolean(errors.fullName)}
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
      </Field>
      <Field label="Organization" htmlFor="contact-org" optional>
        <Input
          id="contact-org"
          type="text"
          placeholder="Acme Co."
          value={data.organization}
          onChange={(e) => onChange({ organization: e.target.value })}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone" htmlFor="contact-phone" error={errors.phone} optional>
          <Input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            placeholder="+1 415 555 0100"
            value={data.phone}
            invalid={Boolean(errors.phone)}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </Field>
        <Field label="Email" htmlFor="contact-email" error={errors.email} optional>
          <Input
            id="contact-email"
            type="email"
            placeholder="name@example.com"
            value={data.email}
            invalid={Boolean(errors.email)}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Website" htmlFor="contact-website" optional>
        <Input
          id="contact-website"
          type="text"
          placeholder="https://example.com"
          value={data.website}
          onChange={(e) => onChange({ website: e.target.value })}
        />
      </Field>
      <Field label="Address" htmlFor="contact-address" optional>
        <Input
          id="contact-address"
          type="text"
          placeholder="123 Main St, City"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />
      </Field>
    </div>
  );
}
