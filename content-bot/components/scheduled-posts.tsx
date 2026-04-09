"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { supabase, Post } from "@/lib/supabase"

export function ScheduledPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<number | null>(null)

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .in("status", ["scheduled", "draft"])
      .order("scheduled_time", { ascending: true })
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  async function handleCancel(id: number) {
    setCancelling(id)
    await supabase.from("posts").update({ status: "draft" }).eq("id", id)
    await fetchPosts()
    setCancelling(null)
  }

  async function handleDelete(id: number) {
    setCancelling(id)
    await supabase.from("posts").delete().eq("id", id)
    setPosts(prev => prev.filter(p => p.id !== id))
    setCancelling(null)
  }

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>
  if (!posts.length) return (
    <p className="text-muted-foreground text-sm">No scheduled posts. <a href="/generate" className="text-primary underline">Generate one</a>.</p>
  )

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => {
        const date = new Date(post.scheduled_time)
        const dateStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
        const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

        return (
          <Card key={post.id} className="border-border shadow-sm">
            <CardContent className="py-4 flex items-center gap-4">
              <div className="shrink-0 w-12 text-center">
                <p className="text-xs text-muted-foreground">{dateStr.split(" ")[1]}</p>
                <p className="text-xl font-semibold text-foreground">{dateStr.split(" ")[0]}</p>
              </div>
              <div className="w-px h-8 bg-border shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{post.topic}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{timeStr} · {post.platform}</p>
              </div>
              <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                post.status === "scheduled"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}>
                {post.status}
              </span>
              {post.status === "scheduled" && (
                <button
                  onClick={() => handleCancel(post.id)}
                  disabled={cancelling === post.id}
                  className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {cancelling === post.id ? "..." : "Cancel"}
                </button>
              )}
              <button
                onClick={() => handleDelete(post.id)}
                disabled={cancelling === post.id}
                className="shrink-0 text-xs text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
