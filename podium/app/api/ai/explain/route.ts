import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/ai/anthropic";
import { EXPLAIN_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    const {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      studentAnswer,
    } = await request.json();

    const prompt = EXPLAIN_PROMPT.replace("{question}", question)
      .replace("{optionA}", optionA)
      .replace("{optionB}", optionB)
      .replace("{optionC}", optionC)
      .replace("{optionD}", optionD)
      .replace("{correctAnswer}", correctAnswer)
      .replace("{studentAnswer}", studentAnswer);

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error("AI explain error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
