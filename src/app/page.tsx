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
import { FAQS } from "@/lib/faq";
import { IOS_STORE_LIVE } from "@/lib/storeLinks";

export const metadata: Metadata = {
  title: {
    absolute: "VialWise: Peptide Reconstitution Calculator & Library",
  },
  description:
    "Free peptide reconstitution calculator. Forward and reverse BAC water math. 90+ peptides with primary-source citations. Pro adds a one-time protocol tracker. Research and educational only.",
  ...pageMetadata("https://www.getvialwise.com"),
};

// JSON-LD structured data — SoftwareApplication + FAQPage + Organization on a
// single @graph block so Google can ingest all three from one parse.
// The FAQ entries are built from src/lib/faq.ts, the same list FAQ.tsx renders,
// so they match the visible Q&A byte for byte (Google's structured-data
// guidelines require visible/schema parity).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "VialWise",
      description:
        "Peptide reconstitution calculator with forward and reverse BAC water math, a library of 90+ peptides with primary-source citations, and a one-time Pro protocol-tracking suite. Research and educational use only.",
      applicationCategory: "HealthApplication",
      operatingSystem: IOS_STORE_LIVE ? "iOS, Android" : "Android",
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
        "Library of 90+ peptides with primary-source citations",
        "mg/mcg toggle for unit safety",
        "U-100 syringe visualization",
        "Protocol tracking suite (Pro): dose log, body map, journal, weekly recap, vial inventory, PDF export",
      ],
      softwareVersion: "2.0",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
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
      // The channels we actually publish on. TikTok was dropped 2026-09-08:
      // the channel is INACTIVE per .claude/rules/posting-channels.md PC-1 and
      // pointing a crawler at a dormant profile is a weak entity signal, not a
      // strong one. YouTube added — it has been a live channel since 2026-08-26
      // and was never listed.
      sameAs: [
        "https://x.com/VialWiseApp",
        "https://www.instagram.com/vialwise",
        "https://www.youtube.com/@VialWise",
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
