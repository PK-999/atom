import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CostWorkbench } from "./CostWorkbench";

describe("CostWorkbench", () => {
  it("shows a modeled result and responds to an assumption change", () => {
    render(<CostWorkbench />);
    expect(
      screen.getByRole("heading", { name: "Cost workbench" }),
    ).toBeVisible();
    const fuel = screen.getByLabelText("Fuel cost / MWh");
    const before = screen.getByText(/illustrative currency\/MWh/).textContent;
    fireEvent.change(fuel, { target: { value: "200" } });
    expect(screen.getByText(/illustrative currency\/MWh/).textContent).not.toBe(
      before,
    );
  });

  it("keeps a zero-output scenario explicitly unavailable", () => {
    render(<CostWorkbench />);
    fireEvent.change(screen.getByLabelText("Capacity (MW)"), {
      target: { value: "0" },
    });
    expect(screen.getByRole("status")).toHaveTextContent(/Generation is zero/i);
  });
});
