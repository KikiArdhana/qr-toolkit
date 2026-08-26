import type { EmailData } from "@/types/qr";
import type { FieldErrors } from "@/lib/qr/types";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EmailFormProps {
  data: EmailData;
  errors: FieldErrors;
  onChange: (patch: Partial<EmailData>) => void;
}

export function EmailForm({ data, errors, onChange }: EmailFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Email address" htmlFor="email-address" error={errors.email}>
        <Input
          id="email-address"
          type="email"
          placeholder="name@example.com"
          value={data.email}
          invalid={Boolean(errors.email)}
          onChange={(e) => onChange({ email: e.target.value })}
        />
      </Field>
      <Field label="Subject" htmlFor="email-subject" optional>
        <Input
          id="email-subject"
          type="text"
          placeholder="Let's talk"
          value={data.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
        />
      </Field>
      <Field label="Message" htmlFor="email-message" optional>
        <Textarea
          id="email-message"
          placeholder="Pre-filled message body"
          value={data.message}
          onChange={(e) => onChange({ message: e.target.value })}
        />
      </Field>
    </div>
  );
}
