/**
 * Renders a library text field, promoting its 🚨-marked statements to callouts.
 *
 * The library marks boxed warnings, WADA status and other safety-critical
 * statements inline with 🚨. This gives those visual weight WITHOUT altering,
 * shortening or reordering a single character — splitOnAlerts only decides
 * where a paragraph break falls.
 *
 * Why that restraint matters here: desmopressin's boxed warning is
 * formulation-specific ("the injection carries it, the marketed sprays and
 * tablets do not"). Any compression of that sentence produces a statement that
 * is wrong in one direction or the other, so the whole string ships intact.
 */
import { splitOnAlerts } from "@/lib/library";

export function EntryProse({ text }: { text: string }) {
  return (
    <>
      {splitOnAlerts(text).map((part, i) =>
        part.alert ? (
          <div
            key={i}
            className="my-4 rounded-md border-l-4 border-amber-deep bg-amber/[0.08] px-4 py-3"
          >
            <p className="!my-0 text-[15px] leading-relaxed text-espresso">
              {part.text}
            </p>
          </div>
        ) : (
          <p key={i}>{part.text}</p>
        )
      )}
    </>
  );
}
