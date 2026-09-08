import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReactorExplorer } from "./ReactorExplorer";
import { PWR_SYSTEM_DATA } from "../../lib/reactor/reactor-model";

describe("ReactorExplorer Component (R15)", () => {
  it("renders the reactor title, summary, and plant schematic", () => {
    render(<ReactorExplorer system={PWR_SYSTEM_DATA} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Pressurized Water Reactor \(PWR\)/i,
      }),
    ).toBeDefined();

    expect(screen.getByText(/Interactive Plant Schematic/i)).toBeDefined();
  });

  it("renders a labeled text control for every component with diagram equivalence", () => {
    render(<ReactorExplorer system={PWR_SYSTEM_DATA} />);

    for (const comp of PWR_SYSTEM_DATA.components) {
      const button = screen.getByRole("button", { name: comp.name });
      expect(button).toBeDefined();
    }
  });

  it("produces identical selection state from button click and diagram click", () => {
    render(<ReactorExplorer system={PWR_SYSTEM_DATA} />);

    // Click "Steam Generator" via text button
    const steamGenBtn = screen.getByRole("button", { name: "Steam Generator" });
    fireEvent.click(steamGenBtn);

    expect(
      screen.getByRole("heading", { level: 3, name: "Steam Generator" }),
    ).toBeDefined();
    expect(
      screen.getByText(/Transfers primary heat to secondary water/i),
    ).toBeDefined();

    // Click "Reactor Pressure Vessel" via diagram SVG button
    const vesselSvgBtn = screen.getByRole("button", {
      name: "Select Reactor Pressure Vessel (RPV)",
    });
    fireEvent.click(vesselSvgBtn);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Reactor Pressure Vessel (RPV)",
      }),
    ).toBeDefined();
  });

  it("switches between simple, standard, and technical explanation tiers", () => {
    render(<ReactorExplorer system={PWR_SYSTEM_DATA} />);

    // Select Reactor Pressure Vessel
    const vesselBtn = screen.getByRole("button", {
      name: "Reactor Pressure Vessel (RPV)",
    });
    fireEvent.click(vesselBtn);

    // Initial is standard
    expect(
      screen.getByText(/A thick forged carbon-steel vessel/i),
    ).toBeDefined();

    // Switch to Simpler (L1-L2)
    const simplerTab = screen.getByRole("tab", { name: /Simple/i });
    fireEvent.click(simplerTab);
    expect(
      screen.getByText(/A gigantic, super-strong steel container/i),
    ).toBeDefined();

    // Switch to Technical (L4-L5)
    const deeperTab = screen.getByRole("tab", { name: /Technical/i });
    fireEvent.click(deeperTab);
    expect(
      screen.getByText(
        /Fabricated from low-alloy manganese-molybdenum-nickel steel/i,
      ),
    ).toBeDefined();
  });

  it("displays connected flows with operating temperature and pressure", () => {
    render(<ReactorExplorer system={PWR_SYSTEM_DATA} />);

    const steamGenBtn = screen.getByRole("button", { name: "Steam Generator" });
    fireEvent.click(steamGenBtn);

    expect(screen.getByText(/Connected Heat & Fluid Flows/i)).toBeDefined();
    expect(screen.getByText(/Primary Hot Leg/i)).toBeDefined();
    expect(screen.getByText(/325°C/i)).toBeDefined();
    expect(screen.getAllByText(/15.5 MPa/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders commercial deployed examples", () => {
    render(<ReactorExplorer system={PWR_SYSTEM_DATA} />);

    expect(screen.getByText(/Westinghouse AP1000/i)).toBeDefined();
    expect(screen.getByText(/Framatome EPR/i)).toBeDefined();
  });
});
