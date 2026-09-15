import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  EvidenceDialog,
  ComparisonEvidenceActions,
} from "./ComparisonEvidence";
import { mockComparison } from "./test-fixtures";

describe("ComparisonEvidence", () => {
  afterEach(() => {
    cleanup();
  });

  const reviewedObservation = mockComparison.observations[0]; // Nuclear
  const unreviewedObservation = {
    ...mockComparison.observations[0],
    evidenceStatus: "unreviewed" as const,
  };

  it("renders DataPassport for a reviewed observation with full provenance", () => {
    render(
      <EvidenceDialog
        appearance="primary"
        comparison={mockComparison}
        observation={reviewedObservation}
        triggerLabel="Explore the evidence"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Explore the evidence" }),
    );

    const dialog = screen.getByRole("dialog", { name: "Why this number?" });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByText("Data passport")).toBeVisible();
    expect(within(dialog).getByText("Published evidence")).toBeVisible();
    expect(within(dialog).getByText("IPCC AR5 WGIII Annex III")).toBeVisible();
    expect(within(dialog).getByText("ipcc-ar5-v1")).toBeVisible();
  });

  it("renders DataPassport for an unreviewed observation with preview draft state", () => {
    render(
      <EvidenceDialog
        appearance="primary"
        comparison={mockComparison}
        observation={unreviewedObservation}
        triggerLabel="Explore the evidence"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Explore the evidence" }),
    );

    const dialog = screen.getByRole("dialog", { name: "Why this number?" });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByText("Data passport preview")).toBeVisible();
    expect(within(dialog).getByText("Not yet published")).toBeVisible();
    expect(within(dialog).getByText("Preview draft")).toBeVisible();
  });

  it("renders disabled trigger when observation is null", () => {
    render(
      <EvidenceDialog
        comparison={mockComparison}
        observation={null}
        triggerLabel="Explore the evidence"
      />,
    );

    const btn = screen.getByRole("button", { name: "Explore the evidence" });
    expect(btn).toBeDisabled();
  });

  it("renders Challenge dialog for reviewed vs unreviewed observations", () => {
    const { rerender } = render(
      <EvidenceDialog
        comparison={mockComparison}
        kind="challenge"
        observation={reviewedObservation}
        triggerLabel="Challenge this number"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Challenge this number" }),
    );
    expect(
      screen.getByText(
        /Submit a challenge or alternative evidence review for Nuclear/i,
      ),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Close evidence" }));

    rerender(
      <EvidenceDialog
        comparison={mockComparison}
        kind="challenge"
        observation={unreviewedObservation}
        triggerLabel="Challenge this number"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Challenge this number" }),
    );
    expect(
      screen.getByText(
        /The challenge workflow will open after evidence review for Nuclear/i,
      ),
    ).toBeVisible();
  });

  it("renders ComparisonEvidenceActions with status badge", () => {
    render(
      <ComparisonEvidenceActions
        comparison={mockComparison}
        observation={reviewedObservation}
      />,
    );

    expect(screen.getByText("Published evidence")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Explore the evidence" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Challenge this number" }),
    ).toBeVisible();
  });

  it("renders source as a hyperlink when source URL is provided", () => {
    const obsWithSourceUrl = {
      ...reviewedObservation,
      source: {
        name: "UNSCEAR 2020 Report",
        url: "https://www.unscear.org/report",
      },
    };

    render(
      <EvidenceDialog
        appearance="primary"
        comparison={mockComparison}
        observation={obsWithSourceUrl}
        triggerLabel="Explore the evidence"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Explore the evidence" }),
    );

    const link = screen.getByRole("link", { name: "UNSCEAR 2020 Report" });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute("href", "https://www.unscear.org/report");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
