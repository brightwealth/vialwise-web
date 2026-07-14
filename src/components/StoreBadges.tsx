/**
 * StoreBadges — the App Store + Google Play download pair.
 *
 * Renders both official store badges at a shared height, App Store first and
 * Google Play second, in a flex row that wraps (rather than overflowing) on
 * narrow widths. Both badges keep their own official artwork and links; this
 * wrapper only owns their pairing, order, and spacing so every CTA on the site
 * shows the two together with consistent gap and responsive behavior.
 */
import { AppStoreBadge } from "./AppStoreBadge";
import { GooglePlayBadge } from "./GooglePlayBadge";

interface StoreBadgesProps {
  /** Shared rendered height in px for both badges; defaults to 48. */
  height?: number;
  className?: string;
}

export function StoreBadges({ height = 48, className }: StoreBadgesProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3${className ? ` ${className}` : ""}`}
    >
      <AppStoreBadge height={height} />
      <GooglePlayBadge height={height} />
    </div>
  );
}
