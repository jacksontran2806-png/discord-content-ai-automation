import type { Metadata } from "next"

/**
 * Resolution order (host-agnostic — works on Cloudflare, Vercel, or anywhere):
 *   1. NEXT_PUBLIC_SITE_URL          — set this to the custom domain. Preferred.
 *   2. CF_PAGES_URL                  — Cloudflare Pages deployment host
 *   3. VERCEL_PROJECT_PRODUCTION_URL — stable production host on Vercel
 *   4. VERCEL_URL                    — per-deployment preview host on Vercel
 *   5. localhost                     — dev
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")

  // Cloudflare Pages already gives a full origin, including protocol.
  const cloudflareUrl = process.env.CF_PAGES_URL
  if (cloudflareUrl) return cloudflareUrl.replace(/\/$/, "")

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

/**
 * Whether this build is the real, public production deployment. Only production
 * is indexable — previews and local builds must never enter a search index.
 *
 * Host-agnostic on purpose. Keying this off a single provider's variable (e.g.
 * VERCEL_ENV) silently deindexes the whole site the moment you deploy anywhere
 * else, because the variable is simply absent.
 *
 *   1. NEXT_PUBLIC_SITE_ENV — explicit override. Set to "production" on the
 *      production deployment. This is the reliable switch on Cloudflare Pages
 *      and Workers, neither of which exposes a production/preview flag that
 *      Next can read at build time.
 *   2. Cloudflare Pages — the deployed branch equals the production branch.
 *   3. Vercel — VERCEL_ENV.
 *
 * Default is false: an unrecognised environment stays out of the index rather
 * than risking a preview host being crawled.
 */
function resolveIsProduction(): boolean {
  const explicit = process.env.NEXT_PUBLIC_SITE_ENV
  if (explicit) return explicit === "production"

  const cfBranch = process.env.CF_PAGES_BRANCH
  if (cfBranch) {
    const productionBranch = process.env.CF_PAGES_PRODUCTION_BRANCH ?? "main"
    return cfBranch === productionBranch
  }

  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === "production"

  return false
}

export const isProduction = resolveIsProduction()

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
