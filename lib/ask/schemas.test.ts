import { describe, expect, it } from "vitest";
import {
  AskResponseSchema,
  AskQuerySchema,
  AskCitationSchema,
} from "./schemas";

describe("Ask ATOM Schemas (R18)", () => {
  it("validates AskCitationSchema", () => {
    const citation = {
      id: "cit-ipcc",
      title: "IPCC AR6 WG3",
      publisher: "IPCC",
      year: 2022,
      url: "https://ipcc.ch",
      summary: "Global life-cycle greenhouse gas emissions evaluation.",
    };

    const parsed = AskCitationSchema.parse(citation);
    expect(parsed.id).toBe("cit-ipcc");
    expect(parsed.publisher).toBe("IPCC");
  });

  it("validates AskQuerySchema with default explanation level", () => {
    const query = {
      id: "q-1",
      prompt: "What is nuclear carbon intensity?",
      timestamp: new Date().toISOString(),
    };

    const parsed = AskQuerySchema.parse(query);
    expect(parsed.level).toBe("standard");
  });

  it("validates AskResponseSchema with answered state and resolved citations", () => {
    const response = {
      queryId: "q-1",
      state: "answered" as const,
      prompt: "What is nuclear carbon intensity?",
      answerText:
        "Nuclear energy emits approximately 12 gCO2eq/kWh over its life-cycle.",
      citations: [
        {
          id: "cit-ipcc",
          title: "IPCC AR6",
          publisher: "IPCC",
          summary: "Peer-reviewed life cycle assessment.",
        },
      ],
      evidenceIds: ["ev-ipcc-2022"],
      explanationLevel: "standard" as const,
      limitations: ["Regional grid factors vary slightly."],
    };

    const parsed = AskResponseSchema.parse(response);
    expect(parsed.state).toBe("answered");
    expect(parsed.citations.length).toBe(1);
  });

  it("validates AskResponseSchema with insufficient-evidence state", () => {
    const response = {
      queryId: "q-2",
      state: "insufficient-evidence" as const,
      prompt: "How to build a reactor in my basement?",
      answerText:
        "ATOM does not currently have verified peer-reviewed scientific evidence in its published catalog to answer this query.",
      citations: [],
      evidenceIds: [],
      explanationLevel: "standard" as const,
    };

    const parsed = AskResponseSchema.parse(response);
    expect(parsed.state).toBe("insufficient-evidence");
    expect(parsed.citations).toEqual([]);
  });
});
