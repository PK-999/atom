import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GridSimulator } from "./GridSimulator";
import { getDefaultScenario } from "../../lib/simulator/grid-model";

describe("GridSimulator Component (R17)", () => {
  it("renders default scenario metrics and controls", () => {
    render(<GridSimulator initialScenario={getDefaultScenario()} />);

    expect(
      screen.getByRole("heading", {
        name: /Annual Electricity Grid Simulator/i,
      }),
    ).toBeDefined();

    expect(screen.getByText("Annual Energy Coverage")).toBeDefined();
    expect(screen.getByText("Grid Carbon Intensity")).toBeDefined();
    expect(screen.getAllByText(/50.00 TWh/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/8760 Hours \(Standard Year\)/i)).toBeDefined();
  });

  it("switches preset scenarios smoothly", () => {
    render(<GridSimulator initialScenario={getDefaultScenario()} />);

    const select = screen.getByLabelText(/Load Scenario:/i);
    fireEvent.change(select, { target: { value: "nuclear-firm-base" } });

    // In nuclear-firm-base, nuclear capacity is 5000 MW
    expect(screen.getAllByText(/5,000 MW/i).length).toBeGreaterThanOrEqual(1);
  });

  it("updates hours when calendar year is changed to leap year", () => {
    render(<GridSimulator initialScenario={getDefaultScenario()} />);

    const yearInput = screen.getByLabelText(/Year:/i);
    fireEvent.change(yearInput, { target: { value: "2024" } });

    expect(screen.getByText(/8784 Hours \(Leap Year\)/i)).toBeDefined();
  });

  it("recalculates metrics when annual demand is updated", () => {
    render(<GridSimulator initialScenario={getDefaultScenario()} />);

    const demandSlider = screen.getByLabelText(/Annual Demand Slider in MWh/i);
    fireEvent.change(demandSlider, { target: { value: "80000000" } });

    expect(screen.getByText(/80.0 TWh\/year/i)).toBeDefined();
  });

  it("recalculates generation when capacity is updated", () => {
    render(<GridSimulator initialScenario={getDefaultScenario()} />);

    const nuclearSlider = screen.getByLabelText(
      /Nuclear Power Capacity Slider in MW/i,
    );
    fireEvent.change(nuclearSlider, { target: { value: "5000" } });

    expect(screen.getAllByText(/5,000 MW/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders educational disclaimer on annual balance vs real-time reliability", () => {
    render(<GridSimulator initialScenario={getDefaultScenario()} />);

    expect(
      screen.getByRole("region", {
        name: /Core Concept: Annual Energy Balance ≠ Real-Time Hourly Reliability/i,
      }),
    ).toBeDefined();

    expect(
      screen.getByText(/Hourly Intermittency & The "Dunkelflaute"/i),
    ).toBeDefined();
    expect(
      screen.getByText(/Mechanical Grid Inertia & Frequency/i),
    ).toBeDefined();
    expect(screen.getByText(/Seasonal Storage Requirements/i)).toBeDefined();
  });
});
