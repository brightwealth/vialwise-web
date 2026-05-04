import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vialwise is built by Andrew Chavez — a peptide user who got tired of every existing app being built by people who don't actually run them.",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Built by someone who actually runs peptides."
      intro="Most peptide apps are built by people who don't take peptides. That shows up in every part of the product. Vialwise exists because that gap kept costing me time and trust."
    >
      <p className="text-[15px] text-graphite/80">
        <em>This is a working draft of the founder story. Andrew will edit in his voice before launch.</em>
      </p>

      <hr />

      <h2>The short version</h2>
      <p>
        I&rsquo;m Andrew. I run peptides personally — for recovery, for body composition, for the same reasons a lot of other people in their 30s and 40s do. I&rsquo;m not a doctor. I&rsquo;m not a clinic. I&rsquo;m someone who got tired of doing reconstitution math in a Notes app at 6am while squinting at a u-100 syringe.
      </p>
      <p>
        Every peptide app I tried was built by people who clearly didn&rsquo;t use peptides themselves. The math was wrong, or the UI was a wall of medical-looking dashboards designed to impress investors, or — worst of all — the app was a thinly disguised funnel into a partnered vendor&rsquo;s store. I didn&rsquo;t want a glossy storefront. I wanted a calculator that was actually right.
      </p>

      <h2>Why I&rsquo;m building it</h2>
      <p>
        The honest answer: nobody else was going to. The existing players have been around for years, charge a lot, and still get the basics wrong. The unfair advantage I have isn&rsquo;t engineering — it&rsquo;s that I&rsquo;m the customer. I know which feature requests are real and which are noise, because I&rsquo;m the one who&rsquo;d use them.
      </p>
      <p>
        Vialwise is going to stay deliberately small. v1 is just the calculator and reconstitution date tracking — free, forever, for one peptide. Pro adds unlimited peptides, reminders, and the rest of the toolkit when v2 ships. That&rsquo;s the whole product roadmap. No coaching. No AI personalities. No vendor partnerships. No supplements line.
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
        <Link href="/#beta">join the TestFlight beta</Link> and tell me what&rsquo;s wrong with it. I&rsquo;m looking for honest feedback from people actually running peptides — bodybuilders, GLP-1 patients, biohackers, and anyone in between.
      </p>
      <p>
        You can also email me directly at{" "}
        <a href="mailto:andrew@vialwise.com">andrew@vialwise.com</a>. I read everything and reply to most of it.
      </p>

      <hr />

      <p className="text-[14px] text-graphite/70">
        — Andrew
      </p>
    </PageShell>
  );
}
