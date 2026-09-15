import { NextResponse } from "next/server";
import { OllamaProvider } from "@/lib/ai/ollama-provider";
import { GroundedRagProvider } from "@/lib/ai/chat-provider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, level, providerPreference } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. 'messages' array is required." },
        { status: 400 },
      );
    }

    const ollama = new OllamaProvider();
    const grounded = new GroundedRagProvider();

    let result;
    if (providerPreference === "ollama") {
      result = await ollama.generateResponse({ messages, level });
    } else {
      // Default to Ollama with Grounded fallback
      result = await ollama.generateResponse({ messages, level });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error occurred while processing debate query.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
