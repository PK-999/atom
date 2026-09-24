import { afterEach, expect, it } from "vitest";
import { createComplexityPreferenceStore } from "./complexity-preference";
afterEach(() => {
  history.replaceState(null, "", "/");
});
it("catches up after an Activity-hidden exhibit subscribes again", () => {
  const exhibit = createComplexityPreferenceStore("curious");
  const shell = createComplexityPreferenceStore("curious");
  const leave = exhibit.subscribe(() => {});
  leave();
  shell.set("deep-dive");
  const returnToExhibit = exhibit.subscribe(() => {});
  expect(exhibit.getSnapshot()).toBe("deep-dive");
  returnToExhibit();
});
