import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "content-bot — AI content automation for Discord",
  description:
    "Generate educational content with Claude, schedule it, and let a daily cron post it to Discord automatically. No manual publishing.",
  path: "/",
  indexable: true,
})

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}
