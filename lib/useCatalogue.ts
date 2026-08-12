"use client";

/* ==========================================================================
   CATALOGUE HOOKS
   --------------------------------------------------------------------------
   The public storefront's read path. useSyncExternalStore is the primitive
   built for exactly this: localStorage does not exist during the server
   render, and reading it during the client render would desync hydration.

   The server snapshot is the seed catalogue, so a statically prerendered page
   ships real content — crawlers and a visitor with JavaScript disabled both
   get the products, not an empty grid. Once hydrated, whatever the console
   has saved takes over.
   ========================================================================== */

import { useSyncExternalStore } from "react";

import {
  getCategoriesSnapshot,
  getContentSnapshot,
  getProductsSnapshot,
  getServerCategoriesSnapshot,
  getServerContentSnapshot,
  getServerProductsSnapshot,
  subscribe,
  type AdminProduct,
  type Category,
  type SiteContent,
} from "@/lib/catalogue";

export function useProducts(): AdminProduct[] {
  return useSyncExternalStore(subscribe, getProductsSnapshot, getServerProductsSnapshot);
}

export function useCategories(): Category[] {
  return useSyncExternalStore(subscribe, getCategoriesSnapshot, getServerCategoriesSnapshot);
}

export function useSiteContent(): SiteContent {
  return useSyncExternalStore(subscribe, getContentSnapshot, getServerContentSnapshot);
}
