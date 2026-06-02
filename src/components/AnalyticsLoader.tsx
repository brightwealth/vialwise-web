'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/hooks/useCookieConsent';

const GA_MEASUREMENT_ID = 'G-XF6GKBT1DW';
const CLARITY_PROJECT_ID = 'wrre3ksj3s';

/**
 * Loads GA4 + Microsoft Clarity scripts — both consent-gated.
 *
 * Per CB-1 in .claude/rules/compliance-hard-rules.md, a GDPR-compliant cookie
 * consent gate must front analytics before any public-launch push. Both GA4 and
 * Clarity now load ONLY after the visitor explicitly accepts (or opts into
 * analytics via Customize):
 *
 *   - Reject / no choice yet → neither GA4 nor Clarity loads; no analytics
 *     cookies set, no GA4 `/collect` hits.
 *   - Accept / analytics-on  → GA4 loads measurement-only
 *     (`allow_google_signals: false`, `allow_ad_personalization_signals: false`)
 *     and Clarity loads.
 *
 * Both are skipped entirely in non-production builds.
 *
 * 2026-06-02: GA4 moved BEHIND consent (Option X, launch-checklist A2). It
 * previously loaded pre-consent as a documented pre-launch-only posture; that
 * gap is now closed for the public launch.
 */
export function AnalyticsLoader() {
  const { analyticsAllowed } = useCookieConsent();
  const isProd = process.env.NODE_ENV === 'production';

  // Gate everything behind production + explicit analytics consent. Before the
  // visitor accepts, neither GA4 nor Clarity loads at all.
  if (!isProd || !analyticsAllowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>

      <Script id="ms-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
        `}
      </Script>
    </>
  );
}
