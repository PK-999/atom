import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DoseExplorer } from "./DoseExplorer";

describe("DoseExplorer Component (R13)", () => {
  it("renders header, disclaimer, and initial scenarios", () => {
    render(<DoseExplorer />);

    expect(
      screen.getByRole("heading", {
        name: "Radiation Dose Explorer",
        level: 1,
      }),
    ).toBeVisible();

    expect(screen.getByTestId("disclaimer")).toBeVisible();
    expect(screen.getByTestId("scenario-inspector")).toBeVisible();

    // Check table exists with correct headers
    expect(
      screen.getByRole("table", {
        name: "Radiation Scenarios Reference Table",
      }),
    ).toBeVisible();
  });

  it("filters scenarios by category in both list and table", () => {
    render(<DoseExplorer />);

    // Click "Medical Diagnostics" filter
    const medicalBtn = screen.getByTestId("filter-medical");
    fireEvent.click(medicalBtn);
    expect(medicalBtn).toHaveAttribute("aria-pressed", "true");

    // Standard chest x-ray should be visible
    expect(screen.getAllByText("Standard Chest X-Ray")[0]).toBeVisible();
    expect(screen.getAllByText("Dental Radiograph (X-ray)")[0]).toBeVisible();

    // Transcontinental flight (everyday) should not be visible
    expect(
      screen.queryByText("Transcontinental Flight (NY to LA)"),
    ).not.toBeInTheDocument();
  });

  it("updates inspector card when a different scenario is selected", () => {
    render(<DoseExplorer />);

    // Click on "Eating One Banana"
    const bananaRow = screen.getByTestId("scenario-row-banana-intake");
    fireEvent.click(bananaRow);

    const inspector = screen.getByTestId("scenario-inspector");
    expect(inspector).toHaveTextContent("Eating One Banana");
    expect(inspector).toHaveTextContent("0.1 µSv");
    expect(inspector).toHaveTextContent("Potassium-40");
  });
});
