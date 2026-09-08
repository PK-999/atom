import {
  DebateTopicSchema,
  type DebateTopic,
  type Argument,
  type DebateCitation,
  type ArgumentRelationship,
  getArgumentRelationship,
  normalizeAttributableStatement,
} from "./schemas";
import wasteTopicData from "../../content/debates/waste.json";
import costsTopicData from "../../content/debates/costs.json";
import safetyTopicData from "../../content/debates/safety.json";

export interface DebateModelValidationResult {
  valid: boolean;
  errors: string[];
}

const RAW_TOPICS: unknown[] = [wasteTopicData, costsTopicData, safetyTopicData];

// Parse and validate all static debate topics at module load time
export const PUBLISHED_DEBATE_TOPICS: readonly DebateTopic[] = RAW_TOPICS.map(
  (raw, idx) => {
    const parsed = DebateTopicSchema.parse(raw);
    const integrity = validateTopicIntegrity(parsed);
    if (!integrity.valid) {
      throw new Error(
        `Debate topic ${parsed.id} at index ${idx} failed integrity validation: ${integrity.errors.join("; ")}`,
      );
    }
    return parsed;
  },
);

/**
 * Validates the referential integrity of a debate topic:
 * 1. Rejects unresolved published citations.
 * 2. Ensures consensus has attributable basis and date (never unsupported fact).
 * 3. Checks that argument titles, bodies, and IDs are valid.
 */
export function validateTopicIntegrity(
  topic: DebateTopic,
): DebateModelValidationResult {
  const errors: string[] = [];
  const citationMap = new Map<string, DebateCitation>();
  for (const cit of topic.citations) {
    citationMap.set(cit.id, cit);
  }

  // Check argument citations
  for (const arg of topic.arguments) {
    for (const citId of arg.citationIds) {
      if (!citationMap.has(citId)) {
        errors.push(
          `Argument "${arg.id}" in topic "${topic.id}" references unresolved citation ID "${citId}"`,
        );
      }
    }
  }

  // Check consensus attributable basis
  if (topic.consensus) {
    const norm = normalizeAttributableStatement(topic.consensus);
    if (!norm || !norm.basis || !norm.asOf) {
      errors.push(
        `Topic "${topic.id}" consensus lacks attributable basis or publication date.`,
      );
    }
    if (norm?.citationIds) {
      for (const citId of norm.citationIds) {
        if (!citationMap.has(citId)) {
          errors.push(
            `Consensus in topic "${topic.id}" references unresolved citation ID "${citId}"`,
          );
        }
      }
    }
  }

  // Check uncertainty attributable basis
  if (topic.uncertainty) {
    const norm = normalizeAttributableStatement(topic.uncertainty);
    if (!norm || !norm.basis || !norm.asOf) {
      errors.push(
        `Topic "${topic.id}" uncertainty lacks attributable basis or date.`,
      );
    }
    if (norm?.citationIds) {
      for (const citId of norm.citationIds) {
        if (!citationMap.has(citId)) {
          errors.push(
            `Uncertainty in topic "${topic.id}" references unresolved citation ID "${citId}"`,
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function listDebateTopics(): readonly DebateTopic[] {
  return PUBLISHED_DEBATE_TOPICS.filter((t) => t.status === "published");
}

export function getDebateTopic(slugOrId: string): DebateTopic | null {
  const found = PUBLISHED_DEBATE_TOPICS.find(
    (t) => t.id === slugOrId || t.slug === slugOrId,
  );
  return found ?? null;
}

export function resolveCitation(
  topic: DebateTopic,
  citationId: string,
): DebateCitation | null {
  return topic.citations.find((c) => c.id === citationId) ?? null;
}

export function resolveArgumentCitations(
  topic: DebateTopic,
  argument: Argument,
): readonly DebateCitation[] {
  return argument.citationIds
    .map((id) => resolveCitation(topic, id))
    .filter((c): c is DebateCitation => c !== null);
}

const STRENGTH_WEIGHT: Record<string, number> = {
  established: 4,
  preponderance: 3,
  contested: 2,
  emerging: 1,
};

/**
 * Sorts arguments by narrative order and evidence strength,
 * rather than arbitrary column groupings.
 */
export function getNarrativelyOrderedArguments(
  topic: DebateTopic,
  filterRelationship?: ArgumentRelationship,
): readonly Argument[] {
  let args = [...topic.arguments];
  if (filterRelationship) {
    args = args.filter(
      (a) => getArgumentRelationship(a) === filterRelationship,
    );
  }

  return args.sort((a, b) => {
    // Primary sort: explicit narrative order if provided and different
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    // Secondary sort: evidence strength
    const weightA = STRENGTH_WEIGHT[a.strength] ?? 0;
    const weightB = STRENGTH_WEIGHT[b.strength] ?? 0;
    return weightB - weightA;
  });
}
