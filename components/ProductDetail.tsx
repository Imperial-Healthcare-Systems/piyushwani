"use client";

/* ==========================================================================
   PRODUCT DETAIL
   --------------------------------------------------------------------------
   Renders the seed record the server prerendered, then swaps in the live
   catalogue once hydrated — so a product the console has edited shows its
   current state, and one the console has added shows at all.

   Every field the project has no real value for still renders as the amber
   [CLIENT: …] gap chip rather than inventing text. Now that the console can
   fill description, usage, benefits, specifications and pack size, a filled
   field renders as itself and the chip disappears. That is the whole point of
   the gap chip: it is a to-do list, not decoration.
   ========================================================================== */

import Link from "next/link";
import NextImage from "next/image";
import { useMemo } from "react";

import { RelatedProducts } from "@/components/catalogue";
import { Arrow, Note, Ph, Rrow } from "@/components/ui";
import { publishedOnly, resolveProduct, type AdminProduct } from "@/lib/catalogue";
import { IMG, type ImageKey } from "@/lib/images";
import { useProducts } from "@/lib/useCatalogue";
import { EXTERNAL_LINK, waanigoProductUrl } from "@/lib/waanigo";

export function ProductDetail({
  param,
  seed,
}: {
  param: string;
  /** null when the server could not resolve the URL from the shipped catalogue. */
  seed: AdminProduct | null;
}) {
  const products = useProducts();

  /* The live catalogue wins; the seed is the pre-hydration fallback. Resolving
     against published products only means a product the operator set back to
     draft stops being reachable here, exactly as it stops being listed. */
  const p = useMemo(
    () => resolveProduct(publishedOnly(products), param) ?? seed,
    [products, param, seed],
  );

  if (!p) return <ProductMissing />;

  const isNut = p.kind === "nut";
  const own = p.image ? IMG[p.image as ImageKey] : undefined;
  const render = own ?? IMG["product-detail"];
  const benefits = p.benefits.filter((b) => b.trim());
  const specs = p.specifications.filter((s) => s.label.trim());

  return (
    <>
      <section className="sect sect--card sect--tight pd-head">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
            <span aria-current="page">{p.name}</span>
          </div>
          <div className="split" style={{ alignItems: "center" }}>
            <div>
              <div className="lab">{isNut ? "Nutraceutical" : "Pharmaceutical"}</div>
              <h1 className="h-lg pd-title">{p.name}</h1>
              {p.composition ? <p className="pd-comp">{p.composition}</p> : null}
              {p.shortDescription ? <p className="lede pd-short">{p.shortDescription}</p> : null}
              <div className="pd-meta">
                {p.form ? (
                  <span>
                    <i>Dosage form</i>
                    <b>{p.form}</b>
                  </span>
                ) : null}
                <span>
                  <i>Category</i>
                  <b>{p.category || (isNut ? "Nutraceutical" : "Pharmaceutical")}</b>
                </span>
                {p.packSize ? (
                  <span>
                    <i>Pack size</i>
                    <b>{p.packSize}</b>
                  </span>
                ) : null}
              </div>
              <div className="pd-cta">
                <Link className="btn btn--seal" href="/verify">
                  Verify a batch
                </Link>
                <Link className="btn btn--line" href="/contact">
                  Request a quote
                </Link>
              </div>
            </div>
            <div className="pd-render">
              <NextImage
                src={render.src}
                alt={
                  own
                    ? `Piyushwani ${p.name} pack`
                    : `Piyushwani ${p.name} — representative pack`
                }
                width={render.width}
                height={render.height}
                priority
              />
              {own ? null : (
                <span className="pd-render-note">Representative image</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap split">
          <div className="body-w">
            <h2 className="h-md" style={{ marginBottom: 12 }}>
              Description
            </h2>
            {p.description ? (
              p.description
                .split(/\n{2,}/)
                .map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p>
                <Ph label="100–150 words — factual description of what the product is and its formulation rationale. Compliance rules apply: no claims that the product cures, treats or prevents any condition" />
              </p>
            )}

            {benefits.length ? (
              <>
                <h2 className="h-md" style={{ margin: "28px 0 12px" }}>
                  Key points
                </h2>
                <ul className="pd-benefits">
                  {benefits.map((b, i) => (
                    <li key={i}>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <h2 className="h-md" style={{ margin: "28px 0 12px" }}>
              Composition
            </h2>
            <Rrow k="Active" first>
              {p.composition ? (
                <p className="mono">{p.composition}</p>
              ) : (
                <p>
                  <Ph label="full composition" />
                </p>
              )}
            </Rrow>
            <Rrow k="Excipients">
              <p>
                <Ph label="full excipient list" />
              </p>
            </Rrow>

            <h2 className="h-md" style={{ margin: "28px 0 12px" }}>
              Directions for use
            </h2>
            {p.usage ? (
              p.usage.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p>
                <Ph label="exactly as printed on the approved pack insert — do not paraphrase" />
              </p>
            )}

            <h2 className="h-md" style={{ margin: "28px 0 12px" }}>
              Storage
            </h2>
            <p>
              Store in a cool, dry place away from direct sunlight. Keep out of
              reach of children.
            </p>

            <Note variant={isNut ? "warn" : undefined} style={{ marginTop: 26 }}>
              {isNut ? (
                <>
                  <strong>Health supplement — not for medicinal use.</strong> This
                  product is not intended to diagnose, treat, cure or prevent any
                  disease. Not a substitute for a balanced diet. Consult a
                  qualified healthcare professional before use. Keep out of reach
                  of children.
                </>
              ) : (
                <>
                  <strong>
                    Use only as directed by a registered medical practitioner.
                  </strong>{" "}
                  Read the pack insert before use. This information is provided
                  for general reference only and does not constitute medical
                  advice.
                </>
              )}
            </Note>
          </div>

          <div className="pd-aside">
            <div className="lab plain" style={{ marginBottom: 12 }}>
              Specifications
            </div>
            <Rrow k="Dosage form" first>
              <p>{p.form || <Ph label="dosage form" />}</p>
            </Rrow>
            <Rrow k="Pack size">
              <p>{p.packSize || <Ph label="pack size" />}</p>
            </Rrow>
            {specs.map((s, i) => (
              <Rrow k={s.label} key={`${s.label}-${i}`}>
                <p>{s.value || <span className="ph">[CLIENT: {s.label}]</span>}</p>
              </Rrow>
            ))}
            <Rrow k="Manufacturer">
              <p>
                <Ph label="contract manufacturer" />
              </p>
            </Rrow>
            <Rrow k="HSN">
              <p>
                <Ph label="HSN code" />
              </p>
            </Rrow>

            <div className="card pd-verify" style={{ marginTop: 22 }}>
              <div className="lab plain">Verify your pack</div>
              <h3 className="h-sm" style={{ margin: "9px 0 8px" }}>
                Every pack carries a QR code
              </h3>
              <p className="muted" style={{ fontSize: ".88rem" }}>
                Scan the code on the reverse to view this batch&apos;s
                manufacturing record.
              </p>
              <Link className="btn btn--seal" href="/verify" style={{ width: "100%" }}>
                Verify a batch
              </Link>
            </div>

            <div className="card pd-actions" style={{ marginTop: 14 }}>
              <h3 className="h-sm" style={{ marginBottom: 12 }}>
                Buy this product
              </h3>
              {/* Deep link straight to this product on the storefront, not to
                  a contact form — WaaniGo is where a single pack is actually
                  bought. The slug is derived from the product name, which is
                  the same key both catalogues use. */}
              <a className="btn btn--line" href={waanigoProductUrl(p)} {...EXTERNAL_LINK}>
                Buy on WaaniGo <Arrow />
              </a>
              <Link className="btn btn--ghost" href="/contact" style={{ marginTop: 12 }}>
                Bulk or distribution enquiry <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts current={p} />
    </>
  );
}

/* Reached when the URL matches nothing in the shipped catalogue and nothing in
   this browser's — a mistyped link, or a product that has since been removed. */
function ProductMissing() {
  return (
    <section className="sect sect--paper">
      <div className="wrap" style={{ maxWidth: 620, textAlign: "center" }}>
        <div className="lab plain" style={{ justifyContent: "center" }}>
          Not available
        </div>
        <h1 className="h-lg" style={{ margin: "12px 0 14px" }}>
          We couldn&apos;t find that product
        </h1>
        <p className="lede" style={{ margin: "0 auto 22px" }}>
          The link may be out of date, or the product may have been withdrawn
          from the catalogue.
        </p>
        <Link className="btn btn--seal" href="/products">
          Browse all products
        </Link>
      </div>
    </section>
  );
}
