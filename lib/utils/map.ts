/**
 * Utility functions for Google Maps integration
 */

/**
 * Get Google Maps API key from environment variables
 * @returns API key or empty string if not set
 */
export function getMapApiKey(): string {
  if (typeof window === "undefined") {
    // Server-side: use process.env directly
    return process.env.NEXT_PUBLIC_MAP_API_KEY || "";
  }
  // Client-side: Next.js injects NEXT_PUBLIC_ variables
  return process.env.NEXT_PUBLIC_MAP_API_KEY || "";
}

/**
 * Check if Google Maps API key is configured
 * @returns true if API key is set, false otherwise
 */
export function isMapApiKeyConfigured(): boolean {
  const apiKey = getMapApiKey();
  return apiKey.length > 0;
}
