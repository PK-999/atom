import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { HowItWorksViewer } from "./HowItWorksViewer";

beforeEach(() => {
  window.history.replaceState(null, "", "/how-it-works");
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

describe("HowItWorksViewer", () => {
  it("renders page title, 5 step tabs, step 1 content, and visual diagram", () => {
    render(<HowItWorksViewer />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /How Nuclear Energy Works/i,
      }),
    ).toBeVisible();

    expect(
      screen.getByRole("button", { name: "Step 1: The Atom & Density" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Step 2: Fission Mechanics" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Step 3: Chain Reactions" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Step 4: Thermal to Electricity" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Step 5: Safety Barriers" }),
    ).toBeVisible();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /1\. The Atomic Nucleus & Extreme Energy Density/i,
      }),
    ).toBeVisible();

    expect(screen.getAllByText(/500,000/)[0]).toBeVisible();
  });

  it("navigates through steps using tabs and next/previous buttons", () => {
    render(<HowItWorksViewer />);

    // Click Next button
    const nextBtn = screen.getByRole("button", {
      name: /Next: Fission Mechanics →/i,
    });
    fireEvent.click(nextBtn);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /2\. Induced Nuclear Fission: Splitting the Nucleus/i,
      }),
    ).toBeVisible();

    // Click step 4 tab
    const step4Tab = screen.getByRole("button", {
      name: "Step 4: Thermal to Electricity",
    });
    fireEvent.click(step4Tab);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /4\. The Three Isolated Loops: Turning Heat into Clean Power/i,
      }),
    ).toBeVisible();
  });

  it("adapts explanation depth based on stored complexity level", () => {
    window.localStorage.setItem("atom:preferences:v1:complexity", "beginner");
    render(<HowItWorksViewer />);

    expect(
      screen.getByText(
        /Everything around us is made of tiny LEGO blocks called atoms/i,
      ),
    ).toBeVisible();
  });
});
