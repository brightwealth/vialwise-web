/**
 * Typed access to the derived peptide library.
 *
 * ⚠️ src/data/library.json is a DERIVED FILE. It is emitted by
 * scripts/build-library-web.mjs in the `vialwise` app repo, which reads the
 * app's own generated library (src/library/peptides/*.ts), which in turn is
 * built from content/peptides/*.md by scripts/build-library.mjs.
 *
 *   content/peptides/*.md  →  build-library.mjs  →  src/library/peptides/*.ts
 *                          →  build-library-web.mjs  →  this JSON
 *
 * The markdown is the ONE source of truth. Never edit the JSON, and never
 * write peptide prose into this repo: the website and the app must not be able
 * to disagree, and the only way to guarantee that is for the website to be
 * strictly downstream of what the app itself compiles.
 *
 * A CI drift check (`build-library-web.mjs --check`) fails if this file no
 * longer matches a fresh emit.
 */
import data from "@/data/library.json";

export type KeyTerm = { term: string; definition: string };

export type QuickReferenceRow = { label: string; value: string };

/**
 * Mirrors Citation in the app's src/library/types.ts EXACTLY.
 *
 * No index signature on purpose. An earlier version of this type guessed
 * `{ number, text, url }` and carried `[key: string]: unknown`, so the real
 * shape type-checked fine and every Sources list rendered as empty <li>
 * elements — blank citations on the pages whose entire differentiator is
 * cited sources. Keep this exact so a shape change is a compile error.
 */
export type Citation = {
  index: number;
  reference: string;
  primaryUrl?: string;
  identifierLabel?: string;
  verified: boolean;
};

export type RelatedEntry = { slug: string; name: string; reason: string };

export type LibraryEntry = {
  slug: string;
  name: string;
  aliases?: string[];
  category: string;
  mechanismClass?: string;
  researchAreas?: string[];
  /** Full regulatory/approval-scope line, verbatim from the entry. */
  status: string;
  fdaApproved?: boolean;
  lastUpdated: string;
  summary?: string;
  beginner?: {
    summary?: string;
    researchFindings?: string;
    evidenceLevel?: string;
    keyTerms?: KeyTerm[];
    /** Carried in full. Never trimmed, never summarised. */
    safetyBasics?: string;
  };
  disclosures?: string[];
  quickReference?: QuickReferenceRow[];
  about?: string[];
  sideEffects?: { common?: string[]; serious?: string[] };
  contraindications?: string[];
  citations?: Citation[];
  web: {
    url: string;
    title: string;
    description: string;
    related: RelatedEntry[];
  };
};

const entries = data.entries as unknown as LibraryEntry[];

/**
 * Build-time validation of the synced artifact.
 *
 * Throws during `next build`, so a corrupted or truncated sync fails the
 * deploy instead of quietly publishing a page with a blank safety section.
 * This does NOT detect staleness (a JSON that parsed fine but predates a
 * markdown edit) — that needs both repos, and is what
 * `build-library-web.mjs --check` is for.
 */
for (const e of entries) {
  const missing = [
    !e.slug && "slug",
    !e.name && "name",
    !e.status?.trim() && "status",
    !e.beginner?.safetyBasics?.trim() && "beginner.safetyBasics",
    !e.citations?.length && "citations",
    !e.web?.title?.trim() && "web.title",
    !e.web?.description?.trim() && "web.description",
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(
      `library.json: entry "${e.slug || "(no slug)"}" is missing ${missing.join(", ")}. ` +
      `Re-sync from the app repo: node scripts/build-library.mjs && ` +
      `node scripts/build-library-web.mjs`
    );
  }
}

export function getAllEntries(): LibraryEntry[] {
  return [...entries].sort((a, b) => a.name.localeCompare(b.name));
}

export function getEntry(slug: string): LibraryEntry | undefined {
  return entries.find((e) => e.slug === slug);
}

export function getAllSlugs(): string[] {
  return entries.map((e) => e.slug);
}

/**
 * Split a field into paragraphs, marking the ones the source flagged with 🚨.
 *
 * The library uses 🚨 as its in-text marker for boxed warnings, WADA status and
 * other safety-critical statements. build-library.mjs strips `**` emphasis but
 * PRESERVES those markers, so they are the reliable signal for rendering a
 * callout.
 *
 * Every character of the input is preserved and emitted — this only decides
 * where a visual break goes. Nothing is dropped, shortened, or reworded.
 */
export function splitOnAlerts(text: string): { alert: boolean; text: string }[] {
  if (!text) return [];
  const parts = text.split(/(?=🚨)/g);
  return parts
    .map((p) => ({ alert: p.trimStart().startsWith("🚨"), text: p.trim() }))
    .filter((p) => p.text.length > 0);
}
