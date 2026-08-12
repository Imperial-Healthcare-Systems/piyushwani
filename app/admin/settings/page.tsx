"use client";

/* ==========================================================================
   ADMIN PORTAL — settings
   --------------------------------------------------------------------------
   There is no backend, so there is no account to manage. Rather than mock up
   a profile form that cannot save anything, this screen shows the operator
   what is actually true: where their data lives, what is still unfilled, and
   which server endpoints the portal is waiting on.

   Everything on the page is either read from the project's own modules
   (lib/cms.ts, lib/config.ts) or derived from the local store. Nothing is
   invented.
   ========================================================================== */

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  IconAlert,
  IconDownload,
  IconExternal,
  IconLogout,
  IconRefresh,
  IconTrash,
} from "@/components/admin/portal/icons";
import { AdminShell } from "@/components/admin/portal/shell";
import { usePortal } from "@/components/admin/portal/store-context";
import { ConfirmDialog } from "@/components/admin/portal/ui";
import { STORAGE_KEYS } from "@/lib/catalogue";
import { API } from "@/lib/config";
import { CMS, CMS_FIELDS, SITE_LABEL, gapList } from "@/lib/cms";

/* Every key lib/catalogue.ts and lib/admin/auth.ts write to, listed so the
   operator can see exactly what "clear local data" will remove. */
const LOCAL_KEYS = [...STORAGE_KEYS, "pw_admin_demo_session_v1"];

const ENDPOINTS: [string, string][] = [
  ["Products", API.adminProducts()],
  ["Site content", API.adminContent()],
  ["Sign in", API.login()],
  ["Sign out", API.logout()],
];

