'use client';

import { useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export function CookieConsent() {
  const { shouldShowBanner, acceptAll, rejectAll, customize } = useCookieConsent();
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsToggle, setAnalyticsToggle] = useState(true);

  if (!shouldShowBanner) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-3xl p-3 sm:bottom-4 sm:p-4"
    >
      <div className="rounded-2xl border border-espresso/10 bg-bone p-5 shadow-xl sm:p-6">
        <h2 id="cookie-consent-title" className="text-base font-medium text-espresso">
          Cookies on Vialwise
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-espresso/80">
          We use a couple of analytics tools (Google Analytics + Microsoft Clarity) to understand
          how the site is used. They&apos;re privacy-hardened — no ad personalization, no Google
          Signals, sensitive content masked. You can accept, reject, or customize.{' '}
          <a href="/privacy" className="underline hover:text-espresso">
            Privacy policy
          </a>
          .
        </p>

        {showCustomize && (
          <div className="mt-4 space-y-3 rounded-xl bg-espresso/5 p-4">
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

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {showCustomize ? (
            <button
              type="button"
              onClick={() => customize(analyticsToggle)}
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-bone transition hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
            >
              Save preferences
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="rounded-full px-4 py-2.5 text-sm text-espresso/80 transition hover:bg-espresso/5 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso/20"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="rounded-full border border-espresso/20 px-5 py-2.5 text-sm font-medium text-espresso transition hover:bg-espresso/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso/20"
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-bone transition hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
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
