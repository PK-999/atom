import {
  type IChatProvider,
  type ChatCompletionOptions,
  type ChatCompletionResult,
  GroundedRagProvider,
} from "./chat-provider";

export interface OllamaConfig {
  baseUrl?: string;
  model?: string;
  timeoutMs?: number;
}

export class OllamaProvider implements IChatProvider {
  name = "ollama";
  private baseUrl: string;
  private model: string;
  private timeoutMs: number;
  private fallbackProvider: GroundedRagProvider;

  constructor(config: OllamaConfig = {}) {
    this.baseUrl =
      config.baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.model = config.model || process.env.OLLAMA_MODEL || "llama3";
    this.timeoutMs = config.timeoutMs || 8000;
    this.fallbackProvider = new GroundedRagProvider();
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      return res.ok;
    } catch {
      return false;
    }
  }

  async generateResponse(
    options: ChatCompletionOptions,
  ): Promise<ChatCompletionResult> {
    // 1. Always retrieve grounding evidence first
    const groundedFallback =
      await this.fallbackProvider.generateResponse(options);

    // 2. Check if Ollama is accessible
    const available = await this.isAvailable();
    if (!available) {
      return groundedFallback;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      // Build system prompt enforcing evidence grounding
      const citationsText = groundedFallback.citations
        .map((c) => `[${c.publisher} ${c.year}]: ${c.summary}`)
        .join("\n");

      const systemInstruction = `You are ATOM, an evidence-first nuclear literacy debate assistant.
Your goal is to answer questions, analyze trade-offs, and test hypotheses strictly grounded in scientific facts.
Do not hallucinate. Do not act as an uncritical nuclear advocate; explain real trade-offs honestly.
Ground your answer in these verified sources:
${citationsText}
${groundedFallback.consensus ? `Consensus: ${groundedFallback.consensus}` : ""}
${groundedFallback.uncertainty ? `Uncertainties: ${groundedFallback.uncertainty}` : ""}
Audience level: ${options.level || "curious"}. Keep explanations concise, balanced, and clear.`;

      const promptPayload = {
        model: this.model,
        messages: [
          { role: "system", content: systemInstruction },
          ...options.messages,
        ],
        stream: false,
        options: {
          temperature: options.temperature ?? 0.3,
        },
      };

      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptPayload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return groundedFallback;
      }

      const data = await res.json();
      const responseContent = data?.message?.content;

      if (!responseContent || typeof responseContent !== "string") {
        return groundedFallback;
      }

      return {
        content: responseContent.trim(),
        model: `ollama-${this.model}`,
        provider: "ollama",
        citations: groundedFallback.citations,
        groundingConfidence: 0.95,
        consensus: groundedFallback.consensus,
        uncertainty: groundedFallback.uncertainty,
      };
    } catch {
      // Graceful fallback to deterministic grounded engine on network or timeout failure
      return groundedFallback;
    }
  }
}
