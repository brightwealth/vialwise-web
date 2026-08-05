"use client";

import { useEffect, useRef, useState } from "react";

import { AppIcon } from "@/components/AppIcon";
import { Wordmark } from "@/components/Wordmark";
import { useCookieConsent } from "@/hooks/useCookieConsent";

import { appStoreUrl, googlePlayUrl, isIpadOs } from "./platform";

/**
 * The desktop half of /get: the two-button card, plus the one piece of device
 * detection a server genuinely cannot do.
 *
 * Only reached when the server could not identify the device from its
 * User-Agent — real desktops, unknown clients, and iPadOS requesting a desktop
 * site (which sends a UA byte-identical to a Mac's, so `page.tsx` cannot tell
 * them apart). `isIpadOs()` resolves that last case here, where
 * navigator.maxTouchPoints exists, and forwards to the App Store.
 *
 * ── Analytics: desktop only, and that is deliberate ─────────────────────────
 * The GA4 `app_store_redirect` event fires ONLY on this card. Two reasons:
 *
 *   1. Mobile taps redirect from the server and never execute JS, so there is
 *      nothing to fire and no beacon/callback race to lose. MOBILE TAP COUNTING
 *      IS INTENTIONALLY NOT COLLECTED HERE.
 *   2. Download attribution for mobile comes from the stores instead, which is
 *      better data anyway: Apple `ct=` shows up in App Store Connect → App
 *      Analytics → Campaigns, and the Play `referrer=` utm_source appears in
 *      Play Console acquisition reports. Those count INSTALLS, not taps.
 *
 * GA4 is consent-gated site-wide (see AnalyticsLoader), so `window.gtag` only
 * exists once analytics consent is given. On this card that is a reasonable
 * bet — a desktop visitor has the banner in front of them — and if gtag is
 * absent the event is simply skipped. Nothing here blocks or delays the user.
 */
export function GetCard({ source }: { source: string }) {
  const { analyticsAllowed, hydrated } = useCookieConsent();
  const [redirectingToAppStore, setRedirectingToAppStore] = useState(false);
  const startedRef = useRef(false);

  const appStoreHref = appStoreUrl(source);
  const playHref = googlePlayUrl(source);

  useEffect(() => {
    if (startedRef.current) return;

    // iPadOS: the server saw "Macintosh" and served this card; touch points say
    // otherwise. Forward before anything else runs. `replace` keeps /get out of
    // the back-stack so Back from the store doesn't bounce them here again.
    if (isIpadOs()) {
      startedRef.current = true;
      setRedirectingToAppStore(true);
      window.location.replace(appStoreHref);
      return;
    }

    // Wait for consent to hydrate before deciding whether gtag can exist.
    if (!hydrated) return;
    startedRef.current = true;

    if (!analyticsAllowed) return;
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== "function") return;

    // No beacon transport or fallback timer: this page is not navigating away,
    // so there is no race for the request to lose.
    gtag("event", "app_store_redirect", { platform: "desktop", source });
  }, [hydrated, analyticsAllowed, appStoreHref, source]);

  return (
    // Height accounts for the consent banner's reserved space (globals.css) so
    // the card stays centred in what's actually visible instead of being pushed
    // under the banner or forcing a scrollbar.
    <main className="flex min-h-[calc(100dvh-var(--cookie-banner-height,0px))] flex-col items-center justify-center bg-bone px-6 py-16">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <AppIcon size={84} />
        <Wordmark size={30} className="mt-1 block text-espresso" />

        {redirectingToAppStore ? (
          <p role="status" className="mt-5 text-[15px] leading-relaxed text-graphite">
            Opening the App Store…
          </p>
        ) : (
          <>
            <h1 className="mt-5 text-[26px] font-medium tracking-[-0.025em] text-espresso">
              Get Vialwise
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-graphite">
              The reconstitution calculator and cited peptide library. Free on
              iPhone and Android.
            </p>

            <div className="mt-7 flex w-full flex-col gap-3">
              <a
                href={appStoreHref}
                target="_blank"
                rel="noopener"
                className="rounded-pill bg-amber px-6 py-3.5 text-[15px] font-medium text-bone transition-colors hover:bg-amber-dark"
              >
                Download on the App Store
              </a>
              <a
                href={playHref}
                target="_blank"
                rel="noopener"
                className="rounded-pill bg-forest px-6 py-3.5 text-[15px] font-medium text-bone transition-colors hover:bg-forest-deep"
              >
                Get it on Google Play
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
