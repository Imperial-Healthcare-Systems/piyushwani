# Piyushwani — Next.js + React

The Piyushwani (OPC) Private Limited site, ported from the single-file HTML
prototype (`piyushwani (2).html`) to **Next.js 16 (App Router) + React 19 +
TypeScript**.

The design is carried over 1:1 — the "Register" palette/type system and the
"Liquid Glass" chrome layer are the original stylesheets, moved verbatim into
[app/globals.css](app/globals.css) with only the three font-family tokens
rewired to `next/font`.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint
```

## What changed from the prototype

| Prototype | This app |
| --- | --- |
| Hash router (`#/about`) rendering into one `<main>` | Real routes under [app/](app/) — every page is its own URL, statically prerendered |
| 15 images inlined as base64 (2.2 MB of HTML) | Static assets in [public/images/](public/images/), served through `next/image` |
| Template strings + `innerHTML` | React components; no `innerHTML`, so the `escapeHtml` helper is gone — React escapes by default |
| Google Fonts `<link>` (render-blocking) | `next/font/google`, self-hosted and preloaded |
| Fonts/`IMG`/data as globals | Typed modules under [lib/](lib/) |

Routes: `/`, `/about`, `/leadership`, `/team`, `/products`, `/product/[id]`,
`/p-wanicure`, `/certifications`, `/verify`, `/contact`, `/privacy`, `/terms`,
`/disclaimer`, the `/admin` portal (see below), plus a 404.

`/product/[id]` accepts a slug (`/product/paracetamol-500-mg-tablets-ip`); the
numeric URLs the site shipped with (`/product/3`) still resolve, against the
seed id rather than the array position, so adding a product cannot silently
re-point an old link.

## Layout

```
app/            one directory per route + layout.tsx, globals.css, not-found.tsx
components/     SiteHeader, SiteFooter, VerifyTerminal, RfqForm, NotifyForm,
                TeamTabs, BatchRecord, catalogue, ui primitives, icons
components/admin/portal/  the console: shell, store-context, ProductForm, ui, icons
lib/            catalogue (the shared data layer), useCatalogue (public hooks),
                cms, products, certs, batches, images, config (API client)
public/images/  the 15 extracted photographs
```

## Motion and refinement layer

[app/motion.css](app/motion.css) loads after `globals.css` and does two jobs, so
the ported stylesheets stay untouched:

**Fixes.** The header "Verify a Batch" CTA was rendering slate text on seal
green — `.nav a` (specificity 0-1-1) outranked `.btn--seal` (0-1-0), so the
button also lost its padding, size and weight, and the glass layer then
overrode its hover background with `!important`. Restated at a winning
specificity. The four hero figures also wrapped 3 + 1, stranding "100%" on its
own line; they are now a grid that folds to 2×2 when narrow.

**Motion.** A clinical language — steady and precise, never bouncy: content
settles into place on scroll, the terminal's status dot beats like a monitor,
an ECG strip runs in the terminal header, a reader's sweep passes over the QR
photograph on `/verify`, and the headline figures count up once when they come
into view.

Motion is strictly opt-in. A pre-paint script in the layout sets
`data-motion="on"` **only** when the visitor has not requested reduced motion,
and every animation rule is gated behind that attribute — no attribute means no
animation and, critically, nothing hidden. Content is never left depending on a
single async callback to become visible: [Motion.tsx](components/Motion.tsx)
reveals in-viewport elements on the next frame, uses IntersectionObserver for
the rest, and runs a 5-second backstop that reveals anything still hidden.
[HeroFacts.tsx](components/HeroFacts.tsx) renders the true figures on the server
and writes counter frames straight to the DOM, with its own backstop, so the
readings can never stick at zero.

## Backend contract

The front end holds **no batch data**. Verification and the two forms call the
API declared in [lib/config.ts](lib/config.ts); set the root with
`NEXT_PUBLIC_API_BASE` (empty = same origin).

It does hold **one password** — the demo admin credential in
`lib/admin/auth.ts`, described above. That is a reviewing convenience, not a
security control, and it is the first thing to delete when `POST
/api/v1/auth/login` exists.

| Endpoint | Used by | Status |
| --- | --- | --- |
| `GET /api/v1/verify/batch/:code` | Batch verification terminal (home + `/verify`) | wired, awaiting server |
| `POST /api/v1/rfq` | Quote request form (`/contact`) | wired, awaiting server |
| `POST /api/v1/notify` | P-Wanicure launch signup | wired, awaiting server |
| `POST /api/v1/auth/login` · `/logout` | Admin sign-in | **stubbed in the browser** |
| `/api/v1/admin/products`, `/content` | Catalogue and content persistence | **localStorage** |

`apiFetch` never throws — it returns `{ok, status, data, error}` so each screen
renders a real loading / not-found / error state. Verification distinguishes
404 ("no record of this code") from a transport failure ("we couldn't reach the
verification service"), and never fakes a "verified" result.

The batch record shape the verify endpoint must return is typed as `Batch` in
[lib/batches.ts](lib/batches.ts).

## Admin portal

`/admin` redirects to `/admin/dashboard`. The console is deliberately solid,
not glass: translucency behind dense tabular data costs legibility.

| Route | Screen |
| --- | --- |
| `/admin/login` | Demo sign-in |
| `/admin/dashboard` | Overview, quick actions, recently updated |
| `/admin/products` | Table with search, filters, sorting, view/edit/delete |
| `/admin/products/new` · `/admin/products/[id]/edit` | Product form |
| `/admin/categories` | Category CRUD |
| `/admin/content` | Homepage hero copy, with live preview |
| `/admin/settings` | Session, local data, export, backend status |

**Sign-in is a demo and is not secure.** The credential pair lives in
[lib/admin/auth.ts](lib/admin/auth.ts), compiled into the client bundle and
readable by anyone who opens devtools. There is no server, no password hashing
and no session signing. It exists so the portal can be reviewed without a
backend, and the login screen and settings screen both say so on the page.

## One catalogue, two front ends

[lib/catalogue.ts](lib/catalogue.ts) is the only data layer. The storefront and
the console both read through it, so an edit in the console is the record the
product page renders:

```
public pages  ─┐
               ├─→ catalogue service ─→ localStorage
admin portal  ─┘
```

Two read paths, deliberately. The `*Service` methods are async and carry a
short artificial latency, so the console's loading states are real. The
`*Snapshot` functions are synchronous, for `useSyncExternalStore` on public
pages, which must not flash a spinner over content that is already
server-rendered. Both resolve against the same storage, so they cannot drift.

Public pages are still statically prerendered from the seed catalogue in
`lib/products.ts` — a crawler, and a visitor with JavaScript disabled, get the
products in the HTML. Once hydrated, whatever the console has saved takes over.
Only `active` products are shown publicly; `draft` (the default for a new
record) and `inactive` are for the operator.

When a real backend lands, the method bodies in `lib/catalogue.ts` become the
`apiFetch` calls already declared in [lib/config.ts](lib/config.ts). The
signatures are already async and already return these shapes, so no screen —
public or admin — changes.

## Content gaps

Unfilled client content renders as an amber `[CLIENT: …]` chip rather than
shipping silently blank. Fill a value in [lib/cms.ts](lib/cms.ts) (or through
the console's Site content tab) and the chip is replaced by the real text; the
console's sidebar badge counts what is still outstanding.
