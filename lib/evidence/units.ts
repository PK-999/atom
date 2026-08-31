import { NumericObservationSchema, type NumericObservation } from "./schemas";
import { UnitConversionError, convertUnit } from "./unit-registry";

export {
  UnitConversionError,
  canConvertUnit,
  convertUnit,
} from "./unit-registry";

export function normalizeObservation(
  observation: NumericObservation,
  targetUnit: string,
): NumericObservation {
  const cloned = structuredClone(observation);
  if (observation.unit === targetUnit) {
    convertUnit(0, observation.unit, targetUnit);
    return NumericObservationSchema.parse(cloned);
  }
  const transformation = [
    ...cloned.transformation,
    {
      description: `Converted from ${observation.unit} to ${targetUnit}.`,
      kind: "unit-conversion" as const,
    },
  ];

  if (observation.valueSemantics === "point") {
    return NumericObservationSchema.parse({
      ...cloned,
      transformation,
      unit: targetUnit,
      value: convertUnit(observation.value, observation.unit, targetUnit),
    });
  }

  return NumericObservationSchema.parse({
    ...cloned,
    range: {
      ...cloned.range,
      lower: convertUnit(observation.range.lower, observation.unit, targetUnit),
      representative: convertUnit(
        observation.range.representative,
        observation.unit,
        targetUnit,
      ),
      upper: convertUnit(observation.range.upper, observation.unit, targetUnit),
    },
    transformation,
    unit: targetUnit,
  });
}

export interface HumanEquivalentAssumption {
  label: string;
  quantityPerEquivalent: number;
  sourceNote: string;
  unit: string;
}

export interface HumanEquivalentInput {
  assumption: HumanEquivalentAssumption;
  scientific: {
    unit: string;
    value: number;
  };
}

export interface HumanEquivalentResult extends HumanEquivalentInput {
  equivalents: number;
}

export function calculateHumanEquivalent(
  input: HumanEquivalentInput,
): HumanEquivalentResult {
  if (
    !input.assumption.label.trim() ||
    !input.assumption.sourceNote.trim() ||
    !Number.isFinite(input.assumption.quantityPerEquivalent) ||
    input.assumption.quantityPerEquivalent <= 0
  ) {
    throw new UnitConversionError(
      "Human-equivalent assumptions require a label, source note, and positive finite quantity.",
    );
  }

  const normalizedScientificValue = convertUnit(
    input.scientific.value,
    input.scientific.unit,
    input.assumption.unit,
  );

  return {
    assumption: { ...input.assumption },
    equivalents:
      normalizedScientificValue / input.assumption.quantityPerEquivalent,
    scientific: { ...input.scientific },
  };
}
