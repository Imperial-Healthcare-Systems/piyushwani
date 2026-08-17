"use client";

import { useState } from "react";

import { PersonIcon, PhotoIcon } from "@/components/icons";

type Employee = {
  n: string;
  r: string;
  d: string;
  /** qualification chips, where supplied */
  q?: string[];
  /** direct line, where the person is a published point of contact */
  tel?: string;
};

/* Intake form §4: 8 employees to be featured. The first is confirmed; the
   remaining seven are still to be supplied as a list, with photographs.

   The profile copy below is written, not supplied — it states the role and
   the standard the company holds itself to, and deliberately claims nothing
   checkable that the client has not given us. No years of experience, no
   previous employers, no achievements: those are facts about a real person
   and have to come from him, not from a copywriter. */
const TEAM_EMP: Employee[] = [
  {
    n: "Sanjeev Raina",
    r: "Chief Executive Officer",
    q: ["B Sc (Agriculture)", "MBA"],
    tel: "+91 99882 88678",
    d: "Trained in agricultural science and in business, Sanjeev leads Piyushwani from sourcing to shelf. He holds the company to a single test — that everything printed on a pack can be traced back to a record — and builds the manufacturing and distribution partnerships that make that possible.",
  },
  ...Array.from({ length: 7 }, () => ({
    n: "[CLIENT: name]",
    r: "[CLIENT: designation]",
    d: "[CLIENT: 30–50 word profile]",
  })),
];

const TEAM_DOC = Array.from({ length: 3 }, () => ({
  n: "[CLIENT: Dr. name]",
  r: "[CLIENT: specialisation]",
  d: "[CLIENT: 40–60 word profile description]",
  q: ["[CLIENT: qualifications]", "[CLIENT: years experience]", "[CLIENT: affiliation]"],
  e: '[CLIENT: engagement with Piyushwani — e.g. "Advises on formulation review for the nutraceutical range"]',
}));

const GALLERY = [
  "Facility",
  "Facility",
  "Team",
  "Team",
  "Events",
  "Manufacturing partner",
  "Events",
  "Team",
];

/* Every field on these cards used to be wrapped in the amber gap chip,
   because every field was an intake note. Now that some are filled, the chip
   has to be conditional — a real name rendered as a gap chip reads as broken,
   and an unfilled one rendered plainly reads as content. The bracket is the
   tell, so it is what the check keys on. */
function Field({ v }: { v: string }) {
  return v.startsWith("[CLIENT:") ? <span className="ph">{v}</span> : <>{v}</>;
}

type Tab = "emp" | "doc" | "gal";

const TABS: { key: Tab; label: string }[] = [
  { key: "emp", label: "Our Team" },
  { key: "doc", label: "Associated Doctors" },
  { key: "gal", label: "Gallery" },
];

export default function TeamTabs() {
  const [tab, setTab] = useState<Tab>("emp");

  return (
    <>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={tab === t.key ? "on" : undefined}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div hidden={tab !== "emp"}>
        <p className="lede" style={{ marginBottom: 26 }}>
          Piyushwani operates from two offices in Laxmi Nagar, East Delhi, with a
          team of eight spanning leadership, operations, quality documentation,
          customer support and logistics.
        </p>
        <div className="grid g-4">
          {TEAM_EMP.map((p, i) => (
            <div className="person" key={i}>
              <div className="avatar">
                <PersonIcon />
              </div>
              <div className="person-in">
                <h3>
                  <Field v={p.n} />
                </h3>
                <div className="role">
                  <Field v={p.r} />
                </div>
                <p>
                  <Field v={p.d} />
                </p>
                {p.q ? (
                  <div className="qual">
                    {p.q.map((q) => (
                      <span key={q}>{q}</span>
                    ))}
                  </div>
                ) : null}
                {p.tel ? (
                  <p className="person-tel">
                    <a href={`tel:${p.tel.replace(/\s/g, "")}`}>{p.tel}</a>
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div hidden={tab !== "doc"}>
        <p className="lede" style={{ marginBottom: 26 }}>
          We work with practising medical professionals who advise on our product
          range. We publish their names, qualifications, experience and the
          nature of their engagement with us in full — because &ldquo;expert
          approved&rdquo; means nothing if the experts are anonymous.
        </p>
        <div className="grid g-3">
          {TEAM_DOC.map((p, i) => (
            <div className="person" key={i}>
              <div className="avatar">
                <PersonIcon />
              </div>
              <div className="person-in">
                <h3>
                  <span className="ph">{p.n}</span>
                </h3>
                <div className="role">
                  <span className="ph">{p.r}</span>
                </div>
                <p>
                  <span className="ph">{p.d}</span>
                </p>
                <div className="qual">
                  {p.q.map((q) => (
                    <span className="ph" key={q}>
                      {q}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 11,
                    borderTop: "1px solid var(--rule-soft)",
                  }}
                >
                  <div className="lab plain" style={{ fontSize: ".6rem", marginBottom: 5 }}>
                    Engagement
                  </div>
                  <p style={{ fontSize: ".8rem" }}>
                    <span className="ph">{p.e}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="note note--warn" style={{ marginTop: 24 }}>
          <strong>Count and consent still outstanding.</strong> The intake form
          records the number of associated doctors as &ldquo;TBD&rdquo;.{" "}
          <strong>Written consent is required.</strong> Publishing a
          doctor&apos;s photograph, qualifications and affiliation requires their
          written consent, and their hospital may have its own policy on
          commercial association. Signed consent should be obtained for each
          individual before these profiles go live.
        </div>
      </div>

      <div hidden={tab !== "gal"}>
        <p className="lede" style={{ marginBottom: 26 }}>
          Facility, team, events and manufacturing partners.
        </p>
        <div className="gal">
          {GALLERY.map((c, i) => (
            <figure key={i}>
              <PhotoIcon />
              <figcaption>
                {c} — <span className="ph">[CLIENT: image]</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
