import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DesignSystemPage from "@/app/design-system/page";

describe("design system playground page", () => {
  it("renders every Stage 4 primitive family inside the shared shell", () => {
    render(<DesignSystemPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "ATOM component playground",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Controls and overlays" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Evidence primitives" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Chart primitives" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "System states" }),
    ).toBeVisible();
    expect(screen.getByText(/synthetic interface geometry/i)).toBeVisible();
    expect(
      screen.getByRole("figure", { name: "Synthetic comparison" }),
    ).toBeVisible();
    expect(screen.getByText("Published evidence")).toBeVisible();
    expect(screen.getByRole("contentinfo")).toBeVisible();
  });
});
