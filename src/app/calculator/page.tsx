import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppStoreBadge } from "@/components/AppStoreBadge";
import { ReconstitutionCalculator } from "@/components/calculator/ReconstitutionCalculator";
import { pageMetadata } from "@/lib/metadata";

const CANONICAL = "https://www.getvialwise.com/calculator";

export const metadata: Metadata = {
  title: {
    absolute: "Peptide Reconstitution Calculator (Free) — VialWise",
  },
  description:
    "Free peptide reconstitution calculator. Enter vial size, BAC water, and target amount to get concentration, draw volume, and U-100 syringe units. Research and educational only.",
  keywords: [
    "peptide reconstitution calculator",
    "peptide calculator",
    "BAC water calculator",
    "reconstitution calculator",
    "U-100 syringe calculator",
    "bacteriostatic water calculator",
  ],
  ...pageMetadata(CANONICAL),
};

// JSON-LD — WebApplication (the free tool) + HowTo (the reconstitution method)
// + BreadcrumbList, in one @graph so Google ingests all three from one parse.
// XSS-scrubbed per the Next.js JSON-LD guide (replace "<" with its unicode
// escape) since the payload is injected via dangerouslySetInnerHTML.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "VialWise Peptide Reconstitution Calculator",
      url: CANONICAL,
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript.",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free forward and reverse peptide reconstitution calculator. Converts vial size, bacteriostatic water, and target amount into concentration, draw volume, and U-100 syringe units. For research and educational purposes only.",
      featureList: [
        "Forward calculator (vial + BAC water + amount → draw size in U-100 units)",
        "Reverse calculator (amount + vial + desired draw → BAC water volume)",
        "mg / mcg amount toggle",
        "Draws per vial and how long a vial lasts",
        "Syringe-overflow and below-precision warnings",
      ],
      author: {
        "@type": "Person",
        name: "Andrew Chavez",
        url: "https://www.getvialwise.com/about",
      },
    },
    {
      "@type": "HowTo",
      name: "How to calculate peptide reconstitution",
      description:
        "Convert a powdered peptide vial and a volume of bacteriostatic water into a measurable draw on a U-100 insulin syringe.",
      step: [
        {
          "@type": "HowToStep",
          name: "Find the concentration",
          text: "Divide the vial size in milligrams by the bacteriostatic water added in milliliters. 30 mg in 3 mL is 10 mg/mL.",
        },
        {
          "@type": "HowToStep",
          name: "Find the draw volume",
          text: "Divide the target amount by the concentration. A 1 mg amount at 10 mg/mL is 0.1 mL.",
        },
        {
          "@type": "HowToStep",
          name: "Convert to syringe units",
          text: "Multiply the draw volume in milliliters by 100, because a U-100 syringe holds 100 units per mL. 0.1 mL is 10 units.",
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.getvialwise.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Reconstitution Calculator",
          item: CANONICAL,
        },
      ],
    },
  ],
};

