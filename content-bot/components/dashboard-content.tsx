"use client"

import Link from "next/link"
import { Calendar, TrendingUp, Layers, Clock, CheckCircle2, Sparkles, CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Posts Scheduled", value: "3", icon: Calendar, trend: "+1 this week" },
  { label: "Posted This Week", value: "7", icon: TrendingUp, trend: "vs 4 last week" },
  { label: "Topics Available", value: "10", icon: Layers, trend: "1 category" },
]

const upcomingPosts = [
  { title: "How DNA replication works", time: "Tomorrow, 9:00 AM", platform: "Discord" },
  { title: "Why we dream", time: "Wed, 2:00 PM", platform: "Discord" },
  { title: "What causes earthquakes", time: "Fri, 10:00 AM", platform: "Discord" },
]

const recentActivity = [
  { action: "Posted", title: "How black holes form", time: "Today", status: "success" },
  { action: "Posted", title: "Why the sky is blue", time: "Yesterday", status: "success" },
  { action: "Posted", title: "How vaccines work", time: "Mon", status: "success" },
  { action: "Scheduled", title: "How DNA replication works", time: "Today", status: "pending" },
]

export function DashboardContent() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your content overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Upcoming Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {upcomingPosts.map((post, index) => (
                <li key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                    {post.platform}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentActivity.map((activity, index) => (
                <li key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === "success" ? "bg-primary" :
                      activity.status === "pending" ? "bg-amber-500" : "bg-muted-foreground"
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/generate" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Content
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/scheduled" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            View Schedule
          </Link>
        </Button>
      </div>
    </div>
  )
}
