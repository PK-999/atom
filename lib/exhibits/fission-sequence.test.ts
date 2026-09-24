import { describe, expect, it } from "vitest";
import {
  createFissionSequence,
  selectFissionStage,
  stepFissionSequence,
} from "./fission-sequence";

describe("single-event fission sequence", () => {
  it("counts one event even when a learner revisits the split", () => {
    let state = createFissionSequence();
    state = selectFissionStage(state, 3);
    expect(state.events).toBe(1);
    state = selectFissionStage(state, 0);
    state = selectFissionStage(state, 3);
    expect(state.events).toBe(1);
  });
  it("replays the same stages without random or frame-dependent outcomes", () => {
    const run = () =>
      Array.from({ length: 5 }).reduce(
        stepFissionSequence,
        createFissionSequence(),
      );
    expect(run()).toEqual(run());
    expect(run().stage).toBe(3);
    expect(createFissionSequence().events).toBe(0);
  });
});
