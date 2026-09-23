import { describe, expect, it, vi } from "vitest";
import {
  createThemePreferenceStore,
  THEME_PREFERENCE_KEY,
} from "./theme-preference";

describe("theme transitions", () => {
  it("resolves cross-tab clear and malformed values using the current system", () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }));
    const store = createThemePreferenceStore();
    const stop = store.subscribe(() => {});
    store.set("light");
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
    expect(store.getSnapshot()).toBe("system");
    expect(store.getResolvedSnapshot()).toBe("dark");
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: THEME_PREFERENCE_KEY,
        newValue: "invalid",
      }),
    );
    expect(store.getSnapshot()).toBe("system");
    stop();
    vi.unstubAllGlobals();
  });
});
