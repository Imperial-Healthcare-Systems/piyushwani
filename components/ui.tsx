import Link from "next/link";
import NextImage from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { cmsLookup } from "@/lib/cms";
import { IMG, type ImageKey } from "@/lib/images";

/* ---------- content placeholder ----------
   Resolves through the CMS. When a value exists it renders as plain text;
   when it does not, it renders the amber gap chip so nothing ships silently
   blank. */
export function Ph({ label }: { label: string }) {
  const hit = cmsLookup(label);
  if (hit) return <>{hit}</>;
  return <span className="ph">[CLIENT: {label}]</span>;
}

/* ---------- inline arrow ----------
   Used in ghost links so the glyph can be animated on hover without the
   label shifting. A text "→" cannot be transformed independently. */
export function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ---------- section heading block ---------- */
export function HeadBlock({
  lab,
  title,
  lede,
  className,
}: {
  lab: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`head-block ${className ?? ""}`}>
      <div className="lab">{lab}</div>
      <h2 className="h-lg">{title}</h2>
      {lede ? (
        <p className="lede" style={{ marginTop: 14 }}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- breadcrumb ---------- */
export function Crumb({ children }: { children: ReactNode }) {
  return (
    <div className="crumb">
      <Link href="/">Home</Link> / {children}
    </div>
  );
}

/* ---------- the record row — this site's structural device ---------- */
export function Rrow({
  k,
  children,
  first,
}: {
  k: ReactNode;
  children: ReactNode;
  /** draws the top rule when the row opens a group */
  first?: boolean;
}) {
  return (
    <div className="rrow" style={first ? { borderTop: "1px solid var(--rule)" } : undefined}>
      <div className="k">{k}</div>
      <div className="v">{children}</div>
    </div>
  );
}

/* ---------- callout ---------- */
export function Note({
  variant,
  style,
  children,
}: {
  variant?: "warn" | "legal";
  style?: CSSProperties;
  children: ReactNode;
}) {
  const cls = variant ? `note note--${variant}` : "note";
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}

/* ---------- branded imagery ----------
   Consistent radius, soft shadow, natural crop, subtle hover. */
export function Media({
  img,
  alt,
  className,
  style,
  priority,
  hover = true,
}: {
  img: ImageKey;
  alt: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  hover?: boolean;
}) {
  const a = IMG[img];
  return (
    <div className={`media ${hover ? "media--hover" : ""} ${className ?? ""}`} style={style}>
      <NextImage
        src={a.src}
        alt={alt}
        width={a.width}
        height={a.height}
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}

/** Section-scale illustration that sits on paper, uncropped.
    The scroll frame matters on a phone: this is a seven-step diagram with
    labels, and shrinking it to 340px makes it unreadable. Below the legibility
    threshold it keeps its size and the frame scrolls instead. */
export function FigurePlate({
  img,
  alt,
  style,
}: {
  img: ImageKey;
  alt: string;
  style?: CSSProperties;
}) {
  const a = IMG[img];
  return (
    <div className="figure-scroll">
      <NextImage
        className="figure-plate"
        src={a.src}
        alt={alt}
        width={a.width}
        height={a.height}
        loading="lazy"
        style={{ margin: "8px auto 0", maxWidth: 1040, height: "auto", ...style }}
      />
    </div>
  );
}
