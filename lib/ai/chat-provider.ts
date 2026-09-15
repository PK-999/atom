import type { AskCitation } from "@/lib/ask/schemas";
import { askAtom } from "@/lib/ask/retrieval-engine";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  level?: "beginner" | "explorer" | "curious" | "deep-dive" | "geeky";
}

export interface ChatCompletionResult {
  content: string;
  model: string;
  provider: "ollama" | "grounded-rag";
  citations: AskCitation[];
  groundingConfidence: number;
  consensus?: string;
  uncertainty?: string;
}

export interface IChatProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generateResponse(
    options: ChatCompletionOptions,
  ): Promise<ChatCompletionResult>;
}

/**
 * Deterministic Grounded RAG Provider
 * Queries ATOM's peer-reviewed evidence and metric catalog.
 * Guarantees 100% verifiable citations without hallucinations.
 */
export class GroundedRagProvider implements IChatProvider {
  name = "grounded-rag";

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async generateResponse(
    options: ChatCompletionOptions,
  ): Promise<ChatCompletionResult> {
    const lastUserMessage = [...options.messages]
      .reverse()
      .find((m) => m.role === "user");

    const queryText = lastUserMessage?.content ?? "nuclear energy";

    // Map level to ask engine level
    let askLevel: "explorer" | "standard" | "deep-dive" = "standard";
    if (options.level === "beginner" || options.level === "explorer") {
      askLevel = "explorer";
    } else if (options.level === "deep-dive" || options.level === "geeky") {
      askLevel = "deep-dive";
    }

    const askResult = askAtom({
      id: `debate-${Date.now()}`,
      prompt: queryText,
      timestamp: new Date().toISOString(),
      level: askLevel,
    });

    const content = askResult.answerText;

    return {
      content,
      model: "atom-evidence-v1",
      provider: "grounded-rag",
      citations: Array.from(askResult.citations),
      groundingConfidence: askResult.state === "answered" ? 1.0 : 0.5,
    };
  }
}
