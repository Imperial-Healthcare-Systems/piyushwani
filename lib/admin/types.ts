/* ==========================================================================
   ADMIN PORTAL — domain types
   --------------------------------------------------------------------------
   The shape here is a superset of lib/products.ts. The public site reads the
   compact {n,c,f,t} record; the admin portal needs editorial fields on top of
   it (status, featured, imagery, specifications). `toPublicProduct` collapses
   an AdminProduct back down to the public shape, so the two never drift.

   Nothing in this file invents product content. Every field that the public
   product page currently renders as a [CLIENT: …] gap chip starts empty here
   too — an empty field is honest, a fabricated one is not.
   ========================================================================== */

import type { Product } from "@/lib/products";

/** Draft is the safe default: a new record is not public until published. */
export type ProductStatus = "active" | "inactive" | "draft";

/** Mirrors lib/products.ts `t` — prescription vs nutraceutical. */
export type ProductKind = "rx" | "nut";

export type Spec = { label: string; value: string };

export type AdminProduct = {
  id: string;
  /** Product name — maps to Product.n */
  name: string;
  /** Category name, must match a Category.name */
  category: string;
  slug: string;
  /** Composition / actives — maps to Product.c */
  composition: string;
  /** Dosage form (Tablet, Capsule, Syrup…) — maps to Product.f */
  form: string;
  /** rx | nut — maps to Product.t */
  kind: ProductKind;
  shortDescription: string;
  description: string;
  /** Key into lib/images.ts IMG, or an absolute /images/… path */
  image: string;
  additionalImages: string[];
  benefits: string[];
  specifications: Spec[];
  packSize: string;
  usage: string;
  status: ProductStatus;
  featured: boolean;
  /** ISO timestamps */
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Key into lib/images.ts IMG */
  image: string;
  order: number;
};

/** A brand-new, entirely empty product. No invented defaults. */
export function emptyProduct(): Omit<AdminProduct, "id" | "createdAt" | "updatedAt"> {
  return {
    name: "",
    category: "",
    slug: "",
    composition: "",
    form: "",
    kind: "rx",
    shortDescription: "",
    description: "",
    image: "",
    additionalImages: [],
    benefits: [],
    specifications: [],
    packSize: "",
    usage: "",
    status: "draft",
    featured: false,
  };
}

export function slugify(v: string): string {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Collapse an admin record back to the public {n,c,f,t} shape. */
export function toPublicProduct(p: AdminProduct): Product {
  return { n: p.name, c: p.composition, f: p.form, t: p.kind, slug: p.slug };
}

export const STATUS_LABEL: Record<ProductStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  draft: "Draft",
};

/** Maps a status onto the existing .ac- tag colour classes. */
export const STATUS_TONE: Record<ProductStatus, string> = {
  active: "t-green",
  inactive: "t-grey",
  draft: "t-amber",
};
