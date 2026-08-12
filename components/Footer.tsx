import Link from "next/link";
import NextImage from "next/image";

import { CMS } from "@/lib/cms";
import { IMG } from "@/lib/images";
import { CAT_TILES } from "@/lib/products";
import {
  EXTERNAL_LINK,
  WAANIGO_CATEGORIES,
  WAANIGO_SHOP,
  waanigoCategoryUrl,
} from "@/lib/waanigo";

/* ==========================================================================
   FOOTER
   --------------------------------------------------------------------------
   Three bands: identity + navigation, then contact + closing action, then the
   legal base. Ground is the brand blue deepening into navy, with the leaf
   green as the accent — the logo's own relationship, where a blue shield
   carries a green leaf.

   The statutory identifier register (CIN, GSTIN, FSSAI, Udyam) has been
   removed. Those numbers belong on the invoices and in the certifications
   page, not stamped across every page of the site.

   Two rules this file keeps:

     • Nothing is invented. Contact values come from lib/cms.ts and categories
       from lib/products.ts. No social accounts are declared anywhere in this
       project, so there is no social row — the slot the reference layout gives
       to social icons carries opening hours instead, which is a fact we have.

     • No operator surface in public chrome. The admin console is reachable at
       /admin by the people who need it; advertising the door in the footer of
       a public site only invites the wrong traffic.
   ========================================================================== */

const COMPANY: [string, string][] = [
  ["/about", "About Us"],
  ["/leadership", "Our Leadership"],
  ["/team", "Our Team"],
  ["/certifications", "Certifications"],
];

const PRODUCTS: [string, string][] = [
  ["/products", "All Products"],
  ...(CAT_TILES.map(([label]) => [
    `/products?category=${encodeURIComponent(label)}`,
    label,
  ]) as [string, string][]),
  ["/p-wanicure", "P-Wanicure"],
];

/* Outbound, to the storefront. These are the only links in the footer that
   leave the site, so they are marked as such rather than looking like
   internal navigation. */
const SHOP: [string, string][] = [
  ...(WAANIGO_CATEGORIES.map(({ label, category }) => [
    waanigoCategoryUrl(category),
    label,
  ]) as [string, string][]),
  [WAANIGO_SHOP, "All Products"],
];

const SUPPORT: [string, string][] = [
  ["/contact", "Contact Us"],
  ["/contact", "Request a Quote"],
  ["/verify", "Verify a Batch"],
  [`mailto:${CMS["legal.grievance_email"]}`, "Grievance Officer"],
];

const LEGAL: [string, string][] = [
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Use"],
  ["/disclaimer", "Disclaimer"],
];

/* The four things this company asks to be judged on. Each is a claim the site
   substantiates elsewhere — the certifications page, the batch record, the
   named clinical team — rather than a slogan. */
const MARKS: [string, React.ReactNode][] = [
  [
    "Quality Assured",
    <>
      <path d="M9 3h6M10 3v5.5L5.5 17A2.5 2.5 0 0 0 7.7 21h8.6a2.5 2.5 0 0 0 2.2-4L14 8.5V3" />
      <path d="M7.5 15h9" />
    </>,
  ],
  [
    "Batch Verified",
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>,
  ],
  [
    "Ethical Practices",
    <>
      <path d="M11 20A7 7 0 0 1 18 4h3v3a7 7 0 0 1-7 7h-3" />
      <path d="M11 20v-6" />
    </>,
  ],
  [
    "Patient Focused",
    <>
      <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
      <circle cx="9.5" cy="7" r="3.2" />
      <path d="M21 20v-1.5a4 4 0 0 0-3-3.87" />
      <path d="M16.5 4.13a4 4 0 0 1 0 5.74" />
    </>,
  ],
];

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* The chevron that sits before every link in the nav columns. Drawn once and
   positioned in CSS rather than repeated in markup, so a column of six links
   costs one path, not six. */
