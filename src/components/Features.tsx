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
          The calculator is the hero. Everything else exists to make the calculator more useful — not to bloat the app.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        <FeatureCard
          eyebrow="01"
          title="Calculator that's actually right."
          body="Reconstitution math, dose conversion, syringe units. Works for any peptide — semaglutide, BPC-157, tirzepatide, ipamorelin, your stack of three. The math doesn't care."
          icon={<CalculatorIcon />}
          accent="amber"
        />
        <FeatureCard
          eyebrow="02"
          title="Track without busywork."
          body="Vials, doses, reconstitution dates, stability windows. You log it once. The app does the boring part — counting days, flagging when a vial is past peak, prepping your next reorder."
          icon={<TrackIcon />}
          accent="forest"
        />
        <FeatureCard
          eyebrow="03"
          title="Reminders that respect you."
          body="Optional, configurable, never naggy. No streaks. No guilt. No 'you've missed 3 days' notifications. Adults running protocols don't need a habit-tracker breathing down their neck."
          icon={<BellIcon />}
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

      <span className="mt-6 text-[12px] font-medium tracking-[0.18em] text-graphite/70">
        {eyebrow}
      </span>
      <h3 className="mt-2 text-[22px] font-medium leading-snug tracking-tight text-espresso">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-graphite">{body}</p>
    </article>
  );
}

function CalculatorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M8 7h8" />
      <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </svg>
  );
}

function TrackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l5-5 4 4 8-8" />
      <path d="M14 8h6v6" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}
