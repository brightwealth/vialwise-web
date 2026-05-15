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
 */

const BASE_URL = "https://www.getvialwise.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/preview/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
