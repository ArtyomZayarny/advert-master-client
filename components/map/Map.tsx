"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMapContext } from "@/lib/contexts/MapContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultOptions = {
  panControl: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  clickableIcons: false,
  keyboardShortcuts: false,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  fullscreenControl: false,
};

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  className?: string;
}

export function Map({ center, zoom = 15, height = "400px", className }: MapProps) {
  const { isLoaded, loadError } = useMapContext();
  const mapOptions = useMemo(() => defaultOptions, []);

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`} style={{ height }}>
        <div className="text-center p-6">
          <p className="text-muted-foreground">Map temporarily unavailable</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please check your internet connection or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <Skeleton className={`w-full ${className}`} style={{ height }} />
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}
