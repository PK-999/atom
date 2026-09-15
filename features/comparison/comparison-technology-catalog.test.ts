import { describe, it, expect } from "vitest";
import {
  TECHNOLOGY_CATALOG,
  TECHNOLOGY_MAP,
  TECHNOLOGY_COLORS,
  TECHNOLOGY_MARKERS,
  getTechnology,
} from "./comparison-technology-catalog";

describe("comparison-technology-catalog", () => {
  it("defines all expected technologies with unique IDs", () => {
    const ids = TECHNOLOGY_CATALOG.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    expect(uniqueIds.size).toBe(9);
    expect(ids).toContain("nuclear");
    expect(ids).toContain("solar");
    expect(ids).toContain("wind");
    expect(ids).toContain("gas");
    expect(ids).toContain("coal");
  });

  it("assigns valid colors and markers to all technologies", () => {
    for (const tech of TECHNOLOGY_CATALOG) {
      expect(tech.name).toBeTruthy();
      expect(tech.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(["circle", "square", "triangle", "diamond", "pentagon"]).toContain(
        tech.marker,
      );
    }
  });

  it("allows lookup by ID via getTechnology and TECHNOLOGY_MAP", () => {
    const nuclear = getTechnology("nuclear");
    expect(nuclear).toBeDefined();
    expect(nuclear?.name).toBe("Nuclear");
    expect(nuclear?.color).toBe("#7B61FF");
    expect(nuclear?.marker).toBe("circle");

    expect(getTechnology("unknown-tech")).toBeUndefined();
    expect(TECHNOLOGY_MAP.get("solar")?.name).toBe("Solar");
  });

  it("provides complete color and marker record dictionaries", () => {
    expect(TECHNOLOGY_COLORS["nuclear"]).toBe("#7B61FF");
    expect(TECHNOLOGY_MARKERS["nuclear"]).toBe("circle");
    expect(Object.keys(TECHNOLOGY_COLORS).length).toBe(9);
    expect(Object.keys(TECHNOLOGY_MARKERS).length).toBe(9);
  });
});
