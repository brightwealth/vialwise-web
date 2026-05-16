import type { Metadata } from "next";
import Script from "next/script";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/**
 * Analytics IDs — public values, safe to commit (visible in page source
 * once deployed). Gated on NODE_ENV so local dev doesn't pollute prod data.
 *
 * GA4: privacy-hardened with Google Signals + ad personalization disabled.
 * IP anonymization is implicit in GA4 (no anonymize_ip flag needed —
 * GA4 strips IPs server-side before logging).
 *
 * Clarity: sensitive content masked by default per Clarity's project
 * settings (Settings → Setup → Masking).
 *
 * Cookie consent banner is a pre-launch follow-up — see memory
 * `project_marketing_plan_v1.md` task #6. Pre-launch traffic is minimal,
 * so the GDPR risk window is small.
 */
const GA_MEASUREMENT_ID = "G-XF6GKBT1DW";
const CLARITY_PROJECT_ID = "wrre3ksj3s";
const analyticsEnabled = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL("https://getvialwise.com"),
  title: {
    default: "Vialwise — Peptide tracking, done right.",
    template: "%s — Vialwise",
  },
  description:
    "The honest peptide app. Built by someone who actually runs peptides. No vendor partnerships, no hidden upsells, just a calculator that's actually right.",
  applicationName: "Vialwise",
  keywords: [
    "peptide tracker",
    "peptide calculator",
    "reconstitution calculator",
    "GLP-1 tracker",
    "BPC-157",
    "TB-500",
    "semaglutide calculator",
  ],
  openGraph: {
    type: "website",
    title: "Vialwise — Peptide tracking, done right.",
    description:
      "The honest peptide app. Built by someone who actually runs peptides.",
    url: "https://getvialwise.com",
    siteName: "Vialwise",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vialwise — Peptide tracking, done right.",
    description:
      "The honest peptide app. Built by someone who actually runs peptides.",
  },
  icons: {
    icon: "/brand/vialwise-app-icon.svg",
    apple: "/brand/vialwise-app-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bone text-espresso font-sans">
        {analyticsEnabled && (
          <>
            {/* Google Analytics 4. Loads the gtag library, then configures it
                with Google Signals + ad personalization disabled (basic
                pageview + engagement tracking still flows). */}
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

            {/* Microsoft Clarity — heatmaps + session recordings. Sensitive
                content is masked by default per Clarity project settings. */}
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
        )}
        {children}
      </body>
    </html>
  );
}
