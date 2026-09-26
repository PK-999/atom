import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ComparisonInterpretation } from "./ComparisonInterpretation";

describe("ComparisonInterpretation", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders 5 distinct complexity levels for lifecycle-ghg", () => {
    const { rerender } = render(
      <ComparisonInterpretation
        level="beginner"
        metricId="lifecycle-ghg"
        metricName="Lifecycle greenhouse-gas emissions"
        displayMode="typical"
      />,
    );
    expect(screen.getByText(/Some ways of making electricity/i)).toBeVisible();

    rerender(
      <ComparisonInterpretation
        level="explorer"
        metricId="lifecycle-ghg"
        metricName="Lifecycle greenhouse-gas emissions"
        displayMode="typical"
      />,
    );
    expect(
      screen.getByText(
        /Fossil fuel estimates are much higher in this comparison/i,
      ),
    ).toBeVisible();

    rerender(
      <ComparisonInterpretation
        level="curious"
        metricId="lifecycle-ghg"
        metricName="Lifecycle greenhouse-gas emissions"
        displayMode="typical"
      />,
    );
    expect(
      screen.getByText(/Lifecycle methods and system boundaries still matter/i),
    ).toBeVisible();

    rerender(
      <ComparisonInterpretation
        level="deep-dive"
        metricId="lifecycle-ghg"
        metricName="Lifecycle greenhouse-gas emissions"
        displayMode="typical"
      />,
    );
    expect(
      screen.getByText(/representative values differ substantially/i),
    ).toBeVisible();

    rerender(
      <ComparisonInterpretation
        level="geeky"
        metricId="lifecycle-ghg"
        metricName="Lifecycle greenhouse-gas emissions"
        displayMode="typical"
      />,
    );
    expect(
      screen.getByText(/These interface values are not a published synthesis/i),
    ).toBeVisible();
  });

  it("renders honest fallback message for an unreviewed or unknown metric", () => {
    render(
      <ComparisonInterpretation
        level="curious"
        metricId="unknown-metric-xyz"
        metricName="Unknown Metric"
        displayMode="typical"
      />,
    );
    expect(
      screen.getByText(
        /Reviewed explanation for Unknown Metric is not yet available/i,
      ),
    ).toBeVisible();
  });

  it("explains unavailable mode states honestly", () => {
    render(
      <ComparisonInterpretation
        level="curious"
        metricId="lifecycle-ghg"
        metricName="Lifecycle greenhouse-gas emissions"
        displayMode="range"
      />,
    );
    expect(
      screen.getByText(
        /Reviewed range evidence is not available in this interface preview/i,
      ),
    ).toBeVisible();
  });
});

it("does not draw a ranking from unavailable observations", () => {
  render(
    <ComparisonInterpretation
      metricId="lifecycle-ghg"
      metricName="Lifecycle emissions"
      level="curious"
      displayMode="typical"
      hasEvidence={false}
    />,
  );
  expect(screen.getByText(/Missing evidence is not zero/)).toBeVisible();
  expect(
    screen.queryByText(/Fossil fuel estimates are much higher/),
  ).not.toBeInTheDocument();
});
