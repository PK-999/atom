import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("platform foundation page", () => {
  it("identifies ATOM and links to the evidence policy", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "ATOM" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read the evidence policy" }),
    ).toHaveAttribute("href", "/methodology");
  });
});
