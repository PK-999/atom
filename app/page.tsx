import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";

export default function HomePage() {
  return (
    <AppShell>
      <div className="foundation">
      <p className="eyebrow">Evidence-first energy literacy</p>
      <h1>ATOM</h1>
      <p>
        Understand energy systems, their trade-offs, and the evidence behind
        important quantitative claims.
      </p>
      <div className="foundation-links">
        <Link href="/compare">Open the Comparison Lab</Link>
        <Link href="/methodology">Read the evidence policy</Link>
      </div>
      <p className="status" role="status">
        Digital Science Museum direction selected. Evidence review and catalog
        expansion remain in progress.
      </p>
      </div>
    </AppShell>
  );
}
