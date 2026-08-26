import type { PhoneData } from "@/types/qr";
import type { FieldErrors } from "@/lib/qr/types";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface PhoneFormProps {
  data: PhoneData;
  errors: FieldErrors;
  onChange: (patch: Partial<PhoneData>) => void;
}

export function PhoneForm({ data, errors, onChange }: PhoneFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Phone number"
        htmlFor="phone-number"
        error={errors.phone}
        hint="Include a country code for international numbers, e.g. +1 415 555 0100"
      >
        <Input
          id="phone-number"
          type="tel"
          inputMode="tel"
          placeholder="+1 415 555 0100"
          value={data.phone}
          invalid={Boolean(errors.phone)}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
      </Field>
    </div>
  );
}
