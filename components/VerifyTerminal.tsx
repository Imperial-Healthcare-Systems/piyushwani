"use client";

import { useRef, useState } from "react";

import BatchRecord, {
  VerifyError,
  VerifyLoading,
  VerifyNotFound,
} from "@/components/BatchRecord";
import type { Batch } from "@/lib/batches";
import { API, apiFetch } from "@/lib/config";

type Result =
  | { kind: "idle" }
  | { kind: "loading"; code: string }
  | { kind: "record"; code: string; batch: Batch }
  | { kind: "notfound"; code: string }
  | { kind: "error"; code: string };

export default function VerifyTerminal({
  intro,
  inputId,
}: {
  intro: string;
  /** distinct ids so both terminals can coexist on one page */
  inputId: string;
}) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();

    const code = value.trim().toUpperCase();
    if (!code) {
      inputRef.current?.focus();
      return;
    }

    setResult({ kind: "loading", code });
    outRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });

    const res = await apiFetch<Batch>(API.verify(code));

    if (res.status === 404) setResult({ kind: "notfound", code });
    else if (!res.ok || !res.data) setResult({ kind: "error", code });
    else setResult({ kind: "record", code, batch: res.data });
  }

  return (
    <>
      <div className="term">
        <div className="term-top">
          <span className="dot" />
          <span>Batch verification terminal</span>
          {/* Live rhythm strip. Two copies of one beat sit end to end and the
              group travels exactly one beat width, so the loop has no seam. */}
          <svg className="ecg" viewBox="0 0 60 24" aria-hidden="true">
            <g>
              <path d="M0 12 H14 q3 -3 6 0 H24 L26 15 L29 3 L32 17 L34 12 H40 q4 -4 8 0 H60" />
              <path
                d="M0 12 H14 q3 -3 6 0 H24 L26 15 L29 3 L32 17 L34 12 H40 q4 -4 8 0 H60"
                transform="translate(60 0)"
              />
            </g>
          </svg>
        </div>
        <div className="term-body">
          <p>{intro}</p>
          <form className="field" onSubmit={run}>
            <input
              id={inputId}
              ref={inputRef}
              name="code"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="ENTER BATCH CODE"
              aria-label="Batch verification code"
              autoComplete="off"
              spellCheck={false}
              maxLength={12}
            />
            <button className="btn btn--lt" type="submit">
              Verify
            </button>
          </form>
        </div>
      </div>

      <div ref={outRef} style={{ marginTop: 14 }} aria-live="polite">
        {result.kind === "loading" && <VerifyLoading code={result.code} />}
        {result.kind === "notfound" && <VerifyNotFound code={result.code} />}
        {result.kind === "error" && <VerifyError code={result.code} />}
        {result.kind === "record" && <BatchRecord b={result.batch} />}
      </div>
    </>
  );
}
