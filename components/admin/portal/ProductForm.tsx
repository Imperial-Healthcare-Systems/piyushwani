"use client";

/* ==========================================================================
   ADMIN PORTAL — product form
   Shared by /admin/products/new and /admin/products/[id]/edit. Validation is
   inline and beside the field it concerns; the slug auto-derives from the
   name until the operator edits it by hand, after which it is left alone.
   ========================================================================== */

import Link from "next/link";
import { useId, useState } from "react";

import { IconClose } from "@/components/admin/portal/icons";
import { usePortal } from "@/components/admin/portal/store-context";
import { AssetPreview, Field, ListEditor, Toggle } from "@/components/admin/portal/ui";
import { IMG } from "@/lib/images";
import {
  slugify,
  type AdminProduct,
  type ProductKind,
  type ProductStatus,
} from "@/lib/admin/types";

export type ProductDraft = Omit<AdminProduct, "id" | "createdAt" | "updatedAt">;

type Errors = Partial<Record<"name" | "category" | "slug" | "form", string>>;

export function ProductForm({
  initial,
  currentId,
  submitLabel,
  onSubmit,
}: {
  initial: ProductDraft;
  /** Present when editing — excludes this record from the slug clash check. */
  currentId?: string;
  submitLabel: string;
  onSubmit: (draft: ProductDraft) => Promise<void>;
}) {
  const { categories, products } = usePortal();
  const [draft, setDraft] = useState<ProductDraft>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);
  const [busy, setBusy] = useState(false);
  const uid = useId();

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!draft.name.trim()) e.name = "A product name is required.";
    if (!draft.category.trim()) e.category = "Choose a category.";
    if (!draft.form.trim()) e.form = "A dosage form is required.";

    const slug = draft.slug.trim() || slugify(draft.name);
    if (!slug) e.slug = "A slug is required.";
    else if (products.some((p) => p.slug === slug && p.id !== currentId)) {
      e.slug = "Another product already uses this slug.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) {
      document.querySelector<HTMLElement>(".apx-bad input, .apx-bad select")?.focus();
      return;
    }
    setBusy(true);
    await onSubmit({ ...draft, slug: draft.slug.trim() || slugify(draft.name) });
    setBusy(false);
  }

  const imageKeys = Object.keys(IMG);

  return (
    <form className="apx-form" onSubmit={submit} noValidate>
      <fieldset className="apx-fieldset">
        <legend>Identity</legend>
        <div className="ac-fields">
          <Field label="Product name" required error={errors.name} htmlFor={`${uid}-name`} wide>
            <input
              id={`${uid}-name`}
              value={draft.name}
              onChange={(e) => {
                set("name", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
              placeholder="e.g. Paracetamol 500 mg Tablets IP"
            />
          </Field>

          <Field label="Category" required error={errors.category} htmlFor={`${uid}-cat`}>
            <select
              id={`${uid}-cat`}
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Slug"
            required
            error={errors.slug}
            hint="Used in the product URL."
            htmlFor={`${uid}-slug`}
          >
            <input
              id={`${uid}-slug`}
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              placeholder="auto-generated from the name"
            />
          </Field>

          <Field label="Dosage form" required error={errors.form} htmlFor={`${uid}-form`}>
            <input
              id={`${uid}-form`}
              value={draft.form}
              onChange={(e) => set("form", e.target.value)}
              placeholder="Tablet, Capsule, Syrup, Sachet…"
            />
          </Field>

          <Field label="Product type" htmlFor={`${uid}-kind`}>
            <select
              id={`${uid}-kind`}
              value={draft.kind}
              onChange={(e) => set("kind", e.target.value as ProductKind)}
            >
              <option value="rx">Pharmaceutical</option>
              <option value="nut">Nutraceutical</option>
            </select>
          </Field>

          <Field
            label="Composition"
            wide
            hint="Actives and strengths, exactly as approved."
            htmlFor={`${uid}-comp`}
          >
            <input
              id={`${uid}-comp`}
              value={draft.composition}
              onChange={(e) => set("composition", e.target.value)}
              placeholder="e.g. Paracetamol IP 500 mg"
            />
          </Field>

          <Field label="Pack size" htmlFor={`${uid}-pack`}>
            <input
              id={`${uid}-pack`}
              value={draft.packSize}
              onChange={(e) => set("packSize", e.target.value)}
              placeholder="e.g. 10 x 10 tablets"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="apx-fieldset">
        <legend>Content</legend>
        <div className="ac-fields">
          <Field
            label="Short description"
            wide
            hint="One line, used on cards and listings."
            htmlFor={`${uid}-short`}
          >
            <input
              id={`${uid}-short`}
              value={draft.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
            />
          </Field>

          <Field
            label="Description"
            wide
            hint="Factual only. No claims that the product cures, treats or prevents any condition."
            htmlFor={`${uid}-desc`}
          >
            <textarea
              id={`${uid}-desc`}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
            />
          </Field>

          <Field
            label="Usage / directions"
            wide
            hint="As printed on the approved pack insert — do not paraphrase."
            htmlFor={`${uid}-use`}
          >
            <textarea
              id={`${uid}-use`}
              value={draft.usage}
              onChange={(e) => set("usage", e.target.value)}
              rows={3}
            />
          </Field>

          <Field label="Benefits" wide hint="One per line.">
            <ListEditor
              items={draft.benefits}
              onChange={(v) => set("benefits", v)}
              placeholder="e.g. Sugar free"
              addLabel="Add benefit"
            />
          </Field>

          <Field label="Specifications" wide hint="Label and value pairs shown on the product page.">
            <div className="apx-list">
              {draft.specifications.map((s, i) => (
                <div className="apx-spec-row" key={i}>
                  <input
                    value={s.label}
                    placeholder="Label (e.g. Shelf life)"
                    onChange={(e) => {
                      const next = draft.specifications.slice();
                      next[i] = { ...next[i], label: e.target.value };
                      set("specifications", next);
                    }}
                  />
                  <input
                    value={s.value}
                    placeholder="Value (e.g. 24 months)"
                    onChange={(e) => {
                      const next = draft.specifications.slice();
                      next[i] = { ...next[i], value: e.target.value };
                      set("specifications", next);
                    }}
                  />
                  <button
                    type="button"
                    className="apx-iconbtn"
                    aria-label={`Remove specification ${i + 1}`}
                    onClick={() =>
                      set("specifications", draft.specifications.filter((_, j) => j !== i))
                    }
                  >
                    <IconClose size={15} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="ac-mini"
                onClick={() =>
                  set("specifications", [...draft.specifications, { label: "", value: "" }])
                }
              >
                + Add specification
              </button>
            </div>
          </Field>
        </div>
      </fieldset>

      <fieldset className="apx-fieldset">
        <legend>Imagery</legend>
        <div className="ac-fields">
          <Field
            label="Primary image"
            wide
            hint="Choose an existing asset from /public/images. Packaging artwork is not edited here."
            htmlFor={`${uid}-img`}
          >
            <div className="apx-imgpick">
              <select
                id={`${uid}-img`}
                value={draft.image}
                onChange={(e) => set("image", e.target.value)}
              >
                <option value="">No image</option>
                {imageKeys.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <AssetPreview
                value={draft.image}
                alt={draft.image ? `Preview of ${draft.image}` : ""}
              />
            </div>
          </Field>

          <Field label="Additional images" wide hint="Image keys or paths under /images.">
            <ListEditor
              items={draft.additionalImages}
              onChange={(v) => set("additionalImages", v)}
              placeholder="e.g. prod-tablets"
              addLabel="Add image"
            />
            {draft.additionalImages.some((v) => v.trim()) ? (
              <div className="apx-thumbrow">
                {draft.additionalImages
                  .filter((v) => v.trim())
                  .map((v, i) => (
                    <AssetPreview key={`${v}-${i}`} value={v} size={72} alt={`Preview of ${v}`} />
                  ))}
              </div>
            ) : null}
          </Field>
        </div>
      </fieldset>

      <fieldset className="apx-fieldset">
        <legend>Visibility</legend>
        <div className="ac-fields">
          <Field label="Status" htmlFor={`${uid}-status`}>
            <select
              id={`${uid}-status`}
              value={draft.status}
              onChange={(e) => set("status", e.target.value as ProductStatus)}
            >
              <option value="draft">Draft — not published</option>
              <option value="active">Active — visible publicly</option>
              <option value="inactive">Inactive — hidden</option>
            </select>
          </Field>

          <div className="ac-field">
            <label>Featured</label>
            <div className="apx-switchrow">
              <div>
                <strong>Mark as featured</strong>
                <small>Highlights this product in listings.</small>
              </div>
              <Toggle
                on={draft.featured}
                onChange={(v) => set("featured", v)}
                label="Mark product as featured"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <div className="apx-formbar">
        <button className="ac-btn" type="submit" disabled={busy}>
          {busy ? "Saving…" : submitLabel}
        </button>
        <Link className="ac-btn ac-btn-o" href="/admin/products">
          Cancel
        </Link>
        <span className="apx-spacer" />
        <span className="ac-hint">Saved to this browser only.</span>
      </div>
    </form>
  );
}
