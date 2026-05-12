"use server";

import { headers, cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

const NA_COUNTRIES = new Set(["US", "CA", "MX"]);

export async function collectAndSaveLocation(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return { success: false };

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    const db = getAdminDb();
    const userRef = db.collection("users").doc(decoded.uid);

    // Guard: only collect once — Admin SDK can read freely
    const snap = await userRef.get();
    if (snap.data()?.lat) return { success: false };

    // Read the user's real IP from Vercel headers
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "";

    // Server-side HTTP fetch is fine — no browser mixed-content restriction
    const geoRes = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,lat,lon,city,regionName,countryCode`
    );
    const geo = await geoRes.json();

    if (geo.status !== "success" || !NA_COUNTRIES.has(geo.countryCode)) {
      return { success: false };
    }

    await userRef.update({
      lat: geo.lat,
      lng: geo.lon,
      city: geo.city,
      state: geo.regionName,
      country: geo.countryCode,
    });

    return { success: true };
  } catch {
    return { success: false };
  }
}
