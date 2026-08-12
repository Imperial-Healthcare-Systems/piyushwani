import Link from "next/link";
import NextImage from "next/image";

import { CatGrid, FeaturedRail } from "@/components/catalogue";
import { HeroCopy } from "@/components/Hero";
import HeroFacts from "@/components/HeroFacts";
import VerifyTerminal from "@/components/VerifyTerminal";
import { Arrow, FigurePlate, HeadBlock, Media, Ph, Rrow } from "@/components/ui";
import { CERTS } from "@/lib/certs";
import { IMG } from "@/lib/images";

const STANDARDS = [
  ["Traceability", "Every batch we release has its own verification record, accessible by QR code from the pack itself."],
  ["Documentation", "Composition, specification and manufacturing details are published for every product, not summarised."],
  ["Clinical input", "We work with practising medical professionals, named publicly along with their qualifications."],
  ["Compliance", "Our licences are published with numbers and validity dates, so you can verify them independently."],
];

export default function HomePage() {
  const hero = IMG.hero;

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <HeroCopy />
              <HeroFacts />
            </div>

            <div className="hero-visual">
              <div className="hero-media">
                <NextImage
                  src={hero.src}
                  alt="Piyushwani scientists inspecting medicine packaging and QR verification on the production line"
                  width={hero.width}
                  height={hero.height}
                  priority
                  fetchPriority="high"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <VerifyTerminal
                  inputId="vin"
                  intro="Turn the pack over and scan the QR code — or type the batch code printed beneath it."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap">
          <HeadBlock
            lab="The company"
            title="A pharmaceutical business built around accountability."
          />
          <div className="split">
            <div className="body-w">
              <p>
                Piyushwani OPC Pvt. Ltd. is a registered One Person Company
                operating in the pharmaceutical sector across two functions —
                pharmaceutical marketing and pharmaceutical e-commerce.
              </p>
              <p>
                We work on a white-label model: our products are manufactured by
                licensed contract manufacturing partners to our specification,
                and carry our branding. That arrangement lets us focus entirely
                on what we can control directly — formulation standards, quality
                documentation, clinical oversight, and traceability.
              </p>
              <p>
                We operate from two offices in Laxmi Nagar, East Delhi, and are
                led by Dr. Shiwani Bansal, BAMS.
              </p>
              <Link className="btn btn--ghost" href="/about">
                More about us <Arrow />
              </Link>
            </div>
            <div>
              {STANDARDS.map(([k, v]) => (
                <Rrow k={k} key={k}>
                  <p>{v}</p>
                </Rrow>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sect sect--card">
        <div className="wrap" style={{ textAlign: "center" }}>
          <HeadBlock
            lab="How we work"
            title="Seven steps, one continuous record."
            lede="Every product travels the same documented path — manufactured, quality-checked, batch-recorded, QR-coded, distributed, and verifiable by you from the pack itself."
          />
          <FigurePlate
            img="how-we-work"
            alt="Piyushwani end-to-end supply chain: manufacturing, quality inspection, batch documentation, QR code generation, distribution, pharmacy delivery and customer verification"
          />
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap">
          <HeadBlock lab="Our brands" title="Three brands. One standard." />
          <div className="grid g-3">
            <div className="card card--brand">
              <div className="lab plain">Pharmaceutical marketing</div>
              <h3 className="h-md">Piyushwani</h3>
              <p className="muted">
                Our pharmaceutical marketing brand — the products, the
                documentation, and the clinical relationships behind them.
              </p>
              <Link className="btn btn--ghost" href="/products">
                View products <Arrow />
              </Link>
            </div>
            <div className="card card--brand card--soon">
              <div className="lab plain">Launching soon</div>
              <h3 className="h-md">P-Wanicure</h3>
              <p className="muted">
                Our wellness and personal care line.{" "}
                <Ph label="one-line positioning" />
              </p>
              <Link className="btn btn--ghost" href="/p-wanicure">
                Learn more <Arrow />
              </Link>
            </div>
            <div className="card card--brand">
              <div className="lab plain">E-commerce</div>
              <h3 className="h-md">WaaniGo</h3>
              <p className="muted">
                Our online store. Healthcare, daily essentials, gym products and
                nutraceuticals, delivered to your door.
              </p>
              <Link className="btn btn--ghost" href="/contact">
                Visit WaaniGo <Arrow />
              </Link>
            </div>
          </div>
          <p className="muted" style={{ marginTop: 22, fontSize: ".88rem" }}>
            All three are units of Piyushwani OPC Pvt. Ltd.
          </p>
        </div>
      </section>

      <section className="sect sect--ink">
        <div className="wrap split">
          <div>
            <div className="lab">Compliance</div>
            <h2 className="h-lg" style={{ margin: "14px 0 16px" }}>
              Licensed, certified,
              <br />
              and documented.
            </h2>
            <p className="lede" style={{ color: "#A9C0CB" }}>
              Our licences and certifications are published in full, with numbers
              and validity dates, so you can check them independently rather than
              take our word for it.
            </p>
            <Link className="btn btn--lt" style={{ marginTop: 18 }} href="/certifications">
              View all certifications
            </Link>
          </div>
          <div className="grid g-2">
            {CERTS.filter((c) => !c.pending)
              .slice(0, 4)
              .map((c) => (
                <div className="trust-tile" key={c.k}>
                  <div className="b">{c.badge}</div>
                  <div className="n">{c.k}</div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap">
          <HeadBlock
            lab="Our products"
            title="A focused range, documented in full."
            lede="We launched with a deliberately small catalogue across four product forms. Each product carries complete composition details, specifications, manufacturing information and batch-level verification — because a short list you can stand behind is worth more than a long one you can't."
          />
          <FeaturedRail />
          <CatGrid />
          <div style={{ marginTop: 26 }}>
            <Link className="btn btn--line" href="/products">
              View all products
            </Link>
          </div>
        </div>
      </section>

      <section className="sect sect--card">
        <div className="wrap split" style={{ alignItems: "center" }}>
          <Media
            img="leadership"
            alt="Dr. Shiwani Bansal, Founder and Director of Piyushwani, in the office"
            style={{ maxWidth: 440 }}
          />
          <div>
            <div className="lab">Leadership</div>
            <h2 className="h-lg" style={{ margin: "14px 0 16px" }}>
              Led by Dr. Shiwani Bansal
            </h2>
            <p className="lede">
              Dr. Shiwani Bansal (BAMS) is the founder, sole owner and Director of
              Piyushwani (OPC) Private Limited.{" "}
              <Ph label="40–60 word summary of her background, clinical practice and vision — still to be supplied" />
            </p>
            <Link className="btn btn--ghost" style={{ marginTop: 12 }} href="/leadership">
              Read the full profile <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap split" style={{ alignItems: "center" }}>
          <div>
            <div className="lab">Clinical input</div>
            <h2 className="h-lg" style={{ margin: "14px 0 16px" }}>
              The clinicians we work with
            </h2>
            <p className="lede">
              Our product decisions are informed by practising medical
              professionals. Their qualifications, experience and the nature of
              their engagement with us are published in full on our team page —
              named, not anonymous.
            </p>
            <Link className="btn btn--line" style={{ marginTop: 12 }} href="/team">
              Meet the team
            </Link>
          </div>
          <Media
            img="clinical-team"
            alt="Piyushwani clinical team reviewing patient imaging together"
            className="img-col"
          />
        </div>
      </section>

      <section className="sect sect--card">
        <div className="wrap" style={{ textAlign: "center", maxWidth: 760 }}>
          <div className="lab plain" style={{ justifyContent: "center" }}>
            Buying
          </div>
          <h2 className="h-lg" style={{ margin: "12px 0 14px" }}>
            Looking to buy?
          </h2>
          <p className="lede" style={{ margin: "0 auto 22px" }}>
            Our products are available for direct purchase on WaaniGo, our online
            store. For bulk, institutional or distribution enquiries, send us a
            quote request instead.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn--seal" href="/contact">
              Shop on WaaniGo <Arrow />
            </Link>
            <Link className="btn btn--line" href="/contact">
              Request a quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
