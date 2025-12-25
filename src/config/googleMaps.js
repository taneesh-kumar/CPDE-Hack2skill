// Deprecated: CPDE now uses Leaflet + OpenStreetMap (no API key required).
// This file is intentionally kept as a no-op to avoid breaking older imports.

export function ensureGoogleMapsLoaded() {
  return Promise.reject(
    new Error('[CPDE] Google Maps is disabled. CPDE uses Leaflet + OpenStreetMap now.'),
  )
}
