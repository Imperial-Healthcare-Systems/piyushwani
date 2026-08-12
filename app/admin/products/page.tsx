"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import {
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconSort,
  IconStar,
  IconTrash,
} from "@/components/admin/portal/icons";
import { AdminShell } from "@/components/admin/portal/shell";
import { usePortal } from "@/components/admin/portal/store-context";
import {
  AssetPreview,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
} from "@/components/admin/portal/ui";
import {
  STATUS_LABEL,
  STATUS_TONE,
  type AdminProduct,
  type ProductStatus,
} from "@/lib/admin/types";

/* Sorting is client-side over an already-loaded array. When a real API takes
   over, the same key/direction pair becomes the query string and the compare
   below is deleted — the header UI does not change. */
type SortKey = "name" | "category" | "status" | "updatedAt";
type SortDir = "asc" | "desc";

const STATUS_ORDER: Record<ProductStatus, number> = { active: 0, draft: 1, inactive: 2 };

function relative(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "—";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

function SortHeader({
  label,
  col,
  sort,
  dir,
  onSort,
  align,
}: {
  label: string;
  col: SortKey;
  sort: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
  align?: "right";
}) {
  const on = sort === col;
  return (
    <th
      aria-sort={on ? (dir === "asc" ? "ascending" : "descending") : "none"}
      style={align === "right" ? { textAlign: "right" } : undefined}
    >
      <button
        type="button"
        className={`apx-sort${on ? " on" : ""}${on && dir === "desc" ? " desc" : ""}`}
        onClick={() => onSort(col)}
        title={`Sort by ${label.toLowerCase()}`}
      >
        {label}
        <span className="apx-sort-ic" aria-hidden="true">
          {on ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 15l6-6 6 6" />
            </svg>
          ) : (
            <IconSort size={12} />
          )}
        </span>
      </button>
    </th>
  );
}

