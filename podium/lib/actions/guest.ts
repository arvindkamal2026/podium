"use server";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export async function createGuestProfile() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return { success: false, error: "Not authenticated" };

  // Skip revocation check (false) — anonymous users can trigger false positives
  const decodedClaims = await getAdminAuth().verifySessionCookie(session, false);
  const uid = decodedClaims.uid;

  const existing = await getAdminDb().collection("users").doc(uid).get();
  if (existing.exists) return { success: true };

  await getAdminDb().collection("users").doc(uid).set({
    firstName: "Guest",
    lastName: "",
    school: "Podium Preview",
    cluster: "marketing",
    eventId: "principles-of-marketing",
    competitionDate: "2026-10-01",
    competitionLevel: "State",
    streak: 3,
    longestStreak: 7,
    weeklySessionCount: 2,
    totalSessions: 12,
    lastSessionDate: null,
    piMastered: 5,
    piTotal: 20,
    vocabMastered: 8,
    vocabTotal: 30,
    examsTaken: 2,
    avgExamScore: 78,
    rolePlayCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  cookieStore.set("onboarding_complete", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return { success: true };
}
