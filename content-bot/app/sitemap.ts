import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Only the public entry point. /generate, /scheduled, /history and /settings
  // are authenticated tool pages and are noindex — listing them would be a
  // sitemap/robots contradiction.
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
