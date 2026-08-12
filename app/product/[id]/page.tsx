import type { Metadata } from "next";

import { ProductDetail } from "@/components/ProductDetail";
import { getServerProductsSnapshot, resolveProduct } from "@/lib/catalogue";

type Params = { params: Promise<{ id: string }> };

/* Both URL shapes are prerendered: the slugs the catalogue links to now, and
   the numeric indices the site shipped with, which stay valid. */
export function generateStaticParams() {
  const seed = getServerProductsSnapshot();
  return [
    ...seed.map((p) => ({ id: p.slug })),
    ...seed.map((_, i) => ({ id: String(i) })),
  ];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = resolveProduct(getServerProductsSnapshot(), id);
  /* A product added in the console exists only in that visitor's browser, so
     the server cannot describe it — and must not let a search engine index a
     page it will render as unavailable. */
  if (!p) {
    return { title: "Product — Piyushwani", robots: { index: false, follow: true } };
  }
  return {
    title: `${p.name} — Piyushwani`,
    description: `${p.name}. Composition: ${p.composition}. Dosage form: ${p.form}. Batch-level verification on every pack.`,
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;

  /* Resolved twice, deliberately. Here against the seed, so the prerendered
     HTML is real content for every product the site ships with; then again on
     the client against the live catalogue, so a product the console has since
     edited — or added, which the server has no way to know about — renders
     its current state rather than a 404. */
  const seed = resolveProduct(getServerProductsSnapshot(), id);

  return <ProductDetail param={id} seed={seed} />;
}
