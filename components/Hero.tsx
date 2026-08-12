"use client";

/* The homepage hero. Its copy is editable from /admin/content, so it reads
   through the shared store rather than holding the strings as literals. The
   defaults in lib/catalogue.ts are the copy the site ships with, which is what
   the server renders and what "reset" restores. */

import Link from "next/link";

import { useSiteContent } from "@/lib/useCatalogue";

export function HeroCopy() {
  const c = useSiteContent();

  return (
    <>
      <div className="lab">{c.heroEyebrow}</div>
      <h1 className="h-xl">
        {c.heroTitle}
        {c.heroTitleEm ? <em>{c.heroTitleEm}</em> : null}
      </h1>
      <p className="lede">{c.heroLede}</p>
      <div className="hero-actions">
        <Link className="btn btn--seal" href={c.heroPrimaryHref || "/products"}>
          {c.heroPrimaryLabel}
        </Link>
        {c.heroSecondaryLabel ? (
          <Link className="btn btn--line" href={c.heroSecondaryHref || "/certifications"}>
            {c.heroSecondaryLabel}
          </Link>
        ) : null}
      </div>
    </>
  );
}
