# Google Maps Integration

## Overview

Google Maps integration has been added to the AdvertMaster client for address autocomplete and map display.

## Components

### 1. MapProvider (`lib/contexts/MapContext.tsx`)
- Provides Google Maps API loading state
- Handles API key configuration
- Manages error states

### 2. Map Component (`components/map/Map.tsx`)
- Displays Google Map with marker
- Shows location based on geocode coordinates
- Handles loading and error states
- Used on advert detail pages

### 3. AddressAutocomplete (`components/map/AddressAutocomplete.tsx`)
- Google Places Autocomplete integration
- Automatically extracts city and geocode
- Fallback to manual entry if API unavailable
- Used in create/edit advert forms

## Setup

1. Get Google Maps API Key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
3. Add API key to `.env.local`:
   ```
   NEXT_PUBLIC_MAP_API_KEY=your_api_key_here
   ```

## Usage

### In Forms (Create/Edit Advert)

```tsx
import { AddressAutocomplete } from "@/components/map/AddressAutocomplete";

<AddressAutocomplete
  value={address}
  onChange={(address, city, geocode) => {
    setAddress(address);
    setCity(city);
    setGeocode(geocode);
  }}
  label="Address"
  required
/>
```

### On Advert Detail Page

```tsx
import { Map } from "@/components/map/Map";

{advert.geocode && (
  <Map 
    center={{ lat: 35.1264, lng: 33.4299 }} 
    height="400px" 
  />
)}
```

## Features

- ✅ Address autocomplete with Google Places
- ✅ Automatic city extraction
- ✅ Geocode generation (lat lng)
- ✅ Map display on detail pages
- ✅ Error handling for blocked API
- ✅ Fallback to manual entry
- ✅ Restricted to Cyprus (CY)

## Error Handling

- If Google Maps API is blocked (AdBlock, privacy extensions):
  - Autocomplete shows fallback message
  - Users can still enter address manually
  - Map shows "temporarily unavailable" message

## Data Format

- **Geocode**: Stored as `"lat lng"` string (e.g., `"35.1264 33.4299"`)
- **Address**: Full formatted address from Google Places
- **City**: Extracted from address components

## Dependencies

- `@react-google-maps/api`: ^2.19.0

## Notes

- API key must be set in environment variables
- Maps are restricted to Cyprus region
- Geocode is automatically generated when address is selected
- Map only displays if geocode is available
