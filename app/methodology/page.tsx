import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evidence methodology",
  description:
    "How ATOM selects, transforms, presents, and corrects scientific evidence.",
};

export default function MethodologyPage() {
  return (
    <main className="foundation">
      <p className="eyebrow">Evidence before persuasion</p>
      <h1>How ATOM handles evidence</h1>
      <p>
        Important quantitative claims must identify their source, unit,
        geography, period, methodology, system boundary, uncertainty, and
        transformation history.
      </p>
      <p>
        Evidence remains unpublished until it has passed source, comparability,
        licensing, and editorial review. Missing or incompatible evidence is
        shown explicitly rather than replaced with an invented value.
      </p>
      <p className="status">
        Detailed source and correction records will become available with the
        evidence system.
      </p>
    </main>
  );
}
