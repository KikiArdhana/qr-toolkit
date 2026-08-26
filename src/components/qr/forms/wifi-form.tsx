import type { WifiData, WifiSecurity } from "@/types/qr";
import type { FieldErrors } from "@/lib/qr/types";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";

interface WifiFormProps {
  data: WifiData;
  errors: FieldErrors;
  onChange: (patch: Partial<WifiData>) => void;
}

export function WifiForm({ data, errors, onChange }: WifiFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Network name (SSID)" htmlFor="wifi-ssid" error={errors.ssid}>
        <Input
          id="wifi-ssid"
          type="text"
          placeholder="Home Network"
          value={data.ssid}
          invalid={Boolean(errors.ssid)}
          onChange={(e) => onChange({ ssid: e.target.value })}
        />
      </Field>

      <Field label="Security" htmlFor="wifi-security">
        <Select
          id="wifi-security"
          value={data.security}
          onChange={(e) => onChange({ security: e.target.value as WifiSecurity })}
        >
          <option value="WPA">WPA / WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (open network)</option>
        </Select>
      </Field>

      {data.security !== "nopass" && (
        <Field
          label="Password"
          htmlFor="wifi-password"
          error={errors.password}
          hint="Not saved to history unless you explicitly choose to."
        >
          <Input
            id="wifi-password"
            type="password"
            autoComplete="off"
            placeholder="Network password"
            value={data.password}
            invalid={Boolean(errors.password)}
            onChange={(e) => onChange({ password: e.target.value })}
          />
        </Field>
      )}

      <div className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2.5">
        <div>
          <p className="text-[13px] font-medium text-text">Hidden network</p>
          <p className="text-[12px] text-text-secondary">
            Tell devices to look for this network even though it doesn&apos;t broadcast.
          </p>
        </div>
        <Switch
          id="wifi-hidden"
          checked={data.hidden}
          onChange={(hidden) => onChange({ hidden })}
          label="Hidden network"
        />
      </div>

      <p className="flex items-start gap-1.5 text-[12px] text-text-secondary">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        The password is embedded in the QR code so scanners can join automatically. It
        stays on this device and is never saved to your history by default.
      </p>
    </div>
  );
}
