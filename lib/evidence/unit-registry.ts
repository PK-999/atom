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

  // Area intensity
  "m2/MWh": { dimension: "area-intensity", factorToBase: 1 },
  // 1 ha/TWh = 10,000 m² / 1,000,000 MWh = 0.01 m²/MWh.
  "ha/TWh": { dimension: "area-intensity", factorToBase: 0.01 },

  // Volume intensity
  "L/MWh": { dimension: "volume-intensity", factorToBase: 1 },
  "m3/MWh": { dimension: "volume-intensity", factorToBase: 1000 }, // 1 m3 = 1000 L

  // Mass intensity
  // 1 t/TWh = 1,000 kg / 1,000,000 MWh = 0.001 kg/MWh.
  "t/TWh": { dimension: "mass-intensity", factorToBase: 0.001 },
  "kg/MWh": { dimension: "mass-intensity", factorToBase: 1 },

  // Economics
  "USD/kW": { dimension: "currency-power", factorToBase: 1 },
  "USD/MWh": { dimension: "currency-energy", factorToBase: 1 },

  // Human impact
  "deaths/TWh": { dimension: "mortality-intensity", factorToBase: 1 },
  "deaths/PWh": { dimension: "mortality-intensity", factorToBase: 0.001 },

  // Energy density
  "MJ/kg": { dimension: "energy-density", factorToBase: 1 },

  // Power density
  "W/m2": { dimension: "power-density", factorToBase: 1 },
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
