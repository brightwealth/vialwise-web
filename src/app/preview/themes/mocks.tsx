/**
 * Four calculator-screen mockups, one per color variation. Pure
 * presentational React — no Expo, no React Native. Same data shown across
 * all four (semaglutide 30mg / 3mL water / 1mg dose → 10 units U-100) so
 * the apples-to-apples comparison is purely about color and hierarchy.
 *
 * Each mock renders inside the PhoneFrame in page.tsx (320×648 inner area).
 */

const SAMPLE = {
  vialMg: 30,
  bacMl: 3,
  doseMg: 1,
  concentration: "10.00 mg/mL",
  drawVolume: "0.1000 mL",
  drawUnits: 10,
  syringeUnits: 100,
};

// ─── Variation 1 — Earthy Block ────────────────────────────────────────────

export function EarthyBlockMock() {
  return (
    <div className="flex h-full flex-col bg-bone">
      {/* Amber top strip */}
      <div className="bg-amber-dark px-4 pt-6 pb-3 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-bone">
          Research and educational only
        </p>
      </div>

      {/* Mode toggle */}
      <div className="px-4 pt-3">
        <div className="flex gap-1 rounded-full bg-cream p-1">
          <ModePill active>Forward</ModePill>
          <ModePill>Reverse</ModePill>
        </div>
      </div>

      {/* Inputs (compact) */}
      <div className="space-y-2 px-4 pt-3">
        <Input label="Vial size" value={`${SAMPLE.vialMg}`} unit="mg" subtle />
        <Input label="BAC water" value={`${SAMPLE.bacMl}`} unit="mL" subtle />
        <Input label="Target dose" value={`${SAMPLE.doseMg}`} unit="mg" subtle />
      </div>

      {/* Syringe size pills with amber active */}
      <div className="px-4 pt-3">
        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-graphite/70">
          Syringe
        </p>
        <div className="mt-1.5 flex gap-1">
          <SyrPill>30 IU</SyrPill>
          <SyrPill>50 IU</SyrPill>
          <SyrPill activeAmber>100 IU</SyrPill>
        </div>
      </div>

      {/* Forest result block — the visual anchor */}
      <div className="mt-3 mx-4 rounded-2xl bg-forest p-4 text-bone">
        <Stat label="Concentration" value={SAMPLE.concentration} dark />
        <Divider dark />
        <Stat label="Draw volume" value={SAMPLE.drawVolume} dark />
        <Divider dark />
        <Stat
          label="Draw on U-100"
          value={`${SAMPLE.drawUnits} units`}
          dark
          accent
        />
      </div>

      {/* Espresso CTA */}
      <div className="mt-auto px-4 pb-4 pt-3">
        <CTAButton bg="bg-espresso">Create protocol</CTAButton>
      </div>

      <TabBar activeColor="text-amber-dark" badge="amber" />
    </div>
  );
}

// ─── Variation 2 — Card Tint ───────────────────────────────────────────────

export function CardTintMock() {
  return (
    <div className="flex h-full flex-col bg-bone">
      <DisclaimerStrip />

      {/* Mode toggle */}
      <div className="px-4 pt-3">
        <div className="flex gap-1 rounded-full bg-cream p-1">
          <ModePill active>Forward</ModePill>
          <ModePill>Reverse</ModePill>
        </div>
      </div>

      {/* Inputs in cream cards */}
      <div className="space-y-2 px-4 pt-3">
        <Input label="Vial size" value={`${SAMPLE.vialMg}`} unit="mg" tinted="cream" />
        <Input label="BAC water" value={`${SAMPLE.bacMl}`} unit="mL" tinted="cream" />
        <Input label="Target dose" value={`${SAMPLE.doseMg}`} unit="mg" tinted="cream" />
      </div>

      {/* Syringe pills with soft forest active */}
      <div className="px-4 pt-3">
        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-graphite/70">
          Syringe
        </p>
        <div className="mt-1.5 flex gap-1">
          <SyrPill>30 IU</SyrPill>
          <SyrPill>50 IU</SyrPill>
          <SyrPill activeSoftForest>100 IU</SyrPill>
        </div>
      </div>

      {/* Sage-tinted result card with forest numbers */}
      <div
        className="mt-3 mx-4 rounded-2xl p-4"
        style={{ backgroundColor: "#E2EAE3" }}
      >
        <Stat
          label="Concentration"
          value={SAMPLE.concentration}
          numberColor="text-forest"
        />
        <Divider />
        <Stat
          label="Draw volume"
          value={SAMPLE.drawVolume}
          numberColor="text-forest"
        />
        <Divider />
        <Stat
          label="Draw on U-100"
          value={`${SAMPLE.drawUnits} units`}
          numberColor="text-forest"
        />
      </div>

      <div className="mt-auto px-4 pb-4 pt-3">
        <CTAButton bg="bg-espresso">Create protocol</CTAButton>
      </div>

      <TabBar activeColor="text-forest" />
    </div>
  );
}

