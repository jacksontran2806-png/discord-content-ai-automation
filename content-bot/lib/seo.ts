import type { Metadata } from "next"

/**
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL   — set this to the custom domain in production
 *   2. VERCEL_PROJECT_PRODUCTION_URL — stable production host on Vercel
 *   3. VERCEL_URL             — per-deployment preview host
 *   4. localhost              — dev
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (vercelHost) return `https://${vercelHost}`

  return "http://localhost:3000"
}

export const siteUrl = resolveSiteUrl()

export const siteConfig = {
  name: "content-bot",
  shortName: "content-bot",
  title: "content-bot — AI content automation for Discord",
  description:
    "Generate educational content with Claude, schedule it, and let a daily cron post it to Discord automatically. No manual publishing.",
  keywords: [
    "AI content automation",
    "Discord bot",
    "scheduled posts",
    "Claude API",
    "content scheduler",
    "educational content generator",
    "Discord webhook automation",
    "Next.js",
  ],
  locale: "en_US",
  themeColor: "#0a0a0a",
} as const

/** True only on the real production deployment — previews stay out of the index. */
export const isProduction = process.env.VERCEL_ENV === "production"

/** Applied to private tool pages: crawlable by nobody, ever. */
export const noIndex: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false },
}

/**
 * Metadata for an app page. Every page here is behind the dashboard, so the
 * default is noindex; pass `indexable: true` for anything public-facing.
 */
export function pageMetadata({
  title,
  description,
  path,
  indexable = false,
}: {
  title: string
  description: string
  path: string
  indexable?: boolean
}): Metadata {
  const url = `${siteUrl}${path}`
  // Avoid "content-bot — X — content-bot" when the title already carries the brand.
  const socialTitle = title.includes(siteConfig.name)
    ? title
    : `${title} — ${siteConfig.name}`

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: indexable ? undefined : noIndex,
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  }
}
