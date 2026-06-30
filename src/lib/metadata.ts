import type { Metadata } from "next";

/**
 * Default Open Graph / Twitter share image (1200x630). Relative path — resolved
 * to the canonical www host via the root layout's `metadataBase`.
 */
export const OG_IMAGE = "/og-image.png";

// Shared Open Graph title/description. These mirror the root layout's values.
// As of the v2.0 launch the app IS a full protocol tracker (dose log, body map,
// weekly recap, vial inventory, BID/TID, PDF export), so the "tracking" share
// copy is now accurate. Kept site-wide (not per-page) intentionally.
const OG_TITLE = "Vialwise — Peptide tracking, done right.";
const OG_DESCRIPTION =
  "The honest peptide app. Built by someone who actually runs peptides.";

/**
 * Build per-page metadata whose `og:url` is guaranteed to equal the canonical:
 * both are set from the same absolute `canonical` string, so they render
 * byte-identical (absolute URLs bypass `metadataBase` resolution — no
 * trailing-slash drift between the two tags).
 *
 * Next.js overwrites — never deep-merges — the `openGraph` object per route
 * segment, so any page that sets its own `og:url` must re-supply the shared OG
 * fields. That is why `images` / `type` / `siteName` live here rather than only
 * in the root layout: a page-level `openGraph` would otherwise drop them.
 */
export function pageMetadata(canonical: string): Metadata {
  return {
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: "Vialwise",
      title: OG_TITLE,
      description: OG_DESCRIPTION,
      url: canonical,
      images: [OG_IMAGE],
    },
  };
}
