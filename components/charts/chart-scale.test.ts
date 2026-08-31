import { describe, expect, it } from "vitest";

import { getPaddedExtent } from "./chart-scale";

describe("getPaddedExtent", () => {
  it("uses the observed non-zero domain with modest padding", () => {
    expect(getPaddedExtent([1_000, 1_010])).toEqual({
      maximum: 1_010.5,
      minimum: 999.5,
      span: 11,
    });
  });

  it("centers a singleton domain without forcing zero into view", () => {
    expect(getPaddedExtent([1_000])).toEqual({
      maximum: 1_050,
      minimum: 950,
      span: 100,
    });
  });
});
