/**
 * AppStoreBadge — official Apple "Download on the App Store" lockup.
 *
 * Uses Apple's official badge artwork (downloaded from Apple's Marketing
 * Resources, public/brand/app-store-badge-black.svg) — NOT recolored,
 * rotated, restyled, or cropped, per Apple's badge guidelines. The black
 * variant is used for best contrast on Vialwise's light cream/bone surfaces.
 *
 * Gating: rendered only when NEXT_PUBLIC_APP_LIVE is on (default OFF), so we
 * never ship a dead App Store link before launch. Andrew flips the flag in
 * Vercel (production env) at the moment he clicks "release" in App Store
 * Connect; callers guard their own layout with the exported APP_LIVE.
 *
 * Guideline compliance:
 *  - Minimum height clamped to Apple's 40px floor.
 *  - Aspect ratio preserved from the official viewBox (no distortion).
 *  - Clear space: surrounding layout gaps (>=12px) exceed Apple's minimum
 *    clear space of 1/10 the badge height for every placement here.
 */

const APP_STORE_URL = "https://apps.apple.com/app/id6774017323";

/** Build-time launch flag. OFF unless NEXT_PUBLIC_APP_LIVE is "true" or "1". */
export const APP_LIVE =
  process.env.NEXT_PUBLIC_APP_LIVE === "true" ||
  process.env.NEXT_PUBLIC_APP_LIVE === "1";

// Official badge artwork aspect ratio (SVG viewBox 119.66407 x 40).
const BADGE_RATIO = 119.66407 / 40;

interface AppStoreBadgeProps {
  /** Rendered height in px. Apple minimum is 40; defaults to 48. */
  height?: number;
  className?: string;
}

export function AppStoreBadge({ height = 48, className }: AppStoreBadgeProps) {
  const h = Math.max(40, height); // never below Apple's 40px minimum
  const width = Math.round(h * BADGE_RATIO);

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener"
      aria-label="Download Vialwise on the App Store"
      className={`inline-flex w-fit shrink-0${className ? ` ${className}` : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- official SVG lockup, must not be re-processed */}
      <img
        src="/brand/app-store-badge-black.svg"
        alt="Download on the App Store"
        width={width}
        height={h}
        style={{ height: h, width }}
      />
    </a>
  );
}
