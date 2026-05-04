import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Why } from "@/components/Why";
import { Pricing } from "@/components/Pricing";
import { AntiBloat } from "@/components/AntiBloat";
import { FAQ } from "@/components/FAQ";
import { BetaCTA } from "@/components/BetaCTA";
import { Footer } from "@/components/Footer";

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
