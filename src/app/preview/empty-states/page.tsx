import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Empty states preview",
  description: "Three empty-state designs for the Vialwise app — current vs proposed.",
  robots: { index: false, follow: false },
};

const VARIANTS = [
  {
    id: "current",
    name: "Current",
    tagline: "What you'd ship today",
    description:
      "Generic centered text with a tiny icon. Functional but forgettable. Doesn't introduce the app's voice or hint at what to do next.",
    Mock: CurrentEmpty,
  },
  {
    id: "proposed",
    name: "Proposed",
    tagline: "Personality + clear next step",
    description:
      "Brand voice in microcopy, custom vial illustration with V monogram, dynamic copy (relative dates, search rewrites). Costs ~45 min to build for all three states.",
    Mock: ProposedEmpty,
  },
  {
    id: "minimal",
    name: "Minimal — alternative",
    tagline: "Quieter middle ground",
    description:
      "If the proposed version feels too playful, a single-line voice tweak with a subtle illustration. Same structural change, lighter touch.",
    Mock: MinimalEmpty,
  },
] as const;

export default function EmptyStatesPreviewPage() {
  return (
    <main className="min-h-screen bg-bone py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-amber-dark">
            Internal preview · #3 — empty states with personality
          </p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.05] tracking-display text-espresso md:text-[56px]">
            Empty states.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-graphite md:text-[17px]">
            Each phone shows the same three moments — Home with no protocols saved, Protocols list empty, Library search with no match. Compare current vs proposed.
          </p>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {VARIANTS.map((v) => (
            <section key={v.id} className="flex flex-col gap-5">
              <header className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-graphite/70">
                  {v.id === "current" ? "Today" : "Proposed"}
                </span>
                <h2 className="text-[24px] font-medium leading-snug tracking-tight text-espresso">
                  {v.name}
                </h2>
                <p className="text-[13px] font-medium text-amber-dark">
                  {v.tagline}
                </p>
              </header>

              <div className="flex flex-col gap-6">
                <PhoneFrame>
                  <v.Mock state="home-empty" />
                </PhoneFrame>
                <PhoneFrame>
                  <v.Mock state="protocols-empty" />
                </PhoneFrame>
                <PhoneFrame>
                  <v.Mock state="library-no-match" />
                </PhoneFrame>
              </div>

              <p className="text-[13.5px] leading-relaxed text-graphite">
                {v.description}
              </p>
            </section>
          ))}
        </div>

        <footer className="mx-auto mt-20 max-w-2xl text-center text-[13px] text-graphite/70">
          Reply with &ldquo;ship the proposed empty states&rdquo; (or &ldquo;ship the minimal version&rdquo;) and I&rsquo;ll wire them into the Expo app.
        </footer>
      </div>
    </main>
  );
}

