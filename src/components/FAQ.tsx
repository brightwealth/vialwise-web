"use client";

const FAQS = [
  {
    q: "Is this medical advice?",
    a: "No. Vialwise is a calculator and a tracker. It doesn't tell you which peptide to take, what dose to run, or whether peptides are right for you. Talk to a doctor for that. We help you do the math correctly once you've already decided.",
  },
  {
    q: "Do you partner with peptide vendors?",
    a: "No, and we never will. There's a real conflict of interest in being both 'the app that tells you you need more' and 'the app that gets paid when you buy more.' We picked a side.",
  },
  {
    q: "What peptides does it support?",
    a: "Any peptide you can reconstitute. Semaglutide, tirzepatide, BPC-157, TB-500, ipamorelin, CJC-1295, retatrutide, MOTS-c — the calculator doesn't care about brand names. It cares about mg per vial, mL of BAC water, and dose target.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Everything you enter — peptides, doses, protocols, and your dose log — stays on your device. The app collects no personal data and transmits nothing to a server; Apple's privacy label is \"Data Not Collected.\" We never see your data.",
  },
  {
    q: "Is VialWise available yet?",
    a: "Yes. VialWise is on the App Store for iPhone. The forward and reverse calculator and the 69-peptide cited library are free; Pro adds the full tracking suite as a one-time purchase. Android is on the way.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "Free gives you the full forward and reverse calculator, the 69-peptide cited library, and tracking for one protocol. Pro is a one-time $44.99 purchase that unlocks unlimited saved protocols plus the full tracking suite: dose log, body map for site rotation, weekly recap, vial inventory with days of supply, BID/TID dosing, and PDF export. Free stays free, forever, even after you buy Pro.",
  },
  {
    q: "Is Pro a subscription?",
    a: "No — one-time. Pro is a single $44.99 purchase through the App Store. You buy it once and keep it: no recurring billing, no auto-renew, nothing to cancel.",
  },
  {
    q: "Will there be an Android version?",
    a: "Yes. iOS is available now; Android is on the way. The app is built on React Native, so the lift is smaller than a full rebuild.",
  },
];

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <div className="text-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-dark">
          Questions
        </p>
        <h2 className="mt-4 text-[36px] font-medium leading-tight tracking-headline text-espresso md:text-[44px]">
          Honest answers.
        </h2>
      </div>

      <div className="mt-12 divide-y divide-espresso/[0.08] border-y border-espresso/[0.08]">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
              <h3 className="text-[16.5px] font-medium leading-snug tracking-tight text-espresso md:text-[18px]">
                {item.q}
              </h3>
              <span
                aria-hidden
                className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-espresso/15 text-espresso transition group-open:rotate-45"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 pr-10 text-[15px] leading-relaxed text-graphite md:text-[15.5px]">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
