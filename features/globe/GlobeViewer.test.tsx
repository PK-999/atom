import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GlobeViewer } from "./GlobeViewer";
import { CANONICAL_FACILITIES } from "../../lib/globe/facility-model";

describe("GlobeViewer Component (R16-G)", () => {
  it("renders the directory title, map projection, and facility table", () => {
    render(<GlobeViewer facilities={CANONICAL_FACILITIES} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Global Nuclear Facilities Directory/i,
      }),
    ).toBeDefined();

    expect(
      screen.getByRole("img", { name: /World map showing nuclear facility/i }),
    ).toBeDefined();
    expect(
      screen.getByRole("table", { name: /Nuclear Facilities Table/i }),
    ).toBeDefined();
  });

  it("verifies identical map pin and directory table row counts", () => {
    render(<GlobeViewer facilities={CANONICAL_FACILITIES} />);

    // Query pins
    const pins = screen.getAllByRole("button", { name: /Select facility/i });
    expect(pins.length).toBe(CANONICAL_FACILITIES.length);

    // Query table rows in tbody
    const table = screen.getByRole("table", {
      name: /Nuclear Facilities Table/i,
    });
    const tbody = table.querySelector("tbody")!;
    const rows = tbody.querySelectorAll("tr");
    expect(rows.length).toBe(CANONICAL_FACILITIES.length);
  });

  it("filters facilities accurately when country select changes", () => {
    render(<GlobeViewer facilities={CANONICAL_FACILITIES} />);

    const countrySelect = screen.getByLabelText(/Country/i);
    fireEvent.change(countrySelect, { target: { value: "IN" } });

    // Both Kudankulam and Kakrapar should be visible
    expect(
      screen.getAllByText("Kudankulam Nuclear Power Plant").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("Kakrapar Atomic Power Station").length,
    ).toBeGreaterThanOrEqual(1);

    // Olkiluoto should not be in the table
    expect(screen.queryByText("Olkiluoto Nuclear Power Plant")).toBeNull();

    // Reset to all
    fireEvent.change(countrySelect, { target: { value: "all" } });
    expect(
      screen.getAllByText("Olkiluoto Nuclear Power Plant").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("updates inspector with unit breakdown and mixed-status notice on facility selection", () => {
    render(<GlobeViewer facilities={CANONICAL_FACILITIES} />);

    // Click Kudankulam in the table
    const kudankulamElements = screen.getAllByText(
      "Kudankulam Nuclear Power Plant",
    );
    fireEvent.click(kudankulamElements[0]);

    // Inspector header
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Kudankulam Nuclear Power Plant",
      }),
    ).toBeDefined();

    // Mixed status callout
    expect(screen.getByText(/Mixed-Status Multi-Unit Facility/i)).toBeDefined();

    // Individual units
    expect(screen.getByText("Kudankulam 1")).toBeDefined();
    expect(screen.getByText("Kudankulam 3")).toBeDefined();
    expect(screen.getAllByText("VVER-1000").length).toBeGreaterThanOrEqual(2);

    // Source link
    expect(screen.getByText(/IAEA PRIS/i)).toBeDefined();
  });

  it("shows an honest empty state when filter matches zero facilities", () => {
    render(<GlobeViewer facilities={CANONICAL_FACILITIES} />);

    const searchInput = screen.getByLabelText(/Search Name or Type/i);
    fireEvent.change(searchInput, {
      target: { value: "non-existent-search-xyz" },
    });

    expect(
      screen.getByText(/No facilities match the selected filters/i),
    ).toBeDefined();
  });
});
