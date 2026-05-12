"use server";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

interface LocationData {
  lat: number;
  lng: number;
  city: string;
  state: string;
  country: string;
}

export async function saveUserLocation(data: LocationData): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return { success: false };

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    const db = getAdminDb();
    const userRef = db.collection("users").doc(decoded.uid);

    // Guard: only write once — check server-side where Admin SDK can read freely
    const snap = await userRef.get();
    if (snap.data()?.lat) return { success: false };

    await userRef.update({
      lat: data.lat,
      lng: data.lng,
      city: data.city,
      state: data.state,
      country: data.country,
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
