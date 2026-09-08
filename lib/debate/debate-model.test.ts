import { describe, expect, it } from "vitest";
import {
  PUBLISHED_DEBATE_TOPICS,
  listDebateTopics,
  getDebateTopic,
  validateTopicIntegrity,
  resolveArgumentCitations,
  getNarrativelyOrderedArguments,
} from "./debate-model";
import type { DebateTopic } from "./schemas";

describe("Debate Model & Integrity (R14)", () => {
  it("loads and validates all published debate topics", () => {
    const topics = listDebateTopics();
    expect(topics.length).toBeGreaterThanOrEqual(3);

    const waste = getDebateTopic("waste");
    expect(waste).not.toBeNull();
    expect(waste?.question).toContain("waste");

    const costs = getDebateTopic("costs");
    expect(costs).not.toBeNull();

    const safety = getDebateTopic("safety");
    expect(safety).not.toBeNull();
  });

  it("verifies referential integrity across all published topics", () => {
    for (const topic of PUBLISHED_DEBATE_TOPICS) {
      const integrity = validateTopicIntegrity(topic);
      expect(integrity.valid).toBe(true);
      expect(integrity.errors).toEqual([]);
    }
  });

  it("rejects debate topics with unresolved citation IDs", () => {
    const invalidTopic: DebateTopic = {
      id: "broken-topic",
      question: "Broken topic question?",
      summary: "Broken summary.",
      status: "published",
      citations: [
        {
          id: "cit-real",
          title: "Real Citation",
          publisher: "Publisher",
          year: 2023,
          sourceTier: "A",
        },
      ],
      arguments: [
        {
          id: "arg-broken",
          relationship: "supporting",
          title: "Unresolved ref",
          body: "This references a ghost citation.",
          citationIds: ["cit-ghost-123"],
          evidenceIds: [],
          strength: "established",
          order: 1,
        },
      ],
    };

    const integrity = validateTopicIntegrity(invalidTopic);
    expect(integrity.valid).toBe(false);
    expect(integrity.errors.some((e) => e.includes("cit-ghost-123"))).toBe(
      true,
    );
  });

  it("rejects consensus displayed as an unsupported statement without basis or date", () => {
    const invalidConsensusTopic: DebateTopic = {
      id: "unsupported-consensus",
      question: "Unsupported consensus?",
      summary: "Summary.",
      status: "published",
      citations: [],
      arguments: [
        {
          id: "arg-1",
          relationship: "supporting",
          title: "Arg",
          body: "Arg body",
          citationIds: [],
          evidenceIds: [],
          strength: "established",
          order: 1,
        },
      ],
      consensus: {
        statement: "Unsupported consensus fact",
        basis: "",
        asOf: "",
        citationIds: [],
      },
    };

    const integrity = validateTopicIntegrity(invalidConsensusTopic);
    expect(integrity.valid).toBe(false);
    expect(
      integrity.errors.some((e) => e.includes("lacks attributable basis")),
    ).toBe(true);
  });

  it("resolves all argument citations cleanly", () => {
    const waste = getDebateTopic("waste")!;
    const argWithCits = waste.arguments.find((a) => a.citationIds.length > 0)!;
    const resolved = resolveArgumentCitations(waste, argWithCits);
    expect(resolved.length).toBe(argWithCits.citationIds.length);
    expect(resolved[0].title).toBeTruthy();
    expect(resolved[0].publisher).toBeTruthy();
  });

  it("orders arguments by explicit narrative order and evidence strength", () => {
    const waste = getDebateTopic("waste")!;
    const ordered = getNarrativelyOrderedArguments(waste);
    expect(ordered.length).toBe(waste.arguments.length);
    // Check orders are non-decreasing
    for (let i = 0; i < ordered.length - 1; i++) {
      expect(ordered[i].order).toBeLessThanOrEqual(ordered[i + 1].order);
    }

    // Filter by relationship
    const disputing = getNarrativelyOrderedArguments(waste, "disputing");
    expect(disputing.length).toBeGreaterThan(0);
    disputing.forEach((d) => expect(d.relationship).toBe("disputing"));
  });
});
