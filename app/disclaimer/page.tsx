import type { Metadata } from "next";

import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer — Piyushwani OPC Pvt. Ltd.",
  description:
    "Important information about our brands, products and this website.",
};

const SECTIONS: LegalSection[] = [
  [
    "Brand disclaimer",
    <>
      <strong>
        Piyushwani, P-Wanicure and WaaniGo are units of Piyushwani OPC Pvt. Ltd.
      </strong>{" "}
      All three brands operate under the same corporate entity and the same
      quality and compliance standards.
    </>,
  ],
  [
    "Medical disclaimer",
    "The information on this website is provided for general reference only. It is not medical advice and is not a substitute for consultation with a registered medical practitioner. Do not use any product described here to self-diagnose or self-treat. Always read the pack insert and use products only as directed by a qualified healthcare professional.",
  ],
  [
    "Product information",
    "Product images are for representation. Packaging, pack sizes and presentation may vary. Formulations are subject to change; the composition printed on the pack you receive is definitive.",
  ],
  [
    "Nutraceuticals",
    <>
      Health supplements are <strong>not for medicinal use</strong>. They are not
      intended to diagnose, treat, cure or prevent any disease, and are not a
      substitute for a balanced diet.
    </>,
  ],
  [
    "Manufacturing",
    "Products are manufactured by licensed contract manufacturing partners to our specification and carry our branding. Manufacturer details for any batch are shown on that batch's verification page.",
  ],
  [
    "External links",
    "We are not responsible for the content, accuracy or practices of any third-party website we link to.",
  ],
];

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      lede="Important information about our brands, products and this website."
      sections={SECTIONS}
    />
  );
}
