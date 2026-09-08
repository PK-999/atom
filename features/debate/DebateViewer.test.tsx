import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DebateViewer } from "./DebateViewer";
import type { DebateTopic } from "../../lib/debate/schemas";

const MOCK_TOPIC: DebateTopic = {
  id: "test-topic",
  question: "Is nuclear power safe?",
  summary: "A nuanced examination of historical statistics vs accident risks.",
  status: "published",
  citations: [
    {
      id: "cit-1",
      title: "UNSCEAR Report",
      publisher: "United Nations",
      year: 2021,
      url: "https://unscear.org",
      sourceTier: "A",
    },
    {
      id: "cit-2",
      title: "WHO Assessment",
      publisher: "World Health Organization",
      year: 2020,
      sourceTier: "A",
    },
  ],
  arguments: [
    {
      id: "arg-support",
      relationship: "supporting",
      title: "Low Mortality Statistics",
      body: "Nuclear causes few fatalities per TWh.",
      citationIds: ["cit-1"],
      evidenceIds: [],
      strength: "established",
      order: 1,
    },
    {
      id: "arg-dispute",
      relationship: "disputing",
      title: "Land Displacement Risk",
      body: "Evacuation causes severe social hardship.",
      citationIds: ["cit-2"],
      evidenceIds: [],
      strength: "established",
      order: 2,
    },
    {
      id: "arg-context",
      relationship: "contextualizing",
      title: "Passive Safety Evolution",
      body: "Modern Gen III+ designs use gravity cooling.",
      citationIds: [],
      evidenceIds: [],
      strength: "preponderance",
      order: 3,
    },
  ],
  consensus: {
    statement: "Statistically safer than fossil fuels by orders of magnitude.",
    basis: "Global epidemiological meta-studies",
    asOf: "2026-01-15",
    citationIds: ["cit-1"],
  },
  uncertainty: {
    statement: "Low-dose radiation biology remains contested.",
    basis: "ICRP guidelines",
    asOf: "2026-01-15",
    citationIds: [],
  },
  missingEvidenceNote:
    "Longitudinal psychological effects lack uniform metrics.",
};

describe("DebateViewer Component (R14)", () => {
  it("renders topic header, attributable consensus, and key uncertainties", () => {
    render(<DebateViewer topic={MOCK_TOPIC} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /is nuclear power safe\?/i,
      }),
    ).toBeDefined();
    expect(screen.getByText(/a nuanced examination/i)).toBeDefined();

    // Attributable consensus
    expect(screen.getByText(/state of scientific consensus/i)).toBeDefined();
    expect(
      screen.getByText(/statistically safer than fossil fuels/i),
    ).toBeDefined();
    expect(
      screen.getByText(/global epidemiological meta-studies/i),
    ).toBeDefined();
    expect(screen.getAllByText(/2026-01-15/i).length).toBeGreaterThanOrEqual(1);

    // Attributable uncertainty
    expect(
      screen.getByText(/key uncertainties & open questions/i),
    ).toBeDefined();
    expect(
      screen.getByText(/low-dose radiation biology remains contested/i),
    ).toBeDefined();
  });

  it("renders all three argument relationships and their badges", () => {
    render(<DebateViewer topic={MOCK_TOPIC} />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Low Mortality Statistics",
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 3, name: "Land Displacement Risk" }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Passive Safety Evolution",
      }),
    ).toBeDefined();

    // Relationship badges
    expect(screen.getByText("supporting")).toBeDefined();
    expect(screen.getByText("disputing")).toBeDefined();
    expect(screen.getByText("contextualizing")).toBeDefined();
  });

  it("filters arguments by relationship when filter buttons are clicked", () => {
    render(<DebateViewer topic={MOCK_TOPIC} />);

    const disputeFilter = screen.getByRole("button", { name: /disputing/i });
    fireEvent.click(disputeFilter);

    expect(
      screen.getByRole("heading", { level: 3, name: "Land Displacement Risk" }),
    ).toBeDefined();
    expect(
      screen.queryByRole("heading", {
        level: 3,
        name: "Low Mortality Statistics",
      }),
    ).toBeNull();
    expect(
      screen.queryByRole("heading", {
        level: 3,
        name: "Passive Safety Evolution",
      }),
    ).toBeNull();

    // Reset to all
    const allFilter = screen.getByRole("button", { name: /^all/i });
    fireEvent.click(allFilter);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Low Mortality Statistics",
      }),
    ).toBeDefined();
  });

  it("toggles expandable citations drawer and renders links", () => {
    render(<DebateViewer topic={MOCK_TOPIC} />);

    const toggleBtns = screen.getAllByRole("button", { name: /view sources/i });
    const toggleBtn = toggleBtns[0];
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(toggleBtn);
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("true");

    const link = screen.getByRole("link", { name: "UNSCEAR Report" });
    expect(link.getAttribute("href")).toBe("https://unscear.org");
  });

  it("renders missing evidence callout", () => {
    render(<DebateViewer topic={MOCK_TOPIC} />);

    expect(screen.getByText(/evidence boundary & gaps/i)).toBeDefined();
    expect(
      screen.getByText(
        /longitudinal psychological effects lack uniform metrics/i,
      ),
    ).toBeDefined();
  });
});
