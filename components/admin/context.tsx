"use client";

import { createContext, useContext } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import type { AdminTab, AuditEntry, Doctor, EditState, InboxRow, SettingRow } from "@/components/admin/types";
import type { Batch } from "@/lib/batches";
import type { Cert } from "@/lib/certs";
import type { CmsValues } from "@/lib/cms";
import type { Product } from "@/lib/products";

export type Paged<T> = { slice: T[]; pages: number; current: number };

export type AdminCtx = {
  /* navigation */
  tab: AdminTab;
  goTab: (t: AdminTab) => void;
  edit: EditState;
  setEdit: Dispatch<SetStateAction<EditState>>;

  /* table controls */
  q: string;
  setQuery: (v: string) => void;
  sort: number | null;
  dir: 1 | -1;
  onSort: (i: number) => void;
  setPage: Dispatch<SetStateAction<number>>;
  sortRows: <T extends Record<string, unknown>>(rows: T[], keys: string[]) => T[];
  paginate: <T>(rows: T[]) => Paged<T>;

  /* session-scoped working copies */
  cms: CmsValues;
  setCms: Dispatch<SetStateAction<CmsValues>>;
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  certs: Cert[];
  setCerts: Dispatch<SetStateAction<Cert[]>>;
  batches: Record<string, Batch>;
  setBatches: Dispatch<SetStateAction<Record<string, Batch>>>;
  doctors: Doctor[];
  setDoctors: Dispatch<SetStateAction<Doctor[]>>;
  settings: SettingRow[];
  setSettings: Dispatch<SetStateAction<SettingRow[]>>;
  inbox: InboxRow[];

  /* side effects */
  log: AuditEntry[];
  audit: (action: string, entity: string, detail: string) => void;
  toast: (msg: ReactNode) => void;

  /* derived */
  gaps: { label: string; where: string }[];
};

const Ctx = createContext<AdminCtx | null>(null);

export const AdminProvider = Ctx.Provider;

export function useAdmin(): AdminCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin must be used inside the admin console");
  return v;
}
