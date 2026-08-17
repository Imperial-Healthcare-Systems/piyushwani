/* Branded imagery. The original prototype inlined these as base64 data URIs;
   they are now static assets under /public/images so the browser can cache
   them and next/image can optimise them. Intrinsic dimensions are the ones
   declared in the prototype markup. */

export type ImageAsset = { src: string; width: number; height: number };

export const IMG = {
  hero: { src: "/images/hero.jpg", width: 1400, height: 1120 },
  "how-we-work": { src: "/images/how-we-work.jpg", width: 1536, height: 1024 },
  leadership: { src: "/images/leadership.jpg", width: 900, height: 1352 },
  "clinical-team": { src: "/images/clinical-team.jpg", width: 1200, height: 800 },
  "about-warehouse": { src: "/images/about-warehouse.jpg", width: 1200, height: 801 },
  certifications: { src: "/images/certifications.jpg", width: 1200, height: 800 },
  "contact-reception": { src: "/images/contact-reception.jpg", width: 1400, height: 933 },
  "product-detail": { src: "/images/product-detail.jpg", width: 1300, height: 867 },
  "qr-verify": { src: "/images/qr-verify.jpg", width: 1200, height: 800 },
  "prod-tablets": { src: "/images/prod-tablets.jpg", width: 760, height: 507 },
  "prod-capsules": { src: "/images/prod-capsules.jpg", width: 760, height: 507 },
  "prod-syrups": { src: "/images/prod-syrups.jpg", width: 760, height: 507 },
  "prod-nutraceuticals": { src: "/images/prod-nutraceuticals.jpg", width: 760, height: 507 },
  /* Client-supplied pack shot. Square, where the other four tiles are 3:2 —
     .cattile is a 3:2 box with object-fit:cover, so it crops the top and
     bottom bands and keeps the box and bottle. Also the heaviest source in
     the set at 1.7 MB against ~50 KB; next/image resizes it per breakpoint so
     the browser never receives that, but a downscaled original would still be
     worth having in the repo. */
  "prod-drops": { src: "/images/nasal.png", width: 1254, height: 1254 },
  "footer-molecular": { src: "/images/footer-molecular.jpg", width: 1200, height: 800 },
  logo: { src: "/images/logo.jpg", width: 512, height: 512 },
  /* The navbar lockup. Derived from logo-nav-bar.png: cropped to the artwork
     (the source carries ~25% dead space top and bottom) and the outer white
     ground flood-filled to transparent, so it sits on any surface. The white
     medical cross inside the shield survives because the fill starts at the
     border and the shield encloses it. 877 KB -> 138 KB. */
  "logo-nav": { src: "/images/logo-nav.png", width: 900, height: 221 },
} as const satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMG;
