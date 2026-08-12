/* ------------------------------------------------------------------
   BATCH DATA LIVES ON THE SERVER.
   Verification calls API.verify(code) and renders whatever the API
   returns. This is the shape BatchRecord expects.
   A 404 from the API is treated as "no record".
   ------------------------------------------------------------------ */

export type BatchState = "ok" | "warn" | "bad";

export type Batch = {
  state: BatchState;
  /** only when state === 'bad' */
  kind?: "expired" | "withdrawn";
  product: string;
  brand: string;
  pack: string;
  form: string;
  batch: string;
  mfg: string;
  exp: string;
  size: string;
  released: string;
  comp: string;
  mfr: string;
  site: string;
  lic: string;
  /** message when state === 'warn' */
  warn?: string;
  /** date string when kind === 'withdrawn' */
  withdrawn?: string;
  scans: number;
  first: string;
};

/* Codes come from a 30-symbol alphabet with 0/O/1/I/L removed — sequential
   codes would let a counterfeiter enumerate valid URLs, and the omitted glyphs
   cut transcription errors when someone reads a code off a pack. */
export const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function mintCode(taken: (code: string) => boolean = () => false): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    let out = "PW";
    const b = new Uint8Array(8);
    crypto.getRandomValues(b);
    for (let i = 0; i < 6; i++) out += CODE_ALPHABET[b[i] % CODE_ALPHABET.length];
    if (!taken(out)) return out;
  }
  throw new Error("could not mint an unused batch code");
}
