"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ProductForm, type ProductDraft } from "@/components/admin/portal/ProductForm";
import { AdminShell } from "@/components/admin/portal/shell";
import { usePortal } from "@/components/admin/portal/store-context";
import { EmptyState, LoadingState } from "@/components/admin/portal/ui";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { products, loading, updateProduct, toast } = usePortal();

  const product = products.find((p) => p.id === id);

  async function save(draft: ProductDraft) {
    if (!product) return;
    await updateProduct(product.id, draft);
    toast(
      <>
        <b>{draft.name}</b> saved
      </>,
    );
    router.push("/admin/products");
  }

  return (
    <AdminShell
      title={product ? "Edit product" : "Product"}
      subtitle={product?.name}
      crumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Products", href: "/admin/products" },
        { label: product?.name ?? "Edit" },
      ]}
    >
      {loading ? (
        <LoadingState label="Loading product…" rows={5} />
      ) : !product ? (
        <EmptyState
          title="Product not found"
          body="This product may have been deleted, or the link points at a record that no longer exists in this browser."
          action={
            <Link className="ac-btn" href="/admin/products">
              Back to products
            </Link>
          }
        />
      ) : (
        <ProductForm
          initial={{
            name: product.name,
            category: product.category,
            slug: product.slug,
            composition: product.composition,
            form: product.form,
            kind: product.kind,
            shortDescription: product.shortDescription,
            description: product.description,
            image: product.image,
            additionalImages: product.additionalImages,
            benefits: product.benefits,
            specifications: product.specifications,
            packSize: product.packSize,
            usage: product.usage,
            status: product.status,
            featured: product.featured,
          }}
          currentId={product.id}
          submitLabel="Save changes"
          onSubmit={save}
        />
      )}
    </AdminShell>
  );
}
