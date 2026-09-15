import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MythViewer } from "./MythViewer";

beforeEach(() => {
  window.history.replaceState(null, "", "/myths");
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

describe("MythViewer", () => {
  it("renders page header, search bar, category pills, and default myths", () => {
    render(<MythViewer />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Nuclear Myth Busting/i,
      }),
    ).toBeVisible();

    expect(
      screen.getByRole("searchbox", { name: "Search myths" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "All Myths (8)" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Nuclear Waste" })).toBeVisible();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /“A nuclear reactor can explode like an atomic bomb\.”/i,
      }),
    ).toBeVisible();
  });

  it("filters myths by category pill", () => {
    render(<MythViewer />);

    const wasteBtn = screen.getByRole("button", { name: "Nuclear Waste" });
    fireEvent.click(wasteBtn);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /“Nuclear waste has no solution and will remain lethal for millions of years\.”/i,
      }),
    ).toBeVisible();

    expect(
      screen.queryByText(
        /“A nuclear reactor can explode like an atomic bomb\.”/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("searches myths by keyword", () => {
    render(<MythViewer />);

    const searchInput = screen.getByRole("searchbox", { name: "Search myths" });
    fireEvent.change(searchInput, { target: { value: "banana" } });

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /“Living near a nuclear power plant exposes you to dangerous radiation doses\.”/i,
      }),
    ).toBeVisible();

    expect(
      screen.queryByText(
        /“A nuclear reactor can explode like an atomic bomb\.”/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("toggles card expand/collapse and adapts to complexity level", () => {
    window.localStorage.setItem("atom:preferences:v1:complexity", "beginner");
    render(<MythViewer />);

    expect(
      screen.getByText(
        /Bombs require super-concentrated weapons-grade uranium/i,
      ),
    ).toBeVisible();

    // Click card to collapse
    const cardHeader = screen.getAllByRole("button", { expanded: true })[0];
    fireEvent.click(cardHeader);

    expect(
      screen.queryByText(
        /Bombs require super-concentrated weapons-grade uranium/i,
      ),
    ).not.toBeInTheDocument();
  });
});
