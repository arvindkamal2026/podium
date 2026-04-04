import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  try {
    const decodedToken = await getAdminAuth().verifyIdToken(idToken);
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn,
    });
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.json({ status: "success" });
}
