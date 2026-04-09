import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const history = [
  { id: 1, topic: "How black holes form", date: "Apr 9", platform: "Discord", provider: "Claude", chars: 892 },
  { id: 2, topic: "Why the sky is blue", date: "Apr 8", platform: "Discord", provider: "Claude", chars: 743 },
  { id: 3, topic: "How vaccines work", date: "Apr 7", platform: "Discord", provider: "OpenAI", chars: 815 },
  { id: 4, topic: "What is quantum entanglement", date: "Apr 6", platform: "Discord", provider: "Claude", chars: 921 },
  { id: 5, topic: "How the internet works", date: "Apr 5", platform: "Discord", provider: "Claude", chars: 678 },
]

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">History</h1>
          <p className="text-muted-foreground">{history.length} posts published.</p>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-0">
            <div className="grid grid-cols-[1fr_72px_80px_72px_60px] px-6 py-3 border-b border-border">
              {["Topic", "Date", "Platform", "Via", "Length"].map((h) => (
                <p key={h} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</p>
              ))}
            </div>
            <ul className="divide-y divide-border">
              {history.map(({ id, topic, date, platform, provider, chars }) => (
                <li key={id} className="grid grid-cols-[1fr_72px_80px_72px_60px] px-6 py-3.5 items-center">
                  <p className="text-sm text-foreground font-medium truncate pr-4">{topic}</p>
                  <p className="text-xs text-muted-foreground">{date}</p>
                  <p className="text-xs text-muted-foreground">{platform}</p>
                  <p className="text-xs text-muted-foreground">{provider}</p>
                  <p className="text-xs text-muted-foreground">{chars}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
