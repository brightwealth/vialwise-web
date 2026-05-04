import Link from "next/link";
import { EmailForm } from "./EmailForm";

const TESTFLIGHT_URL = process.env.NEXT_PUBLIC_TESTFLIGHT_URL ?? "#beta";

export function BetaCTA() {
  return (
    <section id="beta" className="relative overflow-hidden bg-bone py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[40px] bg-espresso px-8 py-14 text-bone md:px-16 md:py-20">
          <AmberOrb />
          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-light">
                Get early access
              </p>
              <h2 className="mt-4 text-[36px] font-medium leading-tight tracking-headline md:text-[48px]">
                Two ways in.
              </h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-bone/75 md:text-[17px]">
                The TestFlight beta is open to a small group right now. If you&rsquo;d rather wait for the App Store launch, we&rsquo;ll email you the day it goes live. Nothing else.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <Link
                href={TESTFLIGHT_URL}
                className="inline-flex items-center justify-between gap-4 rounded-2xl bg-amber-dark px-6 py-5 text-[15px] font-medium text-bone transition hover:bg-amber"
              >
                <span className="flex flex-col">
                  <span className="text-[12px] font-normal uppercase tracking-[0.12em] text-bone/70">
                    Join the TestFlight beta
                  </span>
                  <span className="mt-0.5 text-[16px] font-medium">
                    iOS 17+ · Free
                  </span>
                </span>
                <span aria-hidden className="text-xl">→</span>
              </Link>

              <div className="rounded-2xl bg-bone/5 p-5 ring-1 ring-inset ring-bone/10">
                <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-bone/60">
                  Or get notified at launch
                </p>
                <div className="mt-3">
                  <EmailForm
                    variant="hero"
                    buttonLabel="Notify me"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AmberOrb() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-50 blur-3xl"
      style={{
        background:
          "radial-gradient(closest-side, rgba(203,123,79,0.55) 0%, rgba(166,90,48,0.0) 70%)",
      }}
    />
  );
}
