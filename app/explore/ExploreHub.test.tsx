import { fireEvent, render, screen } from "@testing-library/react";
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
  it("renders the hub header, complexity selector, and 4 major educational sections", () => {
    render(<ExploreHub />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Explore ATOM: Curious/i,
      }),
    ).toBeVisible();

    expect(
      screen.getByText(
        "Curious Citizen Track: Deep Evidence & Real Trade-Offs",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /How Nuclear Energy Works/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Global Reactor Fleet & Grid Systems/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Myths, Incidents & Safety Evidence/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Scientific Comparison & Debate/i,
      }),
    ).toBeVisible();
  });

  it("renders highlight track according to stored complexity preference", () => {
    window.localStorage.setItem("atom:preferences:v1:complexity", "beginner");
    render(<ExploreHub />);

    expect(
      screen.getByText("Beginner Track: Fun Analogies & Visual Wonders"),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Start with Atomic Basics/i }),
    ).toBeVisible();
  });
});
