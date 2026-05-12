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
    await getAdminDb().collection("users").doc(decoded.uid).update({
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