function formatWhen(ms: number): string {
  try {
    return new Date(ms).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

export default function AdminSettingsPage() {
  const { session, signOut, products, categories, content, reload, resetProducts, toast } =
    usePortal();

  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [busy, setBusy] = useState(false);

  const gaps = useMemo(() => gapList(), []);
  const filled = CMS_FIELDS.length - gaps.length;

  /* Exports the working catalogue so a session's edits can leave the browser
     they are trapped in — the only migration path there is without a server. */
  function exportJson() {
    const payload = JSON.stringify({ products, categories, content }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "piyushwani-catalogue.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("Catalogue exported");
  }

  async function clearLocal() {
    setBusy(true);
    for (const k of LOCAL_KEYS) {
      try {
        window.localStorage.removeItem(k);
      } catch {
        /* private mode — nothing was stored to begin with */
      }
    }
    /* The provider outlives this screen (it wraps the whole /admin subtree),
       so it has to be told to re-read — otherwise it would keep serving the
       rows it loaded before the keys were removed. Re-reading finds no keys
       and re-seeds from lib/products.ts. */
    await reload();
    setBusy(false);
    setConfirmClear(false);
    /* Clearing the session notifies the auth store, and the shell's guard
       takes it from there. */
    signOut();
  }

  return (
    <AdminShell
      title="Settings"
      subtitle="Session, local data and the server endpoints this portal is waiting on."
      crumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Settings" }]}
    >
      <div className="apx-set-grid">
        <div>
          <div className="ac-panel">
            <div className="ac-panel-h">
              <h4>Session</h4>
            </div>
            <dl className="apx-view">
              <dt>Signed in as</dt>
              <dd>{session?.email ?? "—"}</dd>
              <dt>Since</dt>
              <dd>{session ? formatWhen(session.signedInAt) : "—"}</dd>
              <dt>Expires</dt>
              <dd>{session ? formatWhen(session.signedInAt + 8 * 60 * 60 * 1000) : "—"}</dd>
            </dl>

            <div className="apx-set-note">
              <span className="apx-set-note-ic" aria-hidden="true">
                <IconAlert size={17} />
              </span>
              <div>
                <strong>Demo sign-in — not secure.</strong>
                <p>
                  The credential pair is compiled into the client bundle and the
                  session is a timestamp this browser wrote for itself. There is
                  no server, no password hashing and no way to change these
                  credentials from this screen. Editing them means editing{" "}
                  <code>lib/admin/auth.ts</code>. Anything behind this sign-in
                  is visible to anyone who opens the page source.
                </p>
              </div>
            </div>

            <button className="ac-btn ac-btn-o" onClick={signOut} style={{ marginTop: ".9rem" }}>
              <IconLogout size={15} /> Sign out
            </button>
          </div>

          <div className="ac-panel">
            <div className="ac-panel-h">
              <h4>Local data</h4>
              <span className="ac-env">Demo data</span>
            </div>
            <p className="ac-hint" style={{ marginTop: 0 }}>
              The catalogue lives in this browser&apos;s local storage. It is not
              shared with other devices, other browsers or anyone else, and a
              private window starts from the seed catalogue every time.
            </p>

            <dl className="apx-view">
              <dt>Products</dt>
              <dd>{products.length}</dd>
              <dt>Categories</dt>
              <dd>{categories.length}</dd>
              <dt>Storage keys</dt>
              <dd className="ac-code">{LOCAL_KEYS.join(", ")}</dd>
            </dl>

            <div className="apx-quick" style={{ marginTop: ".9rem" }}>
              <button className="ac-btn ac-btn-o" onClick={exportJson}>
                <IconDownload size={15} /> Export as JSON
              </button>
              <button className="ac-btn ac-btn-o" onClick={() => setConfirmReset(true)}>
                <IconRefresh size={15} /> Reset demo data
              </button>
              <button className="ac-btn ac-btn-danger" onClick={() => setConfirmClear(true)}>
                <IconTrash size={15} /> Clear local data
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="ac-panel">
            <div className="ac-panel-h">
              <h4>Site information</h4>
              <span className="ac-mini" aria-hidden="true">
                Read-only
              </span>
            </div>
            <p className="ac-hint" style={{ marginTop: 0 }}>
              Company and contact details are rendered on the public site from{" "}
              <code>lib/cms.ts</code>. They are shown here for reference and
              cannot be edited without a content API — an editable form that
              silently discarded its input would be worse than none.
            </p>
            <dl className="apx-view">
              <dt>Site label</dt>
              <dd>{SITE_LABEL}</dd>
              {CMS_FIELDS.filter((f) => CMS[f.key]?.trim()).map((f) => (
                <ViewPair key={f.key} k={f.label} v={CMS[f.key]} />
              ))}
            </dl>
          </div>

          <div className="ac-panel">
            <div className="ac-panel-h">
              <h4>Outstanding content</h4>
              <span className={`ac-tag ${gaps.length ? "t-amber" : "t-green"}`}>
                {filled}/{CMS_FIELDS.length} filled
              </span>
            </div>
            {gaps.length ? (
              <>
                <p className="ac-hint" style={{ marginTop: 0 }}>
                  These fields are still empty and render on the public site as a
                  visible amber gap chip rather than shipping blank or invented.
                </p>
                <ul className="apx-gaps">
                  {gaps.map((g) => (
                    <li key={g.label}>
                      <span>{g.label}</span>
                      <em>{g.where}</em>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="ac-hint" style={{ marginTop: 0 }}>
                Every declared content field has a value.
              </p>
            )}
          </div>

          <div className="ac-panel">
            <div className="ac-panel-h">
              <h4>Backend</h4>
              <span className="ac-tag t-grey">Not connected</span>
            </div>
            <p className="ac-hint" style={{ marginTop: 0 }}>
              The endpoints below are already declared in{" "}
              <code>lib/config.ts</code>. When they exist, the method bodies in{" "}
              <code>lib/catalogue.ts</code> swap from local storage to{" "}
              <code>apiFetch</code> and no screen — public or admin — changes.
            </p>
            <dl className="apx-view">
              {ENDPOINTS.map(([label, path]) => (
                <ViewPair key={path} k={label} v={path} mono />
              ))}
              <dt>API base</dt>
              <dd className="ac-code">{API.BASE || "same origin"}</dd>
            </dl>
            <Link className="ac-btn ac-btn-o" href="/" target="_blank" rel="noreferrer">
              <IconExternal size={15} /> View public site
            </Link>
          </div>
        </div>
      </div>

      {confirmReset ? (
        <ConfirmDialog
          title="Reset demo data"
          confirmLabel="Reset catalogue"
          busy={busy}
          body={
            <p>
              The catalogue returns to the {products.length === 0 ? "" : "seed "}
              records in <strong>lib/products.ts</strong>. Any products you added
              or edited in this browser are discarded.
            </p>
          }
          onConfirm={() => {
            setBusy(true);
            void resetProducts().then(() => {
              setBusy(false);
              setConfirmReset(false);
              toast("Demo catalogue restored");
            });
          }}
          onCancel={() => setConfirmReset(false)}
        />
      ) : null}

      {confirmClear ? (
        <ConfirmDialog
          title="Clear local data"
          confirmLabel="Clear and sign out"
          busy={busy}
          body={
            <>
              <p>
                Every key listed under <strong>Local data</strong> is removed,
                including the session, and you are returned to the sign-in
                screen.
              </p>
              <p style={{ color: "var(--ac-mut)", fontSize: ".82rem" }}>
                Export first if you want to keep this session&apos;s edits — there
                is no server copy to restore from.
              </p>
            </>
          }
          onConfirm={() => void clearLocal()}
          onCancel={() => setConfirmClear(false)}
        />
      ) : null}
    </AdminShell>
  );
}

function ViewPair({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <>
      <dt>{k}</dt>
      <dd className={mono ? "ac-code" : undefined}>{v}</dd>
    </>
  );
}
