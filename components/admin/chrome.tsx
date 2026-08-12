"use client";

import type { ReactNode } from "react";

import { useAdmin } from "@/components/admin/context";

export function Hd({
  title,
  sub,
  actions,
}: {
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="ac-hd">
      <div>
        <h1>{title}</h1>
        {sub ? <p className="ac-sub">{sub}</p> : null}
      </div>
      {actions ? <div className="ac-acts">{actions}</div> : null}
    </header>
  );
}

/** Sortable table header row. Columns with no key are not sortable. */
export function Th({ labels, sortable = true }: { labels: string[]; sortable?: boolean }) {
  const { sort, dir, onSort } = useAdmin();
  return (
    <tr>
      {labels.map((l, i) =>
        l === "" ? (
          <th key={i} />
        ) : (
          <th
            key={i}
            className={sortable ? `s${sort === i ? (dir === 1 ? " asc" : " desc") : ""}` : undefined}
            onClick={sortable ? () => onSort(i) : undefined}
          >
            {l}
          </th>
        ),
      )}
    </tr>
  );
}

export function SearchBar({ placeholder }: { placeholder: string }) {
  const { q, setQuery } = useAdmin();
  return (
    <div className="ac-bar">
      <input placeholder={placeholder} value={q} onChange={(e) => setQuery(e.target.value)} />
    </div>
  );
}

export function Pager({ page, pages }: { page: number; pages: number }) {
  const { setPage } = useAdmin();
  if (pages < 2) return null;
  return (
    <div className="ac-pager">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Prev
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button key={i} className={page === i + 1 ? "on" : undefined} onClick={() => setPage(i + 1)}>
          {i + 1}
        </button>
      ))}
      <button disabled={page === pages} onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