// ─── Shared phone frame ────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-[44px] border border-espresso/15 bg-espresso shadow-[0_30px_70px_-20px_rgba(45,38,32,0.35)]"
      style={{ width: 320, height: 580, padding: 6 }}
    >
      <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-espresso" />
      <div
        className="relative h-full w-full overflow-hidden rounded-[38px]"
        style={{ isolation: "isolate" }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Variant: Current (today) ──────────────────────────────────────────────

function CurrentEmpty({ state }: { state: EmptyState }) {
  if (state === "home-empty") {
    return (
      <div className="flex h-full flex-col bg-bone">
        <CurrentDisclaimer />
        <ScreenHeader title="Today" subtitle="Sunday, May 5" />
        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C5650" strokeWidth="1.6">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
          <p className="mt-4 text-center text-[15px] text-graphite">
            No protocols saved yet.
          </p>
        </div>
        <CurrentTabBar active="Home" />
      </div>
    );
  }
  if (state === "protocols-empty") {
    return (
      <div className="flex h-full flex-col bg-bone">
        <CurrentDisclaimer />
        <ScreenHeader title="Protocols" subtitle="0 saved" />
        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <p className="text-center text-[15px] text-graphite">
            You haven&rsquo;t saved any protocols.
          </p>
        </div>
        <CurrentTabBar active="Protocols" />
      </div>
    );
  }
  // library-no-match
  return (
    <div className="flex h-full flex-col bg-bone">
      <CurrentDisclaimer />
      <ScreenHeader title="Library" />
      <div className="px-4 pb-3">
        <SearchInput value="ozempic" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <p className="text-center text-[15px] text-graphite">
          No results found.
        </p>
      </div>
      <CurrentTabBar active="Library" />
    </div>
  );
}

// ─── Variant: Proposed (with personality) ──────────────────────────────────

function ProposedEmpty({ state }: { state: EmptyState }) {
  if (state === "home-empty") {
    return (
      <div className="flex h-full flex-col bg-bone">
        <ProposedDisclaimer
          message="Start with the calculator below."
        />
        <ScreenHeader title="Today" subtitle="Sunday, May 5" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <ClosedVial />
          <h3 className="mt-5 text-[20px] font-medium tracking-tight text-espresso">
            Pour the first one.
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-graphite">
            Calculator → Protocol takes 30 seconds.
          </p>
          <button
            type="button"
            className="mt-5 rounded-full bg-forest px-5 py-2.5 text-[13.5px] font-medium text-bone"
          >
            Open the calculator
          </button>
        </div>
        <ProposedTabBar active="Home" />
      </div>
    );
  }
  if (state === "protocols-empty") {
    return (
      <div className="flex h-full flex-col bg-bone">
        <ProposedDisclaimer message="Save your first protocol from the calculator." />
        <ScreenHeader title="Protocols" subtitle="Nothing here yet" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <ClosedVial />
          <h3 className="mt-5 text-[20px] font-medium tracking-tight text-espresso">
            Quiet shelf.
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-graphite">
            Run a calculation and save it — your protocols live here.
          </p>
        </div>
        <ProposedTabBar active="Protocols" />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col bg-bone">
      <ProposedDisclaimer message="Not a recommendation. Primary sources only." />
      <ScreenHeader title="Library" />
      <div className="px-4 pb-3">
        <SearchInput value="ozempic" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-[14px] leading-relaxed text-graphite">
          No peptide matches{" "}
          <span className="font-medium text-espresso">&ldquo;ozempic&rdquo;</span>.
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-graphite">
          Try the active ingredient — search{" "}
          <button
            type="button"
            className="rounded-md bg-amber-dark/[0.10] px-2 py-0.5 font-medium text-amber-dark"
          >
            semaglutide
          </button>
          .
        </p>
      </div>
      <ProposedTabBar active="Library" />
    </div>
  );
}

// ─── Variant: Minimal middle ground ────────────────────────────────────────

function MinimalEmpty({ state }: { state: EmptyState }) {
  if (state === "home-empty") {
    return (
      <div className="flex h-full flex-col bg-bone">
        <ProposedDisclaimer message="Start with the calculator below." />
        <ScreenHeader title="Today" subtitle="Sunday, May 5" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-dark/30 bg-amber-dark/[0.06]">
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
              <path
                d="M18 28 L50 76 L82 28"
                stroke="#A65A30"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-graphite">
            No protocols yet — start with the calculator.
          </p>
        </div>
        <ProposedTabBar active="Home" />
      </div>
    );
  }
  if (state === "protocols-empty") {
    return (
      <div className="flex h-full flex-col bg-bone">
        <ProposedDisclaimer message="Save your first protocol from the calculator." />
        <ScreenHeader title="Protocols" subtitle="Nothing here yet" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <p className="text-[15px] leading-relaxed text-graphite">
            Saved protocols will live here.
          </p>
        </div>
        <ProposedTabBar active="Protocols" />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col bg-bone">
      <ProposedDisclaimer message="Not a recommendation. Primary sources only." />
      <ScreenHeader title="Library" />
      <div className="px-4 pb-3">
        <SearchInput value="ozempic" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-[14px] leading-relaxed text-graphite">
          No match for &ldquo;ozempic&rdquo;. Try{" "}
          <span className="font-medium text-amber-dark">semaglutide</span>.
        </p>
      </div>
      <ProposedTabBar active="Library" />
    </div>
  );
}

// ─── Shared chrome ─────────────────────────────────────────────────────────

type EmptyState = "home-empty" | "protocols-empty" | "library-no-match";

function CurrentDisclaimer() {
  return (
    <div className="border-b border-espresso/[0.06] bg-bone px-4 pt-6 pb-2 text-center">
      <p className="text-[10px] font-medium tracking-[0.04em] text-espresso/85">
        Research and educational purposes only.{" "}
        <span className="text-graphite">Informational, not medical advice.</span>
      </p>
    </div>
  );
}

function ProposedDisclaimer({ message }: { message: string }) {
  return (
    <div className="bg-amber-dark px-4 pt-6 pb-2 text-center">
      <p className="text-[10px] tracking-[0.04em] text-bone/95">
        <span className="font-medium">Research and educational only.</span>{" "}
        <span className="text-bone/80">{message}</span>
      </p>
    </div>
  );
}

function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-5 pt-5 pb-3">
      <h2 className="text-[26px] font-medium leading-tight tracking-tight text-espresso">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-0.5 text-[12px] text-graphite">{subtitle}</p>
      ) : null}
    </div>
  );
}

