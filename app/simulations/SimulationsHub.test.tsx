import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { SimulationsHubClient } from "./SimulationsHubClient";

describe("SimulationsHubClient", () => {
  it("renders all four simulation tabs and defaults to Annual Grid Dispatch", () => {
    render(<SimulationsHubClient />);
    expect(
      screen.getByRole("heading", {
        name: /Nuclear & Energy Simulations/i,
        level: 1,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("tab", { name: /Annual Grid Dispatch/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Fission Chain Reaction/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Radioactive Decay & Half-Life/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Reactor Core & SCRAM/i }),
    ).toBeInTheDocument();

    // Default tab is Grid simulator
    expect(
      screen.getAllByText(/Annual Electricity Grid Simulator/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("switches tabs to Fission Chain Reaction Simulator", () => {
    render(<SimulationsHubClient />);
    const fissionTab = screen.getByRole("tab", {
      name: /Fission Chain Reaction/i,
    });
    fireEvent.click(fissionTab);

    expect(
      screen.getByText(/Nuclear Fission Chain Reaction Simulator/i),
    ).toBeInTheDocument();
  });

  it("switches tabs to Radioactive Decay Simulator", () => {
    render(<SimulationsHubClient />);
    const decayTab = screen.getByRole("tab", {
      name: /Radioactive Decay & Half-Life/i,
    });
    fireEvent.click(decayTab);

    expect(
      screen.getByText(/Radioactive Decay & Half-Life Simulator/i),
    ).toBeInTheDocument();
  });

  it("switches tabs to Reactor Core & SCRAM Simulator", () => {
    render(<SimulationsHubClient />);
    const reactorTab = screen.getByRole("tab", {
      name: /Reactor Core & SCRAM/i,
    });
    fireEvent.click(reactorTab);

    expect(
      screen.getByText(/Commercial Reactor Core & Control Rod Simulator/i),
    ).toBeInTheDocument();
  });
});
