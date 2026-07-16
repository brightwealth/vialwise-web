export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-dark">
          What it does
        </p>
        <h2 className="mt-4 text-[36px] font-medium leading-tight tracking-headline text-espresso md:text-[48px]">
          Three things, done well.
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-graphite md:text-[17px]">
          The calculator is the hero. The library is the source of truth. And
          Pro tracks the whole protocol &mdash; on the App Store and Google Play.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        <FeatureCard
          eyebrow="01"
          title="The calculator, done right."
          body="Forward and reverse modes. Vial + water + dose → draw on a U-100 syringe (100, 50, or 30 IU). Long-press any result to copy it to your clipboard. Works for any peptide — semaglutide, retatrutide, BPC-157, your stack of three. The math doesn't care."
          icon={<CalculatorIcon />}
          accent="amber"
        />
        <FeatureCard
          eyebrow="02"
          title="A library you can actually use."
          body="90+ peptide entries with primary-source citations — PubMed DOIs, ClinicalTrials.gov NCTs, FDA labels. Reconstitution tables are calculator-rendered, never hand-typed. Open the reconstitution calculator straight from the library to run the math yourself."
          icon={<LibraryIcon />}
          accent="forest"
        />
        <FeatureCard
          eyebrow="03"
          title="Track the whole protocol."
          body="Pro turns the calculator into a tracker: a dose log and history, a body map for site rotation, a journal, a weekly recap, vial inventory with days of supply, and one-tap PDF export. It records what you logged — it never tells you what to take."
          icon={<CheckCircleIcon />}
          accent="amber"
        />
      </div>
    </section>
  );
}

function FeatureCard({
  eyebrow,
  title,
  body,
  icon,
  accent,
}: {
  eyebrow: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  accent: "amber" | "forest";
}) {
  const accentRing = accent === "amber" ? "ring-amber-dark/20" : "ring-forest/20";
  const accentBg = accent === "amber" ? "bg-amber-dark/[0.06]" : "bg-forest/[0.06]";
  const accentText = accent === "amber" ? "text-amber-dark" : "text-forest";

  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-espresso/[0.07] bg-cream/40 p-7 transition hover:border-espresso/15 hover:bg-cream/60">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentBg} ring-1 ring-inset ${accentRing} ${accentText}`}
      >
        {icon}
      </div>

      <span className="mt-6 text-[12px] font-medium tracking-[0.18em] text-graphite">
        {eyebrow}
      </span>
      <h3 className="mt-2 text-[22px] font-medium leading-snug tracking-tight text-espresso">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-graphite">{body}</p>
    </article>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

function CalculatorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M8 7h8" />
      <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Stack of book spines — leaning */}
      <path d="M4 19V5a2 2 0 0 1 2-2h2v18H6a2 2 0 0 1-2-2z" />
      <path d="M10 3h2v18h-2z" />
      <path d="M14 3h2v18h-2z" />
      <path d="M18 5l3 16-2 .4L16 5.4z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5 L11 15.5 L16 9.5" />
    </svg>
  );
}
