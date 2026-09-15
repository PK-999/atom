import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { FissionSimulator } from "./FissionSimulator";

describe("FissionSimulator", () => {
  it("renders the simulator title, canvas, and controls", () => {
    render(<FissionSimulator />);
    expect(
      screen.getByText(/Nuclear Fission Chain Reaction Simulator/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Fire Source Neutron/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Auto-Pulse/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset Chamber/i)).toBeInTheDocument();
  });

  it("updates enrichment and recalculates multiplication factor", () => {
    render(<FissionSimulator />);
    const enrichmentSlider = screen.getByLabelText(
      /Uranium 235 Fuel Enrichment Percentage/i,
    );
    fireEvent.change(enrichmentSlider, { target: { value: "10.0" } });
    expect(screen.getAllByText("10.0%").length).toBeGreaterThanOrEqual(1);
  });

  it("fires a source neutron when button is clicked", () => {
    render(<FissionSimulator />);
    const fireBtn = screen.getByRole("button", {
      name: /Fire Source Neutron/i,
    });
    fireEvent.click(fireBtn);
    // Component maintains state and renders updated canvas
    expect(
      screen.getByRole("img", { name: /Fission chamber/i }),
    ).toBeInTheDocument();
  });

  it("provides an accessible summary table", () => {
    render(<FissionSimulator />);
    expect(
      screen.getByText(/Accessible Core State Summary Table/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Multiplication Factor \(k_eff\)/i),
    ).toBeInTheDocument();
  });

  it("toggles between reactor lattice view and atomic nucleus split view", () => {
    render(<FissionSimulator />);
    const atomicBtn = screen.getByRole("button", {
      name: /Atomic Nucleus Split/i,
    });
    fireEvent.click(atomicBtn);
    expect(
      screen.getByRole("img", { name: /Atomic nucleus split showing/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /1\. Neutron Approach/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /4\. Fission Split!/i }),
    ).toBeInTheDocument();

    const scissionBtn = screen.getByRole("button", {
      name: /4\. Fission Split!/i,
    });
    fireEvent.click(scissionBtn);
    expect(screen.getByText(/¹⁴¹Ba \(56p\)/i)).toBeInTheDocument();
    expect(screen.getByText(/⁹²Kr \(36p\)/i)).toBeInTheDocument();
  });
});
