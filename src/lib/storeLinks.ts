/**
 * Store links with campaign attribution — the single builder for the site.
 *
 * ⚠️ WHY THIS EXISTS. Until 2026-09-07 the shared <StoreBadges /> linked to
 * BARE store URLs with no `ct` at all, on the homepage, /about and /calculator.
 * Every install originating from getvialwise.com was therefore attributed to
 * organic App Store Search, which means the App Store Connect acquisition
 * numbers — where "App Store Search" ran ~3x every other source — were inflated
 * by an unknown amount of our own web traffic, and other channels were
 * correspondingly under-credited. The token had been documented in
 * docs/marketing/campaign-links.md since 2026-07-20 and was never wired up.
 *
 * Formats are copied from that file verbatim. Do not "tidy" them:
 *   - Apple uses the /app/apple-store/id… path, which is the form App Store
 *     Connect itself generates for campaign links. The shorter /app/id… path
 *     can drop params on a redirect hop.
 *   - Play's `referrer` is itself a query string and must be encoded ONCE as a
 *     single param value, or the inner & splits the URL.
 *
 * Campaign tokens live in docs/marketing/campaign-links.md. Keep them
 * distinguishable: `website` is the site's own download buttons, `web-library`
 * is the /library entry pages. Collapsing the two would lose exactly the signal
 * this is being wired up to get.
 */

const APPLE_APP_ID = "6774017323";
const APPLE_PROVIDER_TOKEN = "128963457";
const ANDROID_PACKAGE = "com.vialwise.app";

/** Campaign tokens registered in docs/marketing/campaign-links.md. */
export type Campaign = "website" | "web-library";

export function appStoreUrl(campaign: Campaign): string {
  return (
    `https://apps.apple.com/app/apple-store/id${APPLE_APP_ID}` +
    `?pt=${APPLE_PROVIDER_TOKEN}&ct=${campaign}&mt=8`
  );
}

export function googlePlayUrl(campaign: Campaign): string {
  const referrer = `utm_source=getvialwise&utm_medium=referral&utm_campaign=${campaign}`;
  return (
    `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}` +
    `&referrer=${encodeURIComponent(referrer)}`
  );
}
