"use client";

import Link from "next/link";
import { useState } from "react";

import { API, apiFetch } from "@/lib/config";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function NotifyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("Personal care");
  const [bad, setBad] = useState<{ name?: boolean; email?: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const next = {
      name: name.trim().length === 0,
      email: !EMAIL_RE.test(email.trim()),
    };
    setBad(next);
    if (next.name || next.email) return;

    const res = await apiFetch(API.notify(), {
      method: "POST",
      body: { name: name.trim(), email: email.trim(), phone: phone.trim(), interest, consent: true },
    });

    if (!res.ok) {
      setError(
        res.error === "network"
          ? "We couldn't reach the server — please try again."
          : "Something went wrong. Please try again in a moment.",
      );
      return;
    }

    setError(null);
    setDone(true);
  }

  return (
    <>
      <div className="form">
        <div className="lab plain">Registration</div>
        <h3 className="h-md" style={{ margin: "10px 0 6px" }}>
          Be the first to know
        </h3>
        <p className="muted" style={{ fontSize: ".9rem" }}>
          Leave your details and we&apos;ll let you know when P-Wanicure
          launches.
        </p>

        {!done && (
          <form onSubmit={submit} noValidate>
            <div className={`f${bad.name ? " bad" : ""}`} style={{ marginBottom: 14 }}>
              <label htmlFor="pn">Name</label>
              <input id="pn" value={name} onChange={(e) => setName(e.target.value)} />
              <span className="err">Please enter your name.</span>
            </div>
            <div className={`f${bad.email ? " bad" : ""}`} style={{ marginBottom: 14 }}>
              <label htmlFor="pe">Email</label>
              <input id="pe" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <span className="err">Please enter a valid email address.</span>
            </div>
            <div className="f" style={{ marginBottom: 14 }}>
              <label htmlFor="pp">Phone (optional)</label>
              <input id="pp" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="f" style={{ marginBottom: 18 }}>
              <label htmlFor="pi">Interest area</label>
              <select id="pi" value={interest} onChange={(e) => setInterest(e.target.value)}>
                <option>Personal care</option>
                <option>Wellness</option>
                <option>Retail / distribution</option>
                <option>Other</option>
              </select>
            </div>
            <button className="btn btn--seal" style={{ width: "100%" }} type="submit">
              Notify me
            </button>
          </form>
        )}

        <p className="muted" style={{ fontSize: ".78rem", margin: "12px 0 0" }}>
          By submitting, you agree to our <Link href="/privacy">Privacy Policy</Link>.
          We&apos;ll only use these details to tell you about the P-Wanicure launch.
        </p>

        {error && (
          <div className="note note--warn" role="alert" style={{ marginTop: 14 }}>
            {error}
          </div>
        )}

        <div className={`f-ok${done ? " show" : ""}`} style={{ marginTop: 14 }}>
          <strong>Thank you.</strong> We&apos;ll be in touch when P-Wanicure
          launches.
        </div>
      </div>
      <p className="muted" style={{ fontSize: ".82rem", marginTop: 16 }}>
        P-Wanicure is a unit of Piyushwani OPC Pvt. Ltd.
      </p>
    </>
  );
}
