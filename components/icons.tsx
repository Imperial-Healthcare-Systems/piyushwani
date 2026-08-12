import type { JSX } from "react";

export function PackIcon() {
  return (
    <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="#0A1F3D" strokeWidth="1.1" aria-hidden="true">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </svg>
  );
}

export function PersonIcon() {
  return (
    <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#0A1F3D" strokeWidth="1.1" aria-hidden="true">
      <circle cx="12" cy="8.4" r="3.9" />
      <path d="M4.5 20.5c0-4 3.4-6.4 7.5-6.4s7.5 2.4 7.5 6.4" />
    </svg>
  );
}

export function PhotoIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0A1F3D" strokeWidth="1.1" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M3 16l4.5-4 4 3.4L15.5 11 21 16" />
    </svg>
  );
}

export function TickIcon() {
  return (
    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" aria-hidden="true">
      <path d="M4 12.5l5.2 5.2L20 7" />
    </svg>
  );
}

export function WarnIcon() {
  return (
    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 3.5L22 20H2L12 3.5z" />
      <path d="M12 10v4.4M12 17.2v.1" />
    </svg>
  );
}

export function CrossIcon() {
  return (
    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function BrandMark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="3" fill="#02409A" />
      <path d="M12 28V12h7.5a5 5 0 0 1 0 10H12" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="square" />
      <circle cx="27.5" cy="27" r="3.4" fill="none" stroke="#6ED45B" strokeWidth="2" />
    </svg>
  );
}

export function VerifiedSeal() {
  return (
    <div className="seal-wrap">
      <svg className="seal-svg" width="72" height="72" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ring" cx="50" cy="50" r="45" fill="none" stroke="#02409A" strokeWidth="3" />
        <circle cx="50" cy="50" r="37" fill="none" stroke="#02409A" strokeWidth="1" opacity=".4" />
        <path className="tick" d="M33 51l12 12 23-25" fill="none" stroke="#02409A" strokeWidth="5" strokeLinecap="square" />
      </svg>
    </div>
  );
}

export function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** Deterministic QR mock — same seed always yields the same label. */
export function QrMock({ seed }: { seed: string }): JSX.Element {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

  const N = 21;
  const c = 6;
  const on: boolean[] = [];
  for (let i = 0; i < N * N; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    on.push(((h >>> 16) & 1) === 1);
  }

  const finder = (x: number, y: number, key: string) => (
    <g key={key}>
      <rect x={x * c} y={y * c} width={c * 7} height={c * 7} fill="none" stroke="currentColor" strokeWidth={c} />
      <rect x={(x + 2) * c} y={(y + 2) * c} width={c * 3} height={c * 3} fill="currentColor" />
    </g>
  );
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);

  const cells: JSX.Element[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!inFinder(x, y) && on[y * N + x]) {
        cells.push(<rect key={`${x}-${y}`} x={x * c} y={y * c} width={c} height={c} fill="currentColor" />);
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${N * c} ${N * c}`} width="126" height="126" role="img" aria-label={`QR label mock for ${seed}`}>
      {finder(0, 0, "tl")}
      {finder(N - 7, 0, "tr")}
      {finder(0, N - 7, "bl")}
      {cells}
    </svg>
  );
}
