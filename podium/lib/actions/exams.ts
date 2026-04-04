"use server";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

interface ExamResult {
  eventId: string;
  score: number;
  total: number;
  answers: Record<string, string>;
  piResults: { piId: string; correct: boolean }[];
}

export async function submitExamResult(result: ExamResult) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const decodedClaims = await getAdminAuth().verifySessionCookie(session, true);
    const uid = decodedClaims.uid;
    const db = getAdminDb();
    const now = new Date().toISOString();

    // Save exam attempt
    await db.collection("users").doc(uid).collection("examAttempts").add({
      eventId: result.eventId,
      score: result.score,
      total: result.total,
      percentage: Math.round((result.score / result.total) * 100),
      answers: result.answers,
      createdAt: now,
    });

    // Update PI progress for each question
    const batch = db.batch();
    for (const pr of result.piResults) {
      const ref = db
        .collection("users")
        .doc(uid)
        .collection("piProgress")
        .doc(pr.piId);
      const snap = await ref.get();

      if (!snap.exists) {
        batch.set(ref, {
          status: pr.correct ? "learning" : "untested",
          timesTested: 1,
          timesCorrect: pr.correct ? 1 : 0,
          consecutiveCorrect: pr.correct ? 1 : 0,
          lastTested: now,
        });
      } else {
        const data = snap.data()!;
        const newConsecutive = pr.correct
          ? (data.consecutiveCorrect || 0) + 1
          : 0;
        let newStatus = data.status;
        if (pr.correct && newConsecutive >= 3) newStatus = "mastered";
        else if (!pr.correct && data.status === "mastered")
          newStatus = "learning";
        else if (data.status === "untested") newStatus = "learning";

        batch.update(ref, {
          status: newStatus,
          timesTested: FieldValue.increment(1),
          timesCorrect: pr.correct
            ? FieldValue.increment(1)
            : data.timesCorrect,
          consecutiveCorrect: newConsecutive,
          lastTested: now,
        });
      }
    }

    // Update user stats
    batch.update(db.collection("users").doc(uid), {
      examsTaken: FieldValue.increment(1),
      totalSessions: FieldValue.increment(1),
      lastSessionDate: now,
      updatedAt: now,
    });

    // Add recent activity
    batch.set(
      db.collection("users").doc(uid).collection("recentActivity").doc(),
      {
        type: "exam",
        label: `Practice Exam — ${result.eventId.toUpperCase()}`,
        score: Math.round((result.score / result.total) * 100),
        date: now,
      }
    );

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Exam submission error:", error);
    return { success: false, error: "Failed to submit exam" };
  }
}
