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
    a: "Yes. v1 stores everything locally on your device. v2 (with Pro) syncs encrypted to your account. Health data from Apple Health stays on-device — we never see your raw weight, body fat, or biometrics. We're transparent about every byte.",
  },
  {
    q: "Is VialWise available yet?",
    a: "Yes. VialWise v1 is now available on the App Store for iPhone — free, with the full reconstitution calculator and the peptide library. Android is on the way.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "Free gives you the full calculator, the full library, and tracking for one protocol. Pro ($39.99/yr) unlocks unlimited protocols, scheduled reminders, inventory tracking, half-life decay charts, and Apple Health imports. Free stays free, forever, even after Pro launches.",
  },
  {
    q: "Will there be an Android version?",
    a: "Yes. iOS ships first, Android follows. The goal is to have both available close to launch — the app is built on React Native so the lift is smaller than a full rebuild.",
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
