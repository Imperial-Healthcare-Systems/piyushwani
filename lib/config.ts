/* ============================================================
   API CONFIGURATION  —  set these for your backend
   ------------------------------------------------------------
   BASE:   root URL of your API. Leave '' to use same-origin, or
           set NEXT_PUBLIC_API_BASE at build time.
   Endpoints below are appended to BASE. Adjust paths to match
   whatever you build server-side.

   IMPORTANT: the front end holds no batch data and no passwords.
   Verification, forms and admin auth all go to the server. If
   BASE is unreachable the UI shows an honest error rather than a
   fake "verified" result.
   ============================================================ */

export const API = {
  BASE: process.env.NEXT_PUBLIC_API_BASE ?? "", // e.g. 'https://api.piyushwani.co'
  verify: (code: string) => `/api/v1/verify/batch/${encodeURIComponent(code)}`,
  rfq: () => `/api/v1/rfq`,
  notify: () => `/api/v1/notify`,
  login: () => `/api/v1/auth/login`,
  logout: () => `/api/v1/auth/logout`,
  adminBatches: () => `/api/v1/admin/batches`,
  adminProducts: () => `/api/v1/admin/products`,
  adminContent: () => `/api/v1/admin/content`,
  adminTeam: () => `/api/v1/admin/team`,
  auditLog: () => `/api/v1/admin/audit-log`,
} as const;

export const ADMIN_TOKEN_KEY = "pw_admin_token";

export type ApiResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
};

type FetchOpts = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

/* Thin fetch wrapper. Sends the admin token (if present) and always
   returns {ok, status, data|error} without throwing, so callers can
   render real loading / error / empty states. */
export async function apiFetch<T = unknown>(
  path: string,
  opts: FetchOpts = {},
): Promise<ApiResult<T>> {
  const url = (API.BASE || "") + path;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.body ? { "Content-Type": "application/json" } : {}),
    ...(opts.headers || {}),
  };

  const token =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem(ADMIN_TOKEN_KEY)
      : null;
  if (token) headers["Authorization"] = "Bearer " + token;

  try {
    const res = await fetch(url, {
      method: opts.method || "GET",
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      credentials: "same-origin",
    });

    let data: T | null = null;
    try {
      data = (await res.json()) as T;
    } catch {
      data = null;
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
      error: res.ok
        ? null
        : (data as { message?: string } | null)?.message || res.statusText,
    };
  } catch {
    return { ok: false, status: 0, data: null, error: "network" };
  }
}
