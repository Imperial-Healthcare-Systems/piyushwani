"use client";

import { useRouter } from "next/navigation";

import { ProductForm, type ProductDraft } from "@/components/admin/portal/ProductForm";
import { AdminShell } from "@/components/admin/portal/shell";
import { usePortal } from "@/components/admin/portal/store-context";
import { emptyProduct } from "@/lib/admin/types";

export default function NewProductPage() {
  const router = useRouter();
  const { createProduct, toast } = usePortal();

  async function save(draft: ProductDraft) {
    await createProduct(draft);
    toast(
      <>
        <b>{draft.name}</b> created
      </>,
    );
    router.push("/admin/products");
  }

  return (
    <AdminShell
      title="New product"
      subtitle="Add a product to the local catalogue."
      crumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Products", href: "/admin/products" },
        { label: "New" },
      ]}
    >
      <div className="ac-note" style={{ marginBottom: "1rem" }}>
        Fields left blank stay blank — the public site renders unfilled content
        as a visible gap chip rather than inventing text.
      </div>
      <ProductForm initial={emptyProduct()} submitLabel="Create product" onSubmit={save} />
    </AdminShell>
  );
}
