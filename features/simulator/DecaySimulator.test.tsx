import { expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DecaySimulator } from "./DecaySimulator";
it("compares a seeded observed population with the expected decay and replays it", () => {
  render(<DecaySimulator />);
  fireEvent.click(screen.getByRole("button", { name: "Advance 1 Half-Life" }));
  const result = screen.getByText(/1.0 t½ · Observed/).textContent;
  expect(result).toContain("Expected: 50.0 atoms");
  fireEvent.click(screen.getByRole("button", { name: "Reset sample" }));
  fireEvent.click(screen.getByRole("button", { name: "Advance 1 Half-Life" }));
  expect(screen.getByText(/1.0 t½ · Observed/).textContent).toBe(result);
  expect(screen.queryByText(/µSv\/h|CPM/)).not.toBeInTheDocument();
});
it("changes isotope and resets elapsed time with a readable table", () => {
  render(<DecaySimulator />);
  fireEvent.change(screen.getByLabelText("Isotope"), {
    target: { value: "I-131" },
  });
  expect(screen.getByText(/Half-life: 8.02 days/)).toBeVisible();
  expect(screen.getByText("Accessible Decay Milestone Table")).toBeVisible();
});
