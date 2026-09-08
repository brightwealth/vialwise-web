/**
 * Renders a library text field: markdown tables as real tables, 🚨-marked
 * statements as callouts, everything else as paragraphs.
 *
 * WHY TABLES NEED HANDLING AT ALL. The library fields arrive as plain strings,
 * and build-library.mjs preserves a markdown table verbatim inside one. Without
 * this, desmopressin's boxed-warning matrix rendered as a run-on paragraph of
 * pipe characters — which is the single most important content on that entry
 * and was unreadable.
 *
 * Nothing here alters text. Table cells and paragraph text are the source
 * strings; this only decides which element they land in.
 */
import { splitOnAlerts } from "@/lib/library";

/** A markdown table: a pipe row, a `|---|` separator, then body rows. */
const TABLE_RE = /(^\|.*\|[ \t]*\n\|[\s:|-]+\|[ \t]*\n(?:\|.*\|[ \t]*\n?)+)/m;

function parseRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

function MarkdownTable({ source }: { source: string }) {
  const lines = source.trim().split("\n").filter((l) => l.trim());
  const header = parseRow(lines[0]);
  const body = lines.slice(2).map(parseRow);

  return (
    <div className="my-5 overflow-x-auto">
      <table className="w-full border-collapse text-[15px]">
        <thead>
          <tr className="border-b-2 border-espresso/20">
            {header.map((h, i) => (
              <th key={i} className="py-2 pr-4 text-left font-medium text-espresso">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-b border-espresso/10 align-top">
              {row.map((cell, c) => (
                <td key={c} className="py-2 pr-4 text-graphite">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Paragraphs + callouts for a stretch of text with no table in it. */
function Paragraphs({ text }: { text: string }) {
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

export function EntryProse({ text }: { text: string }) {
  if (!text?.trim()) return null;

  // Split around any tables, keeping the prose either side in order.
  const chunks: { table: boolean; text: string }[] = [];
  let rest = text;
  for (;;) {
    const m = TABLE_RE.exec(rest);
    if (!m) {
      if (rest.trim()) chunks.push({ table: false, text: rest });
      break;
    }
    const before = rest.slice(0, m.index);
    if (before.trim()) chunks.push({ table: false, text: before });
    chunks.push({ table: true, text: m[1] });
    rest = rest.slice(m.index + m[1].length);
  }

  return (
    <>
      {chunks.map((c, i) =>
        c.table ? (
          <MarkdownTable key={i} source={c.text} />
        ) : (
          <Paragraphs key={i} text={c.text} />
        )
      )}
    </>
  );
}
