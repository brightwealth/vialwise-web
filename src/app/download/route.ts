import { NextResponse, type NextRequest } from "next/server";

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

const APP_STORE_URL = "https://apps.apple.com/app/id6774017323";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.vialwise.app";
const HOME_URL = "https://www.getvialwise.com/";

const IOS_RE = /iPhone|iPad|iPod/i;
const ANDROID_RE = /Android/i;

function destinationFor(userAgent: string): string {
  if (IOS_RE.test(userAgent)) return APP_STORE_URL;
  if (ANDROID_RE.test(userAgent)) return GOOGLE_PLAY_URL;
  return HOME_URL;
}

export function GET(request: NextRequest): NextResponse {
  const userAgent = request.headers.get("user-agent") ?? "";
  const destination = new URL(destinationFor(userAgent));

  // Forward incoming query params (append, so the Play URL's own ?id= is kept).
  request.nextUrl.searchParams.forEach((value, key) => {
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
