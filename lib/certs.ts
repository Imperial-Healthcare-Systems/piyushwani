export type Cert = {
  /** display name */
  k: string;
  badge: string;
  feature?: boolean;
  pending?: boolean;
  rows: [string, string][];
  /** plain-language explanation of what the certification actually means */
  x: string;
};

export const CERTS: Cert[] = [
  /* Drug Licence is recorded as "TBD" on the signed intake form (§1). We do not
     publish a licence number the company does not yet hold, and we do not claim
     drug-licensed status. The card stays visible with an explicit pending state
     so the gap is tracked rather than quietly omitted. */
  {
    k: "Drug Licence",
    feature: true,
    badge: "Application pending",
    pending: true,
    rows: [
      ["Status", "Application in progress"],
      ["Licence number", "[CLIENT: on grant]"],
      ["Type", "[CLIENT: Form 20 / 20B / 21 / 21B]"],
      ["Issuing authority", "[CLIENT: State Drugs Control Dept., Delhi]"],
    ],
    x: "A drug licence is issued by the State Drugs Control authority and permits the holder to deal in pharmaceutical products in the categories specified on the licence. It is the baseline legal requirement for dealing in pharmaceutical products, and it is renewable. Piyushwani has not yet been granted this licence; until it is, this website is informational only and no pharmaceutical product is offered for sale here.",
  },
  {
    k: "ISO 9001",
    badge: "Quality System",
    rows: [
      ["Certificate no.", "3090QAF23"],
      ["Certification body", "BIAA, London, United Kingdom"],
      ["Scope", "Trading of drugs and medical devices"],
      ["Valid until", "6 March 2029"],
    ],
    x: "ISO 9001 certifies that an organisation operates a documented quality management system audited against an international standard. It covers process consistency and documentation, and is renewed through periodic surveillance audits.",
  },
  {
    k: "FSSAI",
    badge: "Food & Nutraceuticals",
    rows: [
      ["Licence no.", "13326999000236"],
      ["Type", "Central Licence"],
      ["Valid until", "4 April 2027"],
    ],
    x: "The FSSAI licence is issued under the Food Safety and Standards Act and is required to manufacture or market nutraceuticals, health supplements and food products in India.",
  },
  {
    k: "LMPC",
    badge: "Legal Metrology",
    rows: [
      ["Registration no.", "GOI/DL/2026/5357"],
      ["Issuing authority", "Ministry of Consumer Affairs, Food and Public Distribution"],
      ["Valid until", "[CLIENT: validity date]"],
    ],
    x: "LMPC registration is required under the Legal Metrology (Packaged Commodities) Rules and governs the mandatory declarations on packaged goods — maximum retail price, net quantity, manufacturer details and consumer care contact.",
  },
  {
    k: "Udyam (MSME)",
    badge: "Enterprise registration",
    rows: [
      ["Registration no.", "UDYAM-DL-02-0109844"],
      ["Issuing authority", "Ministry of Micro, Small and Medium Enterprises"],
    ],
    x: "Udyam registration records the company as a recognised micro, small or medium enterprise under the MSME Development Act. It is an enterprise classification, not a product or quality approval.",
  },
  {
    k: "Startup India",
    badge: "DPIIT recognition",
    rows: [
      ["Recognition no.", "DPII249648"],
      ["Issuing authority", "Department for Promotion of Industry and Internal Trade"],
    ],
    x: "DPIIT recognition under the Startup India initiative confirms the entity meets the government definition of a startup. It is an eligibility recognition for policy benefits, not a product or quality approval.",
  },
];
