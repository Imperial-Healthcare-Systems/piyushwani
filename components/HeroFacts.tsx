"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/* Headline figures count up once, when they first come into view.
   Read as instrument readings settling: a single decelerating run, no spin,
   no overshoot.

   The final figures are what render on the server, so the markup is correct
   for crawlers, for a visitor with JavaScript off, and for anyone who has
   asked for reduced motion. Only when motion is welcome does the client zero
   them — before paint, so nothing flashes — and count them back up.

   Values are written straight to the DOM rather than held in state: at 60fps
   this would otherwise re-render the component around seventy times for a
   purely visual effect. */

type Fact = { value: number; suffix?: string; label: string };

const FACTS: Fact[] = [
  { value: 11, label: "Products at launch" },
  { value: 3, label: "Brands" },
  { value: 5, label: "Registrations held" },
  { value: 100, suffix: "%", label: "Batches traceable" },
];

const DURATION = 1150;
/** Backstop: the figures land on the truth by this point, whatever happens. */
const SAFETY_MS = 2600;

/* Decelerating — quick off the mark, easing into the final reading. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* useLayoutEffect warns when it runs during server rendering; this is the
   standard isomorphic form. The zeroing must happen before paint. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function motionAllowed() {
  return (
    document.documentElement.getAttribute("data-motion") === "on" &&
    typeof IntersectionObserver !== "undefined"
  );
}

export default function HeroFacts() {
  const ref = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLElement | null)[]>([]);
  const armed = useRef(false);

  // Before paint: if we are going to animate, start the readings at zero.
  useIsoLayoutEffect(() => {
    if (!motionAllowed()) return;
    armed.current = true;
    FACTS.forEach((f, i) => {
      const el = cells.current[i];
      if (el) el.textContent = `0${f.suffix ?? ""}`;
    });
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || !armed.current) return;

    // Captured for the cleanup path, which must not read a moved ref.
    const targets = cells.current;
    let frame = 0;
    let start = 0;

    /* The true figures, written unconditionally. Cheap and idempotent. */
    const settle = () => {
      FACTS.forEach((f, i) => {
        const el = targets[i];
        if (el) el.textContent = `${f.value}${f.suffix ?? ""}`;
      });
    };

    const run = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / DURATION, 1);
      const eased = easeOut(t);

      FACTS.forEach((f, i) => {
        const el = targets[i];
        if (el) el.textContent = `${Math.round(f.value * eased)}${f.suffix ?? ""}`;
      });

      if (t < 1) frame = requestAnimationFrame(run);
      else settle();
    };

    let started = false;
    const start_ = () => {
      if (started) return;
      started = true;
      frame = requestAnimationFrame(run);
    };

    /* The readings must never be left sitting at zero, so the backstop is
       armed on mount rather than inside the observer — an observer that never
       delivers would otherwise never arm it. Covers a throttled tab, a
       browser without observer support, and headless renderers. */
    const backstop = setTimeout(settle, SAFETY_MS);

    // Already on screen — the usual case for a hero — so begin at once
    // instead of waiting on an async callback.
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const rect = node.getBoundingClientRect();
    const onScreen = rect.top < viewportH && rect.bottom > 0;

    let observer: IntersectionObserver | null = null;
    if (onScreen || typeof IntersectionObserver === "undefined") {
      start_();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer?.disconnect();
            start_();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(backstop);
      // Whatever happens, leave the true figures on screen.
      settle();
    };
  }, []);

  return (
    <div className="hero-facts" ref={ref}>
      {FACTS.map((f, i) => (
        <div className="fact" key={f.label}>
          <strong
            ref={(el) => {
              cells.current[i] = el;
            }}
          >
            {f.value}
            {f.suffix ?? ""}
          </strong>
          <span>{f.label}</span>
        </div>
      ))}
    </div>
  );
}
