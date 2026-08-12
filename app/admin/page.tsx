import { redirect } from "next/navigation";

/* /admin is the address people type and the address the footer links to; the
   console itself lives at /admin/dashboard. Redirecting rather than
   duplicating keeps one canonical URL per screen. The shell's auth guard runs
   on the destination, so an unauthenticated visitor still lands on the login
   screen. */
export default function AdminIndex() {
  redirect("/admin/dashboard");
}
