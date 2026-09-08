import { NextResponse, type NextRequest } from "next/server";
import {
  appStoreUrl,
  googlePlayUrl,
  campaignFromSrc,
  type Campaign,
} from "@/lib/storeLinks";

/**
 * /download — permanent device-aware smart redirect.
 *
 * A printed QR / walking billboard points at getvialwise.com/download, so this
 * path is PERMANENT — never rename or remove it. Server-side (route handler),
 * so the redirect is instant with no client flash.
 *
 * By User-Agent:
 *   - iOS (iPhone/iPad/iPod) → App Store
 *   - Android                → Google Play
 *   - anything else          → the homepage (which shows both store badges)
 *
 * Incoming query params (e.g. ?utm_source=qr&utm_medium=offline) are forwarded
 * to the destination so offline scans stay attributable. The result depends on
 * the request's UA, so it is never cached (302 + no-store) and the route is
 * dynamic — different devices must get different destinations.
 *
 * iPad note: iPadOS Safari defaults to a desktop ("Macintosh") UA, so those
 * scans fall through to the homepage, which offers both store badges. That is
 * the intended graceful fallback, not a bug.
 */

// Tagged as `website` (Andrew, 2026-09-07). These were BARE store URLs, so every
// QR scan that reached a store arrived indistinguishable from organic App Store
// Search — the same defect as the site's download buttons.
//
// ⚠️ CONSEQUENCE, recorded rather than hidden: offline QR scans now count inside
// `website` and are not separable from ordinary site traffic. Splitting them out
// needs its own token; see the note in docs/marketing/campaign-links.md.
// Campaign comes from `?src=`, so a new printed run needs a new URL, not a new
// deploy. `/download` (no src) stays `website`: the codes already in the wild
// have no src to send, and their scans therefore pool into `website` — recorded
// in campaign-links.md so nobody later reads a website number as pure organic.
const HOME_URL = "https://www.getvialwise.com/";

const IOS_RE = /iPhone|iPad|iPod/i;
const ANDROID_RE = /Android/i;

function destinationFor(userAgent: string, campaign: Campaign): string {
  if (IOS_RE.test(userAgent)) return appStoreUrl(campaign);
  if (ANDROID_RE.test(userAgent)) return googlePlayUrl(campaign);
  return HOME_URL;
}

export function GET(request: NextRequest): NextResponse {
  const userAgent = request.headers.get("user-agent") ?? "";
  const campaign = campaignFromSrc(request.nextUrl.searchParams.get("src"));
  const destination = new URL(destinationFor(userAgent, campaign));

  // Forward incoming query params (append, so the Play URL's own ?id= is kept).
  // Attribution keys are NOT forwarded: the destination already carries its own
  // pt/ct/referrer, and appending an inbound copy would put two `ct` values on
  // one URL and make the campaign ambiguous at exactly the moment it is read.
  // `src` is consumed here (it selected the campaign) and must not travel on to
  // the store as a stray param.
  const RESERVED = new Set(["pt", "ct", "mt", "referrer", "src"]);
  request.nextUrl.searchParams.forEach((value, key) => {
    if (RESERVED.has(key)) return;
    destination.searchParams.append(key, value);
  });

  // 302 (not permanent) + no-store: the destination varies by device, so this
  // must never be cached by the browser or a CDN as a shared redirect.
  const response = NextResponse.redirect(destination, 302);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

// Depends on per-request headers — keep it out of any static optimization.
export const dynamic = "force-dynamic";
