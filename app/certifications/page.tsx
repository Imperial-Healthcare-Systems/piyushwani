import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

import { Crumb, Media, Note } from "@/components/ui";
import { CERTS } from "@/lib/certs";

export const metadata: Metadata = {
  title: "Certifications & Licences — Piyushwani OPC Pvt. Ltd.",
  description:
    "Licence numbers, issuing authorities and validity periods published in full, so you can verify them independently with the issuing body.",
};

export default function CertificationsPage() {
  return (
    <>
      <section className="sect sect--card">
        <div className="wrap split" style={{ alignItems: "center" }}>
          <Media
            img="certifications"
            alt="Piyushwani quality assurance laboratory with ISO and WHO-GMP certifications on display"
            className="img-col"
            style={{ order: 0 }}
          />
          <div>
            <Crumb>Certifications</Crumb>
            <div className="lab">Compliance</div>
            <h1 className="h-xl" style={{ margin: "14px 0 18px" }}>
              Certifications
              <br />
              &amp; Licences
            </h1>
            <p className="lede">
              Anyone can display a certification badge. We publish the licence
              numbers, issuing authorities and validity periods so you can verify
              them independently with the issuing body.
            </p>
          </div>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap">
          <div className="grid g-2">
            {CERTS.map((c) => (
              <div
                className={`cert ${c.feature ? "feature" : ""}`}
                key={c.k}
                style={
                  c.pending
                    ? {
                        borderColor: "var(--amber)",
                        boxShadow: "0 0 0 3px rgba(180,118,26,.08)",
                      }
                    : undefined
                }
              >
                <div className="cert-h">
                  <h3 className="h-md">{c.k}</h3>
                  <span
                    className="cert-badge"
                    style={c.pending ? { background: "#FCF0DC", color: "#7A5310" } : undefined}
                  >
                    {c.badge}
                  </span>
                </div>

                <dl className="dl">
                  {c.rows.map(([label, value]) => (
                    <Fragment key={label}>
                      <dt>{label}</dt>
                      <dd>
                        <b className={value.startsWith("[CLIENT") ? "ph" : undefined}>
                          {value}
                        </b>
                      </dd>
                    </Fragment>
                  ))}
                </dl>

                <p className="explain">{c.x}</p>

                {!c.pending && (
                  <Link className="btn btn--line" href="/contact" style={{ alignSelf: "flex-start" }}>
                    Download certificate
                  </Link>
                )}
              </div>
            ))}
          </div>

          <Note variant="warn" style={{ marginTop: 26 }}>
            <strong>Drug licence pending.</strong> Piyushwani&rsquo;s application
            for a drug licence is in progress. Until it is granted, this website
            presents product information only — no pharmaceutical product is
            offered for sale on this site, and purchases are not accepted here.
          </Note>

          <Note style={{ marginTop: 12 }}>
            Our manufacturing partners hold their own separate licences and
            certifications. The relevant manufacturing licence number for any
            given product appears on its batch verification page.
          </Note>
        </div>
      </section>
    </>
  );
}
