import type { ExplanationContent } from "./schemas";

/** Search includes collapsed context so useful detail stays discoverable. */
export function explanationText(content: ExplanationContent): string {
  return [
    content.summary,
    ...content.body,
    ...(content.details ?? []).flatMap((detail) => [detail.title, detail.body]),
  ].join(" ");
}
