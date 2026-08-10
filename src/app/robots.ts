import type { MetadataRoute } from "next";

/**
 * robots.txt for getvialwise.com.
 *
 * Served at https://www.getvialwise.com/robots.txt — tells search
 * engine crawlers what to index, what to skip, and where the sitemap is.
 *
 * Disallowed:
 *   - /preview/* — internal design preview routes (themes, vials,
 *     numeric-feel, empty-states); not for public consumption.
 *   - /api/* — backend API routes; no SEO value.
 *   - /social/* — social slide PNGs staged here purely so Buffer can
 *     fetch them at publish time (Buffer's API takes a public URL, not
 *     a file upload). They are post artwork, not site content, and
 *     should never appear in search or compete with real pages.
 *     Crawlers ignoring robots.txt are also caught by the
 *     X-Robots-Tag: noindex header on /social/ in vercel.json.
 */

const BASE_URL = "https://www.getvialwise.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/preview/", "/api/", "/social/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
