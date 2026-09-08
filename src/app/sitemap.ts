import type { MetadataRoute } from "next";
import { getAllEntries } from "@/lib/library";

/**
 * Auto-generated sitemap for getvialwise.com.
 *
 * Served at https://www.getvialwise.com/sitemap.xml — submitted to
 * Google Search Console + Bing Webmaster Tools so search engines can
 * discover every public page in one request.
 *
 * Excludes:
 *   - /preview/* — internal design preview routes, blocked in robots.ts
 *
 * Priority + changefreq are SEO heuristics, not commitments. Update as
 * the site grows or as the SEO Agent identifies new public pages.
 */

const BASE_URL = "https://www.getvialwise.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Library URLs are GENERATED from the derived library, never hand-listed —
  // a hand-maintained list silently stops covering new entries, which is the
  // one failure a sitemap exists to prevent.
  const libraryEntries: MetadataRoute.Sitemap = getAllEntries().map((e) => ({
    url: e.web.url,
    lastModified: new Date(e.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/library`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...libraryEntries,
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/calculator`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
