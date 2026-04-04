import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/ai/anthropic";
import { getAdminDb } from "@/lib/firebase/admin";
import { SCENARIO_GEN_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  const adminKey = request.headers.get("X-Admin-Key");
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { eventId, eventName, pis, count } = await request.json();
    const client = getAnthropicClient();
    const db = getAdminDb();
    const scenarios = [];

    const piListText = (pis as { id: string; text: string }[])
      .map((pi) => `- ${pi.text}`)
      .join("\n");

    for (let i = 0; i < (count || 1); i++) {
      const prompt = SCENARIO_GEN_PROMPT
        .replace("{eventName}", eventName)
        .replace("{piList}", piListText);

      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const scenario = JSON.parse(jsonMatch[0]);
        scenario.eventId = eventId;
        scenario.createdAt = new Date().toISOString();

        const docRef = await db.collection("roleplayScenarios").doc(eventId).collection("scenarios").add(scenario);
        scenarios.push({ id: docRef.id, ...scenario });
      }
    }

    return NextResponse.json({ generated: scenarios.length, scenarios });
  } catch (error) {
    console.error("Scenario generation error:", error);
    return NextResponse.json({ error: "Failed to generate scenarios" }, { status: 500 });
  }
}
