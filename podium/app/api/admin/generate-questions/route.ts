import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/ai/anthropic";
import { getAdminDb } from "@/lib/firebase/admin";
import { QUESTION_GEN_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  const adminKey = request.headers.get("X-Admin-Key");
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { eventId, eventName, piId, piText, piCategory, difficulty, count } = await request.json();
    const client = getAnthropicClient();
    const db = getAdminDb();
    const questions = [];

    for (let i = 0; i < (count || 1); i++) {
      const prompt = QUESTION_GEN_PROMPT
        .replace("{eventName}", eventName)
        .replace("{piText}", piText)
        .replace("{piCategory}", piCategory)
        .replace("{difficulty}", difficulty);

      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const q = JSON.parse(jsonMatch[0]);
        q.piId = piId;
        q.eventId = eventId;
        q.createdAt = new Date().toISOString();

        const docRef = await db.collection("practiceExams").doc(eventId).collection("questions").add(q);
        questions.push({ id: docRef.id, ...q });
      }
    }

    return NextResponse.json({ generated: questions.length, questions });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
