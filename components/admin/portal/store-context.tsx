"use client";

/* ==========================================================================
   ADMIN PORTAL — shared state
   --------------------------------------------------------------------------
   One provider holds the catalogue, the categories, the session and the toast
   queue, so every screen sees the same data and a mutation on one screen is
   reflected on the next without a refetch. All writes go through
   lib/admin/store.ts, which is the seam a real API slots into.
   ========================================================================== */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  signOut as clearSession,
  subscribeSession,
  type AdminSession,
} from "@/lib/admin/auth";
import {
  DEFAULT_CONTENT,
  categoryService,
  contentService,
  productService,
  type AdminProduct,
  type Category,
  type SiteContent,
} from "@/lib/catalogue";

type PortalCtx = {
  session: AdminSession | null;
  ready: boolean;
  signOut: () => void;

  products: AdminProduct[];
  categories: Category[];
  content: SiteContent;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;

  createProduct: (p: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">) => Promise<AdminProduct>;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProducts: () => Promise<void>;

  createCategory: (c: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, patch: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  updateContent: (patch: Partial<SiteContent>) => Promise<void>;
  resetContent: () => Promise<void>;

  toast: (msg: ReactNode) => void;
};

const Ctx = createContext<PortalCtx | null>(null);

/* Module-level so the identities stay stable across renders. */
const NO_SUBSCRIBE = () => () => {};
const TRUE_SNAPSHOT = () => true;
const FALSE_SNAPSHOT = () => false;

export function usePortal(): PortalCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePortal must be used inside AdminPortalProvider");
  return v;
}

export function AdminPortalProvider({ children }: { children: ReactNode }) {
  /* Read through an external store rather than a mount effect: localStorage
     does not exist on the server, and useSyncExternalStore is the primitive
     that reconciles that without a cascading render. */
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  /* True only once the client has taken over, so the guard never redirects
     against a server snapshot that is signed-out by definition. */
  const ready = useSyncExternalStore(NO_SUBSCRIBE, TRUE_SNAPSHOT, FALSE_SNAPSHOT);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const [toastMsg, setToastMsg] = useState<ReactNode>(null);
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* The fetch awaits before its first setState, so nothing is set
     synchronously inside the effect body. `reloadToken` re-runs it. */
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [p, c, s] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
          contentService.getContent(),
        ]);
        if (cancelled) return;
        setProducts(p);
        setCategories(c);
        setContent(s);
        setError(null);
      } catch {
        if (!cancelled) setError("Could not load local catalogue data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  /* Called from event handlers only, where setState is the normal path. */
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    setReloadToken((t) => t + 1);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const toast = useCallback((msg: ReactNode) => {
    setToastMsg(msg);
    setToastOn(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 2800);
  }, []);

  /* clearSession notifies the external store, so `session` updates itself. */
  const signOutNow = useCallback(() => {
    clearSession();
  }, []);

  const createProduct = useCallback(
    async (p: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">) => {
      const created = await productService.addProduct(p);
      setProducts((prev) => [created, ...prev]);
      return created;
    },
    [],
  );

  const updateProduct = useCallback(async (id: string, patch: Partial<AdminProduct>) => {
    const next = await productService.updateProduct(id, patch);
    if (next) setProducts((prev) => prev.map((p) => (p.id === id ? next : p)));
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetProducts = useCallback(async () => {
    const seeded = await productService.reset();
    setProducts(seeded);
  }, []);

  const createCategory = useCallback(async (c: Omit<Category, "id">) => {
    const created = await categoryService.addCategory(c);
    setCategories((prev) => [...prev, created]);
  }, []);

  /* A rename has to carry the products with it — they reference the category
     by name, so leaving them behind would orphan every one of them. */
  const updateCategory = useCallback(
    async (id: string, patch: Partial<Category>) => {
      const before = categories.find((c) => c.id === id);
      const next = await categoryService.updateCategory(id, patch);
      if (!next) return;
      setCategories((prev) => prev.map((c) => (c.id === id ? next : c)));

      if (before && patch.name && patch.name !== before.name) {
        setProducts(await productService.reassignCategory(before.name, patch.name));
      }
    },
    [categories],
  );

  const deleteCategory = useCallback(async (id: string) => {
    await categoryService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateContent = useCallback(async (patch: Partial<SiteContent>) => {
    setContent(await contentService.updateContent(patch));
  }, []);

  const resetContent = useCallback(async () => {
    setContent(await contentService.resetContent());
  }, []);

  const value = useMemo<PortalCtx>(
    () => ({
      session,
      ready,
      signOut: signOutNow,
      products,
      categories,
      content,
      loading,
      error,
      reload,
      createProduct,
      updateProduct,
      deleteProduct,
      resetProducts,
      createCategory,
      updateCategory,
      deleteCategory,
      updateContent,
      resetContent,
      toast,
    }),
    [
      session, ready, signOutNow, products, categories, content, loading, error, reload,
      createProduct, updateProduct, deleteProduct, resetProducts,
      createCategory, updateCategory, deleteCategory, updateContent, resetContent, toast,
    ],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={`ac-toast${toastOn ? " on" : ""}`} role="status" aria-live="polite">
        {toastMsg}
      </div>
    </Ctx.Provider>
  );
}
