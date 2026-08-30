import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChallengeNumber } from "./ChallengeNumber";
import { DataPassport } from "./DataPassport";
import { EvidenceBadge } from "./EvidenceBadge";
import { ConfidenceNote, MethodologySummary } from "./EvidenceNotes";
import { SourceDrawer } from "./SourceDrawer";
import type { EvidenceViewModel } from "./evidence-view-model";

const reviewedEvidence: EvidenceViewModel = {
  status: "published",
  metric: "Example metric",
  value: "Reviewed representative value",
  unit: "canonical unit",
  technology: "Example technology",
  geography: "Global",
  period: "Published study period",
  source: {
    title: "Institutional reference",
    url: "https://example.com/source",
  },
  publicationVersion: "Dataset version 1",
  method: "Reviewed synthesis method",
  systemBoundary: "Declared lifecycle boundary",
  range: "Published min–max range",
  uncertainty: "The source documents model uncertainty.",
  lastVerified: "2026-08-30",
  transformation: "Normalized to the metric canonical unit.",
  representativeKind: "Median",
  alternatives: [
    {
      label: "Alternative study",
      value: "Alternative reviewed value",
      difference: "Uses a different declared boundary.",
    },
  ],
  differenceReasons: ["System boundary", "Study period"],
  limitations: ["The example is a component fixture, not scientific evidence."],
};

describe("evidence primitives", () => {
  it("labels publication status without inventing confidence", () => {
    render(<EvidenceBadge status="published" />);

    expect(screen.getByText("Published evidence")).toBeVisible();
    expect(screen.queryByText(/confidence score/i)).not.toBeInTheDocument();
  });

  it("shows every available provenance field in the Data Passport", () => {
    render(<DataPassport evidence={reviewedEvidence} trigger="Why this number?" />);

    fireEvent.click(screen.getByRole("button", { name: "Why this number?" }));
    const dialog = screen.getByRole("dialog", { name: "Why this number?" });

    expect(within(dialog).getByText("Institutional reference")).toBeVisible();
    expect(within(dialog).getByText("Dataset version 1")).toBeVisible();
    expect(within(dialog).getByText("Declared lifecycle boundary")).toBeVisible();
    expect(within(dialog).getByText("2026-08-30")).toBeVisible();
    expect(within(dialog).getByRole("link", { name: "View source" })).toHaveAttribute(
      "href",
      "https://example.com/source",
    );
  });

  it("renders honest missing fields and withholds unavailable source actions", () => {
    const evidence: EvidenceViewModel = {
      status: "unreviewed",
      metric: "Example metric",
      value: "Not published",
      unit: "canonical unit",
      technology: "Example technology",
      geography: "Global",
      period: null,
      source: null,
      publicationVersion: null,
      method: null,
      systemBoundary: null,
      range: null,
      uncertainty: null,
      lastVerified: null,
      transformation: null,
      representativeKind: null,
      alternatives: [],
      differenceReasons: [],
      limitations: ["Evidence review has not been completed."],
    };
    render(<DataPassport evidence={evidence} trigger="Inspect unreviewed record" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Inspect unreviewed record" }),
    );
    const dialog = screen.getByRole("dialog", { name: "Why this number?" });

    expect(within(dialog).getAllByText("Not available — review required").length).toBeGreaterThan(2);
    expect(within(dialog).queryByRole("link", { name: "View source" })).not.toBeInTheDocument();
  });

  it("compares representative and alternative evidence without implying ignorance", () => {
    render(<ChallengeNumber evidence={reviewedEvidence} trigger="Challenge this number" />);

    fireEvent.click(screen.getByRole("button", { name: "Challenge this number" }));
    const dialog = screen.getByRole("dialog", { name: "Challenge this number" });

    expect(within(dialog).getByText("Reviewed representative value")).toBeVisible();
    expect(within(dialog).getByText("Alternative study")).toBeVisible();
    expect(within(dialog).getByText("System boundary")).toBeVisible();
    expect(within(dialog).getByText(/component fixture, not scientific evidence/i)).toBeVisible();
  });

  it("exposes sources, methodology, and uncertainty as reusable notes", () => {
    render(
      <>
        <SourceDrawer
          sources={[reviewedEvidence.source!]}
          trigger="Review sources"
        />
        <ConfidenceNote>{reviewedEvidence.uncertainty}</ConfidenceNote>
        <MethodologySummary>{reviewedEvidence.method}</MethodologySummary>
      </>,
    );

    expect(screen.getByText(/model uncertainty/i)).toBeVisible();
    expect(screen.getByText("Reviewed synthesis method")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Review sources" }));
    expect(
      within(screen.getByRole("dialog", { name: "Sources" })).getByRole("link", {
        name: "Institutional reference",
      }),
    ).toBeVisible();
  });
});
