import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { NationalProfile } from "./NationalProfile";
import { getIndiaProfile } from "../../lib/national/national-model";

describe("NationalProfile Component", () => {
  const profile = getIndiaProfile();

  it("renders country header and metadata", () => {
    render(<NationalProfile profile={profile} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /India Energy & Nuclear Profile/i,
      }),
    ).toBeDefined();
    expect(screen.getByText(/Fiscal Year 2023-24/i)).toBeDefined();
    expect(
      screen.getAllByText(/Central Electricity Authority/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders domestic context and policy section", () => {
    render(<NationalProfile profile={profile} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Strategic Context & Resource Endowment/i,
      }),
    ).toBeDefined();
    expect(screen.getByText(/three-stage fuel cycle/i)).toBeDefined();
  });

  it("renders reactor fleet status cards with correct numbers", () => {
    render(<NationalProfile profile={profile} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Commercial Reactor Fleet Status/i,
      }),
    ).toBeDefined();
    expect(screen.getByText("24")).toBeDefined();
    expect(screen.getByText("8,180 MWe")).toBeDefined();
    expect(screen.getByText("8")).toBeDefined();
    expect(screen.getByText("6,800 MWe")).toBeDefined();
    expect(screen.getByText("10")).toBeDefined();
  });

  it("renders capacity vs generation comparison table with energy literacy insight", () => {
    render(<NationalProfile profile={profile} />);

    expect(
      screen.getByRole("region", {
        name: /Capacity versus generation insight/i,
      }),
    ).toBeDefined();
    const table = screen.getByRole("table", {
      name: /India Electricity Capacity and Generation Breakdown/i,
    });
    expect(table).toBeDefined();

    // Check nuclear row numbers inside table
    const tableScope = within(table);
    expect(tableScope.getByText("Nuclear")).toBeDefined();
    expect(tableScope.getByText("1.85%")).toBeDefined();
    expect(tableScope.getByText("2.75%")).toBeDefined();

    // Check solar row numbers inside table
    expect(tableScope.getByText("Solar PV")).toBeDefined();
    expect(tableScope.getByText("18.47%")).toBeDefined();
    expect(tableScope.getByText("6.67%")).toBeDefined();
  });

  it("renders all 3 stages of the Bhabha nuclear programme", () => {
    render(<NationalProfile profile={profile} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Bhabha Three-Stage Nuclear Programme/i,
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Stage 1: Pressurized Heavy Water Reactors/i,
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Stage 2: Fast Breeder Reactors/i,
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Stage 3: Advanced Thorium Reactors/i,
      }),
    ).toBeDefined();

    // Checks fuel breeding flow
    expect(screen.getByText(/Plutonium-239 in spent fuel/i)).toBeDefined();
    expect(
      screen.getByText(/Uranium-233 bred from Thorium-232/i),
    ).toBeDefined();
    expect(screen.getByText(/monazite thorium reserves/i)).toBeDefined();
  });

  it("renders 2050/future target scenarios and citations", () => {
    render(<NationalProfile profile={profile} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Long-Term Capacity Targets & Net Zero Scenarios/i,
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /2032 Horizon: 22.4 GW Nuclear Target/i,
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /2047 Horizon: 100 GW Nuclear Target/i,
      }),
    ).toBeDefined();

    // Check citations
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Primary Official Sources/i,
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: /Executive Summary of Power Sector/i }),
    ).toBeDefined();
  });
});
