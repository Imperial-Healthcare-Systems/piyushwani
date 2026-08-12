import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { CrossIcon, TickIcon, VerifiedSeal, WarnIcon } from "@/components/icons";
import type { Batch } from "@/lib/batches";

/* States shown while / around the async verify call. */

export function VerifyLoading({ code }: { code: string }) {
  return (
    <div className="rec" aria-busy="true">
      <div className="rec-bar">
        <TickIcon />
        <div>
          <strong>Checking our records…</strong>
          <small>{code}</small>
        </div>
      </div>
    </div>
  );
}

export function VerifyNotFound({ code }: { code: string }) {
  return (
    <div className="rec is-bad">
      <div className="rec-bar">
        <CrossIcon />
        <div>
          <strong>We have no record of this code.</strong>
          <small>{code}</small>
        </div>
      </div>
      <div className="rec-body">
        <p>
          This code doesn&apos;t match any batch in our records. That could mean
          the code was mistyped, the code was damaged in printing, or this
          product was not released by us.
        </p>
        <p>
          <strong>Please do not use the product until this is resolved.</strong>
        </p>
        <p style={{ margin: 0 }}>
          Check the code and try again, or contact us with a photograph of the
          pack. We investigate every report.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <Link className="btn btn--line" href="/contact">
            Report this pack
          </Link>
        </div>
      </div>
    </div>
  );
}

export function VerifyError({ code }: { code: string }) {
  return (
    <div className="rec is-warn">
      <div className="rec-bar">
        <WarnIcon />
        <div>
          <strong>We couldn&apos;t reach the verification service.</strong>
          <small>{code}</small>
        </div>
      </div>
      <div className="rec-body">
        <p>
          This is a problem on our side, not with your pack. Please check your
          connection and try again in a moment.
        </p>
        <p style={{ margin: 0 }}>
          If it keeps happening, contact us with the batch code and we&apos;ll
          verify it for you directly.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <Link className="btn btn--line" href="/contact">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}

function Dl({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="dl">
      {rows.map(([dt, dd]) => (
        <Fragment key={dt}>
          <dt>{dt}</dt>
          <dd>
            <b>{dd}</b>
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}

/** Renders a verification record returned by the API. */
export default function BatchRecord({ b }: { b: Batch | null }) {
  if (!b) return <VerifyNotFound code="" />;

  const bar =
    b.state === "ok"
      ? { cls: "is-ok", ic: <TickIcon />, t: "Verified.", s: "Released by Piyushwani (OPC) Private Limited" }
      : b.state === "warn"
        ? { cls: "is-warn", ic: <WarnIcon />, t: "Verified — expiring soon.", s: "Check remaining shelf life" }
        : b.kind === "expired"
          ? { cls: "is-bad", ic: <WarnIcon />, t: "This batch is past its expiry date.", s: "Do not use this product" }
          : { cls: "is-bad", ic: <WarnIcon />, t: "This batch has been withdrawn.", s: "Do not use this product" };

  let notice: ReactNode = null;
  if (b.state === "warn") {
    notice = (
      <div className="note note--warn" style={{ marginBottom: 16 }}>
        {b.warn}
      </div>
    );
  } else if (b.kind === "expired") {
    notice = (
      <div className="note note--warn" style={{ marginBottom: 16 }}>
        This is a genuine Piyushwani batch, but it expired on{" "}
        <strong>{b.exp}</strong>. Do not use this product. Please dispose of it
        safely and contact your retailer.
      </div>
    );
  } else if (b.kind === "withdrawn") {
    notice = (
      <div className="note note--warn" style={{ marginBottom: 16 }}>
        This batch was withdrawn from circulation on{" "}
        <strong>{b.withdrawn}</strong>. Do not use this product. Please contact
        us for guidance on return or replacement.
      </div>
    );
  }

  const scans =
    typeof b.scans === "number" ? b.scans.toLocaleString("en-IN") : b.scans;

  return (
    <div className={`rec ${bar.cls}`}>
      <div className="rec-bar">
        {bar.ic}
        <div>
          <strong>{bar.t}</strong>
          <small>{bar.s}</small>
        </div>
      </div>

      <div className="rec-body">
        {notice}
        {b.state === "ok" ? <VerifiedSeal /> : null}

        <h3 className="h-sm" style={{ marginBottom: 4 }}>
          {b.product}
        </h3>
        <p className="muted" style={{ fontSize: ".84rem", marginBottom: 14 }}>
          {b.brand} · {b.pack} · {b.form}
        </p>

        <div className="lab plain" style={{ marginBottom: 2 }}>
          Origin
        </div>
        <Dl
          rows={[
            ["Manufacturer", b.mfr],
            ["Site", b.site],
            ["Mfg. licence", b.lic],
            ["Country", "India"],
          ]}
        />

        <div className="lab plain" style={{ margin: "18px 0 2px" }}>
          Composition
        </div>
        <p style={{ fontSize: ".86rem", margin: "8px 0 0" }}>{b.comp}</p>

        <div className="lab plain" style={{ margin: "18px 0 2px" }}>
          Batch details
        </div>
        <dl className="dl">
          <dt>Batch number</dt>
          <dd><b>{b.batch}</b></dd>
          <dt>Manufactured</dt>
          <dd><b>{b.mfg}</b></dd>
          <dt>Expires</dt>
          <dd>
            <b style={{ color: b.state === "ok" ? "var(--seal)" : "var(--alert)" }}>
              {b.exp}
            </b>
          </dd>
          <dt>Batch size</dt>
          <dd><b>{b.size}</b></dd>
          <dt>Released</dt>
          <dd><b>{b.released}</b></dd>
        </dl>

        <div className="lab plain" style={{ margin: "18px 0 2px" }}>
          Certifications
        </div>
        <div className="qual" style={{ marginTop: 8 }}>
          <span>Drug Licence (CDSCO)</span>
          <span>ISO 9001</span>
          <span>LMPC</span>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
          <Link className="btn btn--line" href="/contact">
            Download COA
          </Link>
          <Link className="btn btn--ghost" href="/contact">
            Report a concern →
          </Link>
        </div>

        <p className="rec-note">
          Scanned {scans} times · First scanned {b.first}
        </p>
      </div>
    </div>
  );
}
