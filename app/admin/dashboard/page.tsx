"use client";

import Link from "next/link";
import { useMemo } from "react";

import {
  IconBox,
  IconLayout,
  IconPlus,
  IconStar,
  IconTag,
} from "@/components/admin/portal/icons";
import { AdminShell } from "@/components/admin/portal/shell";
import { usePortal } from "@/components/admin/portal/store-context";
import { ErrorState, LoadingState } from "@/components/admin/portal/ui";
import { STATUS_TONE, STATUS_LABEL } from "@/lib/admin/types";

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

export default function AdminDashboardPage() {
  const { products, categories, loading, error, reload } = usePortal();

  const stats = useMemo(() => {
    const byCategory = new Map<string, number>();
    for (const c of categories) byCategory.set(c.name, 0);
    for (const p of products) {
      byCategory.set(p.category || "Uncategorised", (byCategory.get(p.category || "Uncategorised") ?? 0) + 1);
    }
    return {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      featured: products.filter((p) => p.featured).length,
      drafts: products.filter((p) => p.status === "draft").length,
      byCategory: [...byCategory.entries()].sort((a, b) => b[1] - a[1]),
      recent: products
        .slice()
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 6),
    };
  }, [products, categories]);

  const peak = Math.max(1, ...stats.byCategory.map(([, n]) => n));

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Catalogue overview for the Piyushwani product range."
      actions={
        <Link className="ac-btn" href="/admin/products/new">
          <IconPlus size={15} /> New product
        </Link>
      }
    >
      <div className="ac-note warn" style={{ marginBottom: "1.2rem" }}>
        <strong>Demo data.</strong> Every figure on this screen is calculated
        from records held in this browser&apos;s local storage. Nothing is read
        from or written to a server, and clearing site data resets it to the
        catalogue in <code>lib/products.ts</code>. The public storefront reads
        the same records, so an edit here changes what a visitor sees{" "}
        <em>in this browser</em> — not for anyone else, until a backend exists.
      </div>

      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : null}

      {loading ? (
        <LoadingState label="Loading catalogue…" rows={4} />
      ) : (
        <>
          <div className="ac-kpis">
            <Link className="ac-kpi link" href="/admin/products">
              <div className="l">Total products</div>
              <b>{stats.total}</b>
              <div className="d">Across {categories.length} categories</div>
            </Link>
            <Link className="ac-kpi link" href="/admin/products?status=active">
              <div className="l">Active</div>
              <b>{stats.active}</b>
              <div className="d">Visible on the public site</div>
            </Link>
            <Link className="ac-kpi link" href="/admin/categories">
              <div className="l">Categories</div>
              <b>{categories.length}</b>
              <div className="d">Drive the public tiles</div>
            </Link>
            <Link className="ac-kpi link" href="/admin/products?featured=1">
              <div className="l">Featured</div>
              <b>{stats.featured}</b>
              <div className="d">Shown on the homepage</div>
            </Link>
            <Link
              className={`ac-kpi link${stats.drafts ? " warn" : ""}`}
              href="/admin/products?status=draft"
            >
              <div className="l">Drafts</div>
              <b>{stats.drafts}</b>
              <div className="d">Not yet published</div>
            </Link>
          </div>

          <div className="apx-dash-grid">
            <div>
              <div className="ac-panel">
                <div className="ac-panel-h">
                  <h4>Products by category</h4>
                  <Link className="ac-mini" href="/admin/categories">
                    Manage categories
                  </Link>
                </div>
                {stats.byCategory.length ? (
                  <div className="ac-bars">
                    {stats.byCategory.map(([name, n]) => (
                      <div className="ac-bar-row" key={name}>
                        <span className="ac-bar-l" title={name}>
                          {name}
                        </span>
                        <span className="ac-bar-t">
                          <i style={{ width: `${(n / peak) * 100}%` }} />
                        </span>
                        <b>{n}</b>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="ac-hint">No categories defined yet.</p>
                )}
              </div>

              <div className="ac-panel">
                <div className="ac-panel-h">
                  <h4>Recently updated</h4>
                  <Link className="ac-mini" href="/admin/products">
                    View all
                  </Link>
                </div>
                {stats.recent.length ? (
                  <ul className="ac-timeline">
                    {stats.recent.map((p) => (
                      <li key={p.id}>
                        <Link href={`/admin/products/${p.id}/edit`} className="apx-recent-name">
                          {p.name}
                        </Link>{" "}
                        <span className={`ac-tag ${STATUS_TONE[p.status]}`}>
                          {STATUS_LABEL[p.status]}
                        </span>
                        <time>
                          {p.category || "Uncategorised"} · updated {relative(p.updatedAt)}
                        </time>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ac-hint">No products yet.</p>
                )}
              </div>
            </div>

            <div>
              <div className="ac-panel">
                <h4>Quick actions</h4>
                <div className="apx-quick">
                  <Link className="ac-btn" href="/admin/products/new">
                    <IconPlus size={15} /> Add product
                  </Link>
                  <Link className="ac-btn ac-btn-o" href="/admin/products">
                    <IconBox size={15} /> All products
                  </Link>
                  <Link className="ac-btn ac-btn-o" href="/admin/categories">
                    <IconTag size={15} /> Categories
                  </Link>
                  <Link className="ac-btn ac-btn-o" href="/admin/products?featured=1">
                    <IconStar size={15} /> Featured
                  </Link>
                  <Link className="ac-btn ac-btn-o" href="/admin/content">
                    <IconLayout size={15} /> Website content
                  </Link>
                </div>
              </div>

              <div className="ac-panel">
                <h4>Catalogue health</h4>
                <div className="ac-bars">
                  <div className="ac-bar-row">
                    <span className="ac-bar-l">Has description</span>
                    <span className="ac-bar-t">
                      <i
                        style={{
                          width: `${stats.total ? (products.filter((p) => p.description.trim()).length / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </span>
                    <b>
                      {products.filter((p) => p.description.trim()).length}/{stats.total}
                    </b>
                  </div>
                  <div className="ac-bar-row">
                    <span className="ac-bar-l">Has pack size</span>
                    <span className="ac-bar-t">
                      <i
                        style={{
                          width: `${stats.total ? (products.filter((p) => p.packSize.trim()).length / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </span>
                    <b>
                      {products.filter((p) => p.packSize.trim()).length}/{stats.total}
                    </b>
                  </div>
                  <div className="ac-bar-row">
                    <span className="ac-bar-l">Has image</span>
                    <span className="ac-bar-t">
                      <i
                        style={{
                          width: `${stats.total ? (products.filter((p) => p.image.trim()).length / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </span>
                    <b>
                      {products.filter((p) => p.image.trim()).length}/{stats.total}
                    </b>
                  </div>
                </div>
                <p className="ac-hint" style={{ marginTop: ".7rem" }}>
                  Fields are seeded empty rather than filled with placeholder
                  copy, so these counts show genuinely missing content.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
