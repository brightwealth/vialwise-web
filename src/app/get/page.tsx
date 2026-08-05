import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { GetCard } from "./GetCard";
import {
  appStoreUrl,
  googlePlayUrl,
  sanitizeSource,
  serverPlatformFromUserAgent,
} from "./platform";

/**
 * /get — one-tap, device-aware app download for SOCIAL BIO LINKS.
 *
 * Replaces the Linktree hop in the Instagram bio: one tap goes straight to the
 * right store instead of a 6-link menu. Tag the source with ?src=, e.g.
 * /get?src=ig-bio or /get?src=x — the value flows into Apple's `ct` campaign
 * param and the Play Store `referrer` utm_source.
 *
 * ── /get vs /download: BOTH EXIST ON PURPOSE. DO NOT MERGE THEM. ────────────
 *
 * /download (src/app/download/route.ts) is a route handler for PRINTED QR
 * CODES. It is documented as a permanent path, forwards arbitrary incoming
 * query params verbatim for offline attribution, and sends anything it can't
 * identify — including iPad — to the homepage.
 *
 * /get is for SOCIAL. It differs in three ways that matter:
 *   1. Unidentified devices get a two-button CARD here, not a bounce to the
 *      homepage. A bio-link tap that lands on the homepage is a lost download.
 *   2. It builds STORE-CAMPAIGN URLs (Apple pt/ct, Play referrer) from a single
 *      sanitized ?src=, rather than forwarding whatever params arrived.
 *   3. It handles iPadOS, which /download explicitly punts (see GetCard).
 *
 * Changing one to match the other would break the other's use case.
 *
 * ── Server-side by design ───────────────────────────────────────────────────
 * The redirect happens HERE, on the server, so a phone tap never waits for JS,
 * never hydrates, and is not affected by the cookie-consent banner or by
 * whether GA4 loaded. Only the desktop card ships client JS.
 *
 * `force-dynamic` mirrors /download: the response varies by User-Agent, so it
 * must never be cached as a shared redirect — that would send Android users to
 * the App Store.
 *
 * noindex: a redirect surface, not content. Deliberately absent from sitemap.ts.
 */
export const metadata: Metadata = {
  title: "Get the app",
  description: "Download Vialwise for iPhone or Android.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function GetPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawSource = params.src;
  const source = sanitizeSource(
    Array.isArray(rawSource) ? rawSource[0] : rawSource,
  );

  const userAgent = (await headers()).get("user-agent") ?? "";
  const platform = serverPlatformFromUserAgent(userAgent);

  // Mobile never renders anything: straight to the tagged store URL.
  if (platform === "ios") redirect(appStoreUrl(source));
  if (platform === "android") redirect(googlePlayUrl(source));

  // Desktop, unknown, and iPadOS-in-desktop-mode land here. The card resolves
  // the last of those client-side (see GetCard) since no header can.
  return <GetCard source={source} />;
}
