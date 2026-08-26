import type { UrlData } from "@/types/qr";
import type { FieldErrors } from "@/lib/qr/types";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface UrlFormProps {
  data: UrlData;
  errors: FieldErrors;
  onChange: (patch: Partial<UrlData>) => void;
}

export function UrlForm({ data, errors, onChange }: UrlFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="URL" htmlFor="url-url" error={errors.url}>
        <Input
          id="url-url"
          type="text"
          inputMode="url"
          placeholder="https://example.com"
          value={data.url}
          invalid={Boolean(errors.url)}
          onChange={(e) => onChange({ url: e.target.value })}
        />
      </Field>
      <Field label="Title" htmlFor="url-title" optional>
        <Input
          id="url-title"
          type="text"
          placeholder="My website"
          value={data.title ?? ""}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </Field>
    </div>
  );
}
