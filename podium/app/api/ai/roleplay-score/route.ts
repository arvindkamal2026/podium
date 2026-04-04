import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/ai/anthropic";
import { SCORER_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    const { eventName, scenario, piList, response } = await request.json();

    const prompt = SCORER_PROMPT.replace("{eventName}", eventName)
      .replace("{scenario}", scenario)
      .replace("{piList}", piList)
      .replace("{response}", response);

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json(
        { error: "Failed to parse scoring response" },
        { status: 500 }
      );
    }

    const scoring = JSON.parse(jsonMatch[0]);
    return Response.json(scoring);
  } catch (error) {
    console.error("Roleplay scoring error:", error);
    return Response.json({ error: "Failed to score response" }, { status: 500 });
  }
}
