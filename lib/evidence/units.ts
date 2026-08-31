import { NumericObservationSchema, type NumericObservation } from "./schemas";

type UnitDimension =
  "emissions-intensity" | "power" | "energy" | "duration" | "ratio";

interface UnitDefinition {
  dimension: UnitDimension;
  factorToBase: number;
}

const UNIT_REGISTRY: Readonly<Record<string, UnitDefinition>> = Object.freeze({
  "%": { dimension: "ratio", factorToBase: 0.01 },
  days: { dimension: "duration", factorToBase: 1 },
  "gCO2e/kWh": { dimension: "emissions-intensity", factorToBase: 1 },
  GWh: { dimension: "energy", factorToBase: 1_000_000_000 },
  GW: { dimension: "power", factorToBase: 1_000_000_000 },
  "kgCO2e/MWh": { dimension: "emissions-intensity", factorToBase: 1 },
  kWh: { dimension: "energy", factorToBase: 1_000 },
  kW: { dimension: "power", factorToBase: 1_000 },
  months: { dimension: "duration", factorToBase: 30.4375 },
  MWh: { dimension: "energy", factorToBase: 1_000_000 },
  MW: { dimension: "power", factorToBase: 1_000_000 },
  ratio: { dimension: "ratio", factorToBase: 1 },
  "tCO2e/GWh": { dimension: "emissions-intensity", factorToBase: 1 },
  Wh: { dimension: "energy", factorToBase: 1 },
  W: { dimension: "power", factorToBase: 1 },
  years: { dimension: "duration", factorToBase: 365.25 },
});

export class UnitConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnitConversionError";
  }
}

export function canConvertUnit(from: string, to: string): boolean {
  const source = UNIT_REGISTRY[from];
  const target = UNIT_REGISTRY[to];
  return Boolean(source && target && source.dimension === target.dimension);
}

export function convertUnit(value: number, from: string, to: string): number {
  if (!Number.isFinite(value)) {
    throw new UnitConversionError("Unit conversion requires a finite value.");
  }

  const source = UNIT_REGISTRY[from];
  const target = UNIT_REGISTRY[to];
  if (!source || !target) {
    throw new UnitConversionError(`Unknown unit conversion: ${from} to ${to}.`);
  }
  if (source.dimension !== target.dimension) {
    throw new UnitConversionError(
      `Cannot convert ${from} (${source.dimension}) to ${to} (${target.dimension}).`,
    );
  }

  return (value * source.factorToBase) / target.factorToBase;
}

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
