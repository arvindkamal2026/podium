"use server";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export async function updateProfile(data: {
  firstName?: string;
  lastName?: string;
  school?: string;
  cluster?: string;
  eventId?: string;
  competitionDate?: string;
  competitionLevel?: string;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const decodedClaims = await getAdminAuth().verifySessionCookie(session, true);
    const uid = decodedClaims.uid;
    await getAdminDb().collection("users").doc(uid).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function deleteAccount() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const decodedClaims = await getAdminAuth().verifySessionCookie(session, true);
    const uid = decodedClaims.uid;
    const db = getAdminDb();

    // Delete subcollections
    const subcollections = ["piProgress", "vocabProgress", "examAttempts", "roleplayAttempts", "recentActivity"];
    for (const sub of subcollections) {
      const snap = await db.collection("users").doc(uid).collection(sub).get();
      const batch = db.batch();
      snap.docs.forEach((doc) => batch.delete(doc.ref));
      if (snap.docs.length > 0) await batch.commit();
    }

    // Delete user doc
    await db.collection("users").doc(uid).delete();

    // Delete auth user
    await getAdminAuth().deleteUser(uid);

    // Clear session cookie
    cookieStore.delete("session");
    cookieStore.delete("onboarding_complete");

    return { success: true };
  } catch (error) {
    console.error("Account deletion error:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
