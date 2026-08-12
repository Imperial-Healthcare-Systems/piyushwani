/* ==========================================================================
   LICENCE STRIP
   --------------------------------------------------------------------------
   The thin trust band above the header. Certifications only: the statutory
   registration numbers (CIN, GSTIN, FSSAI, Udyam) live in the footer's
   identifier band, and repeating Udyam in both places was the same fact
   stated twice on one page.

   Driven by an array rather than written out as markup, so an entry with no
   value is simply not rendered. The Drug Licence used to sit here as a
   literal "[CLIENT: DL no.]" — a content-authoring placeholder that had
   escaped into the public chrome, where it reads to a visitor as a bug
   rather than as a to-do. It stays tracked in the console's Outstanding
   content list; it just no longer ships.
   ========================================================================== */

import { CMS } from "@/lib/cms";

const ITEMS: [string, string][] = [
  ["ISO 9001", "3090QAF23"],
  ["LMPC", "GOI/DL/2026/5357"],
  ["Drug Licence (CDSCO)", CMS["compliance.drug_licence"] ?? ""],
];

export default function LicenceStrip() {
  const shown = ITEMS.filter(([, v]) => v.trim());
  if (shown.length === 0) return null;

  return (
    <div className="licstrip">
      <div className="wrap">
        {shown.map(([label, value]) => (
          <span key={label}>
            {label} <b>{value}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
