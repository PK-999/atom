import { expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SimulationsHubClient } from "./SimulationsHubClient";
it("lazy-loads six exhibits and supports roving keyboard tabs", async () => {
  render(<SimulationsHubClient />);
  expect(screen.getAllByRole("tab")).toHaveLength(6);
  expect(
    await screen.findByRole("heading", { name: "Follow one fission" }),
  ).toBeVisible();
  const fission = screen.getByRole("tab", { name: "Fission" });
  fireEvent.keyDown(fission, { key: "ArrowRight" });
  expect(screen.getByRole("tab", { name: "Inside the Atom" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  fireEvent.click(screen.getByRole("tab", { name: "Annual Grid Balance" }));
  expect(
    await screen.findByRole("heading", {
      name: "Annual Electricity Grid Simulator",
    }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("tab", { name: "Fission" }));
  expect(
    screen.getByRole("heading", { name: "Follow one fission" }),
  ).toBeVisible();
});

it("uses an experiment query and gives an honest fallback for unknown ids", async () => {
  window.history.replaceState(null, "", "/simulations?experiment=reactor");
  render(<SimulationsHubClient initialExperiment="reactor" />);
  expect(screen.getByRole("tab", { name: "Reactor Controls" })).toHaveAttribute(
    "aria-selected",
    "true",
  );

  window.history.replaceState(null, "", "/simulations?experiment=not-real");
  render(<SimulationsHubClient initialExperiment="not-real" />);
  expect(screen.getByRole("status")).toHaveTextContent(/not available yet/i);
  expect(screen.getAllByRole("tab", { name: "Fission" })[1]).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
