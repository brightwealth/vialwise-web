/**
 * StoreBadges — the App Store + Google Play download pair.
 *
 * Renders both official store badges at a shared height, App Store first and
 * Google Play second, in a flex row that wraps (rather than overflowing) on
 * narrow widths. Both badges keep their own official artwork and links; this
 * wrapper only owns their pairing, order, and spacing so every CTA on the site
 * shows the two together with consistent gap and responsive behavior.
 *
 * While IOS_STORE_LIVE is false (src/lib/storeLinks.ts) the App Store badge is
 * not rendered, and <IosUnavailableNote /> takes its place below the Google
 * Play badge unless the caller shows the note itself (`iosNote={false}`).
 */
import { AppStoreBadge } from "./AppStoreBadge";
import { GooglePlayBadge } from "./GooglePlayBadge";
import { IosUnavailableNote } from "./IosUnavailableNote";

import { IOS_STORE_LIVE, type Campaign } from "@/lib/storeLinks";

interface StoreBadgesProps {
  /** Shared rendered height in px for both badges; defaults to 48. */
  height?: number;
  className?: string;
  /** Install-attribution campaign token; defaults to "website". */
  campaign?: Campaign;
  /** Show the iPhone-unavailable note under the badge while iOS is off. */
  iosNote?: boolean;
  /** Note colors: "dark" on espresso/forest surfaces. */
  noteTone?: "light" | "dark";
}

export function StoreBadges({
  height = 48,
  className,
  campaign = "website",
  iosNote = true,
  noteTone = "light",
}: StoreBadgesProps) {
  const badges = (
    <div
      className={`flex flex-wrap items-center gap-3${className ? ` ${className}` : ""}`}
    >
      {IOS_STORE_LIVE ? <AppStoreBadge height={height} campaign={campaign} /> : null}
      <GooglePlayBadge height={height} campaign={campaign} />
    </div>
  );

  if (IOS_STORE_LIVE || !iosNote) return badges;

  return (
    <div className="flex flex-col items-start gap-3">
      {badges}
      <IosUnavailableNote tone={noteTone} />
    </div>
  );
}
