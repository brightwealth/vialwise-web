import { EmailForm } from "./EmailForm";

export function BetaCTA() {
  return (
    <section id="beta" className="relative overflow-hidden bg-bone py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[40px] bg-espresso px-8 py-14 text-bone md:px-16 md:py-20">
          <AmberOrb />
          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-light">
                Early access
              </p>
              <h2 className="mt-4 text-[36px] font-medium leading-tight tracking-headline md:text-[48px]">
                Join the waitlist.
              </h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-bone/75 md:text-[17px]">
                iOS launch is targeted for June 2026. Drop your email and we&rsquo;ll send a TestFlight invite when builds open, plus a heads-up the day v1 hits the App Store. Nothing else.
              </p>
            </div>

            <div className="rounded-2xl bg-bone/5 p-6 ring-1 ring-inset ring-bone/10">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-bone/60">
                Get on the list
              </p>
              <div className="mt-3">
                <EmailForm
                  variant="hero"
                  buttonLabel="Join the waitlist"
                  placeholder="your@email.com"
                />
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