function SearchInput({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-espresso/[0.08] bg-cream/40 px-3 py-2.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C5650" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" strokeLinecap="round" />
      </svg>
      <span className="text-[13px] text-espresso">{value}</span>
    </div>
  );
}

function CurrentTabBar({ active }: { active: string }) {
  return (
    <TabBar active={active} accentColor="text-graphite/70" />
  );
}

function ProposedTabBar({ active }: { active: string }) {
  return <TabBar active={active} accentColor="text-amber-dark" withBadge />;
}

function TabBar({
  active,
  accentColor,
  withBadge,
}: {
  active: string;
  accentColor: string;
  withBadge?: boolean;
}) {
  const tabs = ["Home", "Protocols", "Calculator", "Library"];
  return (
    <div className="flex items-center justify-around border-t border-espresso/[0.08] bg-bone px-2 py-2">
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <div key={t} className="flex flex-col items-center gap-0.5">
            <div
              className={
                isActive && withBadge
                  ? "rounded-full bg-amber-dark/15 p-1"
                  : "p-1"
              }
            >
              <div
                className={`h-4 w-4 rounded-sm ${
                  isActive ? accentColor : "text-graphite/50"
                }`}
                style={{
                  background: "currentColor",
                  opacity: isActive ? 0.85 : 0.4,
                }}
              />
            </div>
            <span
              className={`text-[9px] font-medium ${
                isActive ? accentColor : "text-graphite/60"
              }`}
            >
              {t}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Closed vial illustration ──────────────────────────────────────────────

function ClosedVial() {
  return (
    <svg width="64" height="80" viewBox="0 0 64 80" fill="none">
      {/* halo */}
      <circle cx="32" cy="40" r="38" fill="rgba(166,90,48,0.07)" />
      {/* cap top */}
      <rect x="22" y="6" width="20" height="6" rx="2" fill="#A65A30" />
      {/* cap collar */}
      <rect x="20" y="11" width="24" height="4" fill="#CB7B4F" />
      {/* neck */}
      <rect x="26" y="14" width="12" height="4" fill="#5C5650" opacity="0.25" />
      {/* glass body */}
      <rect
        x="18"
        y="17"
        width="28"
        height="50"
        rx="4"
        fill="#FBF7F0"
        stroke="#5C5650"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      {/* liquid */}
      <rect x="20" y="40" width="24" height="25" rx="2" fill="#A65A30" opacity="0.25" />
      {/* V monogram on label */}
      <g transform="translate(32 45)">
        <path
          d="M-7 -6 L0 6 L7 -6"
          stroke="#2F5234"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      {/* base shadow */}
      <ellipse cx="32" cy="72" rx="14" ry="2" fill="#5C5650" opacity="0.10" />
    </svg>
  );
}
