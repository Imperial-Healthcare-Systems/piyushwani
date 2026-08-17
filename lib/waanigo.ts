/* ==========================================================================
   WAANIGO — outbound links to the storefront
   --------------------------------------------------------------------------
   WaaniGo is the group's e-commerce unit and the only place a visitor can
   actually buy a single pack. Every "Buy"/"Shop" call to action on this site
   used to point at /contact, which was a dead end dressed as a purchase path.
   They now resolve to a real WaaniGo URL through this module.

   WaaniGo is a hash-routed single-page app, so its routes are:

       #/                     home
       #/shop                 the full catalogue
       #/c/<category-slug>    a category
       #/p/<product-slug>     a product

   The product slug rule is identical to this project's slugify() — lowercase,
   every run of non-alphanumerics collapsed to a hyphen, ends trimmed. That is
   not an assumption: it was read off WaaniGo's own markup, where the five
   products the two catalogues share resolve to

       paracetamol-500-mg-tablets-ip
       cetirizine-hydrochloride-10-mg-tablets-ip
       oral-rehydration-salts-ip
       pantoprazole-40-mg-tablets-ip
       povidone-iodine-5-solution-ip

   which is exactly slugify() applied to the names in lib/products.ts. So the
   two catalogues stay linked by name alone, with no id table to maintain.

   Where a name does differ between the two sites, add the mapping to
   SLUG_OVERRIDES below rather than renaming a product on either side.
   ========================================================================== */

import { slugify } from "@/lib/admin/types";

/** Root of the storefront. Override at build time to point at a staging deploy. */
export const WAANIGO_BASE =
  process.env.NEXT_PUBLIC_WAANIGO_BASE ?? "https://waanigo.vercel.app";

/** The four storefront categories, as WaaniGo slugs them. */
export type WaanigoCategory =
  | "healthcare"
  | "daily-essentials"
  | "gym-products"
  | "nutraceuticals";

/* Piyushwani's catalogue is split into prescription ("rx") and nutraceutical
   ("nut") lines; WaaniGo splits its shelf four ways. Only two of the four can
   receive a Piyushwani product, so that is all this maps. */
const KIND_TO_CATEGORY: Record<"rx" | "nut", WaanigoCategory> = {
  rx: "healthcare",
  nut: "nutraceuticals",
};

/* This site's own category tiles (lib/products.ts CAT_TILES) onto WaaniGo's
   shelves. Syrups/Drops/Tablets are dosage forms rather than shelves, and all
   three sit under healthcare on the storefront. */
const TILE_TO_CATEGORY: Record<string, WaanigoCategory> = {
  Syrups: "healthcare",
  Nutraceuticals: "nutraceuticals",
  Drops: "healthcare",
  Tablets: "healthcare",
};

/* Products whose WaaniGo slug is not slugify(name). Empty today — every
   shared product currently round-trips through the default rule — and it
   exists so a future rename is a one-line change here instead of a hunt
   through call sites. */
const SLUG_OVERRIDES: Record<string, string> = {};

/** Storefront home. */
export const WAANIGO_HOME = `${WAANIGO_BASE}/#/`;

/** The full storefront catalogue. */
export const WAANIGO_SHOP = `${WAANIGO_BASE}/#/shop`;

/** A storefront category page. */
export function waanigoCategoryUrl(category: WaanigoCategory): string {
  return `${WAANIGO_BASE}/#/c/${category}`;
}

/** The storefront category for one of this site's category tiles. */
export function waanigoCategoryForTile(label: string): WaanigoCategory | null {
  return TILE_TO_CATEGORY[label] ?? null;
}

/* The shapes this module accepts. Both the public catalogue ({n,c,f,t}) and
   the admin record ({name, kind, slug}) can be passed straight in, so callers
   never have to reshape a product just to build a link. */
type NamedProduct = {
  name?: string;
  n?: string;
  slug?: string;
  kind?: "rx" | "nut";
  t?: "rx" | "nut";
};

function nameOf(p: NamedProduct): string {
  return (p.name ?? p.n ?? "").trim();
}

function kindOf(p: NamedProduct): "rx" | "nut" {
  return p.kind ?? p.t ?? "rx";
}

/** The WaaniGo slug for a product, by name. */
export function waanigoSlug(p: NamedProduct): string {
  const name = nameOf(p);
  return SLUG_OVERRIDES[name] ?? p.slug ?? slugify(name);
}

/**
 * Deep link to a product on the storefront.
 *
 * A product with no usable name has no slug to build from, so it falls back
 * to its category shelf rather than emitting `#/p/` and landing the visitor
 * on an empty product page.
 */
export function waanigoProductUrl(p: NamedProduct): string {
  const slug = waanigoSlug(p);
  if (!slug) return waanigoCategoryUrl(KIND_TO_CATEGORY[kindOf(p)]);
  return `${WAANIGO_BASE}/#/p/${slug}`;
}

/** The storefront shelf a given product sits on. */
export function waanigoCategoryUrlForProduct(p: NamedProduct): string {
  return waanigoCategoryUrl(KIND_TO_CATEGORY[kindOf(p)]);
}

/* The storefront shelves, for the footer's shop column. */
export const WAANIGO_CATEGORIES: { label: string; category: WaanigoCategory }[] = [
  { label: "Healthcare", category: "healthcare" },
  { label: "Daily Essentials", category: "daily-essentials" },
  { label: "Gym Products", category: "gym-products" },
  { label: "Nutraceuticals", category: "nutraceuticals" },
];

/** Attributes every outbound storefront link needs. Spread onto an <a>. */
export const EXTERNAL_LINK = {
  target: "_blank",
  rel: "noreferrer noopener",
} as const;
