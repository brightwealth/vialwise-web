import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Why } from "@/components/Why";
import { Pricing } from "@/components/Pricing";
import { AntiBloat } from "@/components/AntiBloat";
import { FAQ } from "@/components/FAQ";
import { BetaCTA } from "@/components/BetaCTA";
import { Footer } from "@/components/Footer";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    absolute: "VialWise: Peptide Reconstitution Calculator & Library",
  },
  description:
    "Free peptide reconstitution calculator. Forward and reverse BAC water math. 64+ peptides with primary-source citations. Research and educational only.",
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
        "Peptide reconstitution calculator with forward and reverse BAC water math. Library of 64+ peptides with primary-source citations. Research and educational use only.",
      applicationCategory: "HealthApplication",
      operatingSystem: "iOS",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/PreOrder",
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
        "Library of 64+ peptides with primary-source citations",
        "mg/mcg toggle for unit safety",
        "U-100 syringe visualization",
      ],
      softwareVersion: "1.0",
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
            text: "Yes. v1 stores everything locally on your device. v2 (with Pro) syncs encrypted to your account. Health data from Apple Health stays on-device — we never see your raw weight, body fat, or biometrics. We're transparent about every byte.",
          },
        },
        {
          "@type": "Question",
          name: "When does v1 launch?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "App Store submission is targeted for June 2026. TestFlight invites will open before that — join the waitlist below to get an invite when builds are ready, plus a heads-up the day v1 hits the App Store.",
          },
        },
        {
          "@type": "Question",
          name: "What's the difference between Free and Pro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Free gives you the full calculator, the full library, and tracking for one protocol. Pro ($39.99/yr) unlocks unlimited protocols, scheduled reminders, inventory tracking, half-life decay charts, and Apple Health imports. Free stays free, forever, even after Pro launches.",
          },
        },
        {
          "@type": "Question",
          name: "Will there be an Android version?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. iOS ships first, Android follows. The goal is to have both available close to launch — the app is built on React Native so the lift is smaller than a full rebuild.",
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
        <BetaCTA />
      </main>
      <Footer />
    </>
  );
}
