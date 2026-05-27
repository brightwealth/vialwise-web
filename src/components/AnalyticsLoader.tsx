'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/hooks/useCookieConsent';

const GA_MEASUREMENT_ID = 'G-XF6GKBT1DW';
const CLARITY_PROJECT_ID = 'wrre3ksj3s';

/**
 * Loads GA4 + Microsoft Clarity scripts.
 *
 * - GA4 loads in production regardless of consent, configured with
 *   `allow_google_signals: false` and `allow_ad_personalization_signals: false`
 *   so it is measurement-only (no ad personalization, no signed-in data
 *   integration). Pre-launch traffic policy per CB-1 in
 *   .claude/rules/compliance-hard-rules.md: this site is pre-public-launch
 *   and the GDPR exposure window is minimal. Revisit this gate before any
 *   public launch push.
 *
 * - Microsoft Clarity is session-recording / heatmap-adjacent and stays
 *   consent-gated. It loads only when the visitor has explicitly accepted
 *   the cookie banner.
 *
 * - Both are skipped entirely in non-production builds.
 */
export function AnalyticsLoader() {
  const { analyticsAllowed } = useCookieConsent();
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) return null;

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

      {analyticsAllowed && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      )}
    </>
  );
}
