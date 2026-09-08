import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AskAtom } from "./AskAtom";

describe("AskAtom Component (R18)", () => {
  it("renders search bar, level selector, and suggested topics in empty state", () => {
    render(<AskAtom />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Ask ATOM/i }),
    ).toBeDefined();
    expect(
      screen.getByLabelText(/Ask a question about nuclear energy/i),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Ask" })).toBeDefined();

    // Check empty state
    expect(screen.getByText(/Peer-Reviewed Evidence Q&A/i)).toBeDefined();

    // Check level buttons
    expect(screen.getByRole("button", { name: "Simple" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Standard" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Technical" })).toBeDefined();
  });

  it("submits a question and displays answered state with citations", () => {
    render(<AskAtom />);

    const input = screen.getByLabelText(/Ask a question about nuclear energy/i);
    fireEvent.change(input, {
      target: { value: "What is the carbon footprint of nuclear energy?" },
    });

    const submitBtn = screen.getByRole("button", { name: "Ask" });
    fireEvent.click(submitBtn);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Synthesized Evidence Answer/i,
      }),
    ).toBeDefined();
    expect(
      screen.getAllByText(/12 gCO2eq\/kWh/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Resolved Citations/i)).toBeDefined();
    expect(screen.getAllByText(/IPCC/i).length).toBeGreaterThanOrEqual(1);
  });

  it("displays abstention box on unsupported queries", () => {
    render(<AskAtom />);

    const input = screen.getByLabelText(/Ask a question about nuclear energy/i);
    fireEvent.change(input, {
      target: { value: "Tell me how to build an atomic weapon" },
    });

    const submitBtn = screen.getByRole("button", { name: "Ask" });
    fireEvent.click(submitBtn);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Evidence Boundary Abstention/i,
      }),
    ).toBeDefined();
    expect(
      screen.getByText(
        /ATOM does not currently have verified peer-reviewed scientific evidence/i,
      ),
    ).toBeDefined();
  });

  it("switches explanation levels reactively", () => {
    render(
      <AskAtom initialQuery="What is the carbon footprint of nuclear energy?" />,
    );

    // Switch to Simple
    const simpleBtn = screen.getByRole("button", { name: "Simple" });
    fireEvent.click(simpleBtn);

    expect(
      screen.getByText(/does not burn anything to create heat/i),
    ).toBeDefined();

    // Switch to Technical
    const technicalBtn = screen.getByRole("button", { name: "Technical" });
    fireEvent.click(technicalBtn);

    expect(screen.getByText(/Harmonized LCA methods/i)).toBeDefined();
  });
});
