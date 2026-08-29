import { DashboardLayout } from "@/components/dashboard-layout"
import { GenerateContent } from "@/components/generate-content"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Generate",
  description:
    "Write a topic, generate content with Claude, then schedule it or post it to Discord right away.",
  path: "/generate",
})

export default function GeneratePage() {
  return (
    <DashboardLayout>
      <GenerateContent />
    </DashboardLayout>
  )
}
