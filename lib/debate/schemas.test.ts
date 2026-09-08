import { describe, expect, it } from "vitest";
import {
  DebateTopicSchema,
  ArgumentSchema,
  AttributableStatementSchema,
  getArgumentRelationship,
  normalizeAttributableStatement,
} from "./schemas";

describe("Debate Schemas (R14)", () => {
  it("validates a complete topic with supporting, disputing, and contextualizing claims", () => {
    const topic = {
      id: "waste-test",
      question: "How should nuclear waste be managed?",
      summary:
        "Waste volumes are compact, but transuranics require multi-millennial isolation.",
      arguments: [
        {
          id: "arg-1",
          relationship: "supporting",
          title: "Compact volume",
          body: "High-level waste is small in volume.",
          citationIds: ["cit-1"],
          strength: "established",
          order: 1,
        },
        {
          id: "arg-2",
          relationship: "disputing",
          title: "Long radiotoxicity",
          body: "Actinides require millennia of isolation.",
          citationIds: ["cit-2"],
          strength: "established",
          order: 2,
        },
        {
          id: "arg-3",
          relationship: "contextualizing",
          title: "Dry cask storage",
          body: "Dry storage casks provide decades of safe cooling.",
          citationIds: ["cit-3"],
          strength: "preponderance",
          order: 3,
        },
      ],
      citations: [
        {
          id: "cit-1",
          title: "IAEA Waste Status",
          publisher: "IAEA",
          year: 2022,
          url: "https://iaea.org",
        },
        {
          id: "cit-2",
          title: "OECD-NEA Waste Report",
          publisher: "OECD-NEA",
          year: 2020,
          url: "https://oecd-nea.org",
        },
        {
          id: "cit-3",
          title: "NRC Spent Fuel Storage",
          publisher: "NRC",
          year: 2023,
        },
      ],
      consensus: {
        statement: "Deep geological repositories are technically sound.",
        basis: "STUK and NEA engineering evaluations",
        asOf: "2026-01-01",
        citationIds: ["cit-1"],
      },
      uncertainty: {
        statement: "Political consensus remains the primary bottleneck.",
        basis: "Global licensing reviews",
        asOf: "2026-01-01",
      },
    };

    const parsed = DebateTopicSchema.parse(topic);
    expect(parsed.id).toBe("waste-test");
    expect(parsed.arguments).toHaveLength(3);
    expect(getArgumentRelationship(parsed.arguments[0])).toBe("supporting");
    expect(getArgumentRelationship(parsed.arguments[1])).toBe("disputing");
    expect(getArgumentRelationship(parsed.arguments[2])).toBe(
      "contextualizing",
    );
  });

  it("normalizes backward-compatible side fields ('for', 'against', 'context')", () => {
    const argFor = ArgumentSchema.parse({
      id: "a1",
      side: "for",
      title: "Title",
      body: "Body",
    });
    const argAgainst = ArgumentSchema.parse({
      id: "a2",
      side: "against",
      title: "Title",
      body: "Body",
    });
    const argContext = ArgumentSchema.parse({
      id: "a3",
      side: "context",
      title: "Title",
      body: "Body",
    });

    expect(getArgumentRelationship(argFor)).toBe("supporting");
    expect(getArgumentRelationship(argAgainst)).toBe("disputing");
    expect(getArgumentRelationship(argContext)).toBe("contextualizing");
  });

  it("validates AttributableStatementSchema strictly with date check", () => {
    const validStatement = {
      statement: "Consensus on safety exists.",
      basis: "Meta-analysis of peer-reviewed data",
      asOf: "2026-05-12",
      citationIds: ["cit-1"],
    };
    expect(AttributableStatementSchema.parse(validStatement).asOf).toBe(
      "2026-05-12",
    );

    const invalidDate = {
      statement: "Statement",
      basis: "Basis",
      asOf: "invalid-date",
    };
    expect(() => AttributableStatementSchema.parse(invalidDate)).toThrow();
  });

  it("normalizes attributable statements and fallback strings", () => {
    const normalized = normalizeAttributableStatement(
      "Plain text claim",
      "Review board",
      "2026-08-01",
    );
    expect(normalized).toEqual({
      statement: "Plain text claim",
      basis: "Review board",
      asOf: "2026-08-01",
      citationIds: [],
    });
    expect(normalizeAttributableStatement(undefined)).toBeNull();
  });
});
