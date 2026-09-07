import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ComparisonPage from "@/app/compare/page";
import { mockComparison } from "@/features/comparison/test-fixtures";

// We mock the API layer so the RSC doesn't hit Supabase during the unit test
vi.mock("@/features/comparison/comparison-api", () => ({
  fetchComparisonData: async () => mockComparison,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/compare",
}));

describe("ComparisonPage", () => {
  it("renders the comparison lab component", async () => {
    const Component = await ComparisonPage({
      searchParams: Promise.resolve({}),
    });
    render(Component);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "See the energy trade-offs",
      }),
    ).toBeVisible();
    expect(screen.getByText("g CO₂e / kWh")).toBeVisible();
  });
});
