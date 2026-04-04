import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/ai/anthropic";
import { CHAT_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    const { eventName, piText, message, history } = await request.json();

    const systemPrompt = CHAT_PROMPT
      .replace("{eventName}", eventName || "DECA")
      .replace("{piText}", piText || "General DECA prep");

    const messages = [
      ...(history || []).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
