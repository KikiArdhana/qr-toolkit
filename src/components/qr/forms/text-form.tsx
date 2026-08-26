import type { TextData } from "@/types/qr";
import type { FieldErrors } from "@/lib/qr/types";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextFormProps {
  data: TextData;
  errors: FieldErrors;
  onChange: (patch: Partial<TextData>) => void;
}

export function TextForm({ data, errors, onChange }: TextFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Text" htmlFor="text-text" error={errors.text}>
        <Textarea
          id="text-text"
          placeholder="Anything you'd like to encode"
          value={data.text}
          invalid={Boolean(errors.text)}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </Field>
      <Field label="Title" htmlFor="text-title" optional>
        <Input
          id="text-title"
          type="text"
          placeholder="Note"
          value={data.title ?? ""}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </Field>
    </div>
  );
}
