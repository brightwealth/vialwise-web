import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { AppStoreBadge } from "./AppStoreBadge";

export function Header() {
  return (
    <header className="w-full border-b border-espresso/[0.06]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <Link href="/" aria-label="Vialwise home" className="flex items-center gap-2">
          <Wordmark size={26} className="text-espresso" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          <Link
            href="/calculator"
            className="text-[14px] text-graphite transition hover:text-espresso"
          >
            Calculator
          </Link>
          <Link
            href="#features"
            className="text-[14px] text-graphite transition hover:text-espresso"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-[14px] text-graphite transition hover:text-espresso"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-[14px] text-graphite transition hover:text-espresso"
          >
            About
          </Link>
          <AppStoreBadge height={40} />
        </nav>

        <AppStoreBadge height={40} className="md:hidden" />
      </div>
    </header>
  );
}
