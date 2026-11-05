/**
 * The homepage FAQ — the ONE copy. src/components/FAQ.tsx renders it and
 * src/app/page.tsx builds the FAQPage JSON-LD from it, so the visible answers
 * and the structured data stay byte-identical (Google requires visible/schema
 * parity). Two answers follow IOS_STORE_LIVE (src/lib/storeLinks.ts).
 */
import { IOS_STORE_LIVE, googlePlayUrl } from "@/lib/storeLinks";

export type FaqItem = {
  q: string;
  a: string;
  link?: { href: string; label: string };
};

export const FAQS: FaqItem[] = [
  {
    q: "Is this medical advice?",
    a: "No. VialWise is a calculator and a tracker. It doesn't tell you which peptide to take, what dose to run, or whether peptides are right for you. Talk to a doctor for that. We help you do the math correctly once you've already decided.",
  },
  {
    q: "Do you partner with peptide vendors?",
    a: "No, and we never will. There's a real conflict of interest in being both 'the app that tells you you need more' and 'the app that gets paid when you buy more.' We picked a side.",
  },
  {
    q: "What peptides does it support?",
    a: "Any peptide you can reconstitute. Semaglutide, tirzepatide, BPC-157, TB-500, ipamorelin, CJC-1295, retatrutide, MOTS-c — the calculator doesn't care about brand names. It cares about mg per vial, mL of BAC water, and dose target.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Everything you enter — peptides, doses, protocols, and your dose log — stays on your device. The app collects no personal data and transmits nothing to a server; Apple's App Privacy label reads \"Data Not Collected,\" and the app ships no analytics, ads, or trackers on either platform. We never see your data.",
  },
  {
    q: "Is VialWise available yet?",
    a: IOS_STORE_LIVE
      ? "Yes. VialWise is on the App Store for iPhone and on Google Play for Android. The forward and reverse calculator and 90+ cited peptides are free; Pro adds the full tracking suite as a one-time purchase."
      : "Yes, on Google Play for Android. The iPhone app is temporarily unavailable on the App Store; the calculator and the cited library are free here on the web. In the app, the forward and reverse calculator and 90+ cited peptides are free; Pro adds the full tracking suite as a one-time purchase.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "Free gives you unlimited saved protocols, basic dose logging, the full forward and reverse calculator, the complete 90+ cited library, basic dose reminders, and the single-dose half-life chart. Pro is a one-time $44.99 purchase, not a subscription, that adds the advanced tracking suite (dose history and back-logging, body map for site rotation, live doses-remaining and vial inventory, the journal, PDF export, and weekly recap), the advanced calculators (blend, titration, and cost-per-dose), shared-vial support, the live half-life view, and advanced catch-up and expiry reminders. Free stays free, forever, even after you buy Pro.",
  },
  {
    q: "Is Pro a subscription?",
    a: "No — one-time. Pro is a single $44.99 purchase in the app (App Store or Google Play). You buy it once and keep it: no recurring billing, no auto-renew, nothing to cancel.",
  },
  {
    q: "Is VialWise on Android?",
    a: IOS_STORE_LIVE
      ? "Yes. VialWise is now available on Google Play, and on the App Store for iPhone. Because the app is built on React Native, both platforms run the same calculator and cited library."
      : "Yes. VialWise is available on Google Play, with the same calculator and cited library that are free here on the web.",
    link: {
      href: googlePlayUrl("website"),
      label: "Get it on Google Play",
    },
  },
];
