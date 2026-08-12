/* Sample catalogue — generic molecules only, described factually, no
   therapeutic claims. Replace wholesale when the client shares the product
   list (MoM Action Item 3). */

export type Product = {
  /** name */
  n: string;
  /** composition */
  c: string;
  /** dosage form */
  f: string;
  /** type: prescription vs nutraceutical */
  t: "rx" | "nut";
  slug?: string;
};

export const PRODUCTS: Product[] = [
  { n: "Paracetamol 500 mg Tablets IP", c: "Paracetamol IP 500 mg", f: "Tablet", t: "rx" },
  { n: "Cetirizine Hydrochloride 10 mg Tablets IP", c: "Cetirizine Hydrochloride IP 10 mg", f: "Tablet", t: "rx" },
  { n: "Oral Rehydration Salts IP", c: "Sodium chloride · Potassium chloride · Sodium citrate · Dextrose", f: "Powder", t: "rx" },
  { n: "Pantoprazole 40 mg Tablets IP", c: "Pantoprazole Sodium IP eq. to Pantoprazole 40 mg", f: "Tablet", t: "rx" },
  { n: "Povidone-Iodine 5% Solution IP", c: "Povidone-Iodine IP 5% w/v", f: "Solution", t: "rx" },
  { n: "Vitamin D3 60000 IU Sachets", c: "Cholecalciferol 60000 IU", f: "Sachet", t: "nut" },
  { n: "Calcium Carbonate & Vitamin D3 Tablets", c: "Calcium Carbonate 1250 mg · Cholecalciferol 250 IU", f: "Tablet", t: "nut" },
  { n: "Multivitamin & Multimineral Tablets", c: "[CLIENT: full composition]", f: "Tablet", t: "nut" },
  { n: "Zinc Sulphate Dispersible Tablets", c: "Zinc Sulphate Monohydrate eq. to elemental Zinc 20 mg", f: "Tablet", t: "nut" },
  { n: "Iron & Folic Acid Tablets", c: "Ferrous Fumarate · Folic Acid IP", f: "Tablet", t: "nut" },
  { n: "Omega-3 Fatty Acid Softgels", c: "Fish oil concentrate providing EPA & DHA", f: "Softgel", t: "nut" },
];

/** Image-led category tiles: [label, image key, alt text] */
export const CAT_TILES: [string, string, string][] = [
  ["Tablets", "prod-tablets", "Piyushwani tablet pack and blister"],
  ["Capsules", "prod-capsules", "Piyushwani capsule pack and blister"],
  ["Syrups", "prod-syrups", "Piyushwani syrup bottle and carton"],
  ["Nutraceuticals", "prod-nutraceuticals", "Piyushwani nutraceutical bottle and carton"],
];

/* The admin console is shared between sites, so each site supplies these
   adapters rather than the console knowing either schema. Piyushwani uses the
   compact n/c/f/t shape; WaaniGo uses full keys. Both round-trip through
   productRow / productSave. */
export type ProductRow = {
  name: string;
  comp: string;
  cat: string;
  form: string;
  price: number;
  rx: boolean;
  stock: boolean;
};

export function productRow(p: Product): ProductRow {
  return {
    name: p.n || "",
    comp: p.c || "",
    cat: p.t === "rx" ? "Pharmaceutical" : "Nutraceutical",
    form: p.f || "—",
    price: 0,
    rx: p.t === "rx",
    stock: true,
  };
}

export function toProduct(rec: ProductRow): Product {
  return {
    n: rec.name,
    c: rec.comp,
    f: rec.form || "Tablet",
    t: rec.rx ? "rx" : "nut",
    slug: rec.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  };
}
