import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

const CANONICAL = "https://www.getvialwise.com/guides/bacteriostatic-water";

export const metadata: Metadata = {
  title: {
    absolute: "Bacteriostatic Water for Peptides — Research Guide",
  },
  description:
    "Bacteriostatic water (BAC water) is the standard solvent for reconstituting research peptides. Learn what it is, how it works, and how to use it safely.",
  ...pageMetadata(CANONICAL),
};

// JSON-LD: Article + FAQPage on one @graph block. FAQ answers mirror the visible
// page copy — Google's structured-data guidelines require schema/visible parity.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "What Is Bacteriostatic Water for Peptides?",
      description:
        "What bacteriostatic water is, why it is the standard solvent for reconstituting research peptides, and how it differs from sterile water.",
      mainEntityOfPage: CANONICAL,
      url: CANONICAL,
      image: "https://www.getvialwise.com/og-image.png",
      datePublished: "2026-06-15",
      author: {
        "@type": "Person",
        name: "Andrew Chavez",
        url: "https://www.getvialwise.com/about",
      },
      publisher: {
        "@type": "Organization",
        name: "VialWise",
        logo: {
          "@type": "ImageObject",
          url: "https://www.getvialwise.com/logo-512.png",
        },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Can bacteriostatic water be injected on its own?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Published drug labeling describes bacteriostatic water as a diluent intended to be combined with a medication before administration, not as a standalone injectable, and it notes limits on benzyl alcohol exposure. Questions about administration fall outside the scope of this educational reference. This page covers only what the solvent is and how it is used to reconstitute a powder.",
          },
        },
        {
          "@type": "Question",
          name: "Where can I source bacteriostatic water for research?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bacteriostatic water is a standard pharmacy item. VialWise does not recommend or endorse any specific vendor or source.",
          },
        },
        {
          "@type": "Question",
          name: "How long does a reconstituted peptide last in bacteriostatic water?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The preservative supports a multi-day window, commonly cited in the peptide-stability literature as up to 28 days refrigerated, but the stability of the specific peptide is usually the real limit. Storage characteristics vary by compound, so check the figure for the compound you are studying rather than assuming a single number applies to all.",
          },
        },
        {
          "@type": "Question",
          name: "Is bacteriostatic water the same as saline?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Saline is water with sodium chloride added and is isotonic. Bacteriostatic water has no salt; it is sterile water with benzyl alcohol as a preservative. They are not interchangeable.",
          },
        },
      ],
    },
  ],
};

