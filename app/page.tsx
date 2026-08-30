import Link from "next/link";

export default function HomePage() {
  return (
    <main className="foundation">
      <p className="eyebrow">Evidence-first energy literacy</p>
      <h1>ATOM</h1>
      <p>
        Understand energy systems, their trade-offs, and the evidence behind
        important quantitative claims.
      </p>
      <Link href="/methodology">Read the evidence policy</Link>
      <p className="status" role="status">
        Platform foundation in progress. The flagship visual direction has not
        been selected.
      </p>
    </main>
  );
}
