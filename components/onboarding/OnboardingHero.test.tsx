import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { OnboardingHero } from "./OnboardingHero";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
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

describe("OnboardingHero", () => {
  it("renders the hero headline, interactive slider, and default curious level preview", () => {
    render(<OnboardingHero />);

    expect(screen.getByTestId("atom-stage")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Understand nuclear energy through scientific evidence/i,
      }),
    ).toBeVisible();

    expect(screen.getByText("Level 3: Curious")).toBeVisible();
    expect(
      screen.getByText(/Designed for: Informed Citizens & Critical Thinkers/i),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Enter ATOM as Curious/i }),
    ).toHaveAttribute("href", "/explore");
  });

  it("updates level preview and CTA when slider is changed or chip is clicked", () => {
    render(<OnboardingHero />);

    // Click Beginner chip (button 1)
    const beginnerBtn = screen.getByRole("button", { name: "1. Beginner" });
    fireEvent.click(beginnerBtn);

    expect(screen.getByText("Level 1: Beginner")).toBeVisible();
    expect(
      screen.getByText(/Designed for: Kids & First-Time Learners/i),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Enter ATOM as Beginner/i }),
    ).toBeVisible();

    // Click Geeky chip (button 5)
    const geekyBtn = screen.getByRole("button", { name: "5. Geeky" });
    fireEvent.click(geekyBtn);

    expect(screen.getByText("Level 5: Geeky")).toBeVisible();
    expect(
      screen.getByText(/Designed for: Nuclear Researchers & Data Geeks/i),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Enter ATOM as Geeky/i }),
    ).toBeVisible();
  });
});