function ProductsInner() {
  const params = useSearchParams();
  const {
    products,
    categories,
    loading,
    error,
    reload,
    updateProduct,
    deleteProduct,
    resetProducts,
    toast,
  } = usePortal();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ProductStatus | "all">(
    (params.get("status") as ProductStatus | null) ?? "all",
  );
  const [category, setCategory] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(params.get("featured") === "1");

  /* Most-recently-touched first is what an operator wants on arrival — the
     record they just saved is the one they are most likely to want again. */
  const [sort, setSort] = useState<SortKey>("updatedAt");
  const [dir, setDir] = useState<SortDir>("desc");

  const [confirming, setConfirming] = useState<AdminProduct | null>(null);
  const [viewing, setViewing] = useState<AdminProduct | null>(null);
  const [busy, setBusy] = useState(false);

  /* Text sorts default to A→Z and dates to newest-first, because that is the
     useful direction for each; clicking the active column flips it. */
  function onSort(k: SortKey) {
    if (k === sort) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSort(k);
    setDir(k === "updatedAt" ? "desc" : "asc");
  }

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const matched = products.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (category !== "all" && p.category !== category) return false;
      if (featuredOnly && !p.featured) return false;
      if (!needle) return true;
      return (
        p.name.toLowerCase().includes(needle) ||
        p.composition.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle) ||
        p.form.toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle)
      );
    });

    const sign = dir === "asc" ? 1 : -1;
    return matched.sort((a, b) => {
      let d = 0;
      if (sort === "updatedAt") {
        d = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sort === "status") {
        d = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      } else {
        d = a[sort].localeCompare(b[sort], undefined, { numeric: true, sensitivity: "base" });
      }
      /* Name is the tiebreaker so equal keys never shuffle between renders. */
      return d !== 0 ? d * sign : a.name.localeCompare(b.name);
    });
  }, [products, q, status, category, featuredOnly, sort, dir]);

  const filtered = q.trim() || status !== "all" || category !== "all" || featuredOnly;

  async function toggleStatus(p: AdminProduct) {
    const next: ProductStatus = p.status === "active" ? "inactive" : "active";
    await updateProduct(p.id, { status: next });
    toast(
      <>
        <b>{p.name}</b> set to {STATUS_LABEL[next].toLowerCase()}
      </>,
    );
  }

  async function toggleFeatured(p: AdminProduct) {
    await updateProduct(p.id, { featured: !p.featured });
    toast(
      <>
        <b>{p.name}</b> {p.featured ? "removed from" : "marked as"} featured
      </>,
    );
  }

  async function confirmDelete() {
    if (!confirming) return;
    setBusy(true);
    await deleteProduct(confirming.id);
    setBusy(false);
    toast(
      <>
        <b>{confirming.name}</b> deleted
      </>,
    );
    setConfirming(null);
  }

  return (
    <AdminShell
      title="Products"
      subtitle="Every product in the Piyushwani catalogue."
      crumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Products" }]}
      actions={
        <>
          <button
            className="ac-btn ac-btn-o"
            onClick={async () => {
              await resetProducts();
              toast("Demo catalogue restored");
            }}
          >
            Reset demo data
          </button>
          <Link className="ac-btn" href="/admin/products/new">
            <IconPlus size={15} /> New product
          </Link>
        </>
      }
    >
      <div className="ac-bar">
        <span className="apx-search">
          <span className="apx-search-ic">
            <IconSearch size={16} />
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, composition, form…"
            aria-label="Search products"
          />
        </span>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProductStatus | "all")}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          className={`ac-mini${featuredOnly ? " on" : ""}`}
          onClick={() => setFeaturedOnly((v) => !v)}
          aria-pressed={featuredOnly}
          style={
            featuredOnly
              ? { borderColor: "var(--amber)", background: "#FFF8EC", color: "#8A5A11" }
              : undefined
          }
        >
          Featured only
        </button>

        <span className="apx-count">
          {rows.length} of {products.length}
        </span>
      </div>

      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : null}

      {loading ? (
        <LoadingState label="Loading products…" rows={6} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={filtered ? "No products match those filters" : "No products yet"}
          body={
            filtered
              ? "Try a different search term, or clear the filters to see the full catalogue."
              : "Add your first product to start building the catalogue."
          }
          action={
            filtered ? (
              <button
                className="ac-btn ac-btn-o"
                onClick={() => {
                  setQ("");
                  setStatus("all");
                  setCategory("all");
                  setFeaturedOnly(false);
                }}
              >
                Clear filters
              </button>
            ) : (
              <Link className="ac-btn" href="/admin/products/new">
                <IconPlus size={15} /> Add product
              </Link>
            )
          }
        />
      ) : (
        <div className="ac-scroll">
          <table className="ac-table">
            <thead>
              <tr>
                <SortHeader label="Product" col="name" sort={sort} dir={dir} onSort={onSort} />
                <SortHeader
                  label="Category"
                  col="category"
                  sort={sort}
                  dir={dir}
                  onSort={onSort}
                />
                <th>Form</th>
                <th>Type</th>
                <SortHeader label="Status" col="status" sort={sort} dir={dir} onSort={onSort} />
                <th>Featured</th>
                <SortHeader
                  label="Updated"
                  col="updatedAt"
                  sort={sort}
                  dir={dir}
                  onSort={onSort}
                />
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="apx-prodcell">
                      <AssetPreview value={p.image} size={40} alt="" />
                      <span className="apx-name">
                        <b>{p.name}</b>
                        <small>{p.composition || "No composition recorded"}</small>
                      </span>
                    </span>
                  </td>
                  <td>{p.category || "—"}</td>
                  <td>{p.form || "—"}</td>
                  <td>
                    <span className={`ac-tag ${p.kind === "rx" ? "t-purple" : "t-green"}`}>
                      {p.kind === "rx" ? "Pharmaceutical" : "Nutraceutical"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`ac-tag ${STATUS_TONE[p.status]}`}
                      onClick={() => void toggleStatus(p)}
                      style={{ border: 0, cursor: "pointer", font: "inherit" }}
                      title={p.status === "active" ? "Deactivate" : "Activate"}
                    >
                      {STATUS_LABEL[p.status]}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`apx-iconbtn${p.featured ? " on" : ""}`}
                      onClick={() => void toggleFeatured(p)}
                      aria-pressed={p.featured}
                      aria-label={p.featured ? `Unfeature ${p.name}` : `Feature ${p.name}`}
                    >
                      <IconStar size={15} />
                    </button>
                  </td>
                  <td>
                    <time className="apx-when" dateTime={p.updatedAt} title={p.updatedAt}>
                      {relative(p.updatedAt)}
                    </time>
                  </td>
                  <td>
                    <div className="apx-rowact">
                      <button
                        className="apx-iconbtn"
                        onClick={() => setViewing(p)}
                        aria-label={`View ${p.name}`}
                      >
                        <IconEye size={15} />
                      </button>
                      <Link
                        className="apx-iconbtn"
                        href={`/admin/products/${p.id}/edit`}
                        aria-label={`Edit ${p.name}`}
                      >
                        <IconEdit size={15} />
                      </Link>
                      <button
                        className="apx-iconbtn danger"
                        onClick={() => setConfirming(p)}
                        aria-label={`Delete ${p.name}`}
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

      {viewing ? (
        <Modal
          title={viewing.name}
          onClose={() => setViewing(null)}
          width={600}
          footer={
            <>
              <button className="ac-btn ac-btn-o" onClick={() => setViewing(null)}>
                Close
              </button>
              <Link className="ac-btn" href={`/admin/products/${viewing.id}/edit`}>
                Edit product
              </Link>
            </>
          }
        >
          {viewing.image ? (
            <div className="apx-viewmedia">
              <AssetPreview value={viewing.image} size={148} alt={`${viewing.name} pack image`} />
            </div>
          ) : null}
          <dl className="apx-view">
            <ViewRow k="Category" v={viewing.category} />
            <ViewRow k="Slug" v={viewing.slug} mono />
            <ViewRow k="Composition" v={viewing.composition} />
            <ViewRow k="Dosage form" v={viewing.form} />
            <ViewRow k="Type" v={viewing.kind === "rx" ? "Pharmaceutical" : "Nutraceutical"} />
            <ViewRow k="Pack size" v={viewing.packSize} />
            <ViewRow k="Short description" v={viewing.shortDescription} />
            <ViewRow k="Description" v={viewing.description} />
            <ViewRow k="Usage" v={viewing.usage} />
            <ViewRow k="Benefits" v={viewing.benefits.filter(Boolean).join(" · ")} />
            <ViewRow
              k="Specifications"
              v={viewing.specifications.filter((s) => s.label).map((s) => `${s.label}: ${s.value}`).join(" · ")}
            />
            <ViewRow k="Image" v={viewing.image} mono />
            <ViewRow k="Status" v={STATUS_LABEL[viewing.status]} />
            <ViewRow k="Featured" v={viewing.featured ? "Yes" : "No"} />
            <ViewRow k="Last updated" v={relative(viewing.updatedAt)} />
          </dl>
        </Modal>
      ) : null}

      {confirming ? (
        <ConfirmDialog
          title="Delete product"
          busy={busy}
          body={
            <>
              <p>
                <strong>{confirming.name}</strong> will be removed from the local
                catalogue.
              </p>
              <p style={{ color: "var(--ac-mut)", fontSize: ".82rem" }}>
                This only affects data stored in this browser. Use{" "}
                <strong>Reset demo data</strong> to restore the original
                catalogue.
              </p>
            </>
          }
          onConfirm={() => void confirmDelete()}
          onCancel={() => setConfirming(null)}
        />
      ) : null}
    </AdminShell>
  );
}

function ViewRow({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <>
      <dt>{k}</dt>
      <dd className={mono ? "ac-code" : undefined}>
        {v?.trim() ? v : <span className="apx-blank">Not recorded</span>}
      </dd>
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="apx-boot" />}>
      <ProductsInner />
    </Suspense>
  );
}
