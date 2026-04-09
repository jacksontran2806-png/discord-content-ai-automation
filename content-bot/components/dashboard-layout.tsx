"use client"

import { Sidebar } from "./Sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[220px] min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