function Col({
  title,
  links,
  external,
}: {
  title: string;
  links: [string, string][];
  external?: boolean;
}) {
  return (
    <nav className="pf-col" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {links.map(([href, label]) => (
          <li key={`${href}${label}`}>
            {external ? (
              <a href={href} {...EXTERNAL_LINK}>
                {label}
              </a>
            ) : (
              <Link href={href}>{label}</Link>
            )}
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
  const supportPhone = CMS["contact.support_phone"];
  const email = CMS["contact.support_email"];
  const address = CMS["company.address"];
  const hours = CMS["contact.hours"];

  return (
    <footer className="pf">
      <div className="pf-rule" aria-hidden="true" />

      <div className="wrap">
        {/* ---- band 1: identity and navigation ---- */}
        <div className="pf-main">
          <div className="pf-id">
            {/* The lockup carries the wordmark and the HEALTH | CARE | NATURE
                line already, so it stands alone. It sits on a light plate
                because the artwork's "PIYUSH" is the deep brand blue, which
                would all but vanish against this navy ground. */}
            <Link href="/" className="pf-brand" aria-label="Piyushwani — home">
              <NextImage
                src={IMG["logo-nav"].src}
                alt="Piyushwani — Health, Care, Nature"
                width={IMG["logo-nav"].width}
                height={IMG["logo-nav"].height}
                sizes="232px"
              />
            </Link>

            <p className="pf-blurb">
              Pharmaceutical marketing and distribution across three brands —
              Piyushwani, P-Wanicure and WaaniGo — with every batch traceable
              from the pack it was sold in.
            </p>

            <ul className="pf-marks">
              {MARKS.map(([label, path]) => (
                <li key={label}>
                  <span className="pf-mark-i">
                    <Icon>{path}</Icon>
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="pf-nav">
            <Col title="Company" links={COMPANY} />
            <Col title="Products" links={PRODUCTS} />
            <Col title="Shop on WaaniGo" links={SHOP} external />
            <Col title="Support" links={SUPPORT} />
          </div>
        </div>

        {/* ---- band 2: contact, hours, closing action ---- */}
        <div className="pf-connect">
          <section className="pf-blk">
            <h2>Get in Touch</h2>
            <ul className="pf-contact">
              <li>
                <span className="pf-ci">
                  <Icon>
                    <path d="M20 10c0 5.2-8 12-8 12s-8-6.8-8-12a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="2.8" />
                  </Icon>
                </span>
                <address>{address}</address>
              </li>
              <li>
                <span className="pf-ci">
                  <Icon>
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
                  </Icon>
                </span>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </li>
              <li>
                <span className="pf-ci">
                  <Icon>
                    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
                    <path d="M3 6.5l9 6 9-6" />
                  </Icon>
                </span>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            </ul>
          </section>

          {/* The reference layout puts social icons here. This company has no
              declared social accounts, so the slot carries opening hours — a
              fact we hold — rather than four links to nowhere. */}
          <section className="pf-blk">
            <h2>Opening Hours</h2>
            <ul className="pf-contact">
              <li>
                <span className="pf-ci">
                  <Icon>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5.2l3.2 1.9" />
                  </Icon>
                </span>
                <p>{hours}</p>
              </li>
              <li>
                <span className="pf-ci">
                  <Icon>
                    <path d="M12 2a7 7 0 0 0-7 7v4.5" />
                    <rect x="2.5" y="12.5" width="4" height="6" rx="1.6" />
                    <rect x="17.5" y="12.5" width="4" height="6" rx="1.6" />
                    <path d="M19 18.5v.8a2.7 2.7 0 0 1-2.7 2.7H13" />
                  </Icon>
                </span>
                <span className="pf-sup">
                  Customer support{" "}
                  <a href={`tel:${supportPhone.replace(/\s/g, "")}`}>
                    {supportPhone}
                  </a>
                </span>
              </li>
            </ul>
          </section>

          <section className="pf-blk pf-cta">
            <h2>Verify a Pack</h2>
            <p>
              Every pack carries a QR code and a batch record. Check yours
              against the manufacturing data before you use it.
            </p>
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
          </section>
        </div>

        {/* ---- band 3: legal ---- */}
        <div className="pf-base">
          <p className="pf-disc">
            Health supplements are not for medicinal use and are not intended to
            diagnose, treat, cure or prevent any disease. This site is for
            general reference and is not medical advice.
          </p>
          <div className="pf-base-row">
            <span className="pf-copy">
              © {year} Piyushwani OPC Pvt. Ltd. All rights reserved.
            </span>

            <nav className="pf-legal" aria-label="Legal">
              {LEGAL.map(([href, label]) => (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ))}
            </nav>

            <div className="pf-end">
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
              {/* An empty fragment scrolls the document to the top natively,
                  so the control needs no JavaScript and the footer stays a
                  server component. html{scroll-behavior:smooth} does the rest. */}
              <a className="pf-top" href="#" aria-label="Back to top">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 19V5M6 11l6-6 6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
