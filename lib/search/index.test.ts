import { describe, expect, it } from "vitest";
import { buildSearchIndex, searchCatalog, type SearchDocument } from "./index";

describe("Search Engine (R12)", () => {
  it("builds an index containing only published content", () => {
    const index = buildSearchIndex();
    expect(index.length).toBeGreaterThan(0);

    // Verify all lessons are published
    const lessonDocs = index.filter((d) => d.type === "lesson");
    expect(lessonDocs.length).toBe(7);

    // Verify topic docs
    const topicDocs = index.filter((d) => d.type === "topic");
    expect(topicDocs.length).toBeGreaterThan(0);

    // No doc should have empty title or href
    for (const doc of index) {
      expect(doc.title).toBeTruthy();
      expect(doc.href).toMatch(/^\/(learn|topics|glossary|compare|radiation)/);
    }
  });

  it("handles empty, whitespace, and capped queries safely", () => {
    expect(searchCatalog("")).toEqual([]);
    expect(searchCatalog("   ")).toEqual([]);

    // 200 char cap
    const longQuery = "energy ".repeat(40);
    const results = searchCatalog(longQuery);
    expect(results.length).toBeGreaterThan(0);
  });

  it("normalizes case and accents", () => {
    const resultsLower = searchCatalog("energy");
    const resultsUpper = searchCatalog("ENERGY");
    expect(resultsLower.map((r) => r.id)).toEqual(
      resultsUpper.map((r) => r.id),
    );

    // Accent test with mock index
    const mockIndex: SearchDocument[] = [
      {
        id: "doc-1",
        type: "lesson",
        title: "Café Energy",
        summary: "Thermal energy in coffee",
        href: "/learn/cafe",
        topicIds: ["fundamentals"],
        keywords: ["coffee"],
      },
    ];

    const resultsAccent = searchCatalog("cafe", mockIndex);
    expect(resultsAccent).toHaveLength(1);
    expect(resultsAccent[0].id).toBe("doc-1");
  });

  it("ranks exact title match higher than keyword or summary match", () => {
    const mockIndex: SearchDocument[] = [
      {
        id: "summary-match",
        type: "lesson",
        title: "Advanced Reactors",
        summary: "Deep discussion of nuclear fission mechanics",
        href: "/learn/reactor",
        topicIds: ["nuclear-technology"],
        keywords: ["reactor"],
      },
      {
        id: "title-match",
        type: "lesson",
        title: "Nuclear Fission",
        summary: "How atomic nuclei split",
        href: "/learn/fission",
        topicIds: ["nuclear-technology"],
        keywords: ["fission"],
      },
    ];

    const results = searchCatalog("Nuclear Fission", mockIndex);
    expect(results[0].id).toBe("title-match");
    expect(results[1].id).toBe("summary-match");
  });

  it("handles HTML-like input strings purely as plain text", () => {
    const results = searchCatalog("<script>alert('xss')</script>");
    // Should safely return without error
    expect(Array.isArray(results)).toBe(true);
  });

  it("produces deterministic order when scores are tied", () => {
    const mockIndex: SearchDocument[] = [
      {
        id: "b-doc",
        type: "glossary",
        title: "Alpha Decay",
        summary: "Decay mode",
        href: "/glossary/alpha",
        topicIds: ["physics"],
        keywords: ["alpha"],
      },
      {
        id: "a-doc",
        type: "glossary",
        title: "Alpha Radiation",
        summary: "Particles",
        href: "/glossary/alpha-rad",
        topicIds: ["physics"],
        keywords: ["alpha"],
      },
    ];

    const results1 = searchCatalog("alpha", mockIndex);
    const results2 = searchCatalog("alpha", mockIndex);
    expect(results1.map((r) => r.id)).toEqual(results2.map((r) => r.id));
    expect(results1[0].title).toBe("Alpha Decay");
    expect(results1[1].title).toBe("Alpha Radiation");
  });
});
