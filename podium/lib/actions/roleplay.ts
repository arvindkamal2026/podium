"use server";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

interface RoleplayResult {
  eventId: string;
  scenarioTitle: string;
  overallScore: number;
  piScores: { piId: string; score: number }[];
  response: string;
}

export async function submitRoleplayResult(result: RoleplayResult) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const decodedClaims = await getAdminAuth().verifySessionCookie(session, true);
    const uid = decodedClaims.uid;
    const db = getAdminDb();
    const now = new Date().toISOString();

    // Save attempt
    await db.collection("users").doc(uid).collection("roleplayAttempts").add({
      eventId: result.eventId,
      scenarioTitle: result.scenarioTitle,
      overallScore: result.overallScore,
      piScores: result.piScores,
      response: result.response,
      createdAt: now,
    });

    // Update PI progress — score >= 4 counts as correct
    const batch = db.batch();
    for (const ps of result.piScores) {
      const isCorrect = ps.score >= 4;
      const ref = db
        .collection("users")
        .doc(uid)
        .collection("piProgress")
        .doc(ps.piId);
      const snap = await ref.get();

      if (!snap.exists) {
        batch.set(ref, {
          status: isCorrect ? "learning" : "untested",
          timesTested: 1,
          timesCorrect: isCorrect ? 1 : 0,
          consecutiveCorrect: isCorrect ? 1 : 0,
          lastTested: now,
        });
      } else {
        const data = snap.data()!;
        const newConsecutive = isCorrect
          ? (data.consecutiveCorrect || 0) + 1
          : 0;
        let newStatus = data.status;
        if (isCorrect && newConsecutive >= 3) newStatus = "mastered";
        else if (!isCorrect && data.status === "mastered")
          newStatus = "learning";
        else if (data.status === "untested") newStatus = "learning";

        batch.update(ref, {
          status: newStatus,
          timesTested: FieldValue.increment(1),
          timesCorrect: isCorrect
            ? FieldValue.increment(1)
            : data.timesCorrect,
          consecutiveCorrect: newConsecutive,
          lastTested: now,
        });
      }
    }

    // Update user stats
    batch.update(db.collection("users").doc(uid), {
      rolePlayCount: FieldValue.increment(1),
      totalSessions: FieldValue.increment(1),
      lastSessionDate: now,
      updatedAt: now,
    });

    // Recent activity
    batch.set(
      db.collection("users").doc(uid).collection("recentActivity").doc(),
      {
        type: "roleplay",
        label: `Role Play — ${result.scenarioTitle}`,
        score: Math.round(result.overallScore * 20),
        date: now,
      }
    );

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Roleplay submission error:", error);
    return { success: false, error: "Failed to submit roleplay" };
  }
}
