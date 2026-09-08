import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { AppStoreBadge } from "./AppStoreBadge";
import { StoreBadges } from "./StoreBadges";
import type { Campaign } from "@/lib/storeLinks";

/**
 * `campaign` threads the install-attribution token through the site chrome.
 *
 * It matters because the chrome renders store badges on EVERY page: a visitor
 * who lands on /library/desmopressin from search and taps the footer badge is
 * an install the library earned. Left at the default the chrome would report it
 * as "website", indistinguishable from a homepage install, and the library's
 * real contribution would be invisible — the exact measurement gap this token
 * was wired up to close.
 */
export function Header({ campaign = "website" }: { campaign?: Campaign } = {}) {
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
          {/* The library is 92 indexable pages and was reachable from NOTHING on
              the site — Search Console showed "Referring page: None detected".
              This nav is shared, so one entry here un-orphans every one of them. */}
          <Link
            href="/library"
            className="text-[14px] text-graphite transition hover:text-espresso"
          >
            Library
          </Link>
          {/* Root-relative, NOT bare "#features": these targets exist only on the
              homepage, so a bare hash was a dead link on /library and on all 92
              detail pages. */}
          <Link
            href="/#features"
            className="text-[14px] text-graphite transition hover:text-espresso"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
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
          <StoreBadges height={40} campaign={campaign} />
        </nav>

        {/* Mobile: a single App Store badge only — both full store badges plus
            the wordmark overflow a phone-width header bar. The hero directly
            below the header shows the App Store + Google Play pair. */}
        <AppStoreBadge height={40} className="md:hidden" campaign={campaign} />
      </div>
    </header>
  );
}
