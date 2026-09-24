import { expect, it } from "vitest";
import { sampleDecayPopulation } from "./decay-population";
it("replays the same seeded population independent of step size", () => {
  const afterOne = sampleDecayPopulation(100, 1, 42);
  expect(afterOne).toEqual(sampleDecayPopulation(100, 1, 42));
  expect(sampleDecayPopulation(100, 0, 42).filter(Boolean)).toHaveLength(100);
  expect(afterOne.filter(Boolean).length).toBeGreaterThan(30);
  expect(afterOne.filter(Boolean).length).toBeLessThan(70);
  const later = sampleDecayPopulation(100, 2, 42);
  expect(later.every((alive, i) => !alive || afterOne[i])).toBe(true);
});
