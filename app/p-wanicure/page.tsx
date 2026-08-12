import type { Metadata } from "next";

import NotifyForm from "@/components/NotifyForm";
import { Crumb, Note, Ph } from "@/components/ui";

export const metadata: Metadata = {
  title: "P-Wanicure — Piyushwani OPC Pvt. Ltd.",
  description:
    "P-Wanicure is the Piyushwani wellness and personal care brand, currently in development. Same manufacturing partners, same batch verification, same published certifications.",
};

export default function PWanicurePage() {
  return (
    <>
      <section className="sect sect--card">
        <div className="wrap">
          <Crumb>P-Wanicure</Crumb>
          <span className="cert-badge" style={{ background: "#FCF0DC", color: "#7A5310" }}>
            Launching soon
          </span>
          <h1 className="h-xl" style={{ margin: "14px 0 12px" }}>
            P-Wanicure
          </h1>
          <p className="lede">
            <Ph label="brand tagline" />
          </p>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap split">
          <div className="body-w">
            <p className="lede">
              P-Wanicure is our{" "}
              <Ph label="wellness / personal care / dermo-cosmetic — confirm category" />{" "}
              brand, currently in development.
            </p>

            <Note style={{ margin: "16px 0" }}>
              <strong>Not an Ayurvedic line.</strong> The intake form records
              AYUSH / Ayurvedic licence as not applicable, so P-Wanicure products
              will not be presented or marketed as Ayurvedic medicines. Trade mark
              applications for Piyushwani, WaaniGo and P-Wanicure have been filed
              and are pending.
            </Note>

            <h2 className="h-md" style={{ margin: "26px 0 12px" }}>
              What P-Wanicure is
            </h2>
            <p>
              <Ph label="150–200 words — what the brand stands for, what the range will cover, who it is for, and how it differs in positioning from the Piyushwani pharmaceutical range" />
            </p>

            <h2 className="h-md" style={{ margin: "26px 0 12px" }}>
              The range
            </h2>
            <p>
              <Ph label="3–5 product categories planned, with one line each" />
            </p>

            <h2 className="h-md" style={{ margin: "26px 0 12px" }}>
              Same standards
            </h2>
            <p>
              P-Wanicure products will be manufactured, documented and
              batch-verified to exactly the same standard as everything else we
              release. Same licensed manufacturing partners, same QR verification
              on every pack, same published certifications.
            </p>
          </div>

          <div>
            <NotifyForm />
          </div>
        </div>
      </section>
    </>
  );
}
