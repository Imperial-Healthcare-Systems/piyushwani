"use client";

/* ==========================================================================
   SITE HEADER
   --------------------------------------------------------------------------
   A flat six-item bar gave every destination equal weight, which left no room
   for the one action the site exists to offer. The nav is now grouped into two
   short menus (Company, Products) plus Contact, so "Verify a Batch" reads as
   the primary action rather than a seventh link.

   Menus open on hover with a close delay on desktop, and on click/keyboard
   everywhere — hover alone is not an accessible affordance. On narrow screens
   the whole thing becomes a drawer with the groups expanded inline, because a
   nested dropdown inside a drawer is a trap on touch.
   ========================================================================== */

import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { IMG } from "@/lib/images";

type Leaf = { href: string; label: string; note?: string };
type Entry = { label: string; href?: string; items?: Leaf[] };

const NAV: Entry[] = [
  {
    label: "Company",
    items: [
      { href: "/about", label: "About Us", note: "Who we are and how we operate" },
      { href: "/leadership", label: "Leadership", note: "Founder and directorship" },
      { href: "/team", label: "Our Team", note: "Clinicians we work with" },
      { href: "/certifications", label: "Certifications", note: "Licences with numbers and dates" },
    ],
  },
  {
    label: "Products",
    items: [
      { href: "/products", label: "Product Range", note: "The full catalogue" },
      { href: "/p-wanicure", label: "P-Wanicure", note: "Wellness and personal care" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headRef = useRef<HTMLElement>(null);

  /* Header capsule firms up once the page leaves the top. */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 12);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Route change closes everything. Adjusted during render rather than in an
     effect — an effect here would paint the old open drawer for a frame. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setMenu(null);
  }

  /* The drawer holds the page still behind it. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Escape closes the open menu; a click outside dismisses it. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (!headRef.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const hoverOpen = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(label);
  }, []);

  /* A short grace period so the pointer can cross the gap to the panel. */
  const hoverClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  }, []);

  const isActive = (href: string) => pathname === href;
  const groupActive = (e: Entry) =>
    e.href ? isActive(e.href) : !!e.items?.some((i) => isActive(i.href));

  return (
    <header className={`site-head${scrolled ? " scrolled" : ""}`} ref={headRef}>
      <div className="head-in">
        {/* The lockup already carries the wordmark and the HEALTH | CARE |
            NATURE line, so it replaces the drawn mark and the text beside it
            rather than sitting next to a second copy of the name. Priority:
            it is the largest thing above the fold on every page. */}
        <Link className="brand" href="/" aria-label="Piyushwani — home">
          <NextImage
            src={IMG["logo-nav"].src}
            alt="Piyushwani — Health, Care, Nature"
            width={IMG["logo-nav"].width}
            height={IMG["logo-nav"].height}
            priority
            sizes="(max-width: 560px) 150px, 194px"
          />
        </Link>

        <button
          className="burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className={`nav${open ? " open" : ""}`} aria-label="Main">
          {NAV.map((e) =>
            e.items ? (
              <div
                key={e.label}
                className={`navgrp${menu === e.label ? " open" : ""}`}
                onMouseEnter={() => hoverOpen(e.label)}
                onMouseLeave={hoverClose}
              >
                <button
                  type="button"
                  className={`navgrp-t${groupActive(e) ? " on" : ""}`}
                  aria-expanded={menu === e.label}
                  aria-haspopup="true"
                  onClick={() => setMenu((m) => (m === e.label ? null : e.label))}
                >
                  {e.label}
                  <svg
                    className="caret"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 9l7 7 7-7" />
                  </svg>
                </button>

                <div className="navmenu" role="group" aria-label={e.label}>
                  {e.items.map((i) => (
                    <Link
                      key={i.href}
                      href={i.href}
                      className={isActive(i.href) ? "on" : undefined}
                      onClick={() => {
                        setMenu(null);
                        setOpen(false);
                      }}
                    >
                      <strong>{i.label}</strong>
                      {i.note ? <small>{i.note}</small> : null}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={e.href}
                href={e.href!}
                className={`navlink${isActive(e.href!) ? " on" : ""}`}
                onClick={() => setOpen(false)}
              >
                {e.label}
              </Link>
            ),
          )}

          <Link
            className="btn btn--seal head-cta"
            href="/verify"
            onClick={() => setOpen(false)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            Verify a Batch
          </Link>
        </nav>
      </div>

      {open ? <div className="nav-scrim" onClick={() => setOpen(false)} aria-hidden="true" /> : null}
    </header>
  );
}
