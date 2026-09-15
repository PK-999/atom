import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ComparisonWarnings } from "./ComparisonWarnings";

describe("ComparisonWarnings", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders nothing when warnings is undefined or empty", () => {
    const { container: c1 } = render(<ComparisonWarnings />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<ComparisonWarnings warnings={[]} />);
    expect(c2.firstChild).toBeNull();
  });

  it("renders single warning as a paragraph", () => {
    render(
      <ComparisonWarnings
        warnings={["Methodology mismatch: direct comparisons may vary."]}
      />,
    );

    const region = screen.getByRole("region", {
      name: "Comparison notices and caveats",
    });
    expect(region).toBeVisible();
    expect(
      screen.getByText("Methodology mismatch: direct comparisons may vary."),
    ).toBeVisible();
  });

  it("renders multiple warnings as a list", () => {
    render(
      <ComparisonWarnings
        warnings={[
          "Warning 1: Scope caveat",
          "Warning 2: Missing regional observation, showing global default",
        ]}
      />,
    );

    expect(screen.getByText("Warning 1: Scope caveat")).toBeVisible();
    expect(
      screen.getByText(
        "Warning 2: Missing regional observation, showing global default",
      ),
    ).toBeVisible();
  });
});
