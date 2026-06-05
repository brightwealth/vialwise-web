import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    absolute: "About VialWise — Built by Someone Who Runs Peptides",
  },
  description:
    "Andrew built VialWise because he runs peptides himself and needed accurate reconstitution math. No vendor kickbacks. Research and educational only.",
  ...pageMetadata("https://www.getvialwise.com/about"),
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Built by someone who actually runs peptides."
      intro="Most peptide apps are built by people who don't take peptides. That shows up in every part of the product. Vialwise exists because that gap kept costing me time and trust."
    >
      <h2>The short version</h2>
      <p>
        I&rsquo;m Andrew. I&rsquo;ve been working out for 20 years and in sports my whole life. I run peptides — for recovery, for body composition, for overall health. Not because I&rsquo;m a bodybuilder or a CrossFit competitor, but because the science kept pointing in a direction I couldn&rsquo;t ignore.
      </p>
      <p>
        Peptides aren&rsquo;t just for fat loss or muscle gain or better skin. For most people it goes deeper than that — longevity, inflammation, gut health, how you feel day to day. The research is growing fast and the people getting behind it aren&rsquo;t just athletes. They&rsquo;re everyday people who&rsquo;ve figured out that not every diet works for every body, not every protocol works for every person, and that there&rsquo;s more than one way to take care of yourself.
      </p>
      <p>
        Every peptide app I tried was built by people who clearly didn&rsquo;t use peptides themselves. The math was wrong, or the UI was a wall of medical-looking dashboards designed to impress investors, or — worst of all — the app was a thinly disguised funnel into a partnered vendor&rsquo;s store. I didn&rsquo;t want a glossy storefront. I wanted a calculator that was actually right.
      </p>

      <h2>Why I&rsquo;m building it</h2>
      <p>
        The honest answer: nobody else was going to. The existing players have been around for years, charge a lot, and still get the basics wrong. The unfair advantage I have isn&rsquo;t engineering — it&rsquo;s that I&rsquo;m the customer. I know which feature requests are real and which are noise, because I&rsquo;m the one who&rsquo;d use them.
      </p>
      <p>
        v1 is the calculator and reconstitution date tracking — free, forever, for one protocol. Pro adds unlimited protocols, reminders, and the rest of the toolkit when v2 ships. No coaching. No AI personalities. No vendor partnerships. No supplements line.
      </p>

      <h2>The promises</h2>
      <ul>
        <li>
          <strong>The calculator will be right.</strong> If we ever get the math wrong, that&rsquo;s a fire-drill bug, not a feature request.
        </li>
        <li>
          <strong>Your data stays yours.</strong> v1 is local-only. v2 syncs encrypted to your account. Apple Health data never leaves your device.
        </li>
        <li>
          <strong>No vendor kickbacks.</strong> Ever. There&rsquo;s a real conflict between &ldquo;the app you trust&rdquo; and &ldquo;the app that profits when you buy more.&rdquo; I&rsquo;m picking the first one.
        </li>
        <li>
          <strong>No medical claims.</strong> Vialwise doesn&rsquo;t tell you what to take or whether to take it. That&rsquo;s a doctor&rsquo;s job.
        </li>
        <li>
          <strong>No bloat.</strong> If a feature doesn&rsquo;t make the calculator more useful or your protocol easier to run, it doesn&rsquo;t ship.
        </li>
      </ul>

      <h2>If you want to help</h2>
      <p>
        The fastest way is to{" "}
        <Link href="/#beta">join the waitlist</Link> for a TestFlight invite when builds open and tell me what&rsquo;s wrong with it. I&rsquo;m looking for honest feedback from people actually running peptides — bodybuilders, GLP-1 patients, biohackers, and anyone in between.
      </p>
      <p>
        You can also email me directly at{" "}
        <a href="mailto:andrew@vialwise.app">andrew@vialwise.app</a>. I read everything and reply to most of it.
      </p>

      <hr />

      <p className="text-[14px] text-graphite/70">
        — Andrew
      </p>
    </PageShell>
  );
}
