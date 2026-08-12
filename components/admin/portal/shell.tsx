"use client";

/* ==========================================================================
   ADMIN PORTAL — application shell
   --------------------------------------------------------------------------
   Sidebar + top bar + breadcrumbs, and the route guard. Rendered as a fixed
   full-viewport surface (the same device the legacy console uses) so the
   public site's header and footer stay out of the operator's way without
   restructuring the app router tree.
   ========================================================================== */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";

import {
  IconBox,
  IconClose,
  IconDashboard,
  IconExternal,
  IconLayout,
  IconLogout,
  IconMenu,
  IconSettings,
  IconTag,
} from "@/components/admin/portal/icons";
import { usePortal } from "@/components/admin/portal/store-context";
import { SITE_LABEL } from "@/lib/cms";

type NavEntry = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  /** marks the section active for nested routes too */
  match: (path: string) => boolean;
};

const NAV: [string, NavEntry[]][] = [
  [
    "Overview",
    [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: IconDashboard,
        match: (p) => p === "/admin" || p === "/admin/dashboard",
      },
    ],
  ],
  [
    "Catalogue",
    [
      {
        href: "/admin/products",
        label: "Products",
        icon: IconBox,
        match: (p) => p.startsWith("/admin/products"),
      },
      {
        href: "/admin/categories",
        label: "Categories",
        icon: IconTag,
        match: (p) => p.startsWith("/admin/categories"),
      },
    ],
  ],
  [
    "Site",
    [
      {
        href: "/admin/content",
        label: "Website Content",
        icon: IconLayout,
        match: (p) => p.startsWith("/admin/content"),
      },
      {
        href: "/admin/settings",
        label: "Settings",
        icon: IconSettings,
        match: (p) => p.startsWith("/admin/settings"),
      },
    ],
  ],
];

export type Crumb = { label: string; href?: string };

export function AdminShell({
  title,
  subtitle,
  crumbs = [],
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready, signOut, products } = usePortal();
  const [navOpen, setNavOpen] = useState(false);

  /* Guard: once the session has been read, an unauthenticated visitor is sent
     to the login screen. `ready` prevents a flash of redirect during hydration. */
  useEffect(() => {
    if (ready && !session) router.replace("/admin/login");
  }, [ready, session, router]);

  /* Route change closes the mobile drawer — adjusted during render so the
     drawer never paints open for a frame on the new screen. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setNavOpen(false);
  }

  if (!ready) {
    return (
      <div className="ac apx-boot">
        <span className="sr-only">Checking session…</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="ac apx-boot">
        <span className="sr-only">Redirecting to sign in…</span>
      </div>
    );
  }

  const draftCount = products.filter((p) => p.status === "draft").length;

  return (
    <div className="ac apx">
      <div className="ac-top">
        <button
          className="apx-burger"
          onClick={() => setNavOpen((v) => !v)}
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={navOpen}
        >
          {navOpen ? <IconClose size={18} /> : <IconMenu size={18} />}
        </button>
        <span className="ac-dot" />
        <b>{SITE_LABEL}</b>
        <span className="apx-top-sep">· Admin</span>
        <span className="ac-env" title="All data is stored in this browser only">
          Demo data
        </span>
        <span className="ac-who">{session.email}</span>
        <Link className="apx-top-link" href="/" target="_blank" rel="noreferrer">
          <IconExternal size={15} />
          <span>View site</span>
        </Link>
        <button className="apx-top-btn" onClick={signOut}>
          <IconLogout size={15} />
          <span>Sign out</span>
        </button>
      </div>

      <div className="ac-shell">
        {navOpen ? (
          <div className="apx-navscrim" onClick={() => setNavOpen(false)} aria-hidden="true" />
        ) : null}

        <nav className={`ac-side${navOpen ? " open" : ""}`} aria-label="Admin sections">
          {NAV.map(([group, entries]) => (
            <div key={group}>
              <div className="ac-grp">{group}</div>
              {entries.map((e) => {
                const on = e.match(pathname);
                const Icon = e.icon;
                return (
                  <Link
                    key={e.href}
                    href={e.href}
                    className={`ac-nav${on ? " on" : ""}`}
                    aria-current={on ? "page" : undefined}
                  >
                    <i>
                      <Icon size={17} />
                    </i>
                    {e.label}
                    {e.href === "/admin/products" && draftCount ? (
                      <span className="ac-badge">{draftCount}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="apx-side-foot">
            <p>
              Frontend demo. Changes are saved to this browser&apos;s local
              storage — no server is involved.
            </p>
          </div>
        </nav>

        <main className="ac-main">
          {crumbs.length ? (
            <nav className="apx-crumbs" aria-label="Breadcrumb">
              <ol>
                {crumbs.map((c, i) => (
                  <li key={`${c.label}-${i}`}>
                    {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div className="ac-hd">
            <div>
              <h1>{title}</h1>
              {subtitle ? <p className="ac-sub">{subtitle}</p> : null}
            </div>
            {actions ? <div className="ac-acts">{actions}</div> : null}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
