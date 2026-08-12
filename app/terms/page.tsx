import type { Metadata } from "next";

import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — Piyushwani OPC Pvt. Ltd.",
  description: "The terms on which this website is provided.",
};

const SECTIONS: LegalSection[] = [
  [
    "Agreement",
    "By accessing this website you accept these terms. If you do not accept them, please do not use the site.",
  ],
  [
    "About this website",
    <>
      This is an informational website operated by Piyushwani (OPC) Private
      Limited, CIN U46497DL2025OPC459389, GSTIN 07AAQCP4428A1ZH, registered at
      Office No. 4, Ground Floor, D-248/10, Laxmi Nagar, East Delhi, Delhi
      110092. <strong>No sale of goods takes place on this website.</strong>{" "}
      Purchases are made on WaaniGo, subject to its own terms.
    </>,
  ],
  [
    "Information accuracy",
    <>
      We take reasonable care to keep product and company information current,
      but make no warranty that it is complete or error-free. Product
      formulations, packaging and specifications may change.{" "}
      <strong>
        Always read the pack insert supplied with the product; where the pack
        insert and this website differ, the pack insert prevails.
      </strong>
    </>,
  ],
  [
    "Not medical advice",
    "Nothing on this website constitutes medical advice, diagnosis or treatment recommendation. Always consult a registered medical practitioner. Never disregard or delay professional medical advice because of something you read here.",
  ],
  [
    "Batch verification",
    "The verification service is provided in good faith based on our batch records. A successful verification indicates the batch code matches our records; it is not a warranty as to the condition of any individual pack, which may be affected by storage, handling or transport after release.",
  ],
  [
    "Intellectual property",
    "All content, trade marks, logos and designs on this site are owned by or licensed to Piyushwani OPC Pvt. Ltd. and may not be reproduced without written permission.",
  ],
  [
    "Third-party links",
    "We link to WaaniGo and other third-party sites. We are not responsible for their content or practices.",
  ],
  [
    "Limitation of liability",
    "To the maximum extent permitted by law, we are not liable for indirect or consequential loss arising from use of this website. Nothing here excludes liability that cannot be excluded by law.",
  ],
  [
    "Governing law",
    "These terms are governed by the laws of India. Courts at Delhi have exclusive jurisdiction.",
  ],
  [
    "Contact",
    <>
      <a href="mailto:support@piyushwani.com">support@piyushwani.com</a> · +91
      87969 22234 · Office No. 4, Ground Floor, D-248/10, Laxmi Nagar, East
      Delhi, Delhi 110092
    </>,
  ],
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lede="The terms on which this website is provided."
      sections={SECTIONS}
    />
  );
}
