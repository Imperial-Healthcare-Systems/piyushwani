"use client";

/* ==========================================================================
   ADMIN CONSOLE  —  /admin
   --------------------------------------------------------------------------
   Deliberately NOT glass. An operator lives in this screen for hours entering
   batch numbers and licence details; translucency behind dense tabular data
   costs legibility and buys nothing. Solid surfaces, high contrast, tight
   density. The glass language belongs to the storefront.

   No password lives in the front end. Auth is a server call that returns a
   token; the token is kept in sessionStorage and sent on every admin request
   via apiFetch.

   Edits are held in console state for the session. The public pages are
   server-rendered from lib/, so persistence is the job of the content API —
   those endpoints are already declared in lib/config.ts.
   ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { AdminProvider, type AdminCtx } from "@/components/admin/context";
import {
  Audit,
  Batches,
  Certs,
  Content,
  Dashboard,
  Inbox,
  Products,
  Settings,
  Team,
} from "@/components/admin/modules";
import {
  ADMIN_NAV_GROUPS,
  SETTINGS_ROWS,
  type AdminTab,
  type AuditEntry,
  type Doctor,
  type EditState,
  type InboxRow,
  type SettingRow,
} from "@/components/admin/types";
import { ShieldIcon } from "@/components/icons";
import type { Batch } from "@/lib/batches";
import { CERTS, type Cert } from "@/lib/certs";
import { CMS, SITE_LABEL, gapList, type CmsValues } from "@/lib/cms";
import { ADMIN_TOKEN_KEY, API, apiFetch } from "@/lib/config";
import { PRODUCTS, type Product } from "@/lib/products";

const PER_PAGE = 10;

const MODULES: Record<AdminTab, () => ReactNode> = {
  dashboard: Dashboard,
  content: Content,
  products: Products,
  batches: Batches,
  certs: Certs,
  team: Team,
  inbox: Inbox,
  settings: Settings,
  audit: Audit,
};

export default function AdminConsole() {
  const [authed, setAuthed] = useState(false);
  const [loginErr, setLoginErr] = useState<string | null>(null);

  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [edit, setEdit] = useState<EditState>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [page, setPage] = useState(1);
  const [log, setLog] = useState<AuditEntry[]>([]);

  /* Session-scoped working copies of everything the console can edit. */
  const [cms, setCms] = useState<CmsValues>(() => ({ ...CMS }));
  const [products, setProducts] = useState<Product[]>(() => PRODUCTS.map((p) => ({ ...p })));
  const [certs, setCerts] = useState<Cert[]>(() =>
    CERTS.map((c) => ({ ...c, rows: c.rows.map((r) => [...r] as [string, string]) })),
  );
  const [batches, setBatches] = useState<Record<string, Batch>>({});
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [settings, setSettings] = useState<SettingRow[]>(() => SETTINGS_ROWS.map((s) => ({ ...s })));
  const inbox = useMemo<InboxRow[]>(() => [], []);

  /* ------------------------------------------------------------- toast */
  const [toastMsg, setToastMsg] = useState<ReactNode>(null);
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((msg: ReactNode) => {
    setToastMsg(msg);
    setToastOn(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 3000);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const audit = useCallback((action: string, entity: string, detail: string) => {
    setLog((prev) => [{ t: new Date(), action, entity, detail }, ...prev].slice(0, 80));
  }, []);

  const goTab = useCallback((t: AdminTab) => {
    setTab(t);
    setEdit(null);
    setQ("");
    setSort(null);
    setPage(1);
  }, []);

  const setQuery = useCallback((v: string) => {
    setQ(v);
    setPage(1);
  }, []);

  const onSort = useCallback(
    (i: number) => {
      if (sort === i) setDir((d) => (d === 1 ? -1 : 1));
      else {
        setSort(i);
        setDir(1);
      }
    },
    [sort],
  );

  const sortRows = useCallback(
    <T extends Record<string, unknown>>(rows: T[], keys: string[]): T[] => {
      if (sort == null) return rows;
      const k = keys[sort];
      if (!k) return rows;
      return rows.slice().sort((a, b) => {
        const x = a[k];
        const y = b[k];
        const numeric = typeof x === "number" && typeof y === "number";
        return (numeric ? x - y : String(x).localeCompare(String(y))) * dir;
      });
    },
    [sort, dir],
  );

  const paginate = useCallback(
    <T,>(rows: T[]) => {
      const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
      const current = page > pages ? 1 : page;
      return {
        slice: rows.slice((current - 1) * PER_PAGE, current * PER_PAGE),
        pages,
        current,
      };
    },
    [page],
  );

  const gaps = useMemo(() => gapList(cms), [cms]);

  const ctx = useMemo<AdminCtx>(
    () => ({
      tab,
      goTab,
      edit,
      setEdit,
      q,
      setQuery,
      sort,
      dir,
      onSort,
      setPage,
      sortRows,
      paginate,
      cms,
      setCms,
      products,
      setProducts,
      certs,
      setCerts,
      batches,
      setBatches,
      doctors,
      setDoctors,
      settings,
      setSettings,
      inbox,
      log,
      audit,
      toast,
      gaps,
    }),
    [
      tab, goTab, edit, q, setQuery, sort, dir, onSort, sortRows, paginate,
      cms, products, certs, batches, doctors, settings, inbox, log, audit, toast, gaps,
    ],
  );

  /* ------------------------------------------------------------- auth */

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    setLoginErr("Signing in…");
    const res = await apiFetch<{ token?: string }>(API.login(), {
      method: "POST",
      body: { email, password },
    });

    if (res.ok && res.data?.token) {
      window.sessionStorage.setItem(ADMIN_TOKEN_KEY, res.data.token);
      setAuthed(true);
      setLoginErr(null);
      audit("login", "Session", email || "admin");
    } else if (res.error === "network") {
      setLoginErr("Couldn't reach the server. Check your connection and try again.");
    } else {
      setLoginErr("Those credentials are not correct.");
    }
  }

  function signOut() {
    void apiFetch(API.logout(), { method: "POST" });
    window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setAuthed(false);
    setLoginErr(null);
  }

  /* ---------------------------------------------------------------- login
     The one place glass IS appropriate — it's a doorway, not a workspace. */
  if (!authed) {
    return (
      <div className="ac-auth">
        <form className="ac-login" onSubmit={signIn} noValidate>
          <div className="ac-logo">
            <ShieldIcon />
          </div>
          <h1>{SITE_LABEL} Admin</h1>
          <p className="ac-sub">Content management console</p>

          <label className="ac-lab" htmlFor="acemail">
            Email
          </label>
          <input id="acemail" name="email" type="email" autoComplete="username" placeholder="you@piyushwani.co" />

          <label className="ac-lab" htmlFor="acpass" style={{ marginTop: ".7rem" }}>
            Password
          </label>
          <input id="acpass" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />

          {loginErr ? <p className="ac-err">{loginErr}</p> : null}

          <button className="ac-btn" type="submit" style={{ width: "100%", marginTop: "1rem", padding: ".7rem" }}>
            Sign in
          </button>

          <div className="ac-warn">
            <strong>Server-backed sign-in.</strong>
            Credentials are checked by <code>POST {API.login()}</code>. Until that
            endpoint exists this form reports that it cannot reach the server —
            which is the honest result, not a bypass.
          </div>
        </form>
      </div>
    );
  }

  const Body = MODULES[tab] ?? Dashboard;

  return (
    <AdminProvider value={ctx}>
      <div className="ac">
        <div className="ac-top">
          <span className="ac-dot" />
          <b>{SITE_LABEL}</b>
          <span style={{ opacity: 0.45 }}>· Admin</span>
          <span className="ac-env">Session data</span>
          <span className="ac-who">Shiwani Bansal · Super Admin</span>
          <button
            className="ac-btn ac-btn-sm"
            style={{ marginLeft: ".8rem", background: "rgba(255,255,255,.14)" }}
            onClick={signOut}
          >
            Sign out
          </button>
        </div>

        <div className="ac-shell">
          <nav className="ac-side" aria-label="Admin sections">
            {ADMIN_NAV_GROUPS.map(([grp, items]) => (
              <div key={grp}>
                <div className="ac-grp">{grp}</div>
                {items.map(([k, glyph, label]) => (
                  <button
                    key={k}
                    className={`ac-nav${tab === k ? " on" : ""}`}
                    aria-current={tab === k}
                    onClick={() => goTab(k)}
                  >
                    <i>{glyph}</i>
                    {label}
                    {k === "content" && gaps.length ? <span className="ac-badge">{gaps.length}</span> : null}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <main className="ac-main">
            <Body />
          </main>
        </div>
      </div>

      <div className={`ac-toast${toastOn ? " on" : ""}`} role="status">
        {toastMsg}
      </div>
    </AdminProvider>
  );
}
