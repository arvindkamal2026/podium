import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getMapLocations } from "@/lib/map-users";

export const revalidate = 60;

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await getAdminAuth().verifySessionCookie(session, true);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const locations = await getMapLocations();
    return NextResponse.json({ locations }, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch {
    return NextResponse.json({ locations: [] }, { status: 500 });
  }
}
