"use server";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function updateVocabProgress(wordId: string, isCorrect: boolean) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const decodedClaims = await getAdminAuth().verifySessionCookie(session, true);
    const uid = decodedClaims.uid;
    const db = getAdminDb();
    const ref = db
      .collection("users")
      .doc(uid)
      .collection("vocabProgress")
      .doc(wordId);
    const snap = await ref.get();
    const now = new Date().toISOString();

    if (!snap.exists) {
      await ref.set({
        status: isCorrect ? "learning" : "untested",
        timesTested: 1,
        timesCorrect: isCorrect ? 1 : 0,
        consecutiveCorrect: isCorrect ? 1 : 0,
        lastTested: now,
      });
    } else {
      const data = snap.data()!;
      const newConsecutive = isCorrect ? (data.consecutiveCorrect || 0) + 1 : 0;
      let newStatus = data.status;
      if (isCorrect && newConsecutive >= 3) newStatus = "mastered";
      else if (!isCorrect && data.status === "mastered") newStatus = "learning";
      else if (data.status === "untested") newStatus = "learning";

      await ref.update({
        status: newStatus,
        timesTested: FieldValue.increment(1),
        timesCorrect: isCorrect ? FieldValue.increment(1) : data.timesCorrect,
        consecutiveCorrect: newConsecutive,
        lastTested: now,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Vocab progress error:", error);
    return { success: false, error: "Failed to update vocab progress" };
  }
}
