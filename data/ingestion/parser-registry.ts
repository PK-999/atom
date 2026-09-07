import { z } from "zod";
import {
  IdentifierSchema,
  ObservationSchema,
  type Observation,
} from "@/lib/evidence/schemas";

export interface EvidenceParser {
  readonly id: string;
  parse(bytes: Uint8Array): Promise<readonly Observation[]>;
}

/** Offline extraction interchange, not an institutional source-specific parser. */
export function createDefaultParserRegistry(): ParserRegistry {
  const registry = new ParserRegistry();
  registry.register({
    id: "observation-envelope-v1",
    async parse(bytes) {
      const envelope = z
        .object({
          header: z.literal("atom-evidence-observations-v1"),
          expectedIds: z.array(IdentifierSchema).min(1),
          rows: z.array(ObservationSchema).min(1),
        })
        .strict()
        .parse(
          JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)),
        );
      const expected = new Set(envelope.expectedIds);
      const actual = new Set(envelope.rows.map((row) => row.id));
      if (
        expected.size !== envelope.expectedIds.length ||
        actual.size !== envelope.rows.length ||
        actual.size !== expected.size ||
        [...expected].some((id) => !actual.has(id))
      ) {
        throw new Error(
          "Artifact contains duplicate, missing or unexpected rows.",
        );
      }
      return envelope.rows;
    },
  });
  return registry;
}

export class ParserRegistry {
  private readonly parsers = new Map<string, EvidenceParser>();

  register(parser: EvidenceParser): void {
    if (this.parsers.has(parser.id)) {
      throw new Error(`A parser is already registered for ${parser.id}.`);
    }
    this.parsers.set(parser.id, parser);
  }

  async parse(
    parserId: string,
    bytes: Uint8Array,
  ): Promise<readonly Observation[]> {
    const parser = this.parsers.get(parserId);
    if (!parser)
      throw new Error(`No evidence parser is registered for ${parserId}.`);
    return parser.parse(bytes);
  }
}
