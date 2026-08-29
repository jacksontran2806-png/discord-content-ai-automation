import { DashboardLayout } from "@/components/dashboard-layout"
import { ScheduledPosts } from "@/components/scheduled-posts"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Scheduled Posts",
  description: "View, reschedule, and cancel posts queued to send automatically.",
  path: "/scheduled",
})

export default function ScheduledPage() {
  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Scheduled Posts</h1>
            <p className="text-muted-foreground">Posts queued to send automatically.</p>
          </div>
          <a
            href="/generate"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            + New Post
          </a>
        </div>
        <ScheduledPosts />
      </div>
    </DashboardLayout>
  )
}
