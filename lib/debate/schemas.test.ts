import { expect, test } from "vitest";
import { DebateTopicSchema } from "./schemas";

test("DebateTopicSchema validates a valid debate topic", () => {
  const topic = {
    id: "is-nuclear-safe",
    question: "Is nuclear energy safe?",
    summary:
      "Nuclear power has historically low mortality rates per TWh, but accidents have large displacement impacts.",
    arguments: [
      {
        id: "arg-for",
        side: "for",
        title: "Low overall mortality",
        body: "Nuclear energy causes very few deaths per unit of energy generated.",
        citationIds: ["cit-1"],
      },
      {
        id: "arg-against",
        side: "against",
        title: "Severe accident potential",
        body: "Accidents can cause significant land contamination and displacement.",
        citationIds: ["cit-2"],
      },
    ],
    consensus:
      "It is among the safest energy sources statistically, though risk perception remains high.",
  };

  const parsed = DebateTopicSchema.parse(topic);
  expect(parsed.id).toBe("is-nuclear-safe");
});
