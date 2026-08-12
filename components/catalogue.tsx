"use client";

/* ==========================================================================
   PUBLIC CATALOGUE
   --------------------------------------------------------------------------
   Reads through lib/useCatalogue, so what the storefront shows is exactly
   what the console holds — an edit in /admin lands here on the next render,
   and in an already-open tab immediately, because the store is subscribable.

   Server-rendered from the seed catalogue first, so a prerendered page ships
   real products rather than an empty grid waiting on JavaScript.

   Only `active` products are shown. Draft and inactive records exist for the
   operator, not the visitor.
   ========================================================================== */

import Link from "next/link";
import NextImage from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";

import { PackIcon } from "@/components/icons";
import { publishedOnly, type AdminProduct } from "@/lib/catalogue";
import { IMG, type ImageKey } from "@/lib/images";
import { useCategories, useProducts } from "@/lib/useCatalogue";

/** Resolves an IMG key or an absolute /images/… path. */
function assetSrc(value: string): { src: string; width: number; height: number } | null {
  const v = value.trim();
  if (!v) return null;
  const known = IMG[v as ImageKey];
  if (known) return known;
  return null;
}

/** Stable public URL for a product — slug when it has one, id otherwise. */
export function productHref(p: AdminProduct): string {
  return `/product/${p.slug || p.id}`;
}

/* Module-level so the identities stay stable across renders. The URL cannot
   change without a navigation, so there is nothing to subscribe to. */
const NO_SUBSCRIBE = () => () => {};
const getUrlCategory = () =>
  new URLSearchParams(window.location.search).get("category") ?? "";
const getServerUrlCategory = () => "";

/* ------------------------------------------------------------ category tiles */

