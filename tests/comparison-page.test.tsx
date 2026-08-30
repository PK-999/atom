import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ComparisonPage, { metadata } from "@/app/compare/page";

describe("Comparison page", () => {
  it("composes the reviewed visual slice at the public compare route", () => {
    render(<ComparisonPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "See the energy trade-offs",
      }),
    ).toBeVisible();
    expect(metadata.title).toBe("Energy Comparison Lab");
  });
});
