import Link from "next/link";

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
              Full library, free. Pro for multiple active protocols.
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

/**
 * HeroVisual — phone-frame mock of the actual app's Home empty state.
 *
 * Shows what the user sees when they first open Vialwise: brand-amber
 * disclaimer strip, today's date, the vial+syringe illustration, the
 * "What are you working toward?" headline, and the forest "Open the
 * calculator" CTA.
 *
 * Mirrors what shipped in the Expo app so the marketing site is an
 * honest preview — no aspirational mock-ups that promise UI Vialwise
 * doesn't actually deliver.
 */
function HeroVisual() {
  return (
    <div className="relative w-full max-w-[340px]">
      {/* Soft cream offset card behind the phone for depth */}
      <div className="absolute inset-0 -z-10 translate-x-6 translate-y-10 rounded-[52px] bg-cream" />

      {/* Phone frame */}
      <div className="relative overflow-hidden rounded-[48px] border border-espresso/15 bg-espresso p-1.5 shadow-[0_40px_90px_-30px_rgba(45,38,32,0.45)]">
        <div className="absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-espresso" />
        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[42px] bg-bone">
          {/* Amber disclaimer strip */}
          <div className="bg-amber-dark px-4 pt-7 pb-3 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-bone">
              Research and educational only · Start with the calculator
            </p>
          </div>

          {/* Today / date */}
          <div className="px-5 pt-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-graphite/70">
              Today
            </p>
            <h3 className="mt-1 text-[20px] font-medium leading-none tracking-tight text-espresso">
              Wednesday, May 7
            </h3>
          </div>

          {/* Vial + syringe + copy + CTA, vertically centered */}
          <div className="mt-6 flex flex-col items-center px-5">
            <VialAndSyringe size={120} />
            <h4 className="mt-5 text-center text-[18px] font-medium tracking-tight text-espresso">
              What are you working toward?
            </h4>
            <p className="mt-1 text-center text-[12px] text-graphite">
              Calculator → Protocol takes 30 seconds.
            </p>
            <div className="mt-5 inline-flex items-center justify-center rounded-full bg-forest px-6 py-2.5 text-[13px] font-medium text-bone shadow-[0_8px_22px_-8px_rgba(36,63,40,0.5)]">
              Open the calculator
            </div>
          </div>

          {/* Tab bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-espresso/[0.08] bg-bone py-2.5">
            {[
              { label: "Home", active: true, Icon: HomeIcon },
              { label: "Protocols", active: false, Icon: ListIcon },
              { label: "Calculator", active: false, Icon: CalcIcon },
              { label: "Library", active: false, Icon: LibIcon },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-0.5">
                <t.Icon
                  size={18}
                  className={t.active ? "text-forest" : "text-graphite/55"}
                />
                <span
                  className={`text-[9px] font-medium ${
                    t.active ? "text-forest" : "text-graphite/55"
                  }`}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Vial + syringe duo. Same SVG composition that ships in the Expo app's
 * `ClosedVial` component (`src/ui/components/ClosedVial/ClosedVial.tsx`).
 * Kept in sync manually: any visual change to the app component should
 * be mirrored here so the marketing preview stays honest.
 */
function VialAndSyringe({ size }: { size: number }) {
  const w = size * 1.4;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 112 80" fill="none" aria-hidden>
      <defs>
        <linearGradient id="hero-vsGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.5" stopColor="#FBF7F0" stopOpacity="1" />
          <stop offset="1" stopColor="#F0E8DC" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="hero-vsLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A65A30" stopOpacity="0.32" />
          <stop offset="1" stopColor="#A65A30" stopOpacity="0.60" />
        </linearGradient>
      </defs>

      <circle cx={32} cy={42} r={40} fill="#A65A30" opacity={0.07} />

      <ellipse cx={56} cy={75} rx={48} ry={2.5} fill="#5C5650" opacity={0.10} />

      {/* Vial */}
      <g>
        <rect x={16} y={6} width={20} height={3} rx={1} fill="#A65A30" />
        <rect x={14} y={8} width={24} height={6} rx={1.5} fill="#CB7B4F" />
        <rect x={15} y={9} width={22} height={1} rx={0.5} fill="#FFFFFF" opacity={0.30} />
        <rect x={21} y={5} width={10} height={2.5} rx={0.5} fill="#5C5650" opacity={0.55} />
        <rect x={19} y={13} width={14} height={2.5} fill="#5C5650" opacity={0.18} />
        <path
          d="M18 15.5 L34 15.5 L37 21 L15 21 Z"
          fill="url(#hero-vsGlass)"
          stroke="#5C5650"
          strokeOpacity={0.30}
          strokeWidth={0.8}
        />
        <rect
          x={14}
          y={21}
          width={24}
          height={47}
          rx={2}
          fill="url(#hero-vsGlass)"
          stroke="#5C5650"
          strokeOpacity={0.30}
          strokeWidth={0.8}
        />
        <rect x={16} y={23} width={1.5} height={42} rx={0.75} fill="#FFFFFF" opacity={0.40} />
        <rect x={15.5} y={42} width={21} height={25} rx={1.5} fill="url(#hero-vsLiquid)" />
        <line x1={15.5} y1={42} x2={36.5} y2={42} stroke="#A65A30" strokeOpacity={0.45} strokeWidth={0.6} />
        <rect
          x={13}
          y={32}
          width={26}
          height={16}
          rx={1.5}
          fill="#FBF7F0"
          stroke="#A65A30"
          strokeOpacity={0.45}
          strokeWidth={0.8}
        />
        <line x1={16} y1={36} x2={26} y2={36} stroke="#5C5650" strokeOpacity={0.30} strokeWidth={0.5} />
        <line x1={16} y1={45} x2={22} y2={45} stroke="#5C5650" strokeOpacity={0.25} strokeWidth={0.5} />
        <g transform="translate(31 41)">
          <path
            d="M-4 -3 L0 3 L4 -3"
            stroke="#2F5234"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>

      {/* Syringe */}
      <g transform="translate(54 24) rotate(20)">
        <rect
          x={0}
          y={0}
          width={42}
          height={10}
          rx={1.5}
          fill="#FBF7F0"
          stroke="#5C5650"
          strokeOpacity={0.32}
          strokeWidth={0.9}
        />
        <rect x={2} y={2} width={14} height={6} rx={1} fill="#A65A30" opacity={0.58} />
        <line x1={20} y1={2} x2={20} y2={4} stroke="#5C5650" strokeOpacity={0.45} strokeWidth={0.8} />
        <line x1={26} y1={2} x2={26} y2={4} stroke="#5C5650" strokeOpacity={0.45} strokeWidth={0.8} />
        <line x1={32} y1={2} x2={32} y2={4} stroke="#5C5650" strokeOpacity={0.45} strokeWidth={0.8} />
        <rect x={-3} y={3} width={3} height={4} fill="#5C5650" opacity={0.55} />
        <rect x={-13} y={4} width={10} height={2} fill="#5C5650" opacity={0.45} />
        <rect x={42} y={3.5} width={10} height={3} fill="#5C5650" opacity={0.30} />
        <rect x={50} y={0} width={4} height={10} rx={1} fill="#A65A30" />
      </g>
    </svg>
  );
}

// ─── Tab bar icons ─────────────────────────────────────────────────────────

function HomeIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M3 12L12 4l9 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ListIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalcIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LibIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M4 19V5a2 2 0 0 1 2-2h2v18H6a2 2 0 0 1-2-2zM10 3h2v18h-2zM14 3h2v18h-2zM18 5l3 16-2 .4L16 5.4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
