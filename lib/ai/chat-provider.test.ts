import { describe, expect, it } from "vitest";
import { GroundedRagProvider } from "./chat-provider";
import { OllamaProvider } from "./ollama-provider";

describe("AI Chat Provider Abstraction & Fallback (Phase 3.1 & 3.2)", () => {
  it("GroundedRagProvider is always available and generates verified responses with citations", async () => {
    const provider = new GroundedRagProvider();
    expect(await provider.isAvailable()).toBe(true);

    const result = await provider.generateResponse({
      messages: [
        {
          role: "user",
          content: "What are the greenhouse gas emissions of nuclear?",
        },
      ],
      level: "curious",
    });

    expect(result.provider).toBe("grounded-rag");
    expect(result.content).toBeTruthy();
    expect(result.citations.length).toBeGreaterThan(0);
    expect(
      result.citations.some(
        (c) => c.publisher.includes("IPCC") || c.publisher.includes("UNECE"),
      ),
    ).toBe(true);
  });

  it("GroundedRagProvider handles safety and accident queries honestly", async () => {
    const provider = new GroundedRagProvider();

    const result = await provider.generateResponse({
      messages: [
        { role: "user", content: "How safe is nuclear compared to coal?" },
      ],
      level: "curious",
    });

    expect(result.content).toBeTruthy();
    expect(result.citations.length).toBeGreaterThan(0);
  });

  it("OllamaProvider gracefully falls back to Grounded RAG when local Ollama is offline", async () => {
    // Point to non-running port so it tests offline fallback
    const provider = new OllamaProvider({
      baseUrl: "http://127.0.0.1:59999",
      timeoutMs: 300,
    });
    const isAvailable = await provider.isAvailable();
    expect(isAvailable).toBe(false);

    const result = await provider.generateResponse({
      messages: [
        { role: "user", content: "Tell me about nuclear waste and storage" },
      ],
      level: "curious",
    });

    // Should seamlessly fall back without throwing an error
    expect(result.content).toBeTruthy();
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.provider).toBe("grounded-rag");
  });
});
