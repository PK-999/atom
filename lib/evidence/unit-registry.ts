type UnitDimension =
  | "emissions-intensity"
  | "power"
  | "energy"
  | "duration"
  | "ratio"
  | "area-intensity"
  | "volume-intensity"
  | "mass-intensity"
  | "currency-power"
  | "currency-energy"
  | "mortality-intensity"
  | "energy-density"
  | "power-density";

export interface UnitDefinition {
  dimension: UnitDimension;
  factorToBase: number;
  displayLabel?: string;
}

const UNIT_REGISTRY: Readonly<Record<string, UnitDefinition>> = Object.freeze({
  "%": { dimension: "ratio", factorToBase: 0.01, displayLabel: "%" },
  days: { dimension: "duration", factorToBase: 1, displayLabel: "days" },
  "gCO2e/kWh": {
    dimension: "emissions-intensity",
    factorToBase: 1,
    displayLabel: "g CO₂e / kWh",
  },
  GWh: {
    dimension: "energy",
    factorToBase: 1_000_000_000,
    displayLabel: "GWh",
  },
  GW: { dimension: "power", factorToBase: 1_000_000_000, displayLabel: "GW" },
  "kgCO2e/MWh": {
    dimension: "emissions-intensity",
    factorToBase: 1,
    displayLabel: "kg CO₂e / MWh",
  },
  kWh: { dimension: "energy", factorToBase: 1_000, displayLabel: "kWh" },
  kW: { dimension: "power", factorToBase: 1_000, displayLabel: "kW" },
  months: {
    dimension: "duration",
    factorToBase: 30.4375,
    displayLabel: "months",
  },
  MWh: { dimension: "energy", factorToBase: 1_000_000, displayLabel: "MWh" },
  MW: { dimension: "power", factorToBase: 1_000_000, displayLabel: "MW" },
  ratio: { dimension: "ratio", factorToBase: 1, displayLabel: "ratio" },
  "tCO2e/GWh": {
    dimension: "emissions-intensity",
    factorToBase: 1,
    displayLabel: "t CO₂e / GWh",
  },
  Wh: { dimension: "energy", factorToBase: 1, displayLabel: "Wh" },
  W: { dimension: "power", factorToBase: 1, displayLabel: "W" },
  years: { dimension: "duration", factorToBase: 365.25, displayLabel: "years" },

  // Area intensity
  "m2/MWh": {
    dimension: "area-intensity",
    factorToBase: 1,
    displayLabel: "m² / MWh",
  },
  // 1 ha/TWh = 10,000 m² / 1,000,000 MWh = 0.01 m²/MWh.
  "ha/TWh": {
    dimension: "area-intensity",
    factorToBase: 0.01,
    displayLabel: "ha / TWh",
  },

  // Volume intensity
  "L/MWh": {
    dimension: "volume-intensity",
    factorToBase: 1,
    displayLabel: "L / MWh",
  },
  "m3/MWh": {
    dimension: "volume-intensity",
    factorToBase: 1000,
    displayLabel: "m³ / MWh",
  }, // 1 m3 = 1000 L

  // Mass intensity
  // 1 t/TWh = 1,000 kg / 1,000,000 MWh = 0.001 kg/MWh.
  "t/TWh": {
    dimension: "mass-intensity",
    factorToBase: 0.001,
    displayLabel: "t / TWh",
  },
  "kg/MWh": {
    dimension: "mass-intensity",
    factorToBase: 1,
    displayLabel: "kg / MWh",
  },

  // Economics
  "USD/kW": {
    dimension: "currency-power",
    factorToBase: 1,
    displayLabel: "USD / kW",
  },
  "USD/MWh": {
    dimension: "currency-energy",
    factorToBase: 1,
    displayLabel: "USD / MWh",
  },

  // Human impact
  "deaths/TWh": {
    dimension: "mortality-intensity",
    factorToBase: 1,
    displayLabel: "deaths / TWh",
  },
  "deaths/PWh": {
    dimension: "mortality-intensity",
    factorToBase: 0.001,
    displayLabel: "deaths / PWh",
  },

  // Energy density
  "MJ/kg": {
    dimension: "energy-density",
    factorToBase: 1,
    displayLabel: "MJ / kg",
  },

  // Power density
  "W/m2": {
    dimension: "power-density",
    factorToBase: 1,
    displayLabel: "W / m²",
  },
});

export function getUnitDisplayLabel(unit: string): string {
  return UNIT_REGISTRY[unit]?.displayLabel ?? unit;
}

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
