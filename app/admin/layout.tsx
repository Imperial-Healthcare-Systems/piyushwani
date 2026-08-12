import type { Metadata } from "next";

import { AdminPortalProvider } from "@/components/admin/portal/store-context";

import "./portal.css";

export const metadata: Metadata = {
  title: "Admin — Piyushwani",
  description: "Catalogue management console.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminPortalProvider>{children}</AdminPortalProvider>;
}
