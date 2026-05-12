import { saveUserLocation } from "@/lib/actions/location";

const NA_COUNTRIES = new Set(["US", "CA", "MX"]);

export async function collectUserLocation(): Promise<void> {
  try {
    const res = await fetch(
      "https://ip-api.com/json/?fields=lat,lon,city,regionName,countryCode"
    );
    const geo = await res.json();

    if (geo.status === "success" && NA_COUNTRIES.has(geo.countryCode)) {
      // Write via server action — Admin SDK bypasses Firestore security rules.
      // The server action itself guards against duplicate writes.
      await saveUserLocation({
        lat: geo.lat,
        lng: geo.lon,
        city: geo.city,
        state: geo.regionName,
        country: geo.countryCode,
      });
    }
  } catch {
    // Location is non-critical — silently fail
  }
}
