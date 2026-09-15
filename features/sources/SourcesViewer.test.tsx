import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SourcesViewer } from "./SourcesViewer";

describe("SourcesViewer Component", () => {
  it("renders the sources title, primary principle, and initial source cards", () => {
    render(<SourcesViewer />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Scientific Sources & Bibliography/i,
      }),
    ).toBeDefined();

    expect(
      screen.getByText(/ATOM should never ask users to trust ATOM/i),
    ).toBeDefined();

    // Check key agencies appear
    expect(screen.getAllByText("UNSCEAR").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("IPCC").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("IAEA").length).toBeGreaterThanOrEqual(1);
  });

  it("filters sources accurately by category pill", () => {
    render(<SourcesViewer />);

    // Click "Emissions & Climate"
    const emissionsBtn = screen.getByRole("button", {
      name: /Emissions & Climate/i,
    });
    fireEvent.click(emissionsBtn);

    // IPCC and UNECE should be visible
    expect(screen.getAllByText("IPCC").length).toBeGreaterThanOrEqual(1);

    // Kemeny Commission (reactor safety) should not be visible
    expect(screen.queryByText(/Kemeny Commission/i)).toBeNull();
  });

  it("searches sources dynamically by keyword", () => {
    render(<SourcesViewer />);

    const searchInput = screen.getByPlaceholderText(/Search by publication/i);
    fireEvent.change(searchInput, { target: { value: "Chernobyl" } });

    expect(screen.getAllByText(/Chernobyl/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.queryByText(/Fukushima Daiichi Nuclear Power Station/i),
    ).toBeNull();
  });

  it("provides direct external links with target=_blank for primary verification", () => {
    render(<SourcesViewer />);

    const links = screen.getAllByRole("link", {
      name: /Open primary document for/i,
    });
    expect(links.length).toBeGreaterThanOrEqual(5);

    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });
});
