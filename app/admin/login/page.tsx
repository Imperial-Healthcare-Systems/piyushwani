"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { IconEye, IconEyeOff } from "@/components/admin/portal/icons";
import { usePortal } from "@/components/admin/portal/store-context";
import { ShieldIcon } from "@/components/icons";
import { DEMO_EMAIL, DEMO_PASSWORD, signIn } from "@/lib/admin/auth";
import { SITE_LABEL } from "@/lib/cms";

export default function AdminLoginPage() {
  const router = useRouter();
  const { session, ready } = usePortal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /* Already signed in — skip the doorway. */
  useEffect(() => {
    if (ready && session) router.replace("/admin/dashboard");
  }, [ready, session, router]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = signIn(email, password);
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
      return;
    }
    /* signIn notifies the session store, so the provider already has the new
       value by the time this navigation resolves. */
    router.replace("/admin/dashboard");
  }

  return (
    <div className="ac-auth">
      <form className="ac-login" onSubmit={onSubmit} noValidate>
        <div className="ac-logo">
          <ShieldIcon />
        </div>
        <h1>{SITE_LABEL} Admin</h1>
        <p className="ac-sub">Catalogue management console</p>

        <label className="ac-lab" htmlFor="ademail">
          Email
        </label>
        <input
          id="ademail"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          style={{ letterSpacing: "normal" }}
        />

        <label className="ac-lab" htmlFor="adpass" style={{ marginTop: ".7rem" }}>
          Password
        </label>
        {/* A long generated password is easy to mistype and impossible to
            proof-read behind dots, so it can be revealed on demand. The button
            stays inside the field so the two read as one control. */}
        <div className="apx-pwfield">
          <input
            id="adpass"
            name="password"
            type={reveal ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="apx-pwtoggle"
            onClick={() => setReveal((v) => !v)}
            aria-pressed={reveal}
            aria-controls="adpass"
            aria-label={reveal ? "Hide password" : "Show password"}
            title={reveal ? "Hide password" : "Show password"}
          >
            {reveal ? <IconEyeOff size={17} /> : <IconEye size={17} />}
          </button>
        </div>

        {error ? (
          <p className="ac-err" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="ac-btn"
          type="submit"
          disabled={busy}
          style={{ width: "100%", marginTop: "1rem", padding: ".7rem" }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <div className="apx-login-note">
          <strong>Demo sign-in — not secure.</strong>
          Credentials are checked in the browser and are readable in the page
          source. There is no server, no password hashing and no real session.
          Do not use this to protect anything.
          <br />
          <br />
          <code>{DEMO_EMAIL}</code>
          <br />
          <code>{DEMO_PASSWORD}</code>
          <button
            type="button"
            className="apx-login-fill"
            onClick={() => {
              setEmail(DEMO_EMAIL);
              setPassword(DEMO_PASSWORD);
              setError(null);
            }}
          >
            Fill demo credentials
          </button>
        </div>
      </form>
    </div>
  );
}
