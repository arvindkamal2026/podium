import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";

const NA_COUNTRIES = new Set(["US", "CA", "MX"]);

export async function collectUserLocation(uid: string): Promise<void> {
  const db = getClientDb();
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  // Only run once — skip if already collected
  if (data?.lat) return;

  try {
    const res = await fetch(
      "http://ip-api.com/json/?fields=lat,lon,city,regionName,countryCode"
    );
    const geo = await res.json();

    if (geo.status === "success" && NA_COUNTRIES.has(geo.countryCode)) {
      await updateDoc(userRef, {
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
