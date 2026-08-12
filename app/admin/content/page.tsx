"use client";

/* ==========================================================================
   ADMIN PORTAL — website content
   --------------------------------------------------------------------------
   Only fields the public homepage actually renders. Nothing here is a stub:
   every input on this screen changes something a visitor can see, because the
   hero reads the same store (components/Hero.tsx).

   Company and contact details are NOT editable here. They live in lib/cms.ts
   and are rendered in the footer, the legal pages and the certifications
   page; a form that appeared to edit them but only wrote to this browser
   would be a lie about where the site's registered details come from. The
   settings screen shows them read-only and says so.
   ========================================================================== */

import Link from "next/link";
import { useMemo, useState } from "react";

import { IconExternal, IconRefresh } from "@/components/admin/portal/icons";
import { AdminShell } from "@/components/admin/portal/shell";
import { usePortal } from "@/components/admin/portal/store-context";
import { ConfirmDialog, ErrorState, Field, LoadingState } from "@/components/admin/portal/ui";
import { CONTENT_FIELDS, DEFAULT_CONTENT, type SiteContent } from "@/lib/catalogue";

export default function AdminContentPage() {
  const { content, loading, error, reload, updateContent, resetContent, toast } = usePortal();

  const [draft, setDraft] = useState<SiteContent>(content);
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  /* The provider loads asynchronously, so the form has to reseed once the real
     content arrives rather than staying on the defaults it mounted with — and
     again after a save or a restore. Adjusted during render rather than in an
     effect, which is the pattern the rest of this codebase uses for
     prop-derived state; an effect here would cost a second render pass. */
  const [syncedFrom, setSyncedFrom] = useState(content);
  if (syncedFrom !== content) {
    setSyncedFrom(content);
    setDraft(content);
  }

  const dirty = useMemo(
    () => CONTENT_FIELDS.some((f) => draft[f.key] !== content[f.key]),
    [draft, content],
  );

  const errors = useMemo(() => {
    const e: Partial<Record<keyof SiteContent, string>> = {};
    if (!draft.heroTitle.trim()) e.heroTitle = "The headline cannot be empty.";
    if (!draft.heroPrimaryLabel.trim()) e.heroPrimaryLabel = "A button needs a label.";
    for (const k of ["heroPrimaryHref", "heroSecondaryHref"] as const) {
      const v = draft[k].trim();
      if (v && !v.startsWith("/")) e[k] = "Use a path on this site, starting with /";
    }
    return e;
  }, [draft]);

  const valid = Object.keys(errors).length === 0;

  async function save() {
    if (!valid) return;
    setBusy(true);
    await updateContent(draft);
    setBusy(false);
    toast("Homepage content saved");
  }

  return (
    <AdminShell
      title="Website Content"
      subtitle="Editable copy on the public homepage."
      crumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Website Content" }]}
      actions={
        <Link className="ac-btn ac-btn-o" href="/" target="_blank" rel="noreferrer">
          <IconExternal size={15} /> View homepage
        </Link>
      }
    >
      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : null}

      {loading ? (
        <LoadingState label="Loading content…" rows={5} />
      ) : (
        <div className="apx-content-grid">
          <form
            className="apx-form"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
            noValidate
          >
            <fieldset className="apx-fieldset">
              <legend>Homepage hero</legend>
              <div className="ac-fields">
                {CONTENT_FIELDS.map((f) => (
                  <Field
                    key={f.key}
                    label={f.label}
                    hint={f.hint}
                    error={errors[f.key]}
                    wide
                    htmlFor={`c-${f.key}`}
                  >
                    {f.long ? (
                      <textarea
                        id={`c-${f.key}`}
                        rows={4}
                        value={draft[f.key]}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, [f.key]: e.target.value }))
                        }
                      />
                    ) : (
                      <input
                        id={`c-${f.key}`}
                        value={draft[f.key]}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, [f.key]: e.target.value }))
                        }
                      />
                    )}
                  </Field>
                ))}
              </div>
            </fieldset>

            <div className="apx-formbar">
              <button className="ac-btn" type="submit" disabled={busy || !dirty || !valid}>
                {busy ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                className="ac-btn ac-btn-o"
                onClick={() => setDraft(content)}
                disabled={busy || !dirty}
              >
                Discard changes
              </button>
              <button
                type="button"
                className="ac-btn ac-btn-o"
                onClick={() => setConfirmReset(true)}
                disabled={busy}
              >
                <IconRefresh size={15} /> Restore original copy
              </button>
              <span className="apx-spacer" />
              <span className="ac-hint">
                {dirty ? "Unsaved changes" : "Saved to this browser only."}
              </span>
            </div>
          </form>

          {/* A live preview costs nothing here and answers the question the
              operator actually has: what will this look like on the page? */}
          <aside className="ac-panel apx-preview-pane">
            <div className="ac-panel-h">
              <h4>Preview</h4>
              <span className="ac-mini" aria-hidden="true">
                Hero
              </span>
            </div>
            <div className="apx-hero-prev">
              <span className="apx-hero-lab">{draft.heroEyebrow || "—"}</span>
              <h2>
                {draft.heroTitle}
                {draft.heroTitleEm ? <em>{draft.heroTitleEm}</em> : null}
              </h2>
              <p>{draft.heroLede}</p>
              <div className="apx-hero-btns">
                <span className="apx-hero-btn primary">{draft.heroPrimaryLabel || "—"}</span>
                {draft.heroSecondaryLabel ? (
                  <span className="apx-hero-btn">{draft.heroSecondaryLabel}</span>
                ) : null}
              </div>
            </div>
            <p className="ac-hint" style={{ marginTop: ".9rem" }}>
              Typography here is indicative. The homepage sets the hero in
              Archivo at a much larger size.
            </p>
          </aside>
        </div>
      )}

      {confirmReset ? (
        <ConfirmDialog
          title="Restore original copy"
          confirmLabel="Restore"
          destructive={false}
          busy={busy}
          body={
            <>
              <p>
                The hero returns to the copy the site ships with, and any wording
                saved in this browser is discarded.
              </p>
              <p style={{ color: "var(--ac-mut)", fontSize: ".82rem" }}>
                Original headline: <strong>{DEFAULT_CONTENT.heroTitle}</strong>
              </p>
            </>
          }
          onConfirm={() => {
            setBusy(true);
            void resetContent().then(() => {
              setBusy(false);
              setConfirmReset(false);
              toast("Original homepage copy restored");
            });
          }}
          onCancel={() => setConfirmReset(false)}
        />
      ) : null}
    </AdminShell>
  );
}
