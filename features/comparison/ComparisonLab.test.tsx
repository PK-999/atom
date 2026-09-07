import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { vi } from "vitest";

import { ComparisonLab } from "./ComparisonLab";
import { mockComparison, mockInitialState } from "./test-fixtures";
import { COMPLEXITY_PREFERENCE_KEY } from "@/lib/preferences/complexity-preference";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/compare",
}));

beforeEach(() => {
  const values = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: (index: number) => [...values.keys()][index] ?? null,
      get length() {
        return values.size;
      },
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    } satisfies Storage,
  });
});
afterEach(() => {
  cleanup();
  mockPush.mockClear();
});

describe("ComparisonLab", () => {
  it("uses a stored level when the URL omits level for display and serialization", async () => {
    window.history.replaceState(null, "", "/compare");
    window.localStorage.setItem(COMPLEXITY_PREFERENCE_KEY, "expert");

    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={mockInitialState}
      />,
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Expert" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
    expect(
      screen.getByText(/These interface values are not a published synthesis/),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Range" }));

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("level=expert"),
      expect.anything(),
    );
  });

  it("keeps an explicit URL level authoritative over stored preference", async () => {
    window.history.replaceState(null, "", "/compare?level=technical");
    window.localStorage.setItem(COMPLEXITY_PREFERENCE_KEY, "expert");

    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={{ ...mockInitialState, level: "technical" }}
      />,
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Technical" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
    expect(
      screen.getByText(/The representative values differ substantially/),
    ).toBeVisible();
  });

  it("renders the useful default with direct values, units, and an honest evidence state", () => {
    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={mockInitialState}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "See the energy trade-offs",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("g CO₂e / kWh")).toBeInTheDocument();
    expect(screen.getByText("Evidence review pending")).toBeVisible();
    expect(
      screen.getByText(/preview data for interface development/i),
    ).toBeVisible();
    const summary = screen.getByRole("list", {
      name: "Accessible comparison summary",
    });
    expect(
      within(summary).getByText(/Nuclear: 12 g CO₂e \/ kWh/),
    ).toBeVisible();
  });

  it("removes a source while preserving the remaining comparison", () => {
    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={mockInitialState}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove Coal" }));

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("sources=nuclear%2Csolar%2Cwind%2Cgas"),
      expect.anything(),
    );
  });

  it("opens the compact source picker without duplicating source controls", () => {
    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={mockInitialState}
      />,
    );
    const sourcePicker = screen.getByRole("button", {
      name: "5 technologies selected",
    });

    expect(sourcePicker).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(sourcePicker);

    expect(sourcePicker).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getAllByRole("button", { name: "Remove Nuclear" }),
    ).toHaveLength(1);
  });

  it("calls router.push when complexity changes", () => {
    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={mockInitialState}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Technical" }));

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("level=technical"),
      expect.anything(),
    );
  });

  it("explains unavailable evidence instead of interpreting typical values", () => {
    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={{ ...mockInitialState, mode: "range" }}
      />,
    );

    expect(
      screen.getByText(/reviewed range evidence is not available/i),
    ).toBeVisible();
    expect(
      screen.queryByText(/fossil fuel estimates are much higher/i),
    ).not.toBeInTheDocument();
  });

  it("provides a table with the same typical values and units", () => {
    // We can simulate state changes if they are local. The table view is still local state.
    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={mockInitialState}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Table view" }));

    const table = screen.getByRole("table", {
      name: "Lifecycle greenhouse-gas emissions comparison",
    });
    expect(within(table).getByText("Nuclear")).toBeVisible();
    expect(within(table).getByText("12")).toBeVisible();
    expect(within(table).getAllByText("g CO₂e / kWh")).toHaveLength(5);
  });

  it("opens evidence details without hover and restores focus when closed", async () => {
    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={mockInitialState}
      />,
    );
    const trigger = screen.getByRole("button", {
      name: "Explore the evidence",
    });

    trigger.focus();
    fireEvent.click(trigger);

    expect(
      screen.getByRole("dialog", { name: "Why this number?" }),
    ).toBeVisible();
    expect(screen.getByText("Not yet published")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Close evidence" }));
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("opens the passport for an individual displayed value", () => {
    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={mockInitialState}
      />,
    );

    const solarValue = screen.getByRole("button", {
      name: "Inspect evidence for Solar",
    });
    expect(solarValue).toHaveTextContent("40");
    fireEvent.click(solarValue);

    const dialog = screen.getByRole("dialog", { name: "Why this number?" });
    expect(within(dialog).getByText("Solar")).toBeVisible();
  });

  it("uses a distinct honest state for challenging a preview value", () => {
    render(
      <ComparisonLab
        comparison={mockComparison}
        initialState={mockInitialState}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Challenge this number" }),
    );

    expect(
      screen.getByRole("dialog", { name: "Challenge this number" }),
    ).toBeVisible();
    expect(
      screen.getByText(/challenge workflow will open after evidence review/i),
    ).toBeVisible();
  });
});
