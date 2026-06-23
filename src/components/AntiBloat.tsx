const PROMISES = [
  {
    title: "No medical claims.",
    body: "We don&rsquo;t say peptides &lsquo;optimize&rsquo; or &lsquo;heal&rsquo; or &lsquo;improve&rsquo; anything. That&rsquo;s a doctor&rsquo;s job, not an app&rsquo;s.",
  },
  {
    title: "No vendor kickbacks.",
    body: "We will never partner with a peptide source for affiliate fees. The day we do, we deserve to be uninstalled.",
  },
  {
    title: "No AI hype.",
    body: "We use AI for one thing: a friendly weekly recap (opt-in, post-launch). Not a personality, not a coach, not a buzzword.",
  },
  {
    title: "No data sale, ever.",
    body: "Health data stays on your device. Nothing aggregated for sale. Nothing sold to insurers. Period.",
  },
  {
    title: "No bloat.",
    body: "If a feature doesn&rsquo;t make the calculator more useful or your protocol easier to run, it doesn&rsquo;t ship.",
  },
  {
    title: "No dark patterns.",
    body: "Pro is one-time, not a subscription. Buy it once and keep it &mdash; no recurring billing, nothing to cancel, no &lsquo;are you sure?&rsquo; theater.",
  },
];

export function AntiBloat() {
  return (
    <section className="bg-cream/50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-deep">
            What we don&rsquo;t do
          </p>
          <h2 className="mt-4 text-[36px] font-medium leading-tight tracking-headline text-espresso md:text-[48px]">
            The promises behind the product.
          </h2>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {PROMISES.map((p) => (
            <li key={p.title} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-forest text-bone">
                  <CheckIcon />
                </span>
                <h3 className="text-[18px] font-medium tracking-tight text-espresso">
                  {p.title}
                </h3>
              </div>
              <p
                className="pl-9 text-[15px] leading-relaxed text-graphite"
                dangerouslySetInnerHTML={{ __html: p.body }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
