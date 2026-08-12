"use client";

import { useEffect } from "react";

/* ============================================================
   Scroll reveal driver.

   The hidden state lives in CSS behind [data-motion="on"], which
   a pre-paint script in the layout sets before first paint — so
   nothing flashes into view and nothing is ever hidden when the
   visitor has asked for reduced motion.

   Content is never left depending on a single async callback to
   become visible. Three routes get an element revealed:

     1. it is already in the viewport  → revealed on the next frame
     2. it scrolls into view           → revealed by the observer
     3. neither fired within 5s        → revealed by the safety net

   Anything short of that risks a blank page for a visitor whose
   browser, or a crawler whose renderer, never delivers an
   IntersectionObserver entry.
   ============================================================ */

/** Ordered by how they read on a page: headings, then bodies, then plates. */
const TARGETS = [
  ".head-block",
  ".hero-media",
  ".hero-visual .term",
  ".fact",
  ".card",
  ".cert",
  ".trust-tile",
  ".p-card",
  ".person",
  ".cattile",
  ".media",
  ".figure-plate",
  ".pd-render",
  ".form",
  ".note",
  ".rrow",
  ".gal figure",
].join(",");

/** Stagger step, and the cap so long lists never crawl. */
const STEP_MS = 55;
const MAX_STEPS = 6;
/** Backstop: nothing stays hidden longer than this, whatever happens. */
const SAFETY_MS = 5000;

export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;

    // The pre-paint script arms a failsafe that un-hides everything if this
    // component never mounts. It did mount, so stand it down — the safety
    // net below takes over that duty with finer granularity.
    const w = window as Window & { __pwMotionFailsafe?: ReturnType<typeof setTimeout> };
    if (w.__pwMotionFailsafe) {
      clearTimeout(w.__pwMotionFailsafe);
      delete w.__pwMotionFailsafe;
    }

    // No attribute means reduced motion, or the failsafe already fired.
    if (root.getAttribute("data-motion") !== "on") return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    if (els.length === 0) return;

    // Stagger by position among siblings so a grid ripples, but a lone
    // element never waits.
    const seen = new Map<Element, number>();
    for (const el of els) {
      const parent = el.parentElement;
      let index = 0;
      if (parent) {
        index = seen.get(parent) ?? 0;
        seen.set(parent, index + 1);
      }
      el.style.setProperty("--d", `${Math.min(index, MAX_STEPS) * STEP_MS}ms`);
      el.setAttribute("data-reveal", "");
    }

    const reveal = (el: Element) => el.classList.add("is-in");

    // Route 1 — anything already on screen animates in on the next frame,
    // without waiting for an observer callback that may never arrive.
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const pending: HTMLElement[] = [];
    for (const el of els) {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportH && rect.bottom > 0) pending.push(el);
    }
    const frame = requestAnimationFrame(() => pending.forEach(reveal));

    // Route 2 — everything else waits its turn.
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            reveal(entry.target);
            observer?.unobserve(entry.target);
          }
        },
        // Fire a little before the element reaches the viewport, so the
        // movement finishes as it arrives rather than starting late.
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
      );
      for (const el of els) {
        if (!pending.includes(el)) observer.observe(el);
      }
    }

    // Route 3 — the backstop. Covers a browser with no observer support, a
    // renderer that never delivers entries, and any element we mis-measured.
    const safety = setTimeout(() => els.forEach(reveal), SAFETY_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(safety);
      observer?.disconnect();
    };
  }, []);

  return null;
}
