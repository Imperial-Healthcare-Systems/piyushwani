"use client";

/* ==========================================================================
   ADMIN PORTAL — shared primitives
   Modal, confirmation dialog, empty / loading / error states, form fields.
   All built on the existing .ac- CSS language so the portal reads as one
   piece with the rest of the console.
   ========================================================================== */

import NextImage from "next/image";
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

import {
  IconAlert,
  IconClose,
  IconImage,
  IconSearch,
} from "@/components/admin/portal/icons";
import { IMG } from "@/lib/images";

/* ------------------------------------------------------------------ modal */

export function Modal({
  title,
  onClose,
  children,
  footer,
  width = 520,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  /* Escape closes; focus moves into the dialog; the page behind stops
     scrolling while it is open. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="apx-scrim" onMouseDown={onClose}>
      <div
        className="apx-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={panel}
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="apx-modal-h">
          <h2 id={titleId}>{title}</h2>
          <button className="apx-iconbtn" onClick={onClose} aria-label="Close dialog">
            <IconClose size={17} />
          </button>
        </div>
        <div className="apx-modal-b">{children}</div>
        {footer ? <div className="apx-modal-f">{footer}</div> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- confirm dialog */

export function ConfirmDialog({
  title,
  body,
  confirmLabel = "Delete",
  destructive = true,
  busy = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      width={440}
      footer={
        <>
          <button className="ac-btn ac-btn-o" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            className={`ac-btn${destructive ? " ac-btn-danger" : ""}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </>
      }
    >
      <div className="apx-confirm">
        {destructive ? (
          <span className="apx-confirm-ic" aria-hidden="true">
            <IconAlert size={20} />
          </span>
        ) : null}
        <div>{body}</div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------- states */

export function LoadingState({ label = "Loading…", rows = 5 }: { label?: string; rows?: number }) {
  return (
    <div className="apx-skel" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div className="apx-skel-row" key={i} style={{ animationDelay: `${i * 70}ms` }} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="apx-empty">
      <span className="apx-empty-ic" aria-hidden="true">
        <IconSearch size={22} />
      </span>
      <strong>{title}</strong>
      <p>{body}</p>
      {action ? <div className="apx-empty-act">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="apx-error" role="alert">
      <span className="apx-error-ic" aria-hidden="true">
        <IconAlert size={20} />
      </span>
      <div>
        <strong>Something went wrong</strong>
        <p>{message}</p>
      </div>
      {onRetry ? (
        <button className="ac-btn ac-btn-o ac-btn-sm" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- fields */

export function Field({
  label,
  hint,
  error,
  required,
  wide,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  wide?: boolean;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className={`ac-field${wide ? " wide" : ""}${error ? " apx-bad" : ""}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required ? <em aria-hidden="true">*</em> : null}
      </label>
      {children}
      {error ? (
        <p className="apx-fielderr" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="ac-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`ac-switch${on ? " on" : ""}`}
      onClick={() => onChange(!on)}
    />
  );
}

/* ------------------------------------------------------------- imagery */

/** Resolves either an IMG key or an absolute /images/… path to a URL. */
export function resolveAsset(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  const known = (IMG as Record<string, { src: string } | undefined>)[v];
  if (known) return known.src;
  return v.startsWith("/") ? v : null;
}

/* A select of filenames tells the operator nothing about what they picked.
   The preview is the field's answer to "is this the right pack shot?" — and
   an unresolvable value says so plainly rather than showing a broken frame. */
export function AssetPreview({
  value,
  size = 132,
  alt = "",
}: {
  value: string;
  size?: number;
  alt?: string;
}) {
  const src = resolveAsset(value);
  const typed = value.trim();
  /* Under ~64px the caption is unreadable, so the icon carries the state. */
  const sm = size < 64 ? " sm" : "";

  if (!src) {
    return (
      <div
        className={`apx-preview${sm}${typed ? " bad" : ""}`}
        style={{ width: size }}
        aria-hidden={typed ? undefined : true}
      >
        <IconImage size={sm ? 15 : 20} />
        <span>{typed ? "Unknown asset" : "No image"}</span>
      </div>
    );
  }

  return (
    <div className={`apx-preview has${sm}`} style={{ width: size }}>
      <NextImage src={src} alt={alt} fill sizes={`${size}px`} />
    </div>
  );
}

/** Repeatable string list — benefits, additional images. */
export function ListEditor({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  return (
    <div className="apx-list">
      {items.map((item, i) => (
        <div className="apx-list-row" key={i}>
          <input
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = items.slice();
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            className="apx-iconbtn"
            aria-label={`Remove item ${i + 1}`}
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <IconClose size={15} />
          </button>
        </div>
      ))}
      <button type="button" className="ac-mini" onClick={() => onChange([...items, ""])}>
        + {addLabel}
      </button>
    </div>
  );
}
