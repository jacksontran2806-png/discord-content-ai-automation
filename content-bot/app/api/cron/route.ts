import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const now = new Date().toISOString();

  // Fetch all posts that are due and still scheduled
  const { data: duePosts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "scheduled")
    .lte("scheduled_time", now);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!duePosts || duePosts.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No posts due" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL!;
  const results = [];

  for (const post of duePosts) {
    try {
      const message = `**${post.topic}**\n\n${post.content}`;
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });

      if (!res.ok) {
        throw new Error(`Discord returned ${res.status}`);
      }

      await supabase
        .from("posts")
        .update({ status: "posted" })
        .eq("id", post.id);

      results.push({ id: post.id, topic: post.topic, status: "posted" });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      await supabase
        .from("posts")
        .update({ status: "failed", error: errMsg })
        .eq("id", post.id);

      results.push({ id: post.id, topic: post.topic, status: "failed", error: errMsg });
    }
  }

  return NextResponse.json({ ok: true, sent: results.length, results });
}
