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

  it("displays verified city and stateProvince in inspector and directory table, with popup retired", () => {
    render(<GlobeViewer facilities={CANONICAL_FACILITIES} />);

    // Check Kudankulam's city/state appears in inspector and directory table (popup retired)
    const kudankulamLocations = screen.getAllByText(/Radhapuram, Tamil Nadu/i);
    expect(kudankulamLocations.length).toBe(2);

    // Verify popup region is retired and no longer rendered
    expect(screen.queryByLabelText(/Facility details for/i)).toBeNull();

    // Check Kakrapar's city/state appears in directory table
    const kakraparLocations = screen.getAllByText(/Vyara, Gujarat/i);
    expect(kakraparLocations.length).toBeGreaterThanOrEqual(1);

    // Switch to 2D view and click Kakrapar pin
    const mode2DBtn = screen.getByRole("button", { name: /2D Map/i });
    fireEvent.click(mode2DBtn);

    const pin = screen.getAllByRole("button", { name: /Select facility/i })[1];
    fireEvent.click(pin);

    // Kakrapar selected: now appears in inspector and table
    expect(screen.getAllByText(/Vyara, Gujarat/i).length).toBe(2);
  });

  it("sets unified 320% focus zoom level on facility selection in both 2D and 3D", () => {
    render(<GlobeViewer facilities={CANONICAL_FACILITIES} />);

    // Initially at 100%
    expect(screen.getByText("100%")).toBeDefined();

    // Click Kakrapar in table
    const kakraparRow = screen.getAllByText("Kakrapar Atomic Power Station")[0];
    fireEvent.click(kakraparRow);

    // Zoom badge should reach unified 320%
    expect(screen.getByText("320%")).toBeDefined();

    // Switch to 2D view and click Kudankulam pin
    const mode2DBtn = screen.getByRole("button", { name: /2D Map/i });
    fireEvent.click(mode2DBtn);

    const pin = screen.getAllByRole("button", { name: /Select facility/i })[0];
    fireEvent.click(pin);

    // Both reach the exact same 320% zoom level
    expect(screen.getByText("320%")).toBeDefined();
  });

  it("prevents browser default page scroll on wheel zoom over the map", () => {
    render(<GlobeViewer facilities={CANONICAL_FACILITIES} />);

    // Switch to 2D view
    const mode2DBtn = screen.getByRole("button", { name: /2D Map/i });
    fireEvent.click(mode2DBtn);

    const svg = screen.getByRole("img", {
      name: /World map showing nuclear facility/i,
    });
    const wheelEvent = new WheelEvent("wheel", {
      deltaY: -100,
      cancelable: true,
      bubbles: true,
    });
    const dispatched = svg.dispatchEvent(wheelEvent);

    // dispatchEvent returns false if event was preventDefault'd
    expect(dispatched).toBe(false);
  });
});
