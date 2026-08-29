import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/seo"

export const alt = siteConfig.title
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Generated at build/request time — no binary asset to keep in sync with copy.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "#0a0a0a",
            }}
          >
            CB
          </div>
          <div style={{ fontSize: 32, color: "#a1a1a1" }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              color: "#fafafa",
              letterSpacing: -2,
            }}
          >
            AI content automation for Discord
          </div>
          <div style={{ fontSize: 32, color: "#a1a1a1", lineHeight: 1.35 }}>
            Generate with Claude. Schedule once. A daily cron posts it for you.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
