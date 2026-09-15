import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DecaySimulator } from "./DecaySimulator";

describe("DecaySimulator", () => {
  it("renders isotope selection tabs and lattice", () => {
    render(<DecaySimulator />);
    expect(
      screen.getByText(/Radioactive Decay & Half-Life Simulator/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Cesium-137/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Iodine-131/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Carbon-14/i).length).toBeGreaterThanOrEqual(1);
  });

  it("switches isotopes and updates dossier and chart", () => {
    render(<DecaySimulator />);
    const iodineTab = screen.getByRole("tab", { name: /¹³¹I/i });
    fireEvent.click(iodineTab);
    expect(
      screen.getByText(/Iodine-131 \(¹³¹I\) — Scientific Dossier/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/8.02 days/i).length).toBeGreaterThanOrEqual(1);
  });

  it("advances decay when step button is clicked", () => {
    render(<DecaySimulator />);
    const stepBtn = screen.getByRole("button", {
      name: /Advance 1 Half-Life/i,
    });
    fireEvent.click(stepBtn);
    expect(screen.getByText("1.0 t½")).toBeInTheDocument();
  });

  it("provides accessible tabular summary table", () => {
    render(<DecaySimulator />);
    expect(
      screen.getByText(/Accessible Decay Milestone Table/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/1 t½ \(1st Half-Life\)/i)).toBeInTheDocument();
  });

  it("renders the Geiger-Müller survey meter with CPM readout and gauge", () => {
    render(<DecaySimulator />);
    expect(screen.getByText(/ATOM-GM 2026 SURVEYOR/i)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Analog Geiger meter gauge/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/CPM/i).length).toBeGreaterThanOrEqual(1);
  });

  it("toggles Geiger audio clicker and adjusts volume", () => {
    render(<DecaySimulator />);
    const audioBtn = screen.getByRole("button", {
      name: /Enable Geiger audio clicks/i,
    });
    expect(audioBtn).toHaveTextContent("🔇 Audio Muted");

    fireEvent.click(audioBtn);
    expect(audioBtn).toHaveTextContent("🔊 Audio On");

    const volumeSlider = screen.getByLabelText(/Geiger Clicker Volume/i);
    fireEvent.change(volumeSlider, { target: { value: "0.8" } });
    expect(volumeSlider).toHaveValue("0.8");
  });

  it("supports switching to Radon-222 from the Uranium decay chain", () => {
    render(<DecaySimulator />);
    const radonTab = screen.getByRole("tab", { name: /²²²Rn/i });
    fireEvent.click(radonTab);
    expect(screen.getAllByText(/Radon-222/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/3.82 days/i).length).toBeGreaterThanOrEqual(1);
  });
});
