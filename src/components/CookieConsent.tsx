'use client';

import { useEffect, useRef, useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

/**
 * CSS custom property holding this banner's measured height while it is on
 * screen. `body` reserves exactly that much bottom padding (see globals.css),
 * which is what stops a position:fixed banner from covering page content.
 *
 * Measured rather than hard-coded on purpose: the banner's height changes with
 * viewport width (the action buttons stack below `sm`), with text wrapping, and
 * when the "Customize" panel expands. A magic number would be wrong at some
 * width; a measured value is correct at every width.
 */
const HEIGHT_VAR = '--cookie-banner-height';

export function CookieConsent() {
  const { shouldShowBanner, acceptAll, rejectAll, customize } = useCookieConsent();
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsToggle, setAnalyticsToggle] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Publish the banner's live height to the document so `body` can reserve room
  // for it. Runs before the early return below so hook order stays stable.
  useEffect(() => {
    const root = document.documentElement;
    const clear = () => {
      root.style.removeProperty(HEIGHT_VAR);
      // Removing the attribute restores normal document scrolling; the CSS that
      // shortens the content area is scoped to it.
      delete root.dataset.cookieBanner;
    };

    if (!shouldShowBanner) {
      clear();
      return;
    }
    const el = bannerRef.current;
    if (!el) return;

    const publish = () =>
      root.style.setProperty(HEIGHT_VAR, `${Math.ceil(el.getBoundingClientRect().height)}px`);
    publish();
    root.dataset.cookieBanner = "visible";

    // Tracks the Customize panel opening, text re-wrapping, and orientation or
    // viewport changes — so the reserved space never goes stale.
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      clear();
    };
  }, [shouldShowBanner]);

  if (!shouldShowBanner) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      // pb uses max(…, safe-area-inset-bottom) so the card clears the iOS home
      // indicator instead of sitting under it.
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-3xl p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-4 sm:p-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="rounded-2xl border border-espresso/10 bg-bone p-4 shadow-xl sm:p-6">
        <h2
          id="cookie-consent-title"
          className="text-[15px] font-medium text-espresso sm:text-base"
        >
          Cookies on Vialwise
        </h2>
        {/* The second sentence is desktop-only. At phone widths it pushed the
            banner past half the viewport, which shoved the page's own CTA below
            the fold; the first sentence plus the Privacy policy link still names
            the tools, the purpose, and where the detail lives. Desktop copy is
            unchanged. */}
        <p className="mt-1.5 text-[13px] leading-snug text-espresso/80 sm:mt-2 sm:text-sm sm:leading-relaxed">
          {/* Phone copy: one short sentence. It still names both tools and the
              purpose, and the Privacy policy link below carries the detail. */}
          <span className="sm:hidden">
            Google Analytics and Microsoft Clarity help us see how the site is used.
          </span>
          {/* Desktop copy: unchanged from before this pass. */}
          <span className="hidden sm:inline">
            We use a couple of analytics tools (Google Analytics + Microsoft Clarity) to understand
            how the site is used. They&apos;re privacy-hardened — no ad personalization, no Google
            Signals, sensitive content masked. You can accept, reject, or customize.
          </span>{' '}
          <a href="/privacy" className="underline hover:text-espresso">
            Privacy policy
          </a>
          .
        </p>

        {showCustomize && (
          <div className="mt-3 space-y-3 rounded-xl bg-espresso/5 p-3 sm:mt-4 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-espresso">Necessary</p>
                <p className="mt-0.5 text-xs text-espresso/70">
                  Required for the site to function (e.g., this consent choice). Always on.
                </p>
              </div>
              <span className="rounded-md bg-espresso/10 px-2 py-1 text-xs font-medium text-espresso/60">
                Always on
              </span>
            </div>

            <div className="flex items-start justify-between gap-3 border-t border-espresso/10 pt-3">
              <div>
                <p className="text-sm font-medium text-espresso">Analytics</p>
                <p className="mt-0.5 text-xs text-espresso/70">
                  GA4 + Microsoft Clarity. Helps us understand what&apos;s working without selling
                  data or tracking you across sites.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={analyticsToggle}
                  onChange={(e) => setAnalyticsToggle(e.target.checked)}
                  aria-label="Enable analytics cookies"
                />
                <div className="h-6 w-11 rounded-full bg-espresso/20 transition-colors peer-checked:bg-forest peer-focus-visible:ring-2 peer-focus-visible:ring-forest/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bone" />
                <div className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-bone shadow transition-transform peer-checked:translate-x-5" />
              </label>
            </div>
          </div>
        )}

        {/* A ROW at every width. Stacking three full-width pills on mobile was
            most of the banner's height. `flex-wrap` is the safety valve: if the
            three controls ever can't fit a narrow line they wrap instead of
            overflowing, so nothing becomes unreachable. */}
        <div className="mt-3 flex flex-row flex-wrap items-center justify-end gap-2 sm:mt-5">
          {showCustomize ? (
            <button
              type="button"
              onClick={() => customize(analyticsToggle)}
              className="rounded-full bg-forest px-4 py-2 text-sm sm:px-5 sm:py-2.5 font-medium text-bone transition hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
            >
              Save preferences
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="rounded-full px-3 py-2 text-sm sm:px-4 sm:py-2.5 text-espresso/80 transition hover:bg-espresso/5 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso/20"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="rounded-full border border-espresso/20 px-4 py-2 text-sm sm:px-5 sm:py-2.5 font-medium text-espresso transition hover:bg-espresso/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso/20"
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full bg-forest px-4 py-2 text-sm sm:px-5 sm:py-2.5 font-medium text-bone transition hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
              >
                Accept all
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
