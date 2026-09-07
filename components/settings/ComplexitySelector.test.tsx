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

  it("updates the URL when storage is blocked and preserves other parameters", () => {
    window.history.replaceState(null, "", "/compare?metric=land-use");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Storage disabled", "SecurityError");
      },
    });
    render(<SelectorHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Expert" }));

    const params = new URLSearchParams(window.location.search);
    expect(params.get("metric")).toBe("land-use");
    expect(params.get("level")).toBe("expert");
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

  it("gives a valid URL level precedence and preserves unrelated parameters", async () => {
    window.localStorage.setItem("atom:preferences:v1:complexity", "simple");
    window.history.replaceState(
      null,
      "",
      "/compare?metric=land-use&level=expert",
    );

    render(<SelectorHarness />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Expert" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Technical" }));

    const params = new URLSearchParams(window.location.search);
    expect(params.get("level")).toBe("technical");
    expect(params.get("metric")).toBe("land-use");
  });

  it("falls back to the stored preference when the URL level is invalid", async () => {
    window.localStorage.setItem("atom:preferences:v1:complexity", "simple");
    window.history.replaceState(null, "", "/compare?level=unknown");

    render(<SelectorHarness />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Simple" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
  });

  it("responds to browser history changes without reloading", async () => {
    window.history.replaceState(null, "", "/compare?level=curious");
    render(<SelectorHarness />);

    window.history.pushState(null, "", "/compare?level=kid");
    window.dispatchEvent(new PopStateEvent("popstate"));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Kid" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
  });

  it("accepts a cross-tab storage change only when the URL omits level", async () => {
    render(<SelectorHarness />);

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "atom:preferences:v1:complexity",
        newValue: "expert",
      }),
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Expert" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
  });

  it("keeps an explicit URL level authoritative during cross-tab changes", async () => {
    window.history.replaceState(null, "", "/compare?level=technical");
    render(<SelectorHarness />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Technical" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "atom:preferences:v1:complexity",
        newValue: "kid",
      }),
    );

    expect(screen.getByRole("button", { name: "Technical" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
