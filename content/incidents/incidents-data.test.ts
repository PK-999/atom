import { describe, expect, it } from "vitest";
import { INCIDENTS_DATA, INCIDENT_FAQS } from "./incidents-data";
import { COMPLEXITY_LEVELS } from "@/lib/preferences/complexity-preference";

describe("Nuclear Incidents & FAQs Data Integrity", () => {
  it("contains canonical major nuclear incidents", () => {
    expect(INCIDENTS_DATA.length).toBeGreaterThanOrEqual(4);

    const ids = INCIDENTS_DATA.map((i) => i.id);
    expect(ids).toContain("chernobyl");
    expect(ids).toContain("fukushima");
    expect(ids).toContain("three-mile-island");
    expect(ids).toContain("kyshtym");
  });

  it("verifies every incident has explanations across all 5 complexity tiers", () => {
    for (const incident of INCIDENTS_DATA) {
      expect(incident.name).toBeTruthy();
      expect(incident.year).toBeGreaterThan(1940);
      expect(incident.inesLevel).toBeGreaterThanOrEqual(1);
      expect(incident.inesLevel).toBeLessThanOrEqual(7);
      expect(incident.timeline.length).toBeGreaterThan(0);
      expect(incident.sources.length).toBeGreaterThan(0);
      expect(incident.keyEngineeringLessons.length).toBeGreaterThan(0);

      // Check all 5 complexity levels exist and have rich content
      for (const level of COMPLEXITY_LEVELS) {
        expect(incident.explanations[level]).toBeTruthy();
        expect(incident.explanations[level].length).toBeGreaterThan(50);
      }
    }
  });

  it("verifies Chernobyl facts align with UNSCEAR and INSAG", () => {
    const chernobyl = INCIDENTS_DATA.find((i) => i.id === "chernobyl")!;
    expect(chernobyl.inesLevel).toBe(7);
    expect(chernobyl.reactorType).toBe("RBMK-1000");
    expect(chernobyl.healthImpacts.immediateFatalities).toBe(31);
    expect(chernobyl.radiologicalRelease.iodine131PBq).toContain("1,760");
  });

  it("verifies Fukushima facts align with UNSCEAR 2020", () => {
    const fukushima = INCIDENTS_DATA.find((i) => i.id === "fukushima")!;
    expect(fukushima.inesLevel).toBe(7);
    expect(fukushima.healthImpacts.immediateFatalities).toBe(0);
    expect(fukushima.healthImpacts.evacuationImpact).toContain("2,200");
  });

  it("verifies Three Mile Island facts align with Kemeny Commission", () => {
    const tmi = INCIDENTS_DATA.find((i) => i.id === "three-mile-island")!;
    expect(tmi.inesLevel).toBe(5);
    expect(tmi.healthImpacts.immediateFatalities).toBe(0);
    expect(tmi.healthImpacts.radiationFatalitiesConfirmed).toBe(0);
  });

  it("contains comprehensive fact-checking FAQs covering all 5 complexity levels", () => {
    expect(INCIDENT_FAQS.length).toBeGreaterThanOrEqual(5);

    for (const faq of INCIDENT_FAQS) {
      expect(faq.question).toBeTruthy();
      expect(faq.source.title).toBeTruthy();
      expect(faq.source.organization).toBeTruthy();

      for (const level of COMPLEXITY_LEVELS) {
        expect(faq.answer[level]).toBeTruthy();
        expect(faq.answer[level].length).toBeGreaterThan(40);
      }
    }
  });
});
