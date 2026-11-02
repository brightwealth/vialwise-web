/**
 * IosUnavailableNote — shown where the App Store badge sat while
 * IOS_STORE_LIVE is false (see src/lib/storeLinks.ts). It tells an iPhone
 * visitor why there is no App Store link and what they can use instead.
 *
 * Renders nothing once IOS_STORE_LIVE is true, so callers can leave it in place.
 */
import Link from "next/link";

import { IOS_STORE_LIVE } from "@/lib/storeLinks";

interface IosUnavailableNoteProps {
  /** "light" on cream/bone surfaces, "dark" on espresso/forest ones. */
  tone?: "light" | "dark";
  className?: string;
}

export function IosUnavailableNote({ tone = "light", className }: IosUnavailableNoteProps) {
  if (IOS_STORE_LIVE) return null;

  const text = tone === "dark" ? "text-bone/75" : "text-graphite";
  const link =
    tone === "dark"
      ? "font-medium text-bone underline underline-offset-4 hover:text-amber-light"
      : "font-medium text-forest underline underline-offset-4 hover:text-forest-deep";

  return (
    <p className={`max-w-md text-[13.5px] leading-relaxed ${text}${className ? ` ${className}` : ""}`}>
      The iPhone app is temporarily unavailable on the App Store. The{" "}
      <Link href="/calculator" className={link}>
        calculator
      </Link>{" "}
      and the{" "}
      <Link href="/library" className={link}>
        cited library
      </Link>{" "}
      are free here on the web, and Android users can get the app on Google Play.
    </p>
  );
}
