import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  ComplexitySelector,
  useComplexityPreference,
} from "./ComplexitySelector";

function SelectorHarness() {
  const [level, setLevel] = useComplexityPreference("curious");

  return <ComplexitySelector value={level} onChange={setLevel} />;
}

function TwoSelectorHarness() {
  const [firstLevel, setFirstLevel] = useComplexityPreference("curious");
  const [secondLevel, setSecondLevel] = useComplexityPreference("curious");

  return (
    <>
      <section aria-label="First complexity control">
        <ComplexitySelector value={firstLevel} onChange={setFirstLevel} />
      </section>
      <section aria-label="Second complexity control">
        <ComplexitySelector value={secondLevel} onChange={setSecondLevel} />
      </section>
    </>
  );
}

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

describe("ComplexitySelector", () => {
  it("shows the default level and exposes every explanation level", () => {
    render(<SelectorHarness />);

    expect(screen.getByText("Curious")).toBeVisible();
    expect(
      screen.getByRole("group", { name: "Complexity level" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Curious" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("changes and persists the selected level across remounts", async () => {
    const first = render(<SelectorHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Technical" }));
    expect(screen.getByText("Technical")).toBeVisible();
    await waitFor(() =>
      expect(
        window.localStorage.getItem("atom:preferences:v1:complexity"),
      ).toBe("technical"),
    );

    first.unmount();
    render(<SelectorHarness />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Technical" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
  });

  it("remains usable when browser storage is unavailable", () => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Storage disabled", "SecurityError");
      },
    });
    render(<SelectorHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Expert" }));

    expect(screen.getByText("Expert")).toBeVisible();
    expect(screen.getByRole("button", { name: "Expert" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("keeps multiple consumers synchronized in the same document", () => {
    render(<TwoSelectorHarness />);
    const first = screen.getByRole("region", {
      name: "First complexity control",
    });
    const second = screen.getByRole("region", {
      name: "Second complexity control",
    });

    fireEvent.click(within(first).getByRole("button", { name: "Expert" }));

    expect(within(first).getByText("Expert")).toBeVisible();
    expect(within(second).getByText("Expert")).toBeVisible();
    expect(
      within(second).getByRole("button", { name: "Expert" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
