import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AskAtom } from "./AskAtom";

describe("AskAtom Component (R18)", () => {
  it("renders search bar and suggested topics in empty state", () => {
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

    expect(
      screen.queryByRole("button", { name: "Technical" }),
    ).not.toBeInTheDocument();
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

  it("shows an initial question with its single explanation", () => {
    render(
      <AskAtom initialQuery="What is the carbon footprint of nuclear energy?" />,
    );
    expect(screen.getByLabelText(/Ask a question/)).toHaveValue(
      "What is the carbon footprint of nuclear energy?",
    );
    expect(
      screen.getByText(
        /Compare emissions across the full electricity lifecycle/,
      ),
    ).toBeVisible();
  });
});
