/**
 * GooglePlayBadge — official Google Play "Get it on Google Play" lockup.
 *
 * Uses Google's official badge artwork (Google Play generic badge, downloaded
 * from Google's badge resources into public/brand/google-play-badge.png) — NOT
 * recolored, rotated, restyled, or distorted, per Google's badge guidelines.
 * The badge's own transparent clear-space margin was trimmed to the artwork
 * bounding box so it pairs tightly with the (equally tight) App Store SVG; the
 * required clear space is supplied by the surrounding layout gap instead, the
 * same way AppStoreBadge is placed. The dark badge suits Vialwise's light
 * cream/bone surfaces and matches the App Store black variant.
 *
 * Mirrors AppStoreBadge's API (height + className) so the two can be dropped in
 * as a pair at a shared height — see StoreBadges.
 */

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.vialwise.app";

// Trimmed official badge artwork aspect ratio (564 x 168 after clear-space trim).
const BADGE_RATIO = 564 / 168;

interface GooglePlayBadgeProps {
  /** Rendered height in px; defaults to 48 to match AppStoreBadge. */
  height?: number;
  className?: string;
}

export function GooglePlayBadge({ height = 48, className }: GooglePlayBadgeProps) {
  const h = height;
  const width = Math.round(h * BADGE_RATIO);

  return (
    <a
      href={GOOGLE_PLAY_URL}
      target="_blank"
      rel="noopener"
      aria-label="Get it on Google Play"
      className={`inline-flex w-fit shrink-0${className ? ` ${className}` : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- official badge lockup, must not be re-processed */}
      <img
        src="/brand/google-play-badge.png"
        alt="Get it on Google Play"
        width={width}
        height={h}
        style={{ height: h, width }}
      />
    </a>
  );
}
