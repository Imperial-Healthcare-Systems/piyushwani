/* ==========================================================================
   CATALOGUE — the one data layer
   --------------------------------------------------------------------------
   Both the public storefront and the admin portal read through this module.
   That is the whole point: an edit made in the console is the same record the
   product page renders, so the two can never disagree.

       public pages  ─┐
                      ├─→ catalogue service ─→ localStorage
       admin portal  ─┘

   There is no server. When one exists, the bodies of the *Service methods
   below become apiFetch calls (lib/config.ts already declares the endpoints)
   and nothing above this line changes — the signatures are already async and
   already return these shapes.

   Two read paths, deliberately:

     • the *Service methods are async, and carry a short artificial latency so
       the console's loading states are real rather than decorative.
     • the *Snapshot functions are synchronous, for useSyncExternalStore on
       public pages, which must not flash a spinner over content that is
       already server-rendered.

   Both resolve against the same storage, so they cannot drift.

   Seed data is derived from lib/products.ts — the catalogue the public site
   already ships. Fields the project has no real value for (pack size, usage,
   description) are seeded EMPTY rather than filled with plausible-looking
   text. An empty field is honest; an invented one is not.
   ========================================================================== */

import {
  slugify,
  type AdminProduct,
  type Category,
} from "@/lib/admin/types";
import { CAT_TILES, PRODUCTS } from "@/lib/products";

export type { AdminProduct, Category };
export { slugify };

const PRODUCTS_KEY = "pw_admin_products_v1";
const CATEGORIES_KEY = "pw_admin_categories_v1";
const CONTENT_KEY = "pw_site_content_v1";

/** Simulated latency so the console's loading states are real, not decorative. */
const LATENCY = 180;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
}

function nowIso(): string {
  return new Date().toISOString();
}

/* Ids for records created at runtime. Seed records get deterministic ids
   instead (see below) so a server render and a client render agree. */
