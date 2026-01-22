"use client";

import { createContext, useContext, ReactNode } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

interface MapContextType {
  isLoaded: boolean;
  loadError: Error | null;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

export function MapProvider({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY || "";
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries,
    language: "en",
    region: "CY",
  });

  // Log warning if API key is missing (only in development)
  if (typeof window !== "undefined" && !apiKey && process.env.NODE_ENV === "development") {
    console.warn(
      "⚠️ NEXT_PUBLIC_MAP_API_KEY is not set. Google Maps will not work. " +
      "Please add NEXT_PUBLIC_MAP_API_KEY to your .env.local file."
    );
  }

  return (
    <MapContext.Provider value={{ isLoaded, loadError: loadError || null }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}