export function CatGrid() {
  const categories = useCategories();

  return (
    <div className="cat-grid">
      {categories.map((c) => {
        const a = assetSrc(c.image);
        return (
          <Link
            className="cattile"
            href={`/products?category=${encodeURIComponent(c.name)}`}
            aria-label={`${c.name} — view products`}
            key={c.id}
          >
            {a ? (
              <NextImage
                src={a.src}
                alt={`${c.name} — Piyushwani pack and blister`}
                width={a.width}
                height={a.height}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 280px"
              />
            ) : (
              <span className="cattile-ph" aria-hidden="true">
                <PackIcon />
              </span>
            )}
            <span className="cap">{c.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- product card */

export function ProductCard({ p }: { p: AdminProduct }) {
  const isNut = p.kind === "nut";
  const a = assetSrc(p.image);

  return (
    <Link className="p-card" href={productHref(p)}>
      <div className="p-thumb">
        {p.form ? <span className="form">{p.form}</span> : null}
        {/* Type is carried by a word, not by colour alone. */}
        <span className={`p-kind ${isNut ? "nut" : "rx"}`}>
          {isNut ? "Nutraceutical" : "Rx"}
        </span>
        {a ? (
          <NextImage
            src={a.src}
            alt=""
            width={a.width}
            height={a.height}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 320px"
          />
        ) : (
          <PackIcon />
        )}
      </div>
      <div className="p-in">
        {p.category ? <span className="p-cat">{p.category}</span> : null}
        <h3>{p.name}</h3>
        {p.composition ? <div className="p-comp">{p.composition}</div> : null}
        {p.shortDescription ? <p className="p-short">{p.shortDescription}</p> : null}
        <span className="go">
          View details
          <svg
            width="13"
            height="13"
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
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------- full catalogue
   Eleven products in one undifferentiated grid gave a visitor no way to reach
   the four they wanted. Filtering is client-side over an already-loaded list,
   so it is instant and needs no request. */

export function ProductGrid() {
  const products = useProducts();
  const categories = useCategories();

  /* The category tiles deep-link here as /products?category=Tablets.
     Deliberately not useSearchParams: that hook opts the whole subtree out of
     prerendering, which would ship this page as an empty grid to crawlers and
     to anyone without JavaScript. useSyncExternalStore reconciles the
     server's "no filter" with the client's URL the way it is meant to, and
     without the cascading render an effect would cause. */
  const urlCategory = useSyncExternalStore(
    NO_SUBSCRIBE,
    getUrlCategory,
    getServerUrlCategory,
  );

  /* null = the visitor has not touched the filter, so the URL still governs. */
  const [picked, setPicked] = useState<string | null>(null);
  const category = picked ?? urlCategory;
  const setCategory = setPicked;

  const [kind, setKind] = useState<"all" | "rx" | "nut">("all");

  const live = useMemo(() => publishedOnly(products), [products]);

  /* Only offer a filter that would actually return something. */
  const available = useMemo(() => {
    const names = new Set(live.map((p) => p.category).filter(Boolean));
    return categories.filter((c) => names.has(c.name));
  }, [categories, live]);

  const rows = useMemo(
    () =>
      live.filter((p) => {
        if (category && p.category !== category) return false;
        if (kind !== "all" && p.kind !== kind) return false;
        return true;
      }),
    [live, category, kind],
  );

  const filtered = !!category || kind !== "all";

  if (live.length === 0) {
    return (
      <div className="cat-empty">
        <strong>No products are published yet.</strong>
        <p>
          The catalogue is managed from the admin console. Products marked
          active appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="cat-filters" role="group" aria-label="Filter products">
        <div className="cat-filter-row">
          <span className="cat-filter-l" id="filter-cat">
            Category
          </span>
          <div className="chips" aria-labelledby="filter-cat">
            <button
              type="button"
              className={`fchip${category === "" ? " on" : ""}`}
              aria-pressed={category === ""}
              onClick={() => setCategory("")}
            >
              All
            </button>
            {available.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`fchip${category === c.name ? " on" : ""}`}
                aria-pressed={category === c.name}
                onClick={() => setCategory(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="cat-filter-row">
          <span className="cat-filter-l" id="filter-kind">
            Type
          </span>
          <div className="chips" aria-labelledby="filter-kind">
            {(
              [
                ["all", "All"],
                ["rx", "Pharmaceutical"],
                ["nut", "Nutraceutical"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                className={`fchip${kind === v ? " on" : ""}`}
                aria-pressed={kind === v}
                onClick={() => setKind(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="cat-count" role="status" aria-live="polite">
          {rows.length} of {live.length} products
          {filtered ? (
            <button
              type="button"
              className="cat-clear"
              onClick={() => {
                setCategory("");
                setKind("all");
              }}
            >
              Clear filters
            </button>
          ) : null}
        </p>
      </div>

      {rows.length ? (
        <div className="grid g-3">
          {rows.map((p) => (
            <ProductCard p={p} key={p.id} />
          ))}
        </div>
      ) : (
        <div className="cat-empty">
          <strong>Nothing matches those filters.</strong>
          <p>Clear them to see the full catalogue.</p>
          <button
            type="button"
            className="btn btn--line"
            onClick={() => {
              setCategory("");
              setKind("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

/* ----------------------------------------------------------------- featured
   Rendered only when the console has actually flagged something, so the
   section cannot appear as an empty promise. */

export function FeaturedRail() {
  const products = useProducts();
  const featured = useMemo(
    () => publishedOnly(products).filter((p) => p.featured),
    [products],
  );

  if (featured.length === 0) return null;

  return (
    <div style={{ marginBottom: 38 }}>
      <div className="lab plain" style={{ marginBottom: 16 }}>
        Featured
      </div>
      <div className="grid g-3">
        {featured.slice(0, 3).map((p) => (
          <ProductCard p={p} key={p.id} />
        ))}
      </div>
    </div>
  );
}

/** Same category, excluding the product being viewed. */
export function RelatedProducts({ current }: { current: AdminProduct }) {
  const products = useProducts();

  const related = useMemo(
    () =>
      publishedOnly(products)
        .filter((p) => p.id !== current.id && p.category === current.category)
        .slice(0, 3),
    [products, current],
  );

  if (related.length === 0) return null;

  return (
    <section className="sect sect--card">
      <div className="wrap">
        <div className="lab plain" style={{ marginBottom: 16 }}>
          More in {current.category}
        </div>
        <div className="grid g-3">
          {related.map((p) => (
            <ProductCard p={p} key={p.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
