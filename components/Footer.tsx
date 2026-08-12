import Link from "next/link";

import { CMS } from "@/lib/cms";
import { CAT_TILES } from "@/lib/products";

/* ==========================================================================
   FOOTER
   --------------------------------------------------------------------------
   Compact by design. The previous footer ran to four full bands and about
   700px; this one does the same job in three tight rows, because a footer is
   a place to leave from, not a second homepage.

   Ground is the seal green — the brand's verification colour — rather than
   the navy ink used elsewhere, so the page closes on the mark it opens with.
   The engraved hairlines are drawn in CSS, so the footer no longer pulls a
   background photograph over the wire.

   Nothing here is invented, and nothing unfinished ships. Contact values come
   from lib/cms.ts and categories from lib/products.ts; an identifier with no
   value is dropped rather than rendered as a placeholder. No social accounts
   are declared anywhere in this project, so there is no social row.
   ========================================================================== */

const COMPANY: [string, string][] = [
  ["/about", "About Us"],
  ["/leadership", "Leadership"],
  ["/team", "Our Team"],
  ["/certifications", "Certifications"],
];

const PRODUCTS: [string, string][] = [
  ["/products", "All Products"],
  ...(CAT_TILES.map(([label]) => [
    `/products?category=${encodeURIComponent(label)}`,
    label,
  ]) as [string, string][]),
];

const RESOURCES: [string, string][] = [
  ["/verify", "Verify a Batch"],
  ["/p-wanicure", "P-Wanicure"],
  ["/contact", "Request a Quote"],
  ["/contact", "Contact Us"],
];

/* Statutory identifiers. Entries with no value are filtered out below rather
   than rendered as a placeholder chip — a "[CLIENT: …]" gap is an authoring
   note, and in the public chrome it reads as a broken field. The Drug Licence
   is still listed as outstanding in the console's content panel. */
const IDS: [string, string][] = [
  ["CIN", "U46497DL2025OPC459389"],
  ["GSTIN", "07AAQCP4428A1ZH"],
  ["FSSAI", "13326999000236"],
  ["Udyam", "UDYAM-DL-02-0109844"],
  ["Drug Licence", CMS["compliance.drug_licence"] ?? ""],
];

const LEGAL: [string, string][] = [
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/disclaimer", "Disclaimer"],
];

function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <nav className="pf-col" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {links.map(([href, label]) => (
          <li key={label}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  /* Stamped at generation — the site is statically rendered, so this refreshes
     on each deploy. */
  const year = new Date().getFullYear();

  const phone = CMS["contact.phone"];
  const email = CMS["contact.support_email"];
  const address = CMS["company.address"];

  return (
    <footer className="pf">
      <div className="pf-rule" aria-hidden="true" />

      <div className="wrap">
        {/* ---- row 1: identity, navigation, closing action ---- */}
        <div className="pf-main">
          <div className="pf-id">
            <Link href="/" className="pf-brand" aria-label="Piyushwani — home">
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <rect x="1" y="1" width="38" height="38" rx="3" fill="#02409A" />
                <path
                  d="M12 28V12h7.5a5 5 0 0 1 0 10H12"
                  stroke="#fff"
                  strokeWidth="2.6"
                  fill="none"
                  strokeLinecap="square"
                />
                <circle cx="27.5" cy="27" r="3.4" fill="none" stroke="#6ED45B" strokeWidth="2" />
              </svg>
              <span>
                <strong>Piyushwani</strong>
                <em>OPC Pvt. Ltd.</em>
              </span>
            </Link>

            <p className="pf-blurb">
              Pharmaceutical marketing and distribution, across three brands —
              Piyushwani, P-Wanicure and WaaniGo.
            </p>

            <ul className="pf-contact">
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </li>
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <address>{address}</address>
              </li>
            </ul>
          </div>

          <div className="pf-nav">
            <Col title="Company" links={COMPANY} />
            <Col title="Products" links={PRODUCTS} />
            <Col title="Resources" links={RESOURCES} />
          </div>

          <div className="pf-act">
            <Link className="pf-btn" href="/verify">
              Verify a batch
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <p>Every pack carries a QR code and a batch record.</p>
          </div>
        </div>

        {/* ---- row 2: statutory identifiers ---- */}
        <dl className="pf-ids" aria-label="Statutory identifiers">
          {IDS.filter(([, v]) => v.trim()).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        {/* ---- row 3: legal ---- */}
        <div className="pf-base">
          <p className="pf-disc">
            Health supplements are not for medicinal use and are not intended to
            diagnose, treat, cure or prevent any disease. This site is for
            general reference and is not medical advice.
          </p>
          <div className="pf-base-row">
            <span>© {year} Piyushwani OPC Pvt. Ltd.</span>
            <nav className="pf-legal" aria-label="Legal">
              {LEGAL.map(([href, label]) => (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ))}
              <Link href="/admin" className="pf-admin">
                Admin
              </Link>
            </nav>
            <p className="pf-credit">
              Built by{" "}
              <a
                href="https://www.imperialtechinnovations.com/"
                target="_blank"
                rel="noreferrer noopener"
              >
                Imperial
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
