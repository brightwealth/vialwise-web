'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/hooks/useCookieConsent';

const GA_MEASUREMENT_ID = 'G-XF6GKBT1DW';
const CLARITY_PROJECT_ID = 'wrre3ksj3s';

/**
 * Loads GA4 + Microsoft Clarity scripts ONLY when:
 * - NODE_ENV is production (no tracking in local dev)
 * - The visitor has consented to analytics (via the cookie banner)
 *
 * If either condition is false, this component renders nothing — no scripts,
 * no cookies, no network calls.
 */
export function AnalyticsLoader() {
  const { analyticsAllowed } = useCookieConsent();
  const isProd = process.env.NODE_ENV === 'production';

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
