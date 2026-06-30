import Link from "next/link";
import { AppStoreBadge } from "./AppStoreBadge";

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
            iOS — now on the App Store.
          </span>

          <h1 className="text-[44px] font-medium leading-[1.05] tracking-display text-espresso md:text-[68px] lg:text-[78px]">
            Peptide tracking,
            <br />
            <span className="text-amber-dark">done right.</span>
          </h1>

          <p className="max-w-lg text-[17px] leading-relaxed text-graphite md:text-[18px]">
            Built by someone who actually runs peptides.{" "}
            <span className="block sm:inline">
              Calculator and 69-peptide cited library, free. Pro adds the full tracking suite for a one-time $44.99.
            </span>
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Primary CTA — the free reconstitution calculator. The marketing
                points people at "calculator at getvialwise.com", so the root
                offers it up front, above the fold, as the obvious primary
                action: one tap to /calculator. */}
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-[15px] font-medium text-bone shadow-sm transition hover:bg-forest-deep"
            >
              Open the free reconstitution calculator
              <span aria-hidden>→</span>
            </Link>

            {/* Secondary CTA — the App Store badge. The app is live, so this
                links straight to the App Store listing. */}
            <AppStoreBadge height={52} />
          </div>

          {/* Tertiary — feature breakdown, without leaving the page. */}
          <p className="-mt-3">
            <Link
              href="#features"
              className="text-[14px] font-medium text-forest underline-offset-4 hover:underline"
            >
              See what it does →
            </Link>
          </p>

          <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-3 text-[13px] text-graphite">
            <div className="flex flex-col">
              <dt className="text-graphite">Calculator</dt>
              <dd className="font-medium text-espresso">Actually right.</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-graphite">Privacy</dt>
              <dd className="font-medium text-espresso">On-device.</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-graphite">Vendor kickbacks</dt>
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

/**
 * HeroVisual — the real Vialwise "Today" screen in a CSS phone frame.
 *
 * Drops a real App-capture (public/hero-today.png — the populated Today / dose
 * log: a saved protocol with today's dose checked off, plus doses remaining and
 * days of supply) into the existing phone frame as an <img>. The screenshot
 * already carries its own iOS status bar, so the frame draws only the
 * Dynamic-Island pill over the status bar's empty centre — there is no second
 * status bar. The <img> has descriptive alt text and is not a heading, so it
 * stays out of the page's heading outline (the old hand-built mock's h3/h4
 * leaked into it).
 */
function HeroVisual() {
  return (
    <div className="relative w-full max-w-[340px]">
      {/* Soft cream offset card behind the phone for depth */}
      <div className="absolute inset-0 -z-10 translate-x-6 translate-y-10 rounded-[52px] bg-cream" />

      {/* Phone frame */}
      <div className="relative overflow-hidden rounded-[48px] border border-espresso/15 bg-espresso p-1.5 shadow-[0_40px_90px_-30px_rgba(45,38,32,0.45)]">
        {/* Dynamic-Island pill — sits over the screenshot status bar's empty centre */}
        <div className="absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-espresso" />
        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[42px] bg-bone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-today.png"
            alt="The Vialwise Today screen: a saved peptide protocol with today's dose checked off, showing doses remaining and days of supply, under a research-and-educational disclaimer."
            width={1179}
            height={2556}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