let counter = 0;
function makeId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${Math.floor(
    Math.random() * 1e6,
  ).toString(36)}`;
}

function canStore(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readRaw(key: string): string | null {
  if (!canStore()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Quota or private mode — the session still works, it just won't persist. */
  }
  emit();
}

/* ==========================================================================
   SUBSCRIPTION
   Public pages re-render when the console writes. The storage event covers a
   second tab; the local listener set covers the tab that made the change,
   which does not receive its own storage event.
   ========================================================================== */

const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === PRODUCTS_KEY || e.key === CATEGORIES_KEY || e.key === CONTENT_KEY) {
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/* ==========================================================================
   SITE CONTENT
   Only fields the homepage actually renders today. Every default below is the
   exact copy currently on the page, so "reset" restores the site as shipped
   and nothing here was written by a machine guessing at marketing.
   ========================================================================== */

export type SiteContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroTitleEm: string;
  heroLede: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
};

export const DEFAULT_CONTENT: SiteContent = {
  heroEyebrow: "Authenticity",
  heroTitle: "Medicines you can trace.",
  heroTitleEm: "Standards you can verify.",
  heroLede:
    "Piyushwani OPC Pvt. Ltd. develops and markets pharmaceutical and wellness products manufactured to certified standards — and gives you the means to verify every single batch.",
  heroPrimaryLabel: "Explore our products",
  heroPrimaryHref: "/products",
  heroSecondaryLabel: "View certifications",
  heroSecondaryHref: "/certifications",
};

export const CONTENT_FIELDS: {
  key: keyof SiteContent;
  label: string;
  hint?: string;
  long?: boolean;
}[] = [
  { key: "heroEyebrow", label: "Hero eyebrow", hint: "The small mono label above the headline." },
  { key: "heroTitle", label: "Hero headline — first line" },
  { key: "heroTitleEm", label: "Hero headline — second line", hint: "Rendered in the lighter emphasis weight." },
  { key: "heroLede", label: "Hero description", long: true },
  { key: "heroPrimaryLabel", label: "Primary button label" },
  { key: "heroPrimaryHref", label: "Primary button link", hint: "A path on this site, e.g. /products" },
  { key: "heroSecondaryLabel", label: "Secondary button label" },
  { key: "heroSecondaryHref", label: "Secondary button link" },
];

/* ==========================================================================
   SEEDING
   ========================================================================== */

/** Maps the public catalogue's dosage form onto a seed category. */
function seedCategoryFor(form: string, kind: string): string {
  if (kind === "nut") return "Nutraceuticals";
  const f = form.toLowerCase();
  if (f.includes("capsule") || f.includes("softgel")) return "Capsules";
  if (f.includes("solution") || f.includes("syrup")) return "Syrups";
  return "Tablets";
}

/* Seed ids are derived from position, not from the clock, so the server and
   the client agree on them and a reset is idempotent. */
function seedCategories(): Category[] {
  return CAT_TILES.map(([label, imageKey], i) => ({
    id: `cat_seed_${i}`,
    name: label,
    slug: slugify(label),
    description: "",
    image: imageKey,
    order: i,
  }));
}

function seedProducts(at: string): AdminProduct[] {
  return PRODUCTS.map((p, i) => ({
    id: `prd_seed_${i}`,
    name: p.n,
    category: seedCategoryFor(p.f, p.t),
    slug: p.slug ?? slugify(p.n),
    composition: p.c,
    form: p.f,
    kind: p.t,
    shortDescription: "",
    description: "",
    image: "",
    additionalImages: [],
    benefits: [],
    specifications: [],
    packSize: "",
    usage: "",
    status: "active" as const,
    featured: false,
    createdAt: at,
    updatedAt: at,
  }));
}

/* ==========================================================================
   SYNCHRONOUS SNAPSHOTS
   getSnapshot must be referentially stable between changes or React will
   re-render forever, so each parse is cached against the raw string it came
   from and only redone when that string differs.
   ========================================================================== */

type Cache<T> = { raw: string | null; value: T; primed: boolean };

const productCache: Cache<AdminProduct[]> = { raw: null, value: [], primed: false };
const categoryCache: Cache<Category[]> = { raw: null, value: [], primed: false };
const contentCache: Cache<SiteContent> = { raw: null, value: DEFAULT_CONTENT, primed: false };

/* The server has no storage, so it renders the seed. Computed once and held,
   because this value is handed to useSyncExternalStore as its server
   snapshot and must not change identity between calls. */
const SEED_TIME = new Date(0).toISOString();
const SERVER_PRODUCTS: AdminProduct[] = seedProducts(SEED_TIME);
const SERVER_CATEGORIES: Category[] = seedCategories();

export function getProductsSnapshot(): AdminProduct[] {
  const raw = readRaw(PRODUCTS_KEY);
  if (raw === null) return SERVER_PRODUCTS;
  if (productCache.primed && raw === productCache.raw) return productCache.value;
  productCache.primed = true;
  productCache.raw = raw;
  try {
    const parsed = JSON.parse(raw) as AdminProduct[];
    productCache.value = Array.isArray(parsed) ? parsed : SERVER_PRODUCTS;
  } catch {
    productCache.value = SERVER_PRODUCTS;
  }
  return productCache.value;
}

export function getServerProductsSnapshot(): AdminProduct[] {
  return SERVER_PRODUCTS;
}

export function getCategoriesSnapshot(): Category[] {
  const raw = readRaw(CATEGORIES_KEY);
  if (raw === null) return SERVER_CATEGORIES;
  if (categoryCache.primed && raw === categoryCache.raw) return categoryCache.value;
  categoryCache.primed = true;
  categoryCache.raw = raw;
  try {
    const parsed = JSON.parse(raw) as Category[];
    categoryCache.value = Array.isArray(parsed) ? parsed : SERVER_CATEGORIES;
  } catch {
    categoryCache.value = SERVER_CATEGORIES;
  }
  return categoryCache.value;
}

export function getServerCategoriesSnapshot(): Category[] {
  return SERVER_CATEGORIES;
}

export function getContentSnapshot(): SiteContent {
  const raw = readRaw(CONTENT_KEY);
  if (raw === null) return DEFAULT_CONTENT;
  if (contentCache.primed && raw === contentCache.raw) return contentCache.value;
  contentCache.primed = true;
  contentCache.raw = raw;
  try {
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    /* Merged over the defaults so a key added to SiteContent later does not
       come back undefined for anyone who saved before it existed. */
    contentCache.value = { ...DEFAULT_CONTENT, ...parsed };
  } catch {
    contentCache.value = DEFAULT_CONTENT;
  }
  return contentCache.value;
}

export function getServerContentSnapshot(): SiteContent {
  return DEFAULT_CONTENT;
}

/* ==========================================================================
   INTERNAL READS — seed on first access so the console has something to edit
   ========================================================================== */

function loadProducts(): AdminProduct[] {
  const raw = readRaw(PRODUCTS_KEY);
  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw) as AdminProduct[];
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* corrupt — fall through and re-seed */
    }
  }
  const seeded = seedProducts(nowIso());
  write(PRODUCTS_KEY, seeded);
  return seeded;
}

function loadCategories(): Category[] {
  const raw = readRaw(CATEGORIES_KEY);
  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw) as Category[];
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* corrupt — fall through and re-seed */
    }
  }
  const seeded = seedCategories();
  write(CATEGORIES_KEY, seeded);
  return seeded;
}

/* ==========================================================================
   SERVICES — the seam a real API slots into
   ========================================================================== */

export const productService = {
  async getProducts(): Promise<AdminProduct[]> {
    return delay(loadProducts());
  },

  async getProductById(id: string): Promise<AdminProduct | null> {
    return delay(loadProducts().find((p) => p.id === id) ?? null);
  },

  async addProduct(
    input: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">,
  ): Promise<AdminProduct> {
    const all = loadProducts();
    const t = nowIso();
    const record: AdminProduct = {
      ...input,
      id: makeId("prd"),
      slug: input.slug || slugify(input.name),
      createdAt: t,
      updatedAt: t,
    };
    write(PRODUCTS_KEY, [record, ...all]);
    return delay(record);
  },

  async updateProduct(id: string, patch: Partial<AdminProduct>): Promise<AdminProduct | null> {
    const all = loadProducts();
    const i = all.findIndex((p) => p.id === id);
    if (i === -1) return delay(null);
    const next: AdminProduct = { ...all[i], ...patch, id, updatedAt: nowIso() };
    all[i] = next;
    write(PRODUCTS_KEY, all);
    return delay(next);
  },

  async deleteProduct(id: string): Promise<boolean> {
    const all = loadProducts();
    const next = all.filter((p) => p.id !== id);
    write(PRODUCTS_KEY, next);
    return delay(next.length !== all.length);
  },

  /* Products reference their category by name, so renaming one has to
     re-point them or they are left pointing at a name that no longer exists.
     It lives here rather than in the calling screen because a real API would
     do this in one server-side transaction, not N round trips. */
  async reassignCategory(from: string, to: string): Promise<AdminProduct[]> {
    const all = loadProducts();
    const t = nowIso();
    let changed = false;
    const next = all.map((p) => {
      if (p.category !== from) return p;
      changed = true;
      return { ...p, category: to, updatedAt: t };
    });
    if (changed) write(PRODUCTS_KEY, next);
    return delay(next);
  },

  /** Restore the seed catalogue — used by the "Reset demo data" action. */
  async reset(): Promise<AdminProduct[]> {
    const seeded = seedProducts(nowIso());
    write(PRODUCTS_KEY, seeded);
    return delay(seeded);
  },
};

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return delay(loadCategories().slice().sort((a, b) => a.order - b.order));
  },

  async addCategory(input: Omit<Category, "id">): Promise<Category> {
    const all = loadCategories();
    const record: Category = {
      ...input,
      id: makeId("cat"),
      slug: input.slug || slugify(input.name),
    };
    write(CATEGORIES_KEY, [...all, record]);
    return delay(record);
  },

  async updateCategory(id: string, patch: Partial<Category>): Promise<Category | null> {
    const all = loadCategories();
    const i = all.findIndex((c) => c.id === id);
    if (i === -1) return delay(null);
    const next = { ...all[i], ...patch, id };
    all[i] = next;
    write(CATEGORIES_KEY, all);
    return delay(next);
  },

  async deleteCategory(id: string): Promise<boolean> {
    const all = loadCategories();
    const next = all.filter((c) => c.id !== id);
    write(CATEGORIES_KEY, next);
    return delay(next.length !== all.length);
  },
};

export const contentService = {
  async getContent(): Promise<SiteContent> {
    return delay(getContentSnapshot());
  },

  async updateContent(patch: Partial<SiteContent>): Promise<SiteContent> {
    const next = { ...getContentSnapshot(), ...patch };
    write(CONTENT_KEY, next);
    return delay(next);
  },

  /** Back to the copy the site ships with. */
  async resetContent(): Promise<SiteContent> {
    write(CONTENT_KEY, DEFAULT_CONTENT);
    return delay(DEFAULT_CONTENT);
  },
};

/** Every key this module owns — the settings screen lists them before clearing. */
export const STORAGE_KEYS = [PRODUCTS_KEY, CATEGORIES_KEY, CONTENT_KEY] as const;

/* ==========================================================================
   PUBLIC-SIDE HELPERS
   The storefront shows published products only. Draft and inactive records
   exist for the operator, not the visitor.
   ========================================================================== */

export function publishedOnly(products: AdminProduct[]): AdminProduct[] {
  return products.filter((p) => p.status === "active");
}

/** Resolves a /product/[id] param, which may be a slug, an id, or a legacy index. */
export function resolveProduct(
  products: AdminProduct[],
  param: string,
): AdminProduct | null {
  const bySlug = products.find((p) => p.slug === param);
  if (bySlug) return bySlug;
  const byId = products.find((p) => p.id === param);
  if (byId) return byId;
  /* The catalogue shipped with index-based URLs (/product/3), so they stay
     valid. The index is resolved against the seed id rather than the current
     array position — otherwise adding a product would silently re-point every
     old link, because new records are prepended. */
  const i = Number(param);
  if (Number.isInteger(i) && i >= 0 && i < PRODUCTS.length) {
    return products.find((p) => p.id === `prd_seed_${i}`) ?? null;
  }
  return null;
}
