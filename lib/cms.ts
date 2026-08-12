/* ==========================================================================
   CMS STORE
   Every `[CLIENT: …]` placeholder resolves through here. When a value is
   present the amber gap chip is replaced by real text — which is the whole
   point: it proves the content wiring, not just the screens.
   ========================================================================== */

export type CmsGroup =
  | "company"
  | "contact"
  | "compliance"
  | "legal"
  | "leadership"
  | "brands";

export type CmsField = {
  group: CmsGroup;
  label: string;
  key: string;
  long: boolean;
  req: boolean;
};

export const CMS_FIELDS: CmsField[] = [
  { group: "company", label: "Registered legal name", key: "company.legal_name", long: false, req: true },
  { group: "company", label: "CIN", key: "company.cin", long: false, req: true },
  { group: "company", label: "GSTIN", key: "company.gstin", long: false, req: true },
  { group: "company", label: "Registered office address", key: "company.address", long: true, req: true },
  { group: "contact", label: "Primary phone", key: "contact.phone", long: false, req: true },
  { group: "contact", label: "Support phone", key: "contact.support_phone", long: false, req: true },
  { group: "contact", label: "Support email", key: "contact.support_email", long: false, req: true },
  { group: "contact", label: "Sales email", key: "contact.sales_email", long: false, req: true },
  { group: "contact", label: "Business hours", key: "contact.hours", long: false, req: true },
  { group: "compliance", label: "Drug Licence number", key: "compliance.drug_licence", long: false, req: true },
  { group: "compliance", label: "Contract manufacturer name", key: "compliance.manufacturer", long: false, req: true },
  { group: "compliance", label: "Manufacturing site address", key: "company.mfg_site", long: true, req: true },
  { group: "compliance", label: "Manufacturing licence number", key: "compliance.mfg_licence", long: false, req: true },
  { group: "legal", label: "Grievance Officer name", key: "legal.grievance_name", long: false, req: true },
  { group: "legal", label: "Grievance Officer email", key: "legal.grievance_email", long: false, req: true },
  { group: "legal", label: "Data retention period", key: "legal.retention", long: false, req: false },
  { group: "leadership", label: "Founder summary (homepage, 40–60 words)", key: "leadership.summary", long: true, req: true },
  { group: "leadership", label: "Founder biography", key: "leadership.bio", long: true, req: true },
  { group: "leadership", label: "Founder pull-quote", key: "leadership.quote", long: true, req: false },
  { group: "leadership", label: "Institution and year of graduation", key: "leadership.institution", long: false, req: false },
  { group: "brands", label: "P-Wanicure positioning (one line)", key: "brand.pwanicure.line", long: false, req: false },
  { group: "brands", label: "P-Wanicure tagline", key: "brand.pwanicure.tagline", long: false, req: false },
  { group: "brands", label: "P-Wanicure category", key: "brand.pwanicure.category", long: false, req: false },
  { group: "brands", label: "P-Wanicure description", key: "brand.pwanicure.about", long: true, req: false },
];

export type CmsValues = Record<string, string>;

export const CMS: CmsValues = {
  "company.legal_name": "Piyushwani (OPC) Private Limited",
  "company.cin": "U46497DL2025OPC459389",
  "company.gstin": "07AAQCP4428A1ZH",
  "company.address":
    "Office No. 4, Ground Floor, D-248/10, Laxmi Nagar, East Delhi, Delhi 110092",
  "contact.phone": "+91 87969 22237",
  "contact.support_phone": "+91 87969 22234",
  "contact.support_email": "support@piyushwani.com",
  "contact.sales_email": "sales@piyushwani.com",
  "contact.hours": "Monday to Saturday, 9:30 am – 6:30 pm IST",
  "legal.grievance_name": "Utkarsh Srivastav",
  "legal.grievance_email": "utkarshsrivastav@piyushwani.com",
};

export const SITE_LABEL = "Piyushwani";
export const HAS_PRICE = false;

/* Maps a placeholder phrase to a CMS key so existing Ph() call sites resolve
   without rewriting each one. */
const CMS_ALIAS: Record<string, string> = {
  phone: "contact.phone",
  "support phone": "contact.support_phone",
  email: "contact.support_email",
  "support email": "contact.support_email",
  "distribution email": "contact.sales_email",
  hours: "contact.hours",
  CIN: "company.cin",
  "registered office address": "company.address",
  "contract manufacturer": "compliance.manufacturer",
  "contract manufacturer name": "compliance.manufacturer",
  "mfg licence no.": "compliance.mfg_licence",
  "licence no.": "compliance.mfg_licence",
  name: "legal.grievance_name",
  "manufacturing site address": "company.mfg_site",
  "composition snapshot": "",
  X: "ship.dispatch_days",
};

export function cmsLookup(label: string, values: CmsValues = CMS): string | null {
  const key = CMS_ALIAS[label] ?? label;
  const v = values[key];
  return v && String(v).trim() ? String(v).trim() : null;
}

export function gapList(values: CmsValues = CMS) {
  return CMS_FIELDS.filter((f) => !(values[f.key] || "").toString().trim()).map(
    (f) => ({ label: f.label, where: f.group }),
  );
}
