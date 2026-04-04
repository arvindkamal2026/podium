"use server";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

interface OnboardingData {
  firstName: string;
  lastName: string;
  school: string;
  cluster: string;
  eventId: string;
  competitionDate: string;
  competitionLevel: string;
}

export async function completeOnboarding(data: OnboardingData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const decodedClaims = await getAdminAuth().verifySessionCookie(session, true);
    const uid = decodedClaims.uid;

    await getAdminDb().collection("users").doc(uid).set({
      firstName: data.firstName,
      lastName: data.lastName,
      school: data.school,
      cluster: data.cluster,
      eventId: data.eventId,
      competitionDate: data.competitionDate,
      competitionLevel: data.competitionLevel,
      streak: 0,
      longestStreak: 0,
      weeklySessionCount: 0,
      totalSessions: 0,
      lastSessionDate: null,
      piMastered: 0,
      piTotal: 0,
      vocabMastered: 0,
      vocabTotal: 0,
      examsTaken: 0,
      avgExamScore: 0,
      rolePlayCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    cookieStore.set("onboarding_complete", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { success: false, error: "Failed to complete onboarding" };
  }
}
