"use client";

import { useState } from "react";

import { IconEdit, IconPlus, IconTrash } from "@/components/admin/portal/icons";
import { AdminShell } from "@/components/admin/portal/shell";
import { usePortal } from "@/components/admin/portal/store-context";
import {
  AssetPreview,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  Modal,
} from "@/components/admin/portal/ui";
import { slugify, type Category } from "@/lib/admin/types";
import { IMG } from "@/lib/images";

type Draft = { name: string; slug: string; description: string; image: string };

const BLANK: Draft = { name: "", slug: "", description: "", image: "" };

export default function AdminCategoriesPage() {
  const {
    categories,
    products,
    loading,
    error,
    reload,
    createCategory,
    updateCategory,
    deleteCategory,
    toast,
  } = usePortal();

  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(BLANK);
  const [nameError, setNameError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);

  const imageKeys = Object.keys(IMG);
  const countFor = (name: string) => products.filter((p) => p.category === name).length;

  function openCreate() {
    setDraft(BLANK);
    setNameError(null);
    setCreating(true);
  }

  function openEdit(c: Category) {
    setDraft({ name: c.name, slug: c.slug, description: c.description, image: c.image });
    setNameError(null);
    setEditing(c);
  }

  function close() {
    setCreating(false);
    setEditing(null);
    setNameError(null);
  }

  async function save() {
    const name = draft.name.trim();
    if (!name) {
      setNameError("A category name is required.");
      return;
    }
    const clash = categories.some(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== editing?.id,
    );
    if (clash) {
      setNameError("A category with this name already exists.");
      return;
    }

    setBusy(true);
    const payload = {
      name,
      slug: draft.slug.trim() || slugify(name),
      description: draft.description,
      image: draft.image,
    };

    if (editing) {
      const moved = editing.name !== name ? countFor(editing.name) : 0;
      /* updateCategory re-points the products that referenced the old name,
         so none is left pointing at a category that no longer exists. */
      await updateCategory(editing.id, payload);
      toast(
        <>
          <b>{name}</b> updated
          {moved ? ` · ${moved} product${moved === 1 ? "" : "s"} re-pointed` : ""}
        </>,
      );
    } else {
      await createCategory({ ...payload, order: categories.length });
      toast(
        <>
          <b>{name}</b> created
        </>,
      );
    }
    setBusy(false);
    close();
  }

  async function confirmDelete() {
    if (!confirming) return;
    setBusy(true);
    await deleteCategory(confirming.id);
    setBusy(false);
    toast(
      <>
        <b>{confirming.name}</b> deleted
      </>,
    );
    setConfirming(null);
  }

  const open = creating || !!editing;

  return (
    <AdminShell
      title="Categories"
      subtitle="Groupings used across the catalogue and the public product tiles."
      crumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Categories" }]}
      actions={
        <button className="ac-btn" onClick={openCreate}>
          <IconPlus size={15} /> New category
        </button>
      }
    >
      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : null}

      {loading ? (
        <LoadingState label="Loading categories…" rows={4} />
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          body="Categories group the catalogue and drive the image-led tiles on the public products page."
          action={
            <button className="ac-btn" onClick={openCreate}>
              <IconPlus size={15} /> Add category
            </button>
          }
        />
      ) : (
        <div className="ac-scroll">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Image</th>
                <th className="ac-num">Products</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className="apx-name">
                      <b>{c.name}</b>
                      <small>{c.description || "No description"}</small>
                    </span>
                  </td>
                  <td className="ac-code">{c.slug}</td>
                  <td className="ac-code">{c.image || "—"}</td>
                  <td className="ac-num">{countFor(c.name)}</td>
                  <td>
                    <div className="apx-rowact">
                      <button
                        className="apx-iconbtn"
                        onClick={() => openEdit(c)}
                        aria-label={`Edit ${c.name}`}
                      >
                        <IconEdit size={15} />
                      </button>
                      <button
                        className="apx-iconbtn danger"
                        onClick={() => setConfirming(c)}
                        aria-label={`Delete ${c.name}`}
                      >
                        <IconTrash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open ? (
        <Modal
          title={editing ? "Edit category" : "New category"}
          onClose={close}
          footer={
            <>
              <button className="ac-btn ac-btn-o" onClick={close} disabled={busy}>
                Cancel
              </button>
              <button className="ac-btn" onClick={() => void save()} disabled={busy}>
                {busy ? "Saving…" : editing ? "Save changes" : "Create category"}
              </button>
            </>
          }
        >
          <div className="ac-fields">
            <Field label="Name" required error={nameError} wide htmlFor="cat-name">
              <input
                id="cat-name"
                value={draft.name}
                autoFocus
                onChange={(e) => {
                  const v = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    name: v,
                    slug: editing ? d.slug : slugify(v),
                  }));
                  setNameError(null);
                }}
                placeholder="e.g. Tablets"
              />
            </Field>

            <Field label="Slug" wide htmlFor="cat-slug" hint="Used in category URLs.">
              <input
                id="cat-slug"
                value={draft.slug}
                onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                placeholder="auto-generated from the name"
              />
            </Field>

            <Field label="Description" wide htmlFor="cat-desc">
              <textarea
                id="cat-desc"
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={3}
              />
            </Field>

            <Field label="Tile image" wide htmlFor="cat-img">
              <div className="apx-imgpick">
                <select
                  id="cat-img"
                  value={draft.image}
                  onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
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
          </div>
        </Modal>
      ) : null}

      {confirming ? (
        <ConfirmDialog
          title="Delete category"
          busy={busy}
          body={
            <>
              <p>
                Delete <strong>{confirming.name}</strong>?
              </p>
              {countFor(confirming.name) > 0 ? (
                <p style={{ color: "#8A5A11" }}>
                  {countFor(confirming.name)} product
                  {countFor(confirming.name) === 1 ? "" : "s"} currently use this
                  category. They will keep the category name but it will no
                  longer appear in the filter list.
                </p>
              ) : null}
            </>
          }
          onConfirm={() => void confirmDelete()}
          onCancel={() => setConfirming(null)}
        />
      ) : null}
    </AdminShell>
  );
}
