import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ComparisonInterpretation } from "./ComparisonInterpretation";

describe("ComparisonInterpretation", () => {
  afterEach(() => {
    cleanup();
  });

  it("explains the metric with inspectable boundaries", () => {
    render(
      <ComparisonInterpretation
        metricId="lifecycle-ghg"
        metricName="Lifecycle greenhouse-gas emissions"
        displayMode="typical"
      />,
    );
    expect(
      screen.getByText(/Climate pollution across the electricity lifecycle/i),
    ).toBeVisible();
    expect(screen.getByText(/Cradle-to-grave/)).toBeInTheDocument();
  });

  it("renders honest fallback message for an unreviewed or unknown metric", () => {
    render(
      <ComparisonInterpretation
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

      displayMode="typical"
      hasEvidence={false}
    />,
  );
  expect(screen.getByText(/Missing evidence is not zero/)).toBeVisible();
  expect(
    screen.queryByText(/Fossil fuel estimates are much higher/),
  ).not.toBeInTheDocument();
});
