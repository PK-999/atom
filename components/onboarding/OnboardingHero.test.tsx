import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OnboardingHero } from "./OnboardingHero";
describe("museum homepage", () => {
  it("offers a clear learning action before the interactive exhibit", () => {
    render(<OnboardingHero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Small atoms.*Big questions/,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Start exploring/ }),
    ).toHaveAttribute("href", "/learn");
    expect(
      screen.getByRole("link", { name: "Compare energy" }),
    ).toHaveAttribute("href", "/compare");
  });
  it("supports stepped energy conversion without requiring autoplay", () => {
    render(<OnboardingHero />);
    fireEvent.click(screen.getByRole("button", { name: "3. Motion" }));
    expect(screen.getByText(/Expanding steam turns the turbine/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Step" }));
    expect(
      screen.getByText(/only part of the heat becomes electricity/),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("button", { name: "1. Heat" })).toHaveAttribute(
      "aria-current",
      "step",
    );
  });
});