export default function BacteriostaticWaterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageShell
        eyebrow="Guide"
        title="What Is Bacteriostatic Water for Peptides?"
        intro="The standard solvent for reconstituting research peptides — what it is, why it is used, and how it differs from plain sterile water."
      >
        <p className="rounded-lg border border-amber/20 bg-cream/40 px-4 py-3 text-[14px] italic text-graphite">
          For research and educational purposes only. This page explains what
          bacteriostatic water is and how it is used as a solvent. It is not medical
          advice and does not recommend any dose, protocol, or product.
        </p>

        <p>
          Bacteriostatic water is the solvent most commonly described in the research
          literature for reconstituting lyophilized (freeze-dried) peptides. If you
          have a vial of dry peptide powder and need to turn it into a measured liquid
          you can draw into a syringe, bacteriostatic water is usually the diluent
          involved. This guide explains what it is, why it is used, and how it differs
          from plain sterile water, so you can understand the material before you
          reconstitute anything.
        </p>

        <h2>What is bacteriostatic water?</h2>
        <p>
          Bacteriostatic water is sterile water that contains a small amount of benzyl
          alcohol, typically 0.9%, added as a preservative. Per published FDA drug
          labeling for{" "}
          <a
            href="https://www.accessdata.fda.gov/scripts/cder/daf/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bacteriostatic Water for Injection, USP
          </a>
          , the benzyl alcohol is what makes the water &ldquo;bacteriostatic&rdquo;:
          it inhibits the growth of bacteria, which is what allows a vial to be entered
          more than once over a period of days rather than being discarded immediately
          after a single use.
        </p>
        <p>
          That single property, multi-use stability, is the entire reason it matters
          for peptide work. A reconstituted peptide vial is rarely used all at once.
          Bacteriostatic water lets the same vial be drawn from repeatedly while
          limiting microbial growth between uses.
        </p>

        <h2>Why bacteriostatic water for peptide reconstitution?</h2>

        <h3>Multi-dose stability</h3>
        <p>
          Because the benzyl alcohol suppresses bacterial growth, a vial reconstituted
          with bacteriostatic water can typically be stored and re-entered for a period
          after opening. The figure commonly cited in the peptide-stability literature
          is up to 28 days when refrigerated, though the peptide itself, not the water,
          is usually the limiting factor for how long a reconstituted vial remains
          stable. You can look up storage characteristics for a specific compound in
          the <Link href="/about">VialWise library</Link>.
        </p>

        <h3>Benzyl alcohol as a preservative</h3>
        <p>
          Benzyl alcohol is a long-established preservative in injectable diluents. Its
          presence is the difference between a single-use solvent and one that supports
          a multi-use vial. The published literature on peptide and protein stability
          describes how storage conditions, including the choice of solvent and
          temperature, affect how long a reconstituted compound holds its integrity.
        </p>

        <h2>Bacteriostatic water vs. sterile water for peptides</h2>
        <p>
          The two are easy to confuse. The practical difference comes down to the
          preservative.
        </p>

        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="border-b border-espresso/15 text-left">
                <th className="py-2 pr-4 font-medium text-espresso"></th>
                <th className="py-2 pr-4 font-medium text-espresso">
                  Bacteriostatic water
                </th>
                <th className="py-2 font-medium text-espresso">Sterile water</th>
              </tr>
            </thead>
            <tbody className="text-graphite">
              <tr className="border-b border-espresso/10">
                <td className="py-2 pr-4 font-medium text-espresso">
                  Contains preservative
                </td>
                <td className="py-2 pr-4">Yes (0.9% benzyl alcohol)</td>
                <td className="py-2">No</td>
              </tr>
              <tr className="border-b border-espresso/10">
                <td className="py-2 pr-4 font-medium text-espresso">Typical use</td>
                <td className="py-2 pr-4">
                  Multi-use vials, reconstitution over days
                </td>
                <td className="py-2">Single-use, discard after one entry</td>
              </tr>
              <tr className="border-b border-espresso/10">
                <td className="py-2 pr-4 font-medium text-espresso">
                  Re-entry over time
                </td>
                <td className="py-2 pr-4">Supported</td>
                <td className="py-2">Not intended</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-espresso">
                  Where it is described
                </td>
                <td className="py-2 pr-4">
                  Standard for research peptide reconstitution
                </td>
                <td className="py-2">Used where a preservative is unwanted</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Sterile water is simply water with nothing added. It is appropriate where a
          single use is intended or where benzyl alcohol must be avoided for a specific
          reason described in the relevant labeling. For the multi-use reconstitution
          pattern most peptide research follows, bacteriostatic water is the solvent
          the literature describes.
        </p>

        <h2>How to use bacteriostatic water to reconstitute peptides</h2>
        <p>
          The short version: you add a measured volume of bacteriostatic water to the
          peptide vial, which dissolves the powder into a known concentration, and then
          you draw a measured amount on a U-100 syringe. The exact volume to add
          depends on your vial size and the concentration you want, which is a
          calculation, not a fixed number.
        </p>
        <p>
          This guide deliberately does not tell you &ldquo;add X mL.&rdquo; The correct
          volume is derived from your own inputs. You can work it out with the{" "}
          <Link href="/calculator">VialWise calculator</Link>, which takes your vial
          size and target concentration and returns the water volume and the resulting
          draw in syringe units. A full{" "}
          <Link href="/guides/how-to-reconstitute-peptides">
            step-by-step reconstitution walkthrough
          </Link>{" "}
          is available in the VialWise guides.
        </p>

        <h2>Frequently asked questions</h2>

        <h3>Can bacteriostatic water be injected on its own?</h3>
        <p>
          Published drug labeling describes bacteriostatic water as a diluent intended
          to be combined with a medication before administration, not as a standalone
          injectable, and it notes limits on benzyl alcohol exposure. Questions about
          administration fall outside the scope of this educational reference. This
          page covers only what the solvent is and how it is used to reconstitute a
          powder.
        </p>

        <h3>Where can I source bacteriostatic water for research?</h3>
        <p>
          Bacteriostatic water is a standard pharmacy item. VialWise does not recommend
          or endorse any specific vendor or source.
        </p>

        <h3>How long does a reconstituted peptide last in bacteriostatic water?</h3>
        <p>
          The preservative supports a multi-day window, commonly cited in the
          peptide-stability literature as up to 28 days refrigerated, but the stability
          of the specific peptide is usually the real limit. Storage characteristics
          vary by compound, so check the figure for the compound you are studying
          rather than assuming a single number applies to all.
        </p>

        <h3>Is bacteriostatic water the same as saline?</h3>
        <p>
          No. Saline is water with sodium chloride added and is isotonic.
          Bacteriostatic water has no salt; it is sterile water with benzyl alcohol as
          a preservative. They are not interchangeable.
        </p>

        <hr />

        <p className="text-[13px] text-graphite/70">
          VialWise is a peptide research and education tool. The calculator and library
          are provided for research and educational purposes only and are not a
          substitute for professional advice. Learn more{" "}
          <Link href="/about">about VialWise</Link> or open the{" "}
          <Link href="/calculator">reconstitution calculator</Link>.
        </p>
      </PageShell>
    </>
  );
}
