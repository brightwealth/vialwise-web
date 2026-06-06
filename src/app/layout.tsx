import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CookieConsentProvider } from "@/hooks/useCookieConsent";
import { CookieConsent } from "@/components/CookieConsent";
import { AnalyticsLoader } from "@/components/AnalyticsLoader";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getvialwise.com"),
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
  // Site-wide Open Graph fallback (used by routes that don't set their own,
  // e.g. /preview/*). The public pages override this with a per-page og:url via
  // pageMetadata() in src/lib/metadata.ts. No absolute `url` here on purpose —
  // a hard-coded homepage URL would (a) be non-www and (b) wrongly claim the
  // homepage URL on every page.
  openGraph: {
    type: "website",
    title: "Vialwise — Peptide tracking, done right.",
    description:
      "The honest peptide app. Built by someone who actually runs peptides.",
    siteName: "Vialwise",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vialwise — Peptide tracking, done right.",
    description:
      "The honest peptide app. Built by someone who actually runs peptides.",
    images: ["/og-image.png"],
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
        <CookieConsentProvider>
          <AnalyticsLoader />
          {children}
          <CookieConsent />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
