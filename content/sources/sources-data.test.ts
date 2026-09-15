import { describe, expect, it } from "vitest";
import { SCIENTIFIC_SOURCES } from "./sources-data";

describe("Scientific Sources & Bibliography Registry", () => {
  it("contains major international scientific bodies", () => {
    expect(SCIENTIFIC_SOURCES.length).toBeGreaterThanOrEqual(10);

    const orgs = SCIENTIFIC_SOURCES.map((s) => s.shortOrg);
    expect(orgs).toContain("UNSCEAR");
    expect(orgs).toContain("IPCC");
    expect(orgs).toContain("IAEA");
    expect(orgs).toContain("UNECE");
    expect(orgs).toContain("WHO");
  });

  it("verifies every source has complete attribution metadata", () => {
    for (const source of SCIENTIFIC_SOURCES) {
      expect(source.id).toBeTruthy();
      expect(source.title).toBeTruthy();
      expect(source.organization).toBeTruthy();
      expect(source.year).toBeGreaterThan(1970);
      expect(source.citation).toBeTruthy();
      expect(source.doiOrUrl).toMatch(/^https?:\/\//);
      expect(source.scope).toBeTruthy();
      expect(source.usedInAtomFor.length).toBeGreaterThan(0);
      expect(source.peerReviewType).toBeTruthy();
    }
  });

  it("covers all critical evidence domains in ATOM", () => {
    const categories = new Set(SCIENTIFIC_SOURCES.map((s) => s.category));
    expect(categories.has("climate-emissions")).toBe(true);
    expect(categories.has("radiation-health")).toBe(true);
    expect(categories.has("reactor-safety")).toBe(true);
    expect(categories.has("economics")).toBe(true);
    expect(categories.has("global-fleet")).toBe(true);
  });
});
