import { expect, test } from "vitest";
import { AskResponseSchema } from "./schemas";

test("AskResponseSchema validates a valid response", () => {
  const response = {
    queryId: "q-123",
    answerMarkdown: "Nuclear energy is a low-carbon energy source.",
    citationIds: ["cit-ipcc"],
    confidence: "high",
    caveats: ["Definitions of 'low-carbon' can vary by methodology."],
  };

  const parsed = AskResponseSchema.parse(response);
  expect(parsed.queryId).toBe("q-123");
});
