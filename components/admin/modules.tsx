"use client";

/* Every console module lives at module scope so that editor drafts survive a
   parent re-render — components declared inside a render function are new
   identities each pass and remount, throwing away their local state. */

import { useState } from "react";

import { Hd, Pager, SearchBar, Th } from "@/components/admin/chrome";
import { useAdmin } from "@/components/admin/context";
import { CATS_KEYS, HAS_PRICE, INBOX_LABEL, type Doctor } from "@/components/admin/types";
import { QrMock } from "@/components/icons";
import { mintCode, type Batch } from "@/lib/batches";
import { CMS_FIELDS, SITE_LABEL } from "@/lib/cms";
import { API } from "@/lib/config";
import { productRow, toProduct } from "@/lib/products";

/* ---------------------------------------------------------------- dashboard */

export function Dashboard() {
  const { products, batches, certs, gaps, log, goTab } = useAdmin();

  const stats = [
    { k: "Products", v: products.length, n: "published on the informative site" },
    { k: "Batches", v: Object.keys(batches).length, n: "with public verification records" },
    { k: "Registrations", v: certs.filter((c) => !c.pending).length, n: "held and published" },
    { k: "Content gaps", v: gaps.length, n: "fields still awaiting client input" },
  ];

  const scans = Object.values(batches).reduce((n, b) => n + (b.scans || 0), 0);
  const top = Object.entries(batches)
    .map(([c, b]) => ({ c, n: b.scans || 0 }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);
  const max = Math.max(1, ...top.map((t) => t.n));

  return (
    <>
      <Hd title="Dashboard" sub="Live state of the site — every figure below is editable from this console" />

      <div className="ac-kpis">
        {stats.map((s) => (
          <div className="ac-kpi" key={s.k}>
            <span className="l">{s.k}</span>
            <b>{s.v}</b>
            <span className="d">{s.n}</span>
          </div>
        ))}
      </div>

      <div className="ac-cols">
        <div>
          <div className="ac-panel">
            <div className="ac-panel-h">
              <h4>Batch verification — most scanned</h4>
              <span className="ac-tag t-grey">{scans.toLocaleString("en-IN")} total scans</span>
            </div>
            {top.length ? (
              <div className="ac-bars">
                {top.map((t) => (
                  <div className="ac-bar-row" key={t.c}>
                    <span className="ac-bar-l ac-code">{t.c}</span>
                    <span className="ac-bar-t">
                      <i style={{ width: `${Math.round((t.n / max) * 100)}%` }} />
                    </span>
                    <b>{t.n.toLocaleString("en-IN")}</b>
                  </div>
                ))}
              </div>
            ) : (
              <p className="ac-empty">No scans recorded.</p>
            )}
            <p className="ac-hint" style={{ marginTop: ".7rem" }}>
              A cluster of failed scans from one region is the earliest signal of
              counterfeit stock. Misses are logged too, not just hits.
            </p>
          </div>

          <div className="ac-panel">
            <div className="ac-panel-h">
              <h4>Outstanding content</h4>
              <button className="ac-btn ac-btn-o ac-btn-sm" onClick={() => goTab("content")}>
                Fill these in
              </button>
            </div>
            {gaps.length ? (
              <>
                <div className="ac-scroll">
                  <table className="ac-table" style={{ minWidth: 0 }}>
                    <tbody>
                      {gaps.slice(0, 7).map((g) => (
                        <tr key={g.label}>
                          <td>
                            <strong>{g.label}</strong>
                          </td>
                          <td>
                            <span className="ac-tag t-amber">{g.where}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {gaps.length > 7 && (
                  <p className="ac-hint" style={{ marginTop: ".6rem" }}>
                    and {gaps.length - 7} more.
                  </p>
                )}
              </>
            ) : (
              <p className="ac-empty">Nothing outstanding.</p>
            )}
          </div>
        </div>

        <div>
          <div className="ac-panel">
            <h4>Blocking before launch</h4>
            <ul className="ac-timeline">
              <li>
                <strong>Drug Licence</strong>
                <time>TBD on the intake form — no product requiring one can be sold until granted</time>
              </li>
              <li>
                <strong>Schedule H / H1 classification</strong>
                <time>Unanswered — decides whether the prescription workflow ships</time>
              </li>
              <li>
                <strong>Product data</strong>
                <time>Intake §8 and §9 blank — catalogue below is sample data</time>
              </li>
              <li>
                <strong>Contract manufacturer</strong>
                <time>Required on every batch record and on labelling</time>
              </li>
            </ul>
          </div>

          <div className="ac-panel">
            <h4>Recent activity</h4>
            {log.length ? (
              <ul className="ac-timeline">
                {log.slice(0, 5).map((l, i) => (
                  <li key={i}>
                    <strong>
                      {l.action} · {l.entity}
                    </strong>
                    <time>
                      {l.detail} — {l.t.toLocaleTimeString("en-IN")}
                    </time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ac-empty">No changes yet this session.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- content */

export function Content() {
  const { q, cms, setCms, audit, toast } = useAdmin();

  const needle = q.toLowerCase();
  const matched = CMS_FIELDS.filter(
    (f) => !needle || f.label.toLowerCase().includes(needle) || f.key.toLowerCase().includes(needle),
  );
  const groups = matched.reduce<Record<string, typeof CMS_FIELDS>>((acc, f) => {
    (acc[f.group] ||= []).push(f);
    return acc;
  }, {});

  const total = CMS_FIELDS.length;
  const filled = CMS_FIELDS.filter((f) => (cms[f.key] || "").toString().trim()).length;

  return (
    <>
      <Hd
        title="Site content"
        sub="Every field the public pages read. Saving records the change for this session; production writes go to the content API."
        actions={
          <button
            className="ac-btn"
            onClick={() => {
              audit("update", "SiteSetting", "content fields");
              toast("Content saved for this session.");
            }}
          >
            Save all changes
          </button>
        }
      />

      <div className="ac-kpis">
        <div className="ac-kpi">
          <span className="l">Fields complete</span>
          <b>
            {filled} / {total}
          </b>
          <span className="d">{Math.round((filled / total) * 100)}% of the content the site needs</span>
        </div>
        <div className={`ac-kpi ${total - filled ? "warn" : ""}`}>
          <span className="l">Awaiting client</span>
          <b>{total - filled}</b>
          <span className="d">shown as amber chips on the public site</span>
        </div>
      </div>

      <SearchBar placeholder="Search fields…" />

      {Object.keys(groups).length === 0 ? (
        <p className="ac-empty">No fields match that search.</p>
      ) : (
        Object.entries(groups).map(([g, items]) => (
          <div className="ac-panel" key={g}>
            <h4>{g}</h4>
            <div className="ac-fields">
              {items.map((f) => {
                const v = cms[f.key] ?? "";
                const isFilled = String(v).trim().length > 0;
                const set = (val: string) => setCms((prev) => ({ ...prev, [f.key]: val }));
                return (
                  <div className={`ac-field ${f.long ? "wide" : ""} ${isFilled ? "" : "empty"}`} key={f.key}>
                    <label htmlFor={`ac-${f.key}`}>
                      {f.label}
                      {f.req ? <em>required</em> : null}
                    </label>
                    {f.long ? (
                      <textarea id={`ac-${f.key}`} value={v} onChange={(e) => set(e.target.value)} />
                    ) : (
                      <input id={`ac-${f.key}`} value={v} onChange={(e) => set(e.target.value)} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </>
  );
}

/* ---------------------------------------------------------------- products */

function ProductEditor({ i }: { i: number }) {
  const { products, setProducts, setEdit, audit, toast } = useAdmin();

  const [draft, setDraft] = useState(() =>
    i === -1
      ? { name: "", comp: "", form: "", cat: CATS_KEYS[0] || "", price: 0, rx: false, stock: true }
      : productRow(products[i]),
  );
  const set = <K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) =>
    setDraft((p) => ({ ...p, [k]: v }));

  return (
    <div className="ac-panel" style={{ borderColor: "var(--ac-acc)" }}>
      <div className="ac-panel-h">
        <h4>{i === -1 ? "New product" : "Edit product"}</h4>
        <button className="ac-mini" onClick={() => setEdit(null)}>
          Close
        </button>
      </div>

      <div className="ac-fields">
        <div className="ac-field">
          <label>Product name</label>
          <input value={draft.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="ac-field">
          <label>Composition / descriptor</label>
          <input value={draft.comp} onChange={(e) => set("comp", e.target.value)} />
        </div>
        <div className="ac-field">
          <label>Dosage form</label>
          <input value={draft.form} onChange={(e) => set("form", e.target.value)} />
        </div>
        {CATS_KEYS.length > 0 && (
          <div className="ac-field">
            <label>Category</label>
            <select value={draft.cat} onChange={(e) => set("cat", e.target.value)}>
              {CATS_KEYS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
        {HAS_PRICE && (
          <div className="ac-field">
            <label>Selling price (₹)</label>
            <input type="number" value={draft.price} onChange={(e) => set("price", Number(e.target.value) || 0)} />
          </div>
        )}
        <div className="ac-field">
          <label>Prescription required</label>
          <select value={draft.rx ? "1" : "0"} onChange={(e) => set("rx", e.target.value === "1")}>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div className="ac-field">
          <label>In stock</label>
          <select value={draft.stock ? "1" : "0"} onChange={(e) => set("stock", e.target.value === "1")}>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>

      <div className="ac-note" style={{ marginTop: ".9rem" }}>
        Product copy is governed by §A2 of the content document — no
        &ldquo;cures&rdquo;, &ldquo;treats&rdquo; or &ldquo;prevents&rdquo;, and no
        unsubstantiated superlatives. Nutraceutical listings carry the mandatory
        &ldquo;not for medicinal use&rdquo; disclaimer automatically.
      </div>

      <div className="ac-acts" style={{ marginTop: ".9rem" }}>
        <button
          className="ac-btn"
          onClick={() => {
            const rec = { ...draft, name: draft.name.trim() || "Untitled product" };
            const next = toProduct(rec);
            setProducts((prev) =>
              i === -1 ? [...prev, next] : prev.map((p, j) => (j === i ? { ...p, ...next } : p)),
            );
            audit(i === -1 ? "create" : "update", "Product", rec.name);
            toast(i === -1 ? "Product created." : "Product updated.");
            setEdit(null);
          }}
        >
          Save product
        </button>
        {i > -1 && (
          <button
            className="ac-btn ac-btn-danger"
            onClick={() => {
              const nm = products[i]?.n ?? "";
              setProducts((prev) => prev.filter((_, j) => j !== i));
              audit("delete", "Product", nm);
              toast("Product deleted.");
              setEdit(null);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export function Products() {
  const { q, products, edit, setEdit, sortRows, paginate } = useAdmin();

  const needle = q.toLowerCase();
  let rows = products
    .map((p, i) => ({ i, ...productRow(p) }))
    .filter((r) => !needle || `${r.name} ${r.comp} ${r.cat}`.toLowerCase().includes(needle));

  const keys = HAS_PRICE ? ["name", "cat", "form", "price", "rx"] : ["name", "cat", "form", "rx"];
  rows = sortRows(rows, keys);
  const { slice, pages, current } = paginate(rows);

  const headers = HAS_PRICE
    ? ["Product", "Category", "Form", "Price", "Flags", ""]
    : ["Product", "Category", "Form", "Flags", ""];

  return (
    <>
      <Hd
        title="Products"
        sub={`${products.length} items — edits are held for this session`}
        actions={
          <button className="ac-btn" onClick={() => setEdit({ kind: "product", i: -1 })}>
            New product
          </button>
        }
      />
      <SearchBar placeholder="Search products…" />

      {slice.length ? (
        <>
          <div className="ac-scroll">
            <table className="ac-table">
              <thead>
                <Th labels={headers} />
              </thead>
              <tbody>
                {slice.map((r) => (
                  <tr key={r.i}>
                    <td>
                      <strong>{r.name}</strong>
                      {r.comp ? (
                        <>
                          <br />
                          <small>{r.comp.slice(0, 58)}</small>
                        </>
                      ) : null}
                    </td>
                    <td>{r.cat}</td>
                    <td>{r.form}</td>
                    {HAS_PRICE && <td className="ac-num">₹{r.price.toLocaleString("en-IN")}</td>}
                    <td>
                      {r.rx ? <span className="ac-tag t-purple">Rx</span> : null}{" "}
                      {r.stock ? (
                        <span className="ac-tag t-green">In stock</span>
                      ) : (
                        <span className="ac-tag t-grey">Out</span>
                      )}
                    </td>
                    <td>
                      <button className="ac-mini" onClick={() => setEdit({ kind: "product", i: r.i })}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={current} pages={pages} />
        </>
      ) : (
        <div className="ac-scroll">
          <p className="ac-empty">No products match that search.</p>
        </div>
      )}

      {edit?.kind === "product" && <ProductEditor i={edit.i} key={edit.i} />}
    </>
  );
}

/* ---------------------------------------------------------------- batches */

function BatchEditor() {
  const { products, batches, setBatches, setEdit, audit, toast } = useAdmin();

  const [draft, setDraft] = useState(() => ({
    product: products[0]?.n ?? "",
    batch: "",
    mfg: "",
    exp: "",
    size: "",
    pack: "",
  }));
  const set = (k: keyof typeof draft, v: string) => setDraft((p) => ({ ...p, [k]: v }));

  return (
    <div className="ac-panel" style={{ borderColor: "var(--ac-acc)" }}>
      <div className="ac-panel-h">
        <h4>Create batch</h4>
        <button className="ac-mini" onClick={() => setEdit(null)}>
          Close
        </button>
      </div>

      <div className="ac-fields">
        <div className="ac-field">
          <label>Product</label>
          <select value={draft.product} onChange={(e) => set("product", e.target.value)}>
            {products.slice(0, 60).map((p) => (
              <option key={p.n}>{p.n}</option>
            ))}
          </select>
        </div>
        <div className="ac-field">
          <label>Batch number</label>
          <input value={draft.batch} onChange={(e) => set("batch", e.target.value)} placeholder="PWN-2608-A01" />
        </div>
        <div className="ac-field">
          <label>Manufactured</label>
          <input value={draft.mfg} onChange={(e) => set("mfg", e.target.value)} placeholder="August 2026" />
        </div>
        <div className="ac-field">
          <label>Expires</label>
          <input value={draft.exp} onChange={(e) => set("exp", e.target.value)} placeholder="July 2029" />
        </div>
        <div className="ac-field">
          <label>Batch size</label>
          <input value={draft.size} onChange={(e) => set("size", e.target.value)} placeholder="24,000 packs" />
        </div>
        <div className="ac-field">
          <label>Pack size</label>
          <input value={draft.pack} onChange={(e) => set("pack", e.target.value)} placeholder="10 × 10 tablets" />
        </div>
      </div>

      <div className="ac-acts" style={{ marginTop: ".9rem" }}>
        <button
          className="ac-btn"
          onClick={() => {
            const code = mintCode((c) => c in batches);
            const record: Batch = {
              state: "ok",
              product: draft.product || products[0]?.n || "—",
              brand: SITE_LABEL,
              pack: draft.pack || "—",
              form: "—",
              batch: draft.batch || `PWN-${code.slice(2, 6)}`,
              mfg: draft.mfg || "—",
              exp: draft.exp || "—",
              size: draft.size || "—",
              released: "—",
              comp: "[CLIENT: composition snapshot]",
              mfr: "[CLIENT: contract manufacturer name]",
              site: "[CLIENT: manufacturing site address]",
              lic: "[CLIENT: mfg licence no.]",
              scans: 0,
              first: "—",
            };
            setBatches((prev) => ({ ...prev, [code]: record }));
            audit("create", "Batch", code);
            toast(
              <>
                Batch minted — code <b>{code}</b>. Try it on the Verify page.
              </>,
            );
            setEdit({ kind: "qr", code });
          }}
        >
          Mint code &amp; save
        </button>
      </div>
    </div>
  );
}

function QrPanel({ code }: { code: string }) {
  const { setEdit } = useAdmin();
  return (
    <div className="ac-panel" style={{ borderColor: "var(--ac-acc)" }}>
      <div className="ac-panel-h">
        <h4>QR label — {code}</h4>
        <button className="ac-mini" onClick={() => setEdit(null)}>
          Close
        </button>
      </div>
      <div className="ac-qr-wrap">
        <div className="ac-qr">
          <QrMock seed={code} />
        </div>
        <div>
          <p className="ac-hint">
            Printed on the reverse of every unit in this batch, with the
            human-readable code beneath it so a customer can type it if the camera
            fails.
          </p>
          <p className="ac-bigcode">{code}</p>
          <p className="ac-hint">
            Verification URL <code>/verify/{code}</code>
          </p>
          <div className="ac-note warn" style={{ marginTop: ".8rem" }}>
            This code is identical on every unit in the batch, so it proves{" "}
            <strong>batch provenance</strong>, not individual-unit authenticity.
            Unit-level anti-counterfeiting needs a scratch-off code per pack — a
            printing and logistics change worth settling before labels are ordered.
          </div>
        </div>
      </div>
    </div>
  );
}

export function Batches() {
  const { q, batches, setBatches, edit, setEdit, sortRows, paginate, audit, toast } = useAdmin();

  const needle = q.toLowerCase();
  let rows = Object.entries(batches)
    .map(([code, b]) => ({
      code,
      product: b.product,
      batch: b.batch,
      exp: b.exp,
      status:
        b.state === "ok"
          ? "Active"
          : b.state === "warn"
            ? "Near expiry"
            : b.kind === "expired"
              ? "Expired"
              : "Withdrawn",
      scans: b.scans || 0,
    }))
    .filter((r) => !needle || `${r.code} ${r.product} ${r.batch}`.toLowerCase().includes(needle));

  rows = sortRows(rows, ["code", "product", "batch", "exp", "status", "scans"]);
  const { slice, pages, current } = paginate(rows);
  const tagOf = (s: string) => (s === "Active" ? "t-green" : s === "Near expiry" ? "t-amber" : "t-red");

  return (
    <>
      <Hd
        title="Batches & QR"
        sub="Each batch mints an unguessable public code. Try one on the Verify page once the API serves it."
        actions={
          <button className="ac-btn" onClick={() => setEdit({ kind: "batch" })}>
            Create batch
          </button>
        }
      />
      <SearchBar placeholder="Search by code, product or batch number…" />

      {slice.length ? (
        <>
          <div className="ac-scroll">
            <table className="ac-table">
              <thead>
                <Th labels={["Verify code", "Product", "Batch no.", "Expires", "Status", "Scans", ""]} />
              </thead>
              <tbody>
                {slice.map((r) => (
                  <tr key={r.code}>
                    <td className="ac-code">
                      <strong>{r.code}</strong>
                    </td>
                    <td>{r.product}</td>
                    <td className="ac-code">{r.batch}</td>
                    <td>{r.exp}</td>
                    <td>
                      <span className={`ac-tag ${tagOf(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="ac-num">{r.scans.toLocaleString("en-IN")}</td>
                    <td>
                      <button className="ac-mini" onClick={() => setEdit({ kind: "qr", code: r.code })}>
                        QR label
                      </button>
                      {r.status !== "Withdrawn" && (
                        <button
                          className="ac-mini danger"
                          onClick={() => {
                            setBatches((prev) => ({
                              ...prev,
                              [r.code]: {
                                ...prev[r.code],
                                state: "bad",
                                kind: "withdrawn",
                                withdrawn: new Date().toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }),
                              },
                            }));
                            audit("withdraw", "Batch", r.code);
                            toast(`Batch ${r.code} withdrawn — the public record now warns against use.`);
                          }}
                        >
                          Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={current} pages={pages} />
        </>
      ) : (
        <div className="ac-scroll">
          <p className="ac-empty">No batches match that search.</p>
        </div>
      )}

      {edit?.kind === "batch" && <BatchEditor />}
      {edit?.kind === "qr" && <QrPanel code={edit.code} key={edit.code} />}

      <div className="ac-note" style={{ marginTop: "1rem" }}>
        Codes come from a 30-symbol alphabet with <code>0/O/1/I/L</code> removed —
        sequential codes would let a counterfeiter enumerate valid URLs, and the
        omitted glyphs cut transcription errors when someone reads a code off a
        pack.
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- certs */

export function Certs() {
  const { certs, setCerts, audit, toast } = useAdmin();

  return (
    <>
      <Hd title="Certifications" sub="Numbers and validity dates exactly as published on the public site." />

      <div className="ac-cols" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        {certs.map((c, i) => (
          <div className="ac-panel" key={c.k}>
            <div className="ac-panel-h">
              <h4>{c.k}</h4>
              <span className={`ac-tag ${c.pending ? "t-amber" : "t-green"}`}>
                {c.pending ? "Pending" : "Held"}
              </span>
            </div>

            <div className="ac-fields">
              {c.rows.map(([label, value], j) => {
                const blank = String(value).startsWith("[CLIENT");
                return (
                  <div className={`ac-field ${blank ? "empty" : ""}`} key={label}>
                    <label>{label}</label>
                    <input
                      value={blank ? "" : value}
                      placeholder={value}
                      onChange={(e) =>
                        setCerts((prev) =>
                          prev.map((cc, ci) =>
                            ci !== i
                              ? cc
                              : {
                                  ...cc,
                                  rows: cc.rows.map(
                                    (rr, rj) => (rj === j ? [rr[0], e.target.value] : rr) as [string, string],
                                  ),
                                },
                          ),
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>

            <button
              className="ac-btn ac-btn-sm"
              style={{ marginTop: ".8rem" }}
              onClick={() => {
                let granted = false;
                setCerts((prev) =>
                  prev.map((cc, ci) => {
                    if (ci !== i || !cc.pending) return cc;
                    const num = cc.rows.find((r) => /number/i.test(r[0]))?.[1] ?? "";
                    if (!num || String(num).startsWith("[CLIENT")) return cc;
                    granted = true;
                    return {
                      ...cc,
                      pending: false,
                      badge: "Statutory",
                      rows: cc.rows.filter((r) => r[0] !== "Status"),
                    };
                  }),
                );
                audit("update", "Certification", c.k);
                toast(
                  granted
                    ? "Drug Licence recorded — the public site can now display it."
                    : "Certification saved.",
                );
              }}
            >
              Save
            </button>
          </div>
        ))}
      </div>

      <div className="ac-note warn" style={{ marginTop: "1rem" }}>
        The Drug Licence card stays <strong>pending</strong> until a number is
        entered. Enter one and the public Certifications page switches from
        &ldquo;Application in progress&rdquo; to a published licence. Claiming
        drug-licensed status before the licence is granted is a live legal
        exposure, so the public site omits the claim rather than showing a blank.
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- team */

function DocEditor({ i }: { i: number }) {
  const { doctors, setDoctors, setEdit, audit, toast } = useAdmin();

  const [draft, setDraft] = useState<Doctor>(() =>
    i === -1
      ? { name: "", qual: "", spec: "", years: "", affil: "", engagement: "", consent: false }
      : doctors[i],
  );
  const set = <K extends keyof Doctor>(k: K, v: Doctor[K]) => setDraft((p) => ({ ...p, [k]: v }));

  return (
    <div className="ac-panel" style={{ borderColor: "var(--ac-acc)" }}>
      <div className="ac-panel-h">
        <h4>{i === -1 ? "Add doctor" : "Edit doctor"}</h4>
        <button className="ac-mini" onClick={() => setEdit(null)}>
          Close
        </button>
      </div>

      <div className="ac-fields">
        <div className="ac-field">
          <label>Full name</label>
          <input value={draft.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="ac-field">
          <label>Qualifications</label>
          <input value={draft.qual} onChange={(e) => set("qual", e.target.value)} placeholder="MBBS, MD (Medicine)" />
        </div>
        <div className="ac-field">
          <label>Specialisation</label>
          <input value={draft.spec} onChange={(e) => set("spec", e.target.value)} />
        </div>
        <div className="ac-field">
          <label>Years of experience</label>
          <input value={draft.years} onChange={(e) => set("years", e.target.value)} />
        </div>
        <div className="ac-field">
          <label>Current affiliation</label>
          <input value={draft.affil} onChange={(e) => set("affil", e.target.value)} />
        </div>
        <div className="ac-field wide">
          <label>Engagement with Piyushwani</label>
          <input
            value={draft.engagement}
            onChange={(e) => set("engagement", e.target.value)}
            placeholder="Advises on formulation review for the nutraceutical range"
          />
        </div>
      </div>

      <div className="ac-setrow" style={{ marginTop: ".9rem" }}>
        <div>
          <strong>Written consent on file</strong>
          <p>Required before this profile can appear on the public team page.</p>
        </div>
        <button
          className={`ac-switch ${draft.consent ? "on" : ""}`}
          role="switch"
          aria-checked={draft.consent}
          aria-label="Written consent recorded"
          onClick={() => set("consent", !draft.consent)}
        />
      </div>

      <div className="ac-acts" style={{ marginTop: ".9rem" }}>
        <button
          className="ac-btn"
          onClick={() => {
            setDoctors((prev) => (i === -1 ? [...prev, draft] : prev.map((d, j) => (j === i ? draft : d))));
            audit(i === -1 ? "create" : "update", "TeamMember", draft.name || "unnamed");
            toast(draft.consent ? "Doctor saved and publishable." : "Saved as draft — consent not recorded.");
            setEdit(null);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export function Team() {
  const { doctors, edit, setEdit } = useAdmin();

  return (
    <>
      <Hd
        title="Team & associated doctors"
        sub="Doctor profiles stay in draft until written consent is recorded."
        actions={
          <button className="ac-btn" onClick={() => setEdit({ kind: "doc", i: -1 })}>
            Add doctor
          </button>
        }
      />

      <div className="ac-kpis">
        <div className="ac-kpi">
          <span className="l">Employees to feature</span>
          <b>8</b>
          <span className="d">confirmed on the intake form</span>
        </div>
        <div className="ac-kpi">
          <span className="l">Doctors added</span>
          <b>{doctors.length}</b>
          <span className="d">{doctors.filter((x) => x.consent).length} publishable</span>
        </div>
        <div className={`ac-kpi ${doctors.some((x) => !x.consent) ? "warn" : ""}`}>
          <span className="l">Consent missing</span>
          <b>{doctors.filter((x) => !x.consent).length}</b>
          <span className="d">cannot be published</span>
        </div>
      </div>

      {doctors.length ? (
        <div className="ac-scroll">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Qualifications</th>
                <th>Engagement</th>
                <th>Consent</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {doctors.map((x, i) => (
                <tr key={i}>
                  <td>
                    <strong>{x.name || "Unnamed"}</strong>
                  </td>
                  <td>{x.qual || "—"}</td>
                  <td>{(x.engagement || "—").slice(0, 44)}</td>
                  <td>
                    {x.consent ? (
                      <span className="ac-tag t-green">Recorded</span>
                    ) : (
                      <span className="ac-tag t-red">Missing</span>
                    )}
                  </td>
                  <td>
                    {x.consent && x.name ? (
                      <span className="ac-tag t-green">Publishable</span>
                    ) : (
                      <span className="ac-tag t-amber">Draft</span>
                    )}
                  </td>
                  <td>
                    <button className="ac-mini" onClick={() => setEdit({ kind: "doc", i })}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ac-scroll">
          <p className="ac-empty">
            No doctors added. The intake form records the count as &ldquo;TBD&rdquo;.
          </p>
        </div>
      )}

      <div className="ac-note" style={{ marginTop: "1rem" }}>
        Publishing a clinician&rsquo;s photograph, qualifications and hospital
        affiliation requires their <strong>written consent</strong>, and their
        hospital may have its own policy on commercial association. A profile stays
        in Draft until consent is recorded — the public page cannot render it
        otherwise.
      </div>

      {edit?.kind === "doc" && <DocEditor i={edit.i} key={edit.i} />}
    </>
  );
}

/* ---------------------------------------------------------------- inbox */

export function Inbox() {
  const { inbox } = useAdmin();

  return (
    <>
      <Hd title={INBOX_LABEL} sub="Submissions captured from the public site during this session." />
      {inbox.length ? (
        <div className="ac-scroll">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Detail</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {inbox.map((r) => (
                <tr key={r.ref}>
                  <td className="ac-code">{r.ref}</td>
                  <td>{r.name}</td>
                  <td>{r.contact}</td>
                  <td>{r.detail}</td>
                  <td>
                    <small>{r.at}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ac-scroll">
          <p className="ac-empty">
            Nothing yet. Quote requests arrive here once <code>{API.rfq()}</code> is
            serving them.
          </p>
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- settings */

export function Settings() {
  const { settings, setSettings, audit } = useAdmin();

  return (
    <>
      <Hd title="Settings" sub="Operational switches. In production these persist server-side." />
      {settings.map((s, i) => (
        <div className="ac-setrow" key={s.label}>
          <div>
            <strong>{s.label}</strong>
            <p>{s.help}</p>
          </div>
          <button
            className={`ac-switch ${s.on ? "on" : ""}`}
            role="switch"
            aria-checked={s.on}
            aria-label={s.label}
            onClick={() => {
              setSettings((prev) => prev.map((x, j) => (j === i ? { ...x, on: !x.on } : x)));
              audit("update", "Setting", `${s.label}: ${!s.on ? "on" : "off"}`);
            }}
          />
        </div>
      ))}
      <div className="ac-note" style={{ marginTop: "1rem" }}>
        Roles, staff accounts and permission levels sit in the production schema (
        <code>User</code>, <code>Role</code>, <code>AuditLog</code>) and are managed
        server-side — they are not exposed here because there is no server to
        enforce them.
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- audit */

export function Audit() {
  const { log } = useAdmin();

  return (
    <>
      <Hd title="Audit log" sub="Every change made in this session. Production writes this to an immutable table." />
      {log.length ? (
        <div className="ac-scroll">
          <table className="ac-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {log.map((l, i) => (
                <tr key={i}>
                  <td>
                    <small>{l.t.toLocaleTimeString("en-IN")}</small>
                  </td>
                  <td>
                    <span className="ac-tag t-grey">{l.action}</span>
                  </td>
                  <td>{l.entity}</td>
                  <td>
                    <small>{l.detail}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ac-scroll">
          <p className="ac-empty">No changes yet this session.</p>
        </div>
      )}
      <div className="ac-note" style={{ marginTop: "1rem" }}>
        An immutable audit trail — who changed what, when, and the before/after
        values — is strongly recommended for a regulated business. The{" "}
        <code>AuditLog</code> model belongs in the production schema.
      </div>
    </>
  );
}