export default function CalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="flex flex-1 flex-col">
        {/* ── Hero + prominent disclaimer ─────────────────────────────── */}
        <section className="border-b border-espresso/[0.06] bg-cream/40">
          <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-20">
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-dark">
              Free web tool
            </p>
            <h1 className="mt-3 max-w-3xl text-[40px] font-medium leading-[1.05] tracking-display text-espresso md:text-[56px]">
              Peptide reconstitution calculator
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-graphite md:text-[18px]">
              Enter your vial size, bacteriostatic water, and the amount you want
              per draw. The calculator returns the concentration, the draw
              volume, and the draw size in units on a U-100 insulin syringe —
              forward or reverse. The same math that ships in the VialWise app,
              free in your browser.
            </p>

            <DisclaimerBanner className="mt-7" />
          </div>
        </section>

        {/* ── The calculator ──────────────────────────────────────────── */}
        <section id="calculator" className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-16">
          <ReconstitutionCalculator />

          {/* App CTA — App Store badge (the app is live) */}
          <div className="mt-8 flex flex-col items-start gap-3 rounded-3xl border border-espresso/[0.08] bg-bone p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[15px] font-medium text-espresso">
                Want this on your phone, plus a library of 64+ researched peptides?
              </p>
              <p className="mt-1 text-[14px] text-graphite">
                VialWise for iOS pairs the calculator with primary-source-cited
                entries. Free on the App Store.
              </p>
            </div>
            <AppStoreBadge height={48} />
          </div>
        </section>

        {/* ── Educational explainer (SEO) ─────────────────────────────── */}
        <section className="border-t border-espresso/[0.06] bg-cream/30">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 md:px-10 md:py-24">
            <div className="prose-vialwise">
              <h2>How peptide reconstitution math works</h2>
              <p>
                Reconstitution is dissolving a powdered peptide in bacteriostatic
                water so you can measure a precise amount. The math is three
                steps, and the calculator above does all three — but it helps to
                understand what it&rsquo;s doing.
              </p>

              <h3>1. Concentration</h3>
              <p>
                Concentration is how much peptide sits in each milliliter of
                solution. Divide the vial size by the water you added:
              </p>
              <p>
                <strong>concentration (mg/mL) = vial mg ÷ BAC water mL</strong>
              </p>
              <p>
                A 30&nbsp;mg vial reconstituted with 3&nbsp;mL of bacteriostatic
                water is 10&nbsp;mg/mL. Add less water and the same vial gets more
                concentrated; add more and it gets more dilute.
              </p>

              <h3>2. Draw volume</h3>
              <p>
                Once you know the concentration, the volume to draw for a given
                amount is:
              </p>
              <p>
                <strong>draw volume (mL) = target amount ÷ concentration</strong>
              </p>
              <p>
                At 10&nbsp;mg/mL, a 1&nbsp;mg amount is 0.1&nbsp;mL. Amounts are
                often described in micrograms (mcg) in the research literature
                while vials are labeled in milligrams (mg) — 1&nbsp;mg is
                1,000&nbsp;mcg, so the calculator&rsquo;s mg/mcg toggle re-derives
                the draw to keep a decimal-point slip from becoming a 1,000×
                difference.
              </p>

              <h3>3. Syringe units</h3>
              <p>
                Insulin syringes are marked in units, not milliliters. A U-100
                syringe holds 100 units per milliliter, so:
              </p>
              <p>
                <strong>units on a U-100 syringe = draw volume mL × 100</strong>
              </p>
              <p>
                That 0.1&nbsp;mL draw is 10 units. The calculator rounds to whole
                units (you can&rsquo;t measure 16.67 units on a standard syringe)
                and flags draws that are too small to measure accurately or too
                large to fit a single syringe.
              </p>

              <h3>Working backward</h3>
              <p>
                The reverse mode solves the other direction: pick the draw size
                you&rsquo;d like to measure — say a clean 10 units — and the
                calculator tells you how much bacteriostatic water to add so that
                draw delivers your target amount.
              </p>

              <hr />

              <p>
                VialWise keeps the calculator{" "}
                <Link href="/#features">paired with a peptide library</Link> of
                64+ entries, each with primary-source citations, in the iOS app.
                You can read more{" "}
                <Link href="/about">about why it exists</Link>, or{" "}
                <a
                  href="https://apps.apple.com/app/id6774017323"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  download it on the App Store
                </a>
                . For research and educational purposes only.
              </p>
            </div>
          </div>
        </section>

        {/* ── Library tease + App Store download ──────────────────────── */}
        <section className="relative overflow-hidden bg-bone py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="relative overflow-hidden rounded-[40px] bg-espresso px-8 py-14 text-bone md:px-16 md:py-20">
              <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-light">
                    The app does more
                  </p>
                  <h2 className="mt-4 text-[32px] font-medium leading-tight tracking-headline md:text-[42px]">
                    A calculator and a cited library, in your pocket.
                  </h2>
                  <p className="mt-4 max-w-md text-[16px] leading-relaxed text-bone/75 md:text-[17px]">
                    The web calculator is the math. The VialWise iOS app adds a
                    library of 64+ peptides with primary-source citations, a
                    visual syringe, and reconstitution tables rendered by this
                    same engine. Free on the App Store.
                  </p>
                </div>

                <div className="flex md:justify-end">
                  <AppStoreBadge height={52} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/**
 * Prominent research/educational disclaimer — the same line the app shows on
 * every dose-related view. Amber strip so it reads as a first-class part of the
 * page, not fine print.
 */
function DisclaimerBanner({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={`rounded-2xl border border-amber-dark/30 bg-amber-dark/[0.07] px-5 py-4 ${className ?? ""}`}
    >
      <p className="text-[14px] leading-relaxed text-espresso">
        <span className="font-medium text-amber-deep">
          For research and educational purposes only.
        </span>{" "}
        Not for medical use. This tool does not provide medical advice.
      </p>
    </div>
  );
}
