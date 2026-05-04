import Link from "next/link";
import { AppIcon } from "./AppIcon";

const TESTFLIGHT_URL = process.env.NEXT_PUBLIC_TESTFLIGHT_URL ?? "#beta";

export function Hero() {
  return (
    <section className="grain relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-10 md:py-28 lg:py-32">
        <div className="flex flex-col gap-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-forest/20 bg-forest/[0.05] px-3 py-1 text-[12px] font-medium tracking-tight text-forest">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest/40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-forest" />
            </span>
            v1 beta — TestFlight invites open
          </span>

          <h1 className="text-[44px] font-medium leading-[1.05] tracking-display text-espresso md:text-[68px] lg:text-[78px]">
            Peptide tracking,
            <br />
            <span className="text-amber-dark">done right.</span>
          </h1>

          <p className="max-w-lg text-[17px] leading-relaxed text-graphite md:text-[18px]">
            Built by someone who actually runs peptides.{" "}
            <span className="block sm:inline">
              Free for one peptide. Forever.
            </span>
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={TESTFLIGHT_URL}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-[15px] font-medium text-bone shadow-sm transition hover:bg-forest-deep"
            >
              Join the beta
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-espresso/15 bg-bone px-6 py-3 text-[15px] font-medium text-espresso transition hover:border-espresso/30"
            >
              See what it does
            </Link>
          </div>

          <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-3 text-[13px] text-graphite">
            <div className="flex flex-col">
              <dt className="text-graphite/70">Calculator</dt>
              <dd className="font-medium text-espresso">Actually right.</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-graphite/70">Privacy</dt>
              <dd className="font-medium text-espresso">On-device.</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-graphite/70">Vendor kickbacks</dt>
              <dd className="font-medium text-espresso">None.</dd>
            </div>
          </dl>
        </div>

        <div className="relative flex items-center justify-center md:justify-end">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative w-full max-w-[440px]">
      <div className="absolute inset-0 -z-10 translate-x-6 translate-y-8 rounded-[44px] bg-cream" />
      <div className="relative overflow-hidden rounded-[44px] border border-espresso/[0.08] bg-bone p-6 shadow-[0_30px_70px_-30px_rgba(45,38,32,0.25)] md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppIcon size={56} withHalo={false} />
            <div className="flex flex-col">
              <span className="text-[15px] font-medium tracking-tight text-espresso">
                Semaglutide
              </span>
              <span className="text-[12px] text-graphite">5 mg vial · BAC water</span>
            </div>
          </div>
          <span className="rounded-full bg-forest/[0.08] px-2.5 py-1 text-[11px] font-medium tracking-tight text-forest">
            Active
          </span>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <Stat label="Reconstitute with" value="2.0 mL" />
          <Stat label="Per dose" value="0.10 mL" />
          <Stat label="Dose strength" value="0.25 mg" />
          <Stat label="Doses per vial" value="20" />
        </div>

        <div className="mt-7 rounded-2xl bg-cream/70 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] text-graphite">Draw to</span>
            <span className="text-[12px] text-graphite">u-100 syringe</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[40px] font-medium leading-none tracking-display text-espresso">
              10
            </span>
            <span className="text-[14px] text-graphite">units</span>
          </div>
          <SyringeBar units={10} />
        </div>

        <div className="mt-6 flex items-center justify-between text-[12px]">
          <span className="text-graphite">Reconstituted</span>
          <span className="font-medium text-espresso">3 days ago</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-espresso/[0.06]">
          <div className="h-full w-[15%] rounded-full bg-forest" />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-graphite/80">
          <span>Day 3 of 28</span>
          <span>Stable</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-espresso/[0.06] bg-bone p-3">
      <div className="text-[11px] uppercase tracking-[0.08em] text-graphite/80">{label}</div>
      <div className="mt-1 text-[18px] font-medium tracking-tight text-espresso">{value}</div>
    </div>
  );
}

function SyringeBar({ units }: { units: number }) {
  const ticks = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div className="mt-3" aria-hidden>
      <div className="relative h-3 rounded-full bg-bone ring-1 ring-inset ring-espresso/[0.08]">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-amber-dark"
          style={{ width: `${units}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-graphite/70">
        {ticks.map((t) => (
          <span key={t}>{t * 10}</span>
        ))}
      </div>
    </div>
  );
}
