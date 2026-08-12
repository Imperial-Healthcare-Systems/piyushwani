import type { ReactNode } from "react";

import { Crumb, Rrow } from "@/components/ui";

export type LegalSection = [string, ReactNode];

export default function LegalPage({
  title,
  lede,
  sections,
  intro,
}: {
  title: string;
  lede: string;
  sections: LegalSection[];
  /** optional line above the sections, e.g. "Last updated: …" */
  intro?: ReactNode;
}) {
  return (
    <>
      <section className="sect sect--card">
        <div className="wrap">
          <Crumb>{title}</Crumb>
          <div className="lab">Legal</div>
          <h1 className="h-xl" style={{ margin: "14px 0 18px" }}>
            {title}
          </h1>
          <p className="lede">{lede}</p>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap" style={{ maxWidth: 840 }}>
          <div className="note note--legal" style={{ marginBottom: 26 }}>
            <strong>Draft for legal review.</strong> This text reflects standard
            Indian practice and is not legal advice. It must be reviewed and
            approved by the client&apos;s legal counsel before publication.
          </div>

          {intro}

          {sections.map(([k, body]) => (
            <Rrow k={k} key={k}>
              <p>{body}</p>
            </Rrow>
          ))}
        </div>
      </section>
    </>
  );
}
