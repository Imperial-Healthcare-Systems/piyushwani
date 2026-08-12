import type { Metadata } from "next";

import VerifyTerminal from "@/components/VerifyTerminal";
import { Crumb, Media, Note, Rrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Verify a Batch — Piyushwani OPC Pvt. Ltd.",
  description:
    "Check that the pack in your hand is genuine, and see exactly where it came from. Enter the batch code printed beneath the QR code on the pack.",
};

export default function VerifyPage() {
  return (
    <>
      <section className="sect sect--card">
        <div className="wrap">
          <Crumb>Verify</Crumb>
          <div className="lab">Authenticity</div>
          <h1 className="h-xl" style={{ margin: "14px 0 18px" }}>
            Verify a Batch
          </h1>
          <p className="lede">
            Check that the pack in your hand is genuine, and see exactly where it
            came from.
          </p>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap split">
          <div>
            <VerifyTerminal
              inputId="vin2"
              intro="Enter the batch code printed directly beneath the QR code on the pack."
            />
          </div>

          <div>
            <Media
              img="qr-verify"
              alt="Customer scanning a Piyushwani pack QR code, showing a successful authenticity verification"
              className="scan"
              style={{ marginBottom: 22 }}
            />

            <h2 className="h-md" style={{ marginBottom: 16 }}>
              How it works
            </h2>
            <Rrow k="Find the code" first>
              <p>Turn the pack over. There&apos;s a QR code printed on the back.</p>
            </Rrow>
            <Rrow k="Scan it">
              <p>Use your phone&apos;s camera. No app required.</p>
            </Rrow>
            <Rrow k="See the record">
              <p>You&apos;ll land on that batch&apos;s verification page.</p>
            </Rrow>

            <Note variant="warn" style={{ marginTop: 22 }}>
              If your pack has no QR code, or the code doesn&apos;t return a
              record, please contact us at{" "}
              <a href="mailto:support@piyushwani.com">support@piyushwani.com</a>{" "}
              or <a href="tel:+918796922234">+91 87969 22234</a>{" "}
              <strong>before using the product</strong>.
            </Note>
          </div>
        </div>
      </section>
    </>
  );
}
