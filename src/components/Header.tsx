import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { AppStoreBadge, APP_LIVE } from "./AppStoreBadge";

export function Header() {
  return (
    <header className="w-full border-b border-espresso/[0.06]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <Link href="/" aria-label="Vialwise home" className="flex items-center gap-2">
          <Wordmark size={26} className="text-espresso" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
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
          {APP_LIVE ? (
            <AppStoreBadge height={40} />
          ) : (
            <Link
              href="#beta"
              className="rounded-full bg-forest px-5 py-2 text-[14px] font-medium text-bone transition hover:bg-forest-deep"
            >
              Join the waitlist
            </Link>
          )}
        </nav>

        {APP_LIVE ? (
          <AppStoreBadge height={40} className="md:hidden" />
        ) : (
          <Link
            href="#beta"
            className="rounded-full bg-forest px-4 py-2 text-[13px] font-medium text-bone md:hidden"
          >
            Beta
          </Link>
        )}
      </div>
    </header>
  );
}
