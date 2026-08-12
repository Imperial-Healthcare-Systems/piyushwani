import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="sect sect--card"
      style={{ minHeight: "52vh", display: "flex", alignItems: "center" }}
    >
      <div className="wrap">
        <div className="lab">Not found</div>
        <h1 className="h-xl" style={{ margin: "14px 0 16px" }}>
          We can&apos;t find that page.
        </h1>
        <p className="lede">
          The page may have moved, or the link may be broken. Try our products,
          verify a batch, or head home.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
          <Link className="btn btn--seal" href="/">
            Home
          </Link>
          <Link className="btn btn--line" href="/products">
            Products
          </Link>
          <Link className="btn btn--line" href="/verify">
            Verify a batch
          </Link>
        </div>
      </div>
    </section>
  );
}
