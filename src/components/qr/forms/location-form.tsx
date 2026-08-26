import type { LocationData } from "@/types/qr";
import type { FieldErrors } from "@/lib/qr/types";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Crosshair } from "lucide-react";
import { useState } from "react";

interface LocationFormProps {
  data: LocationData;
  errors: FieldErrors;
  onChange: (patch: Partial<LocationData>) => void;
}

export function LocationForm({ data, errors, onChange }: LocationFormProps) {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setGeoError("This browser doesn't support location lookup.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        });
        setLocating(false);
      },
      () => {
        setGeoError("Couldn't access your location. Enter coordinates manually.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Latitude" htmlFor="location-lat" error={errors.latitude}>
          <Input
            id="location-lat"
            type="text"
            inputMode="decimal"
            placeholder="37.774900"
            value={data.latitude}
            invalid={Boolean(errors.latitude)}
            onChange={(e) => onChange({ latitude: e.target.value })}
          />
        </Field>
        <Field label="Longitude" htmlFor="location-lon" error={errors.longitude}>
          <Input
            id="location-lon"
            type="text"
            inputMode="decimal"
            placeholder="-122.419400"
            value={data.longitude}
            invalid={Boolean(errors.longitude)}
            onChange={(e) => onChange({ longitude: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Label" htmlFor="location-title" optional>
        <Input
          id="location-title"
          type="text"
          placeholder="Office HQ"
          value={data.title ?? ""}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </Field>
      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={useCurrentLocation}
          disabled={locating}
        >
          <Crosshair className="size-3.5" aria-hidden="true" />
          {locating ? "Locating…" : "Use current location"}
        </Button>
        {geoError && (
          <p role="alert" className="mt-1.5 text-[12px] text-danger">
            {geoError}
          </p>
        )}
      </div>
    </div>
  );
}
