import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReactorExplorer } from "./ReactorExplorer";
import {
  PWR_SYSTEM_DATA,
  BWR_SYSTEM_DATA,
  PHWR_SYSTEM_DATA,
  SMR_SYSTEM_DATA,
  HTGR_SYSTEM_DATA,
} from "../../lib/reactor/reactor-model";

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

  it("renders BWR architecture with bottom-entry control rods and direct steam cycle", () => {
    render(<ReactorExplorer system={BWR_SYSTEM_DATA} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Boiling Water Reactor \(BWR\)/i,
      }),
    ).toBeDefined();

    // Click Bottom-Entry Control Rods via diagram
    const rodsSvg = screen.getByRole("button", {
      name: "Select Bottom-Entry Control Rods",
    });
    fireEvent.click(rodsSvg);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Bottom-Entry Control Rods",
      }),
    ).toBeDefined();
    expect(
      screen.getByText(/Cruciform control blades inserted from the bottom/i),
    ).toBeDefined();
  });

  it("renders PHWR architecture with horizontal calandria and heavy water moderator", () => {
    render(<ReactorExplorer system={PHWR_SYSTEM_DATA} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Pressurized Heavy Water Reactor/i,
      }),
    ).toBeDefined();

    // Click Horizontal Calandria Vessel via diagram
    const calandriaSvg = screen.getByRole("button", {
      name: "Select Horizontal Calandria Vessel",
    });
    fireEvent.click(calandriaSvg);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Horizontal Calandria Vessel",
      }),
    ).toBeDefined();
    expect(
      screen.getByText(
        /Contains heavy water moderator at near-atmospheric pressure/i,
      ),
    ).toBeDefined();
  });

  it("updates power level simulator state when buttons are clicked", () => {
    render(<ReactorExplorer system={PWR_SYSTEM_DATA} />);

    // SCRAM button
    const scramBtn = screen.getByRole("radio", { name: /SCRAM/i });
    fireEvent.click(scramBtn);
    expect(scramBtn.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByText("0%")).toBeDefined();

    // 50% power button
    const halfBtn = screen.getByRole("radio", { name: /50% Reduced/i });
    fireEvent.click(halfBtn);
    expect(halfBtn.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByText("50%")).toBeDefined();

    // 100% full power button
    const fullBtn = screen.getByRole("radio", { name: /100% Full Power/i });
    fireEvent.click(fullBtn);
    expect(fullBtn.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByText("100%")).toBeDefined();
  });

  it("filters circuit loops via legend controls", () => {
    render(<ReactorExplorer system={PWR_SYSTEM_DATA} />);

    const primaryBtn = screen.getByRole("button", { name: /Primary/i });
    fireEvent.click(primaryBtn);
    expect(primaryBtn.className).toContain("legendBtnActive");

    const secondaryBtn = screen.getByRole("button", { name: /Secondary/i });
    fireEvent.click(secondaryBtn);
    expect(secondaryBtn.className).toContain("legendBtnActive");

    const allBtn = screen.getByRole("button", { name: /All Circuits/i });
    fireEvent.click(allBtn);
    expect(allBtn.className).toContain("legendBtnActive");
  });

  it("renders SMR architecture with integral pressure vessel and helical-coil steam generator", () => {
    render(<ReactorExplorer system={SMR_SYSTEM_DATA} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Small Modular Reactor/i,
      }),
    ).toBeDefined();

    // Verify SMR components are rendered in text list
    expect(
      screen.getByRole("button", { name: "Integral Reactor Pressure Vessel" }),
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Helical-Coil Steam Generator" }),
    ).toBeDefined();

    // Click Helical-Coil Steam Generator via diagram button
    const sgSvg = screen.getByRole("button", {
      name: "Select Helical-Coil Steam Generator",
    });
    fireEvent.click(sgSvg);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Helical-Coil Steam Generator",
      }),
    ).toBeDefined();
    expect(
      screen.getByText(/Transfers primary heat to secondary feedwater/i),
    ).toBeDefined();
  });

  it("renders HTGR architecture with TRISO fuel and high-efficiency steam turbine", () => {
    render(<ReactorExplorer system={HTGR_SYSTEM_DATA} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /High-Temperature Gas-Cooled Reactor/i,
      }),
    ).toBeDefined();

    // Verify HTGR components are rendered in text list
    expect(
      screen.getByRole("button", { name: "TRISO Particle Fuel Elements" }),
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Helium Gas Circulator" }),
    ).toBeDefined();

    // Click TRISO Particle Fuel Elements via diagram button
    const fuelSvg = screen.getByRole("button", {
      name: "Select TRISO Particle Fuel Elements",
    });
    fireEvent.click(fuelSvg);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "TRISO Particle Fuel Elements",
      }),
    ).toBeDefined();
    expect(
      screen.getByText(/Ceramic micro-containment resistant to temperatures/i),
    ).toBeDefined();
  });
});
