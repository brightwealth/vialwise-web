import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Why } from "@/components/Why";
import { Pricing } from "@/components/Pricing";
import { AntiBloat } from "@/components/AntiBloat";
import { FAQ } from "@/components/FAQ";
import { BetaCTA } from "@/components/BetaCTA";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "VialWise: Peptide Reconstitution Calculator & Library",
  },
  description:
    "Free peptide reconstitution calculator. Forward and reverse BAC water math. 56+ peptides with primary-source citations. Research and educational only.",
  alternates: {
    canonical: "https://www.getvialwise.com",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Features />
        <Why />
        <Pricing />
        <AntiBloat />
        <FAQ />
        <BetaCTA />
      </main>
      <Footer />
    </>
  );
}
