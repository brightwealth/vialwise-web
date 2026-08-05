/**
 * Shared, dependency-free helpers for /get — imported by BOTH the server
 * component (which does the redirect) and the client card (which handles the
 * one case a server cannot). Keep this module free of React and of any
 * browser-only globals at module scope so the server can import it safely.
 */

/* ────────────────────────────────────────────────────────────────────────────
 * ⚠️  ACTION REQUIRED — PASTE THE REAL APPLE PROVIDER TOKEN BELOW  ⚠️
 *
 * `PROVIDER_TOKEN` is a PLACEHOLDER. Andrew must replace it with the real
 * value from:
 *
 *     App Store Connect → App Analytics → Campaigns  (the "Provider Token")
 *
 * It was deliberately NOT invented — a guessed token silently attributes
 * nothing. Until it is replaced, the App Store link still opens the correct
 * product page (pt/ct are analytics-only params); only Apple-side campaign
 * attribution stays inert.
 * ──────────────────────────────────────────────────────────────────────────── */
export const APPLE_PROVIDER_TOKEN = "PROVIDER_TOKEN";

const APPLE_APP_ID = "6774017323";
const ANDROID_PACKAGE = "com.vialwise.app";

/** `?src=` value used when the link carries no source of its own. */
const DEFAULT_SOURCE = "direct";

/** Apple caps the `ct` campaign token at 40 characters. */
const MAX_SOURCE_LENGTH = 40;

/**
 * What the SERVER can determine from a User-Agent alone.
 *
 * "unknown" covers real desktops AND iPadOS-in-desktop-mode, which are not
 * distinguishable from a UA string — see `isIpadOs` for the other half.
 */
export type ServerPlatform = "ios" | "android" | "unknown";

/**
 * Platform from the User-Agent header, server-side.
 *
 * Deliberately conservative: anything not positively identified as iOS or
 * Android resolves to "unknown" and is served the card rather than guessed at.
 * A wrong guess here sends someone to the wrong store, which is worse than
 * showing two buttons.
 */
export function serverPlatformFromUserAgent(userAgent: string): ServerPlatform {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "unknown";
}

/**
 * The half of iPadOS detection a server cannot do.
 *
 * Since iPadOS 13, Safari requests desktop sites by default: it reports a
 * "Macintosh" UA with no "iPad" token, so the header is byte-identical to a real
 * Mac's. The only reliable discriminator is `navigator.maxTouchPoints` — 5 on an
 * iPad, 0 on a Mac — which exists only in the browser. Hence the card carries a
 * tiny client-side upgrade path for this one case; everything else redirects
 * from the server. The `Macintosh` guard keeps Windows touchscreen laptops
 * (which also report touch points) out of the iOS branch.
 *
 * Returns false during SSR, where there is no navigator.
 */
export function isIpadOs(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPad/i.test(ua)) return true;
  return /Macintosh/i.test(ua) && (navigator.maxTouchPoints ?? 0) > 1;
}

/**
 * Normalize an arbitrary `?src=` into something safe for a campaign token:
 * lowercase, `[a-z0-9._-]` only, no leading/trailing separators, clamped to
 * Apple's 40-char ceiling. Anything empty or unusable falls back to "direct",
 * so a malformed link still redirects and still reports a source.
 */
export function sanitizeSource(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_SOURCE;
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, MAX_SOURCE_LENGTH);
  return cleaned || DEFAULT_SOURCE;
}

/** App Store URL carrying Apple campaign attribution (`pt` / `ct`). */
export function appStoreUrl(source: string): string {
  const params = new URLSearchParams({
    pt: APPLE_PROVIDER_TOKEN,
    ct: source,
    mt: "8",
  });
  return `https://apps.apple.com/app/id${APPLE_APP_ID}?${params.toString()}`;
}

/**
 * Play Store URL carrying an install referrer.
 *
 * The referrer value is itself a query string (`utm_source=…&utm_medium=…`)
 * that must be encoded ONCE as a single param value — hence the explicit
 * encodeURIComponent rather than URLSearchParams, which would encode the `id`
 * and `referrer` pair separately and leave the inner `&` splitting the URL.
 */
export function googlePlayUrl(source: string): string {
  const referrer = `utm_source=${source}&utm_medium=social`;
  return `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&referrer=${encodeURIComponent(
    referrer,
  )}`;
}
