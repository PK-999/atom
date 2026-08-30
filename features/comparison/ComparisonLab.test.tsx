import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComparisonLab } from "./ComparisonLab";
import { previewComparison } from "./preview-data";

describe("ComparisonLab", () => {
  it("renders the useful default with direct values, units, and an honest evidence state", () => {
    render(<ComparisonLab comparison={previewComparison} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "See the energy trade-offs",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("g CO₂e / kWh")).toBeInTheDocument();
    expect(screen.getByLabelText("Nuclear: 12 g CO₂e / kWh")).toBeVisible();
    expect(screen.getByText("Evidence review pending")).toBeVisible();
    expect(
      screen.getByText(/preview data for interface development/i),
    ).toBeVisible();
  });

  it("removes a source while preserving the remaining comparison", () => {
    render(<ComparisonLab comparison={previewComparison} />);

    fireEvent.click(screen.getByRole("button", { name: "Remove Coal" }));

    expect(screen.queryByLabelText(/Coal: 820/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Nuclear: 12/)).toBeVisible();
    expect(screen.getByText("4 technologies selected")).toBeVisible();
  });

  it("opens the compact source picker without duplicating source controls", () => {
    render(<ComparisonLab comparison={previewComparison} />);
    const sourcePicker = screen.getByRole("button", {
      name: "5 technologies selected",
    });

    expect(sourcePicker).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(sourcePicker);

    expect(sourcePicker).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getAllByRole("button", { name: "Remove Nuclear" }),
    ).toHaveLength(1);
  });

  it("preserves the comparison when complexity changes", () => {
    render(<ComparisonLab comparison={previewComparison} />);

    fireEvent.click(screen.getByRole("button", { name: "Remove Coal" }));
    fireEvent.click(screen.getByRole("button", { name: "Range" }));
    fireEvent.click(screen.getByRole("button", { name: "Technical" }));

    expect(screen.getByRole("button", { name: "Range" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Technical" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.queryByText("Coal", { selector: "[data-chart-label]" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Range evidence pending review")).toHaveLength(
      4,
    );
  });

  it("provides a table with the same typical values and units", () => {
    render(<ComparisonLab comparison={previewComparison} />);

    fireEvent.click(screen.getByRole("button", { name: "Table view" }));

    const table = screen.getByRole("table", {
      name: "Lifecycle greenhouse-gas emissions comparison",
    });
    expect(within(table).getByText("Nuclear")).toBeVisible();
    expect(within(table).getByText("12")).toBeVisible();
    expect(within(table).getAllByText("g CO₂e / kWh")).toHaveLength(5);
  });

  it("opens evidence details without hover and restores focus when closed", async () => {
    render(<ComparisonLab comparison={previewComparison} />);
    const trigger = screen.getByRole("button", {
      name: "Explore the evidence",
    });

    trigger.focus();
    fireEvent.click(trigger);

    expect(
      screen.getByRole("dialog", { name: "Why this number?" }),
    ).toBeVisible();
    expect(screen.getByText("Not yet published")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Close evidence" }));
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
