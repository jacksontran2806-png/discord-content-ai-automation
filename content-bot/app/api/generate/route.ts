import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/llm";

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  if (!topic || typeof topic !== "string") {
    return NextResponse.json({ error: "topic is required" }, { status: 400 });
  }

  const content = await generateContent(topic);
  return NextResponse.json(content);
}