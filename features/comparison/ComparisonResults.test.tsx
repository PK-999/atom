import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ComparisonResults } from "./ComparisonResults";
import { mockComparison } from "./test-fixtures";
import type { PreviewObservation } from "./comparison-types";

describe("ComparisonResults", () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    comparison: mockComparison,
    displayMode: "typical" as const,
    selectedObservations: mockComparison.observations,
    view: "chart" as const,
    onViewChange: vi.fn(),
    onRestoreDefaultSources: vi.fn(),
  };

  it("renders the bar chart with direct values and units", () => {
    render(<ComparisonResults {...defaultProps} />);

    expect(screen.getByText("Nuclear")).toBeVisible();
    expect(screen.getByText("12")).toBeVisible();
    expect(screen.getByText("40")).toBeVisible();
    expect(screen.getAllByText("g CO₂e / kWh").length).toBeGreaterThan(0);
  });

  it("renders table view when explicitly selected", () => {
    render(<ComparisonResults {...defaultProps} view="table" />);

    const table = screen.getByRole("table", {
      name: "Lifecycle greenhouse-gas emissions comparison",
    });
    expect(table).toBeVisible();
    expect(within(table).getByText("Nuclear")).toBeVisible();
    expect(within(table).getByText("12")).toBeVisible();
  });

  it("switches to table view automatically when 9 or more sources are selected", () => {
    const nineObservations: PreviewObservation[] = [
      ...mockComparison.observations,
      {
        technologyId: "hydro",
        technologyName: "Hydro",
        color: "#2B8CEE",
        marker: "triangle",
        typicalValue: 24,
        range: null,
        evidenceStatus: "reviewed",
        source: null,
        verifiedAt: null,
      },
      {
        technologyId: "storage",
        technologyName: "Storage",
        color: "#FF8A00",
        marker: "square",
        typicalValue: 30,
        range: null,
        evidenceStatus: "reviewed",
        source: null,
        verifiedAt: null,
      },
      {
        technologyId: "biomass",
        technologyName: "Biomass",
        color: "#48A868",
        marker: "pentagon",
        typicalValue: 230,
        range: null,
        evidenceStatus: "reviewed",
        source: null,
        verifiedAt: null,
      },
      {
        technologyId: "geothermal",
        technologyName: "Geothermal",
        color: "#E05638",
        marker: "diamond",
        typicalValue: 38,
        range: null,
        evidenceStatus: "reviewed",
        source: null,
        verifiedAt: null,
      },
    ];

    render(
      <ComparisonResults
        {...defaultProps}
        selectedObservations={nineObservations}
        view="chart"
      />,
    );

    expect(
      screen.getByRole("table", {
        name: "Lifecycle greenhouse-gas emissions comparison",
      }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Chart view" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("renders an honest empty state when 0 sources are selected and restores defaults", () => {
    const onRestoreDefaultSources = vi.fn();
    render(
      <ComparisonResults
        {...defaultProps}
        selectedObservations={[]}
        onRestoreDefaultSources={onRestoreDefaultSources}
      />,
    );

    expect(screen.getByText("No technologies selected")).toBeVisible();
    const restoreBtn = screen.getByRole("button", {
      name: "Restore default technologies",
    });
    fireEvent.click(restoreBtn);
    expect(onRestoreDefaultSources).toHaveBeenCalledTimes(1);
  });
});
