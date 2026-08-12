export type AdminTab =
  | "dashboard"
  | "content"
  | "products"
  | "batches"
  | "certs"
  | "team"
  | "inbox"
  | "settings"
  | "audit";

export type NavItem = [AdminTab, string, string]; // [key, glyph, label]
export type NavGroup = [string, NavItem[]];

/* Grouped navigation — modules cluster by the job being done, not by table. */
export const ADMIN_NAV_GROUPS: NavGroup[] = [
  ["Overview", [["dashboard", "▦", "Dashboard"]]],
  [
    "Content",
    [
      ["content", "◑", "Site content"],
      ["products", "◈", "Products"],
      ["team", "◉", "Team & doctors"],
    ],
  ],
  [
    "Compliance",
    [
      ["batches", "▣", "Batches & QR"],
      ["certs", "⛨", "Certifications"],
    ],
  ],
  [
    "System",
    [
      ["inbox", "✉", "Quote requests"],
      ["settings", "⚙", "Settings"],
      ["audit", "⧉", "Audit log"],
    ],
  ],
];

export type SettingRow = { label: string; help: string; on: boolean };

export const SETTINGS_ROWS: SettingRow[] = [
  {
    label: "Publish drug-licensed products",
    help: "Blocked until a Drug Licence number is recorded on the Certifications screen.",
    on: false,
  },
  {
    label: "Show content gaps on the public site",
    help: "Renders unfilled fields as amber chips so nothing ships silently blank.",
    on: true,
  },
  {
    label: "Require consent before publishing a doctor",
    help: "A profile stays in draft until written consent is recorded. Strongly recommended.",
    on: true,
  },
  {
    label: "Log failed verification scans",
    help: "Records NOT_FOUND attempts — the earliest signal of counterfeit stock in circulation.",
    on: true,
  },
];

export type Doctor = {
  name: string;
  qual: string;
  spec: string;
  years: string;
  affil: string;
  engagement: string;
  consent: boolean;
};

export type AuditEntry = {
  t: Date;
  action: string;
  entity: string;
  detail: string;
};

export type InboxRow = {
  ref: string;
  name: string;
  contact: string;
  detail: string;
  at: string;
};

export type EditState =
  | { kind: "product"; i: number }
  | { kind: "batch" }
  | { kind: "qr"; code: string }
  | { kind: "doc"; i: number }
  | null;

export const INBOX_LABEL = "Quote requests";
/** Piyushwani does not publish prices on the informational site. */
export const HAS_PRICE = false;
/** No fixed category vocabulary on this site — the type flag carries it. */
export const CATS_KEYS: string[] = [];
