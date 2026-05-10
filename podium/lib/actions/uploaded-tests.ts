"use server";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export interface UploadedTest {
  id: string;
  userId: string;
  testName: string;
  uploadedAt: string;
  questionCount: number;
}

export interface UploadedQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
}

async function getUid(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  try {
    const claims = await getAdminAuth().verifySessionCookie(session, true);
    return claims.uid;
  } catch {
    return null;
  }
}

export async function saveUploadedTest(
  testName: string,
  questions: Omit<UploadedQuestion, "id">[]
): Promise<{ success: boolean; testId?: string; error?: string }> {
  const uid = await getUid();
  if (!uid) return { success: false, error: "Not authenticated" };

  if (questions.length > 200) {
    return { success: false, error: "Test exceeds the maximum of 200 questions." };
  }

  try {
    const db = getAdminDb();
    const testRef = db.collection("uploaded_tests").doc();
    const testId = testRef.id;
    const now = new Date().toISOString();

    const batch = db.batch();
    batch.set(testRef, {
      userId: uid,
      testName,
      uploadedAt: now,
      questionCount: questions.length,
    });
    for (const q of questions) {
      const qRef = testRef.collection("questions").doc();
      batch.set(qRef, q);
    }
    await batch.commit();
    return { success: true, testId };
  } catch (error) {
    console.error("saveUploadedTest error:", error);
    return { success: false, error: "Failed to save test" };
  }
}

export async function getUploadedTests(): Promise<UploadedTest[]> {
  const uid = await getUid();
  if (!uid) return [];

  try {
    const db = getAdminDb();
    // Single equality filter — no composite index needed; sort client-side
    const snap = await db
      .collection("uploaded_tests")
      .where("userId", "==", uid)
      .get();

    const tests = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<UploadedTest, "id">),
    }));

    return tests.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  } catch (error) {
    console.error("getUploadedTests error:", error);
    return [];
  }
}

export async function deleteUploadedTest(
  testId: string
): Promise<{ success: boolean; error?: string }> {
  const uid = await getUid();
  if (!uid) return { success: false, error: "Not authenticated" };

  try {
    const db = getAdminDb();
    const testRef = db.collection("uploaded_tests").doc(testId);
    const testDoc = await testRef.get();

    if (!testDoc.exists || testDoc.data()?.userId !== uid) {
      return { success: false, error: "Not found" };
    }

    const qSnap = await testRef.collection("questions").get();
    const batch = db.batch();
    qSnap.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(testRef);
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error("deleteUploadedTest error:", error);
    return { success: false, error: "Failed to delete test" };
  }
}
