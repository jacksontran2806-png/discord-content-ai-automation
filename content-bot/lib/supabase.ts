import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Post {
  id: number;
  topic: string;
  content: string;
  platform: string;
  scheduled_time: string;
  status: "draft" | "scheduled" | "posted" | "failed";
  error: string | null;
  created_at: string;
}
