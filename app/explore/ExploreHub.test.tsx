import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExploreHub } from "./ExploreHub";

beforeEach(() => {
  window.history.replaceState(null, "", "/explore");
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

describe("ExploreHub", () => {
  it("renders one experiment catalog with a clear starting point", () => {
    render(<ExploreHub />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Play with the science/i,
      }),
    ).toBeVisible();

    expect(
      screen.getByText("Start with a question. Try an experiment."),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: "Choose an experiment" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Follow one fission/i }),
    ).toHaveAttribute("href", "/simulations?experiment=fission");
    expect(
      screen.getByRole("link", { name: /Balance a town's annual grid/i }),
    ).toHaveAttribute("href", "/simulations?experiment=grid");
  });

  it("keeps the same starting point with a legacy preference", () => {
    window.localStorage.setItem("atom:preferences:v1:complexity", "beginner");
    render(<ExploreHub />);

    expect(
      screen.getByText("Start with a question. Try an experiment."),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Start with fission/i }),
    ).toBeVisible();
  });
});
