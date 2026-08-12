import type { Metadata } from "next";

import { Crumb, FigurePlate, HeadBlock, Media, Note, Rrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — Piyushwani OPC Pvt. Ltd.",
  description:
    "A registered One Person Company working in pharmaceutical marketing and e-commerce, built on documented standards and verifiable supply.",
};

const REGISTRY: [string, React.ReactNode][] = [
  ["Registered office", "Office No. 4, Ground Floor, D-248/10, Abhishek Business Centre, Laxmi Nagar, East Delhi, Delhi 110092"],
  ["Branch office", "Office No. 172–173, 1st Floor, D-248/10, Balaji Business Centre, Laxmi Nagar, East Delhi, Delhi 110092"],
  ["CIN", <span className="mono" key="cin">U46497DL2025OPC459389</span>],
  ["GSTIN", <span className="mono" key="gst">07AAQCP4428A1ZH</span>],
  ["Incorporated", "11 December 2025"],
  ["Brands", "Piyushwani · P-Wanicure · WaaniGo"],
];

const STANDARDS = [
  ["Traceability", "Every batch we release has its own verification record, accessible by QR code from the pack itself."],
  ["Documentation", "Composition, specification and manufacturing details are published for every product, not summarised."],
  ["Clinical input", "We work with practising medical professionals, named publicly along with their qualifications."],
  ["Compliance", "Our licences and certifications are published with numbers and validity dates."],
];

export default function AboutPage() {
  return (
    <>
      <section className="sect sect--card">
        <div className="wrap">
          <Crumb>About</Crumb>
          <div className="lab">The company</div>
          <h1 className="h-xl" style={{ margin: "14px 0 18px" }}>
            About Piyushwani
            <br />
            OPC Pvt. Ltd.
          </h1>
          <p className="lede">
            A registered One Person Company working in pharmaceutical marketing
            and e-commerce, built on documented standards and verifiable supply.
          </p>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap split">
          <div className="body-w">
            <h2 className="h-md" style={{ marginBottom: 12 }}>
              Who we are
            </h2>
            <p>
              Piyushwani (OPC) Private Limited is a One Person Company
              incorporated in India on 11 December 2025, wholly owned by Dr.
              Shiwani Bansal. We operate from two offices in Laxmi Nagar, East
              Delhi.
            </p>
            <p>
              The company works across two connected functions. As a{" "}
              <strong>pharmaceutical marketing company</strong>, we develop, brand
              and take to market a range of pharmaceutical and wellness products.
              As a <strong>pharmaceutical e-commerce company</strong>, we sell
              those products — and a wider everyday health range — directly to
              customers through WaaniGo.
            </p>
            <Note style={{ marginTop: 20 }}>
              <strong>Registered structure</strong>
              <br />
              One Person Company (OPC), incorporated in India on 11 December 2025.
              Sole owner and Director: Dr. Shiwani Bansal, BAMS.
            </Note>
          </div>
          <Media
            img="about-warehouse"
            alt="Piyushwani warehouse team verifying pharmaceutical inventory on tablets"
            className="img-col"
          />
        </div>
      </section>

      <section className="sect sect--card">
        <div className="wrap" style={{ textAlign: "center" }}>
          <HeadBlock
            lab="How we work"
            title="From production line to your hands, every step recorded."
            lede="Products are made by licensed partners to our specification, checked, batch-documented, QR-coded and dispatched — with a verification record you can open from the pack itself."
          />
          <FigurePlate
            img="how-we-work"
            alt="Piyushwani supply-chain workflow: manufacturing, quality inspection, batch documentation, QR code generation, distribution, pharmacy and customer verification"
          />
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap split">
          <div className="body-w">
            <h2 className="h-md" style={{ marginBottom: 12 }}>
              The white-label model
            </h2>
            <p>
              Our products are <strong>white-labelled</strong>. Licensed contract
              manufacturers produce them to our specification and apply our
              branding. We select manufacturing partners on the strength of their
              licences, facilities and quality documentation, and we publish the
              manufacturing details of every batch we release.
            </p>
            <p>
              Fulfilment runs on a <strong>direct-dispatch model</strong>. When an
              order is placed, it goes to the manufacturing partner, who ships it
              straight to the customer. Fewer handling points between the
              production line and the person opening the box means fewer
              opportunities for a product to be mishandled, substituted or
              delayed.
            </p>
          </div>
          <div>
            {REGISTRY.map(([k, v], i) => (
              <Rrow k={k} key={k} first={i === 0}>
                <p>{v}</p>
              </Rrow>
            ))}
          </div>
        </div>
      </section>

      <section className="sect sect--card">
        <div className="wrap">
          <HeadBlock lab="Standards" title="What we hold ourselves to" />
          <div className="grid g-4">
            {STANDARDS.map(([k, v]) => (
              <div className="card" key={k}>
                <h3 className="h-sm">{k}</h3>
                <p className="muted">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
