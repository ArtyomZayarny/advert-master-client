"use client";

import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMapContext } from "@/lib/contexts/MapContext";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, city: string, geocode: string) => void;
  onError?: (error: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onError,
  label = "Address",
  placeholder = "Enter address...",
  className,
  required = false,
}: AddressAutocompleteProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isLoaded: mapsLoaded, loadError } = useMapContext();

  useEffect(() => {
    if (mapsLoaded && inputRef.current && !autocomplete) {
      const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "cy" }, // Restrict to Cyprus
        fields: ["formatted_address", "geometry", "address_components"],
      });

      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();

        if (!place.geometry || !place.geometry.location) {
          onError?.("Please select a valid address from the suggestions");
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const geocode = `${lat} ${lng}`;

        // Extract city from address components
        let city = "";
        const cityComponent = place.address_components?.find((component) =>
          component.types.includes("locality")
        );
        if (cityComponent) {
          city = cityComponent.long_name;
        } else {
          // Fallback to administrative_area_level_1 or country
          const areaComponent = place.address_components?.find((component) =>
            component.types.includes("administrative_area_level_1")
          );
          city = areaComponent?.long_name || "Cyprus";
        }

        onChange(place.formatted_address || "", city, geocode);
      });

      setAutocomplete(autocompleteInstance);
      setIsLoaded(true);
    }
  }, [mapsLoaded, autocomplete, onChange, onError]);

  if (loadError) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <Label>{label} {required && <span className="text-destructive">*</span>}</Label>}
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            // Manual entry fallback
            onChange(e.target.value, "", "");
          }}
          placeholder={placeholder}
          className="pl-10"
        />
        <p className="text-xs text-muted-foreground">
          Autocomplete unavailable. You can enter the address manually.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label} {required && <span className="text-destructive">*</span>}</Label>}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            // Allow manual editing
            if (!e.target.value.includes("→")) {
              // Only update if not a suggestion (suggestions have →)
              onChange(e.target.value, "", "");
            }
          }}
          placeholder={placeholder}
          className="pl-10"
          disabled={!isLoaded}
        />
      </div>
      {!isLoaded && (
        <p className="text-xs text-muted-foreground">Loading address suggestions...</p>
      )}
    </div>
  );
}
