import { describe, expect, it } from "vitest";

import {
  EXPERIMENTS,
  getPrimaryNavigation,
  parseExperimentId,
  toExperimentHref,
} from "./catalog";

describe("navigation catalog", () => {
  it("exposes only released experiments in stable order", () => {
    expect(EXPERIMENTS.map((experiment) => experiment.id)).toEqual([
      "fission",
      "atom",
      "fuel",
      "decay",
      "reactor",
      "grid",
    ]);
    expect(EXPERIMENTS.every((experiment) => experiment.released)).toBe(true);
  });

  it("keeps India out of primary navigation until its release gate is open", () => {
    expect(getPrimaryNavigation().map((item) => item.id)).toEqual([
      "learn",
      "play",
      "myths",
    ]);
    expect(
      getPrimaryNavigation({ indiaReleased: true }).map((item) => item.id),
    ).toContain("india");
  });

  it("falls back helpfully for unknown experiment selections", () => {
    expect(parseExperimentId("fission")).toEqual({ id: "fission" });
    expect(parseExperimentId("unknown")).toEqual({
      id: "fission",
      fallback: true,
      message: "That experiment is not available yet. Showing Fission instead.",
    });
    expect(parseExperimentId(null)).toEqual({ id: "fission" });
  });

  it("serializes experiment links without a second route hierarchy", () => {
    expect(toExperimentHref("reactor")).toBe("/simulations?experiment=reactor");
  });
});
