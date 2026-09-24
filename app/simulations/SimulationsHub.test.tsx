import { expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SimulationsHubClient } from "./SimulationsHubClient";
it("lazy-loads six exhibits and supports roving keyboard tabs", async () => {
  render(<SimulationsHubClient />);
  expect(screen.getAllByRole("tab")).toHaveLength(6);
  expect(
    await screen.findByRole("heading", {
      name: "Annual Electricity Grid Simulator",
    }),
  ).toBeVisible();
  const grid = screen.getByRole("tab", { name: "Annual Grid Balance" });
  fireEvent.keyDown(grid, { key: "ArrowRight" });
  expect(screen.getByRole("tab", { name: "Fission" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(
    await screen.findByRole("heading", { name: "Follow one fission" }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "4. Split" }));
  fireEvent.click(grid);
  fireEvent.click(screen.getByRole("tab", { name: "Fission" }));
  expect(screen.getByText(/Events in this replay: 1/)).toBeVisible();
});
