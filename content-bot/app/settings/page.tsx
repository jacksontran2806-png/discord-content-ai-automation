import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsActions } from "@/components/settings-actions"
import { pageMetadata } from "@/lib/seo"

function mask(value: string | undefined, show = 8): string {
  if (!value) return "Not set"
  return value.slice(0, show) + "••••••••••••••••"
}

export const metadata = pageMetadata({
  title: "Settings",
  description: "API key status, Discord webhook, cron schedule, and history controls.",
  path: "/settings",
})

export default function SettingsPage() {
  const anthropicKey = mask(process.env.ANTHROPIC_API_KEY)
  const openaiKey = mask(process.env.OPENAI_API_KEY)
  const webhookUrl = mask(process.env.DISCORD_WEBHOOK_URL, 30)

  return (
    <DashboardLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your API keys, webhook, and schedule.</p>
        </div>

        <div className="flex flex-col gap-5">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">API Keys</CardTitle>
              <p className="text-xs text-muted-foreground">
                Set via Vercel environment variables. Redeploy after changing.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-0 pt-0">
              <SettingRow label="Anthropic API Key" value={anthropicKey} hint="Used for Claude (primary)" />
              <SettingRow label="OpenAI API Key" value={openaiKey} hint="Used as fallback" />
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Discord</CardTitle>
              <p className="text-xs text-muted-foreground">Webhook URL for posting content to your channel.</p>
            </CardHeader>
            <CardContent className="pt-0">
              <SettingRow label="Webhook URL" value={webhookUrl} hint="Channel webhook" />
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Schedule</CardTitle>
              <p className="text-xs text-muted-foreground">Cron runs daily — all scheduled posts due that day are sent.</p>
            </CardHeader>
            <CardContent className="pt-0">
              <SettingRow label="Post Schedule" value="Daily at 9:00 AM (Hanoi)" hint="Edit via vercel.json → crons[0].schedule" />
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <SettingsActions />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

function SettingRow({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="py-3 flex items-center justify-between gap-4 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
      </div>
      <p className="text-xs text-muted-foreground font-mono bg-secondary px-2.5 py-1.5 rounded-md shrink-0 max-w-[200px] truncate">{value}</p>
    </div>
  )
}
