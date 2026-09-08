/**
 * Layout for every /library route.
 *
 * The research-and-educational disclaimer is mounted HERE rather than on each
 * page so it cannot be omitted from a page by forgetting it. Adding a new
 * entry page cannot produce an undisclaimed page.
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResearchDisclaimer } from "@/components/library/ResearchDisclaimer";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ResearchDisclaimer />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
