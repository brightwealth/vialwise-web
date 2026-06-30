import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Why } from "@/components/Why";
import { Pricing } from "@/components/Pricing";
import { AntiBloat } from "@/components/AntiBloat";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    absolute: "VialWise: Peptide Reconstitution Calculator & Library",
  },
  description:
    "Free peptide reconstitution calculator. Forward and reverse BAC water math. 69 peptides with primary-source citations. Pro adds a one-time protocol tracker. Research and educational only.",
  ...pageMetadata("https://www.getvialwise.com"),
};

// JSON-LD structured data — SoftwareApplication + FAQPage + Organization on a
// single @graph block so Google can ingest all three from one parse.
// The FAQ entries below must match the visible Q&A in src/components/FAQ.tsx
// verbatim — Google's structured-data guidelines require visible/schema parity.
// When the live FAQ copy changes, update this list.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "VialWise",
      description:
        "Peptide reconstitution calculator with forward and reverse BAC water math, a library of 69 peptides with primary-source citations, and a one-time Pro protocol-tracking suite. Research and educational use only.",
      applicationCategory: "HealthApplication",
      operatingSystem: "iOS",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      url: "https://www.getvialwise.com",
      author: {
        "@type": "Person",
        name: "Andrew Chavez",
        url: "https://www.getvialwise.com/about",
      },
      featureList: [
        "Forward reconstitution calculator (vial + BAC water + dose → draw size)",
        "Reverse reconstitution calculator (dose + vial + desired draw → BAC water volume)",
        "Library of 69 peptides with primary-source citations",
        "mg/mcg toggle for unit safety",
        "U-100 syringe visualization",
        "Protocol tracking suite (Pro): dose log, body map, weekly recap, vial inventory, BID/TID, PDF export",
      ],
      softwareVersion: "2.0",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is this medical advice?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Vialwise is a calculator and a tracker. It doesn't tell you which peptide to take, what dose to run, or whether peptides are right for you. Talk to a doctor for that. We help you do the math correctly once you've already decided.",
          },
        },
        {
          "@type": "Question",
          name: "Do you partner with peptide vendors?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, and we never will. There's a real conflict of interest in being both 'the app that tells you you need more' and 'the app that gets paid when you buy more.' We picked a side.",
          },
        },
        {
          "@type": "Question",
          name: "What peptides does it support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Any peptide you can reconstitute. Semaglutide, tirzepatide, BPC-157, TB-500, ipamorelin, CJC-1295, retatrutide, MOTS-c — the calculator doesn't care about brand names. It cares about mg per vial, mL of BAC water, and dose target.",
          },
        },
        {
          "@type": "Question",
          name: "Is my data private?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Everything you enter — peptides, doses, protocols, and your dose log — stays on your device. The app collects no personal data and transmits nothing to a server; Apple's privacy label is \"Data Not Collected.\" We never see your data.",
          },
        },
        {
          "@type": "Question",
          name: "Is VialWise available yet?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. VialWise is on the App Store for iPhone. The forward and reverse calculator and the 69-peptide cited library are free; Pro adds the full tracking suite as a one-time purchase. Android is on the way.",
          },
        },
        {
          "@type": "Question",
          name: "What's the difference between Free and Pro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Free gives you the full forward and reverse calculator, the 69-peptide cited library, and tracking for one protocol. Pro is a one-time $44.99 purchase that unlocks unlimited saved protocols plus the full tracking suite: dose log, body map for site rotation, weekly recap, vial inventory with days of supply, BID/TID dosing, and PDF export. Free stays free, forever, even after you buy Pro.",
          },
        },
        {
          "@type": "Question",
          name: "Is Pro a subscription?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No — one-time. Pro is a single $44.99 purchase through the App Store. You buy it once and keep it: no recurring billing, no auto-renew, nothing to cancel.",
          },
        },
        {
          "@type": "Question",
          name: "Will there be an Android version?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. iOS is available now; Android is on the way. The app is built on React Native, so the lift is smaller than a full rebuild.",
          },
        },
      ],
    },
    {
      "@type": "Organization",
      name: "VialWise",
      url: "https://www.getvialwise.com",
      // Square raster logo (512x512) — required by Google's Organization rich
      // result. Asset: public/logo-512.png (rasterized from the app-icon SVG).
      logo: "https://www.getvialwise.com/logo-512.png",
      founder: {
        "@type": "Person",
        name: "Andrew Chavez",
      },
      sameAs: [
        "https://twitter.com/VialWiseApp",
        "https://www.instagram.com/vialwise",
        "https://www.tiktok.com/@vialwise",
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Features />
        <Why />
        <Pricing />
        <AntiBloat />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
