import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("platform foundation page", () => {
  it("identifies ATOM and links to the flagship and evidence policy", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "ATOM" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read the evidence policy" }),
    ).toHaveAttribute("href", "/methodology");
    expect(
      screen.getByRole("link", { name: "Open the Comparison Lab" }),
    ).toHaveAttribute("href", "/compare");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Digital Science Museum direction selected",
    );
  });
});
