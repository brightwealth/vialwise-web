import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getvialwise.com"),
  title: {
    default: "Vialwise — Peptide tracking, done right.",
    template: "%s — Vialwise",
  },
  description:
    "The honest peptide app. Built by someone who actually runs peptides. No vendor partnerships, no hidden upsells, just a calculator that's actually right.",
  applicationName: "Vialwise",
  keywords: [
    "peptide tracker",
    "peptide calculator",
    "reconstitution calculator",
    "GLP-1 tracker",
    "BPC-157",
    "TB-500",
    "semaglutide calculator",
  ],
  openGraph: {
    type: "website",
    title: "Vialwise — Peptide tracking, done right.",
    description:
      "The honest peptide app. Built by someone who actually runs peptides.",
    url: "https://getvialwise.com",
    siteName: "Vialwise",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vialwise — Peptide tracking, done right.",
    description:
      "The honest peptide app. Built by someone who actually runs peptides.",
  },
  icons: {
    icon: "/brand/vialwise-app-icon.svg",
    apple: "/brand/vialwise-app-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bone text-espresso font-sans">
        {children}
      </body>
    </html>
  );
}
