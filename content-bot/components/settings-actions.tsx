"use client"

import { useState } from "react"

export function SettingsActions() {
  const [clearing, setClearing] = useState(false)
  const [cleared, setCleared] = useState(false)

  async function handleClearHistory() {
    if (!confirm("Delete all posted history? This cannot be undone.")) return
    setClearing(true)
    await fetch("/api/settings/clear-history", { method: "POST" })
    setClearing(false)
    setCleared(true)
  }

  return (
    <button
      onClick={handleClearHistory}
      disabled={clearing || cleared}
      className="text-sm text-destructive border border-destructive/30 px-4 py-2 rounded-md hover:bg-destructive/5 transition-colors disabled:opacity-50"
    >
      {cleared ? "History cleared ✓" : clearing ? "Clearing..." : "Clear all history"}
    </button>
  )
}