// ─── Variation 3 — Hero Number ─────────────────────────────────────────────

export function HeroNumberMock() {
  return (
    <div className="flex h-full flex-col bg-bone">
      <DisclaimerStrip />

      {/* Compact mode toggle */}
      <div className="px-4 pt-3">
        <div className="flex gap-1 rounded-full bg-cream p-0.5">
          <ModePill active small>Forward</ModePill>
          <ModePill small>Reverse</ModePill>
        </div>
      </div>

      {/* Compact inputs — inline row */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 gap-1.5">
          <CompactInput label="Vial" value={`${SAMPLE.vialMg}`} unit="mg" />
          <CompactInput label="Water" value={`${SAMPLE.bacMl}`} unit="mL" />
          <CompactInput label="Dose" value={`${SAMPLE.doseMg}`} unit="mg" />
        </div>
      </div>

      {/* Hero number block — amber-tinted bone */}
      <div
        className="mt-3 mx-4 rounded-2xl p-4"
        style={{ backgroundColor: "#F9F0E5" }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-graphite">
          Draw on U-100
        </p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span
            className="text-amber-dark"
            style={{
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            {SAMPLE.drawUnits}
          </span>
          <span className="text-[14px] font-medium text-graphite">units</span>
        </div>

        {/* Visual syringe with amber border */}
        <div
          className="mt-3 rounded-xl border-2 border-amber-dark/40 bg-bone p-2"
          style={{ borderColor: "rgba(166,90,48,0.35)" }}
        >
          <MiniSyringe units={SAMPLE.drawUnits} max={SAMPLE.syringeUnits} />
        </div>

        {/* Smaller derived numbers */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-espresso/[0.08] pt-3">
          <SmallStat label="Concentration" value={SAMPLE.concentration} />
          <SmallStat label="Draw volume" value={SAMPLE.drawVolume} />
        </div>
      </div>

      <div className="mt-auto px-4 pb-4 pt-3">
        <CTAButton bg="bg-espresso">Create protocol</CTAButton>
      </div>

      <TabBar activeColor="text-forest" />
    </div>
  );
}

// ─── Variation 4 — Editorial Warmth ────────────────────────────────────────

export function EditorialWarmthMock() {
  return (
    <div className="flex h-full flex-col bg-bone">
      {/* Forest header band */}
      <div className="bg-forest px-4 pt-6 pb-4 text-bone">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-amber-light/90">
          Research & educational
        </p>
        <h2
          className="mt-1 text-[24px] font-medium leading-tight"
          style={{ letterSpacing: "-0.025em" }}
        >
          Forward calculator
        </h2>
        <p className="mt-0.5 text-[11px] text-bone/60">
          Vial + water + dose → draw size
        </p>
      </div>

      {/* Borderless inputs on bone */}
      <div className="px-4 pt-4">
        <BorderlessInput label="Vial size" value={`${SAMPLE.vialMg}`} unit="mg" />
        <AmberHairline />
        <BorderlessInput label="Bacteriostatic water" value={`${SAMPLE.bacMl}`} unit="mL" />
        <AmberHairline />
        <BorderlessInput label="Target dose per draw" value={`${SAMPLE.doseMg}`} unit="mg" />
        <AmberHairline />
      </div>

      {/* Editorial result — small label / huge number */}
      <div className="px-4 pt-3">
        <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-amber-dark">
          Result
        </p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span
            className="text-espresso"
            style={{
              fontSize: 56,
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            {SAMPLE.drawUnits}
          </span>
          <span className="text-[13px] font-medium text-graphite">
            units · U-100
          </span>
        </div>
        <div className="mt-2 flex gap-3 text-[11px] text-graphite">
          <span>{SAMPLE.concentration}</span>
          <span>·</span>
          <span>{SAMPLE.drawVolume}</span>
        </div>
      </div>

      <div className="mt-auto px-4 pb-4 pt-3">
        <CTAButton bg="bg-amber-dark">Create protocol</CTAButton>
      </div>

      {/* Tab bar with forest top border */}
      <TabBar activeColor="text-forest" topBorderForest />
    </div>
  );
}

// ─── Shared building blocks ────────────────────────────────────────────────

function DisclaimerStrip() {
  return (
    <div className="border-b border-espresso/[0.06] bg-bone px-4 pt-6 pb-2 text-center">
      <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-graphite/80">
        Research and educational only
      </p>
    </div>
  );
}

function ModePill({
  children,
  active,
  small,
}: {
  children: React.ReactNode;
  active?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`flex-1 rounded-full text-center ${small ? "py-1.5" : "py-2"} ${
        active
          ? "bg-bone text-espresso shadow-sm"
          : "text-graphite"
      } text-[12px] font-medium`}
    >
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  unit,
  subtle,
  tinted,
}: {
  label: string;
  value: string;
  unit: string;
  subtle?: boolean;
  tinted?: "cream";
}) {
  const bg = tinted === "cream" ? "bg-cream" : subtle ? "bg-bone" : "bg-cream/40";
  const border = subtle ? "border border-espresso/[0.07]" : "";
  return (
    <div className={`rounded-xl ${bg} ${border} px-3 py-2`}>
      <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-graphite/70">
        {label}
      </p>
      <div className="mt-0.5 flex items-baseline justify-between">
        <span
          className="text-espresso"
          style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.015em" }}
        >
          {value}
        </span>
        <span className="text-[11px] text-graphite">{unit}</span>
      </div>
    </div>
  );
}

function CompactInput({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-lg border border-espresso/[0.08] bg-cream/40 px-2 py-1.5 text-center">
      <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-graphite/70">
        {label}
      </p>
      <p className="text-[16px] font-medium leading-tight tracking-tight text-espresso">
        {value}
        <span className="ml-0.5 text-[9px] font-normal text-graphite">{unit}</span>
      </p>
    </div>
  );
}

function BorderlessInput({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <p className="text-[12px] text-graphite">{label}</p>
      <p className="text-[15px] font-medium tracking-tight text-espresso">
        {value}
        <span className="ml-1 text-[11px] font-normal text-graphite">{unit}</span>
      </p>
    </div>
  );
}

function AmberHairline() {
  return (
    <div
      className="h-px w-full"
      style={{ backgroundColor: "rgba(166,90,48,0.30)" }}
    />
  );
}

function SyrPill({
  children,
  activeAmber,
  activeSoftForest,
}: {
  children: React.ReactNode;
  activeAmber?: boolean;
  activeSoftForest?: boolean;
}) {
  let cls = "bg-cream/60 text-graphite";
  if (activeAmber) cls = "bg-amber-dark text-bone";
  if (activeSoftForest) cls = "bg-forest/[0.12] text-forest border border-forest/30";
  return (
    <div
      className={`flex-1 rounded-lg px-2 py-1 text-center text-[11px] font-medium ${cls}`}
    >
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  dark,
  accent,
  numberColor,
}: {
  label: string;
  value: string;
  dark?: boolean;
  accent?: boolean;
  numberColor?: string;
}) {
  const labelColor = dark ? "text-bone/65" : "text-graphite";
  const valColor = numberColor
    ? numberColor
    : accent
    ? "text-amber-light"
    : dark
    ? "text-bone"
    : "text-espresso";
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <span className={`text-[11px] ${labelColor}`}>{label}</span>
      <span
        className={`text-[15px] font-medium tracking-tight ${valColor}`}
        style={accent ? { fontSize: 20 } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-graphite/70">
        {label}
      </span>
      <span className="mt-0.5 text-[13px] font-medium tracking-tight text-espresso">
        {value}
      </span>
    </div>
  );
}

function Divider({ dark }: { dark?: boolean }) {
  return (
    <div
      className={`h-px w-full ${dark ? "bg-bone/15" : "bg-espresso/[0.08]"}`}
    />
  );
}

function CTAButton({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg: string;
}) {
  return (
    <div
      className={`${bg} rounded-full py-3 text-center text-[14px] font-medium text-bone`}
    >
      {children}
    </div>
  );
}

function MiniSyringe({ units, max }: { units: number; max: number }) {
  const pct = (units / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-3 flex-1 rounded-full bg-bone ring-1 ring-inset ring-espresso/15">
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: "#3B82F6" }}
        />
      </div>
      <span className="text-[10px] font-medium tabular-nums text-graphite">
        {units}/{max}
      </span>
    </div>
  );
}

function TabBar({
  activeColor,
  badge,
  topBorderForest,
}: {
  activeColor: string;
  badge?: "amber";
  topBorderForest?: boolean;
}) {
  const tabs = [
    { label: "Home", icon: HomeIcon },
    { label: "Protocols", icon: ListIcon },
    { label: "Calculator", icon: CalcIcon, active: true },
    { label: "Library", icon: LibIcon },
  ];
  const topBorder = topBorderForest
    ? "border-t-[2px] border-forest/40"
    : "border-t border-espresso/[0.08]";
  return (
    <div className={`flex items-center justify-around bg-bone px-2 py-2 ${topBorder}`}>
      {tabs.map((t) => (
        <div key={t.label} className="flex flex-col items-center gap-0.5">
          <div
            className={
              t.active && badge === "amber"
                ? "rounded-full bg-amber-dark/15 p-1"
                : "p-1"
            }
          >
            <t.icon
              size={16}
              className={t.active ? activeColor : "text-graphite/60"}
            />
          </div>
          <span
            className={`text-[9px] font-medium ${
              t.active ? activeColor : "text-graphite/60"
            }`}
          >
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Tiny inline icons (avoid heroicons dep) ───────────────────────────────

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
