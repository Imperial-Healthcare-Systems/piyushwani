import type { Metadata } from "next";

import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { Ph } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy — Piyushwani OPC Pvt. Ltd.",
  description: "How we collect, use and protect personal data.",
};

const SECTIONS: LegalSection[] = [
  [
    "Introduction",
    'Piyushwani OPC Pvt. Ltd. ("we", "us") operates this website. This policy explains what personal data we collect, why, and what rights you have over it. It is intended to comply with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 and rules thereunder.',
  ],
  [
    "Data we collect",
    <>
      <strong>Provided by you:</strong> name, email, phone, organisation,
      address, enquiry content. <strong>Collected automatically:</strong> IP
      address, browser and device type, pages viewed, referring URL, cookie
      identifiers. <strong>Batch verification scans:</strong> the batch code
      scanned and the time of scanning — we do not attach this to your identity.
    </>,
  ],
  [
    "Why we use it",
    "To respond to enquiries and quote requests; to provide batch verification; to improve the website; to send information you have specifically asked for; and to meet legal and regulatory obligations.",
  ],
  [
    "Legal basis",
    "We process personal data on the basis of your consent, which you may withdraw at any time, and where processing is necessary for compliance with law.",
  ],
  [
    "Sharing",
    <>
      We share personal data only with service providers who operate the website,
      hosting and email infrastructure on our behalf under contract; our contract
      manufacturing partners where necessary to fulfil an enquiry; and
      authorities where required by law. <strong>We do not sell personal data.</strong>
    </>,
  ],
  [
    "Retention",
    <>
      We retain enquiry data for{" "}
      <Ph label="retention period — still to be confirmed" /> from last contact,
      and thereafter delete or anonymise it, unless a longer period is required
      by law.
    </>,
  ],
  [
    "Security",
    "We apply reasonable technical and organisational safeguards including encryption in transit, access controls and audit logging. No system is completely secure, and we cannot guarantee absolute security.",
  ],
  [
    "Your rights",
    <>
      Under the DPDP Act you may request access to, correction of, or erasure of
      your personal data; withdraw consent; and nominate another person to
      exercise these rights. Write to{" "}
      <a href="mailto:utkarshsrivastav@piyushwani.com">
        utkarshsrivastav@piyushwani.com
      </a>
      .
    </>,
  ],
  [
    "Cookies",
    "We use cookies that are necessary for the site to function, and analytics cookies to understand how the site is used. You can control cookies through your browser settings.",
  ],
  [
    "Children",
    "This website is not directed at children under 18 and we do not knowingly collect their personal data.",
  ],
  [
    "Grievance Officer",
    <>
      <strong>Utkarsh Srivastav</strong>, E-commerce Executive ·{" "}
      <a href="mailto:utkarshsrivastav@piyushwani.com">
        utkarshsrivastav@piyushwani.com
      </a>{" "}
      · +91 87969 22234 · Office No. 4, Ground Floor, D-248/10, Laxmi Nagar, East
      Delhi, Delhi 110092. We acknowledge within 48 hours and respond within 30
      days.
    </>,
  ],
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lede="How we collect, use and protect personal data."
      intro={
        <p className="mono muted">
          Last updated: <Ph label="date" />
        </p>
      }
      sections={SECTIONS}
    />
  );
}
