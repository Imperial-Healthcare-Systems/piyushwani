/* ==========================================================================
   ADMIN PORTAL — demo authentication
   --------------------------------------------------------------------------
   THIS IS NOT SECURE AUTHENTICATION AND MUST NOT BE TREATED AS SUCH.

   The credential pair below is compiled into the client bundle, so anyone who
   opens devtools can read it. There is no server, no password hashing, no
   session signing and no expiry enforcement beyond a timestamp this same
   client wrote. It exists so the portal can be demonstrated and reviewed
   without a backend.

   When a real backend lands, replace signIn/signOut with the apiFetch calls
   already declared in lib/config.ts (API.login / API.logout) and store the
   returned token instead of this flag. The rest of the portal reads auth only
   through this module, so nothing else changes.
   ========================================================================== */

export const DEMO_EMAIL = "admin@himalayanfeeds.com";
export const DEMO_PASSWORD = "HimalayanAdmin@2026";

const SESSION_KEY = "pw_admin_demo_session_v1";

/** Eight hours — a convenience for the demo, not a security control. */
const SESSION_MS = 8 * 60 * 60 * 1000;

export type AdminSession = {
  email: string;
  /** epoch ms */
  signedInAt: number;
};

export type SignInResult =
  | { ok: true; session: AdminSession }
  | { ok: false; error: string };

function canStore(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/* ---------------------------------------------------------------- store
   Exposed as an external store so components can read it through
   useSyncExternalStore. Reading localStorage during render would desync
   hydration; useSyncExternalStore is the primitive built for exactly this,
   and it avoids the cascading render that a mount effect would cause. */

const listeners = new Set<() => void>();

/* getSnapshot must be referentially stable between changes, so the parsed
   session is cached and only re-parsed when the raw string differs. */
let cachedRaw: string | null = null;
let cachedSession: AdminSession | null = null;
let primed = false;

function parse(raw: string | null): AdminSession | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as AdminSession;
    if (!s?.email || typeof s.signedInAt !== "number") return null;
    if (Date.now() - s.signedInAt > SESSION_MS) return null;
    return s;
  } catch {
    return null;
  }
}

function emit(): void {
  for (const l of listeners) l();
}

export function subscribeSession(cb: () => void): () => void {
  listeners.add(cb);
  /* Keeps two tabs of the portal in step. */
  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY || e.key === null) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSessionSnapshot(): AdminSession | null {
  if (!canStore()) return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(SESSION_KEY);
  } catch {
    raw = null;
  }
  if (primed && raw === cachedRaw) return cachedSession;
  primed = true;
  cachedRaw = raw;
  cachedSession = parse(raw);
  return cachedSession;
}

/** The server has no session — always signed out until the client hydrates. */
export function getServerSessionSnapshot(): AdminSession | null {
  return null;
}

export function signIn(email: string, password: string): SignInResult {
  const e = email.trim().toLowerCase();

  if (!e || !password) {
    return { ok: false, error: "Enter both an email address and a password." };
  }
  if (e !== DEMO_EMAIL.toLowerCase() || password !== DEMO_PASSWORD) {
    return { ok: false, error: "Those credentials are not correct." };
  }

  const session: AdminSession = { email: DEMO_EMAIL, signedInAt: Date.now() };
  if (canStore()) {
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* Private mode — the session lives in memory for this page only. */
    }
  }
  emit();
  return { ok: true, session };
}

export function signOut(): void {
  if (canStore()) {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* nothing to clear */
    }
  }
  emit();
}
