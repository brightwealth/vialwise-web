import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

const CANONICAL = "https://www.getvialwise.com/guides/how-to-reconstitute-peptides";

export const metadata: Metadata = {
  title: {
    absolute: "How to Reconstitute Peptides — Step-by-Step Guide",
  },
  description:
    "Reconstitute peptides accurately with BAC water. Covers concentration math, syringe units, and storage best practices. Research and educational only.",
  ...pageMetadata(CANONICAL),
};

// JSON-LD: Article + HowTo + FAQPage on one @graph block. The HowTo steps and
// FAQ answers mirror the visible page copy — Google's structured-data
// guidelines require schema/visible parity.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Reconstitute Peptides with Bacteriostatic Water",
      description:
        "A research-and-educational guide to the peptide reconstitution procedure and the concentration math behind it.",
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
      "@type": "HowTo",
      name: "How to Reconstitute Peptides with Bacteriostatic Water",
      description:
        "The step-by-step procedure for dissolving a lyophilized peptide in bacteriostatic water to a known concentration and calculating the draw.",
      step: [
        {
          "@type": "HowToStep",
          name: "Calculate how much BAC water to add",
          text: "The volume of water you add sets the concentration, which sets how many units each draw will be. Enter your vial size and target concentration into the VialWise calculator in forward mode to get the exact water volume.",
        },
        {
          "@type": "HowToStep",
          name: "Prepare your work surface",
          text: "Wipe the work area, wash your hands, and swab the rubber stopper on both the peptide vial and the bacteriostatic water vial. Let the alcohol dry.",
        },
        {
          "@type": "HowToStep",
          name: "Add BAC water to the vial correctly",
          text: "Draw the calculated volume of bacteriostatic water and add it to the peptide vial slowly, aiming the stream against the inside glass wall rather than directly onto the powder. Do not shake; swirl gently if needed.",
        },
        {
          "@type": "HowToStep",
          name: "Confirm your concentration",
          text: "Once the powder has fully dissolved the solution should be clear. Concentration is the amount of peptide divided by the volume of water added; the calculator displays it for you.",
        },
        {
          "@type": "HowToStep",
          name: "Calculate your draw in U-100 units",
          text: "Enter your concentration and target amount into the calculator in reverse mode to get the draw in U-100 syringe units, instead of doing the arithmetic by hand.",
        },
        {
          "@type": "HowToStep",
          name: "Store the reconstituted vial",
          text: "Store the vial refrigerated and protected from light. The preservative supports a multi-day window, but the peptide itself is usually the real limit; check the figure for the specific compound.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is bacteriostatic water?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sterile water with about 0.9% benzyl alcohol added as a preservative, which inhibits bacterial growth and allows a vial to be used more than once over several days.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use sterile water instead of bacteriostatic water?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Plain sterile water has no preservative and is intended for single use. For a multi-use vial reconstituted over several days, the literature describes bacteriostatic water as the standard solvent.",
          },
        },
        {
          "@type": "Question",
          name: "How long does a reconstituted peptide last?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The preservative supports a multi-day window, commonly cited in the peptide-stability literature as up to 28 days refrigerated, but the stability of the specific peptide is usually the limiting factor. Check the figure for the compound you are studying.",
          },
        },
        {
          "@type": "Question",
          name: "What syringe should I use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A U-100 insulin syringe. Its unit markings are what the reverse calculation gives you a draw against.",
          },
        },
        {
          "@type": "Question",
          name: "Is this medical advice?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. This is a research-and-educational reference covering the reconstitution procedure and the math. It does not recommend any dose, compound, or protocol.",
          },
        },
      ],
    },
  ],
};

export default function HowToReconstitutePeptidesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageShell
        eyebrow="Guide"
        title="How to Reconstitute Peptides with Bacteriostatic Water"
        intro="The full procedure and the concentration math behind it — how much bacteriostatic water to add, and how many units to draw."
      >
        <p className="rounded-lg border border-amber/20 bg-cream/40 px-4 py-3 text-[14px] italic text-graphite">
          For research and educational purposes only. This guide explains the
          procedure and the math behind peptide reconstitution. It is not medical
          advice and does not recommend any dose, compound, or protocol. Verify
          every figure with the <Link href="/calculator">VialWise calculator</Link>.
        </p>

        <p>
          Research peptides ship as a dry, freeze-dried powder. Before that powder
          can be measured into a syringe, it has to be dissolved into a liquid of a
          known strength. That step is called reconstitution, and the math behind it
          is where most errors happen. This guide walks through the full procedure
          and explains how to calculate the two numbers that matter: how much
          bacteriostatic water to add, and how many units to draw.
        </p>

        <h2>What is peptide reconstitution?</h2>
        <p>
          Reconstitution is the process of dissolving a lyophilized (freeze-dried)
          peptide in a measured volume of liquid to produce a solution at a known
          concentration. Once you know the concentration, you can convert any target
          amount into a precise draw on a syringe.
        </p>

        <h3>Why lyophilized (freeze-dried) peptides need reconstitution</h3>
        <p>
          Peptides are fragile. Freeze-drying removes the water so the compound stays
          stable in storage and transport. That is why the vial arrives as a powder
          or a thin film at the bottom. The trade-off is that a dry powder cannot be
          measured accurately, so you reconstitute it into a liquid before anything
          else.
        </p>

        <h3>Bacteriostatic water vs. sterile water — which to use</h3>
        <p>
          The solvent the research literature most often describes is bacteriostatic
          water: sterile water with about 0.9% benzyl alcohol added as a
          preservative, per published{" "}
          <a
            href="https://www.accessdata.fda.gov/scripts/cder/daf/"
            target="_blank"
            rel="noopener noreferrer"
          >
            FDA drug labeling for Bacteriostatic Water for Injection, USP
          </a>
          . The preservative is what lets a vial be entered more than once over a
          period of days. Plain sterile water has no preservative and is intended for
          single use. For the multi-use pattern most peptide research follows,
          bacteriostatic water is the standard choice. For a deeper look at the
          solvent itself, see{" "}
          <Link href="/guides/bacteriostatic-water">
            what bacteriostatic water is
          </Link>
          .
        </p>

        <h2>What you need before you start</h2>
        <h3>Equipment checklist</h3>
        <ul>
          <li>The lyophilized peptide vial</li>
          <li>Bacteriostatic water</li>
          <li>
            A U-100 insulin syringe (the unit markings are what you will read your
            draw against)
          </li>
          <li>Alcohol swabs for the vial stoppers and your work surface</li>
          <li>A clean, flat work area</li>
        </ul>
        <p>
          Verify the seal on the bacteriostatic water before you begin. Sterility
          starts at the first puncture.
        </p>

        <h2>Step-by-step reconstitution protocol</h2>

        <h3>Step 1 — Calculate how much BAC water to add</h3>
        <p>
          This is the decision that sets everything downstream. The volume of water
          you add determines the concentration, and the concentration determines how
          many units each draw will be. There is no single correct volume; it depends
          on the vial size and the concentration you want to work at. Rather than
          guess, enter your vial size and target concentration into the{" "}
          <Link href="/calculator">VialWise calculator</Link> in forward mode and it
          returns the exact water volume. The guide explains the math; the calculator
          does the calculation.
        </p>

        <h3>Step 2 — Prepare your work surface</h3>
        <p>
          Wipe the work area, wash your hands, and swab the rubber stopper on both the
          peptide vial and the bacteriostatic water vial. Let the alcohol dry.
          Cleanliness here is what protects the multi-day window the preservative
          gives you.
        </p>

        <h3>Step 3 — Add BAC water to the vial correctly</h3>
        <p>
          Draw the calculated volume of bacteriostatic water into the syringe, then
          add it to the peptide vial slowly. Aim the stream against the inside glass
          wall, not directly onto the powder. Peptides can denature under mechanical
          stress, so let the water run down the side rather than blasting the powder.
          Do not shake. If the powder does not dissolve on its own, swirl gently and
          let it sit.
        </p>

        <h3>Step 4 — Confirm your concentration</h3>
        <p>
          Once the powder has fully dissolved, the solution should be clear. Your
          concentration is the amount of peptide divided by the volume of water you
          added. The calculator displays this for you so you are not deriving it by
          hand, which is exactly where decimal-point slips happen.
        </p>

        <h3>Step 5 — Calculate your draw (units on a U-100 syringe)</h3>
        <p>
          Knowing the concentration, you can convert any target amount into syringe
          units. Enter your concentration and your target amount into the calculator
          in reverse mode and it returns the draw in U-100 units. Reading the draw off
          the calculator instead of doing the arithmetic in your head removes the most
          common error in the whole process.
        </p>

        <h3>Step 6 — Store the reconstituted vial</h3>
        <p>
          Once reconstituted, store the vial refrigerated and protected from light.
          The preservative supports a multi-day window, but the peptide itself is
          usually the real limit on how long the solution stays good. Storage
          characteristics vary by compound, so check the figure for the compound you
          are studying rather than assuming one number fits all.
        </p>

        <h2>Common reconstitution mistakes to avoid</h2>

        <h3>How much BAC water for a 5 mg peptide vial?</h3>
        <p>
          There is no universal answer, and that is the point. The &ldquo;right&rdquo;
          volume for a 5 mg vial depends entirely on the concentration you want to
          work at. A smaller water volume gives a more concentrated solution and a
          smaller draw; a larger volume gives a more dilute solution and a larger,
          easier-to-read draw. Enter 5 mg and your target concentration into the{" "}
          <Link href="/calculator">calculator</Link> and it returns the volume.
          Typing a fixed &ldquo;add X mL&rdquo; number from memory is how 10x errors
          happen.
        </p>

        <h3>How much BAC water for a 10 mg peptide vial?</h3>
        <p>
          Same logic. A 10 mg vial at the same concentration needs twice the water of
          a 5 mg vial. The relationship is linear and the calculator handles it, but
          the takeaway is that vial size and water volume move together to set your
          concentration.
        </p>

        <h3>What a one-unit syringe error means in percentage terms</h3>
        <p>
          Precision matters most at small draws. A one-unit error on a 5-unit draw is
          a 20% deviation. The same one-unit error on a 40-unit draw is only 2.5%.
          This is why very small draws are riskier to read by eye, and why confirming
          the draw against a calculated figure is worth the extra few seconds.
        </p>

        <h2>Frequently asked questions</h2>

        <h3>What is bacteriostatic water?</h3>
        <p>
          Sterile water with about 0.9% benzyl alcohol added as a preservative, which
          inhibits bacterial growth and allows a vial to be used more than once over
          several days.
        </p>

        <h3>Can I use sterile water instead of bacteriostatic water?</h3>
        <p>
          Plain sterile water has no preservative and is intended for single use. For
          a multi-use vial reconstituted over several days, the literature describes
          bacteriostatic water as the standard solvent.
        </p>

        <h3>How long does a reconstituted peptide last?</h3>
        <p>
          The preservative supports a multi-day window, commonly cited in the
          peptide-stability literature as up to 28 days refrigerated, but the
          stability of the specific peptide is usually the limiting factor. Check the
          figure for the compound you are studying.
        </p>

        <h3>What syringe should I use?</h3>
        <p>
          A U-100 insulin syringe. Its unit markings are what the reverse calculation
          gives you a draw against.
        </p>

        <h3>Is this medical advice?</h3>
        <p>
          No. This is a research-and-educational reference covering the reconstitution
          procedure and the math. It does not recommend any dose, compound, or
          protocol. Learn more <Link href="/about">about VialWise</Link>.
        </p>

        <hr />

        <p className="text-[13px] text-graphite/70">
          VialWise is a peptide research and education tool. The{" "}
          <Link href="/calculator">calculator</Link> and library are provided for
          research and educational purposes only and are not a substitute for
          professional advice.
        </p>
      </PageShell>
    </>
  );
}
