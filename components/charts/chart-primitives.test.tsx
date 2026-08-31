import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ChartNarrativeSummary,
  ChartTableFallback,
  ChartTooltip,
} from "./ChartDetails";
import { ComparisonBar } from "./ComparisonBar";
import { DistributionPlot } from "./DistributionPlot";
import { RangePlot } from "./RangePlot";
import type { ComparisonDatum, RangeDatum } from "./chart-types";

const comparisonData: ReadonlyArray<ComparisonDatum> = [
  {
    color: "var(--atom-energy-nuclear)",
    formattedValue: "25 fixture units",
    id: "alpha",
    label: "Alpha fixture",
    marker: "circle",
    unit: "fixture units",
    value: 25,
  },
  {
    color: "var(--atom-energy-solar)",
    formattedValue: "70 fixture units",
    id: "beta",
    label: "Beta fixture",
    marker: "square",
    unit: "fixture units",
    value: 70,
  },
];

const rangeData: ReadonlyArray<RangeDatum> = [
  {
    color: "var(--atom-energy-wind)",
    formattedLower: "10 fixture units",
    formattedRepresentative: "20 fixture units",
    formattedUpper: "35 fixture units",
    id: "range-alpha",
    label: "Range fixture",
    lower: 10,
    marker: "triangle",
    rangeKind: "Published min–max",
    representative: 20,
    unit: "fixture units",
    upper: 35,
  },
];

describe("chart primitives", () => {
  it("renders direct labels, visible units, non-color markers, and a summary", () => {
    render(
      <ComparisonBar
        data={comparisonData}
        summary="Beta fixture is larger in this synthetic geometry example."
        title="Synthetic comparison"
      />,
    );

    const figure = screen.getByRole("figure", { name: "Synthetic comparison" });
    expect(within(figure).getByText("25 fixture units")).toBeVisible();
    expect(within(figure).getByText("70 fixture units")).toBeVisible();
    expect(
      within(figure).getByText(
        "Beta fixture is larger in this synthetic geometry example.",
      ),
    ).toBeVisible();
    expect(
      within(figure).getByText("Alpha fixture").closest("li"),
    ).toHaveAttribute("data-marker", "circle");
  });

  it("labels range semantics and every bound", () => {
    render(<RangePlot data={rangeData} title="Synthetic ranges" />);

    const figure = screen.getByRole("figure", { name: "Synthetic ranges" });
    expect(within(figure).getByText("Published min–max")).toBeVisible();
    expect(within(figure).getByText("10 fixture units")).toBeVisible();
    expect(within(figure).getByText("20 fixture units")).toBeVisible();
    expect(within(figure).getByText("35 fixture units")).toBeVisible();
  });

  it("maps clustered non-zero ranges across the available track", () => {
    render(
      <RangePlot
        data={[
          {
            ...rangeData[0]!,
            formattedLower: "1,000 fixture units",
            formattedRepresentative: "1,005 fixture units",
            formattedUpper: "1,010 fixture units",
            lower: 1_000,
            representative: 1_005,
            upper: 1_010,
          },
        ]}
        title="Clustered range"
      />,
    );

    const row = screen.getByText("Range fixture").closest("li");
    expect(row?.getAttribute("style")).toContain(
      "--range-start: 4.545454545454546%",
    );
    expect(row?.getAttribute("style")).toContain(
      "--range-end: 95.45454545454545%",
    );
  });

  it("exposes every distribution observation as text", () => {
    render(
      <DistributionPlot
        observations={[
          { formattedValue: "12 fixture units", id: "one", value: 12 },
          { formattedValue: "18 fixture units", id: "two", value: 18 },
          { formattedValue: "31 fixture units", id: "three", value: 31 },
        ]}
        title="Synthetic distribution"
        unit="fixture units"
      />,
    );

    const list = screen.getByRole("list", {
      name: "Distribution observations",
    });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(within(list).getByText("31 fixture units")).toBeVisible();
  });

  it("provides reusable narrative, tooltip, and equivalent table details", () => {
    render(
      <>
        <ChartNarrativeSummary>
          This fixture demonstrates the narrative slot.
        </ChartNarrativeSummary>
        <ChartTooltip
          content="Observation metadata"
          label="Inspect Alpha fixture"
        />
        <ChartTableFallback
          caption="Synthetic comparison table"
          data={comparisonData}
        />
      </>,
    );

    expect(screen.getByRole("note")).toHaveTextContent(/narrative slot/i);
    fireEvent.click(
      screen.getByRole("button", { name: "Inspect Alpha fixture" }),
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Observation metadata",
    );
    const table = screen.getByRole("table", {
      name: "Synthetic comparison table",
    });
    expect(within(table).getByText("Alpha fixture")).toBeVisible();
    expect(within(table).getByText("25 fixture units")).toBeVisible();
  });

  it("renders an explicit chart state instead of a silent blank", () => {
    render(
      <ComparisonBar
        data={[]}
        state={{
          message: "We do not currently have reliable comparable data.",
          title: "Missing chart evidence",
          tone: "missing",
        }}
        summary="No comparison can be made."
        title="Unavailable comparison"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Missing chart evidence" }),
    ).toBeVisible();
  });

  it("renders explicit range and distribution states instead of silent blanks", () => {
    render(
      <>
        <RangePlot
          data={[]}
          state={{
            message: "Comparable ranges are not available.",
            title: "Missing range evidence",
            tone: "missing",
          }}
          title="Unavailable ranges"
        />
        <DistributionPlot
          observations={[]}
          title="Unavailable distribution"
          unit="fixture units"
        />
      </>,
    );

    expect(
      screen.getByRole("heading", { name: "Missing range evidence" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Empty chart" })).toBeVisible();
  });

  it("renders loading chart states as named progress indicators", () => {
    render(
      <RangePlot
        data={[]}
        state={{
          message: "Loading reviewed ranges.",
          title: "Loading range evidence",
          tone: "loading",
        }}
        title="Loading ranges"
      />,
    );

    expect(
      screen.getByRole("status", { name: "Loading range evidence" }),
    ).toBeVisible();
  });
});
