import type { MetadataRoute } from "next"
import { siteUrl, isProduction } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  // Previews and local builds: block everything so staging hosts never rank.
  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private tool surfaces + API routes stay out of the crawl budget.
        disallow: ["/api/", "/generate", "/scheduled", "/history", "/settings"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
