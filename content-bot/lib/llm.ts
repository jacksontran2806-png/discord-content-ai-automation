import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export interface GeneratedContent {
  topic: string;
  body: string;
  provider: "claude" | "openai";
}

export async function generateContent(topic: string): Promise<GeneratedContent> {
  const prompt = `You are an educational content writer. Write a short, engaging lesson (3-5 sentences) about the following topic for a general audience: ${topic}`;

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const body =
      response.content[0].type === "text" ? response.content[0].text : "";

    return { topic, body, provider: "claude" };
  } catch (err) {
    console.warn("Claude failed, falling back to OpenAI:", err);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const body = response.choices[0].message.content ?? "";

    return { topic, body, provider: "openai" };
  }
}
