"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { API, apiFetch } from "@/lib/config";
import { EXTERNAL_LINK, WAANIGO_SHOP } from "@/lib/waanigo";

type Fields = {
  name: string;
  org: string;
  email: string;
  phone: string;
  type: string;
  qty: string;
  message: string;
  consent: boolean;
};

const EMPTY: Fields = {
  name: "",
  org: "",
  email: "",
  phone: "",
  type: "Bulk order",
  qty: "",
  message: "",
  consent: false,
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function RfqForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [bad, setBad] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const okRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const next: Record<string, boolean> = {
      name: f.name.trim().length === 0,
      email: !EMAIL_RE.test(f.email.trim()),
      phone: !/^\d{10}$/.test(f.phone.replace(/\D/g, "")),
      message: f.message.trim().length === 0,
      consent: !f.consent,
    };
    setBad(next);
    if (Object.values(next).some(Boolean)) return;

    setSending(true);
    const res = await apiFetch<{ reference?: string }>(API.rfq(), {
      method: "POST",
      body: {
        name: f.name.trim(),
        email: f.email.trim(),
        phone: f.phone.trim(),
        type: f.type,
        message: f.message.trim(),
        consent: true,
      },
    });
    setSending(false);

    if (!res.ok) {
      setError(
        res.error === "network"
          ? "We couldn't send your request — please check your connection and try again."
          : "Something went wrong sending your request. Please try again in a moment.",
      );
      return;
    }

    setError(null);
    setReference(res.data?.reference ?? "—");
    setF(EMPTY);
    requestAnimationFrame(() =>
      okRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
    );
  }

  return (
    <div className="form">
      <div className="lab plain">Request a quote</div>
      <h2 className="h-md" style={{ margin: "10px 0 8px" }}>
        Request a Quote
      </h2>
      <p className="muted" style={{ fontSize: ".9rem", marginBottom: 20 }}>
        For bulk purchases, institutional supply or distribution enquiries. For
        single-unit purchases,{" "}
        <a href={WAANIGO_SHOP} {...EXTERNAL_LINK}>
          shop on WaaniGo
        </a>{" "}
        instead.
      </p>

      {reference === null && (
        <form onSubmit={submit} noValidate>
          <div className="f-row">
            <div className={`f${bad.name ? " bad" : ""}`}>
              <label htmlFor="rn">Your name</label>
              <input id="rn" value={f.name} onChange={(e) => set("name", e.target.value)} />
              <span className="err">Please enter your name.</span>
            </div>
            <div className="f">
              <label htmlFor="ro">Company / clinic / pharmacy</label>
              <input id="ro" value={f.org} onChange={(e) => set("org", e.target.value)} />
            </div>
          </div>

          <div className="f-row">
            <div className={`f${bad.email ? " bad" : ""}`}>
              <label htmlFor="re">Email address</label>
              <input id="re" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
              <span className="err">Please enter a valid email address.</span>
            </div>
            <div className={`f${bad.phone ? " bad" : ""}`}>
              <label htmlFor="rp">Phone number</label>
              <input id="rp" inputMode="numeric" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
              <span className="err">Please enter a valid 10-digit phone number.</span>
            </div>
          </div>

          <div className="f-row">
            <div className="f">
              <label htmlFor="rt">Enquiry type</label>
              <select id="rt" value={f.type} onChange={(e) => set("type", e.target.value)}>
                <option>Bulk order</option>
                <option>Distribution partnership</option>
                <option>Institutional supply</option>
                <option>Product information</option>
                <option>Other</option>
              </select>
            </div>
            <div className="f">
              <label htmlFor="rq">Approximate quantity</label>
              <input id="rq" placeholder="Optional" value={f.qty} onChange={(e) => set("qty", e.target.value)} />
            </div>
          </div>

          <div className={`f${bad.message ? " bad" : ""}`} style={{ marginBottom: 16 }}>
            <label htmlFor="rm">Tell us what you need</label>
            <textarea id="rm" maxLength={500} value={f.message} onChange={(e) => set("message", e.target.value)} />
            <span className="err">Please tell us what you need.</span>
          </div>

          <label className="f-check">
            <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />
            <span>
              I agree to the <Link href="/privacy">Privacy Policy</Link> and to
              being contacted about this enquiry.
            </span>
          </label>
          <div className={`f${bad.consent ? " bad" : ""}`} style={{ margin: "-10px 0 14px" }}>
            <span className="err">Please accept the Privacy Policy to continue.</span>
          </div>

          <button className="btn btn--seal" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send request"}
          </button>
        </form>
      )}

      {error && (
        <div className="note note--warn" role="alert" style={{ marginTop: 18 }}>
          {error}
        </div>
      )}

      <div
        ref={okRef}
        className={`f-ok${reference !== null ? " show" : ""}`}
        style={{ marginTop: 18 }}
      >
        <strong>Thank you — your request has been received.</strong>
        Our reference is <span className="mono">{reference ?? "RFQ-0000"}</span>.
        We typically respond within one working day.
      </div>
    </div>
  );
}
