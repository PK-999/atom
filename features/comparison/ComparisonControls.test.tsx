import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ComparisonControls,
  getRecentMetrics,
  addRecentMetric,
} from "./ComparisonControls";
import { mockComparison, mockInitialState } from "./test-fixtures";

describe("ComparisonControls", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k),
        clear: () => store.clear(),
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    state: {
      ...mockInitialState,
      sources: ["nuclear", "solar", "wind"],
    },
    selectedObservations: mockComparison.observations.slice(0, 3),
    metricShortName: "Lifecycle emissions",
    geography: "Global",
    canonicalUrl: "http://localhost:3000/compare",
    onAddSource: vi.fn(),
    onRemoveSource: vi.fn(),
    onRestoreSources: vi.fn(),
    onMetricChange: vi.fn(),
    onGeographyChange: vi.fn(),
    onModeChange: vi.fn(),
    onUnitsChange: vi.fn(),
    onResetComparison: vi.fn(),
  };

  it("renders selected source chips and triggers removal", () => {
    const onRemoveSource = vi.fn();
    render(
      <ComparisonControls {...defaultProps} onRemoveSource={onRemoveSource} />,
    );

    expect(
      screen.getByRole("button", { name: "Remove Nuclear" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Remove Solar" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Remove Wind" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Remove Solar" }));
    expect(onRemoveSource).toHaveBeenCalledWith("solar");
  });

  it("opens add source dialog and allows selecting an unselected technology", () => {
    const onAddSource = vi.fn();
    render(<ComparisonControls {...defaultProps} onAddSource={onAddSource} />);

    fireEvent.click(screen.getByRole("button", { name: "Add source" }));

    expect(
      screen.getByRole("dialog", { name: "Add Technology" }),
    ).toBeVisible();
    const addHydro = screen.getByRole("button", { name: "Hydro" });
    fireEvent.click(addHydro);

    expect(onAddSource).toHaveBeenCalledWith("hydro");
  });

  it("allows toggling display mode between typical and range", () => {
    const onModeChange = vi.fn();
    render(
      <ComparisonControls {...defaultProps} onModeChange={onModeChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Range" }));
    expect(onModeChange).toHaveBeenCalledWith("range");
  });

  it("recovers safely from corrupt recent metrics in localStorage", () => {
    window.localStorage.setItem("atom_recent_metrics", "{invalid-json");
    expect(getRecentMetrics()).toEqual([]);

    addRecentMetric("land-use");
    expect(getRecentMetrics()).toEqual(["land-use"]);
  });
});
