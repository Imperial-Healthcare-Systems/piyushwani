import type { Metadata } from "next";

import { CatGrid, ProductGrid } from "@/components/catalogue";
import { Crumb, Note } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Products — Piyushwani OPC Pvt. Ltd.",
  description:
    "A focused pharmaceutical and wellness range, each product documented in full and verifiable by batch.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="sect sect--card sect--tight page-head">
        <div className="wrap">
          <Crumb>Products</Crumb>
          <div className="lab">Our products</div>
          <h1 className="h-xl" style={{ margin: "14px 0 18px" }}>
            Our Products
          </h1>
          <p className="lede">
            A focused pharmaceutical and wellness range, each product documented
            in full and verifiable by batch.
          </p>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap">
          <Note variant="warn" style={{ marginBottom: 26 }}>
            <strong>Sample catalogue.</strong> The products below use generic
            molecule names to demonstrate the layout. They will be replaced
            entirely when the client shares the product list with
            specifications, composition and photographs (MoM Action Item 3).
          </Note>

          <p className="lede" style={{ marginBottom: 28 }}>
            We have deliberately launched with a small catalogue across four
            product forms. Every product below carries its complete composition,
            specifications, pack details and manufacturing information — and
            every batch we release can be verified from the pack itself.
          </p>

          <div className="lab plain" style={{ marginBottom: 16 }}>
            Product categories
          </div>
          <CatGrid />

          <div className="lab plain" style={{ margin: "38px 0 16px" }}>
            Full catalogue
          </div>
          {/* Both are client components, but neither reads searchParams during
              render, so the page still prerenders with every product in the
              HTML. The ?category= deep link is applied after hydration. */}
          <ProductGrid />
        </div>
      </section>
    </>
  );
}
