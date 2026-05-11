import { getAdminDb } from "@/lib/firebase/admin";

export interface MapLocation {
  lat: number;
  lng: number;
}

export async function getMapLocations(): Promise<MapLocation[]> {
  const snapshot = await getAdminDb()
    .collection("users")
    .where("country", "in", ["US", "CA", "MX"])
    .where("lat", "!=", null)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return { lat: data.lat as number, lng: data.lng as number };
  });
}
