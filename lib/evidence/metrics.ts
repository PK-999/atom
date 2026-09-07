import type { Metric } from "./schemas";

export const METRICS: readonly Metric[] = [
  // ====================
  // ENVIRONMENT METRICS
  // ====================
  {
    id: "lifecycle-ghg",
    category: "environment",
    definition:
      "Lifecycle greenhouse gas emissions per unit of electricity generated.",
    valueKind: "numeric",
    canonicalUnit: "gCO2e/kWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["gCO2e/kWh", "kgCO2e/MWh"],
  },
  {
    id: "land-use",
    category: "environment",
    definition: "Direct and indirect land area required per unit of energy.",
    valueKind: "numeric",
    canonicalUnit: "m2/MWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region", "facility"],
    supportedUnits: ["m2/MWh", "ha/TWh"],
  },
  {
    id: "water-withdrawal",
    category: "environment",
    definition: "Volume of water removed from a source per unit of energy.",
    valueKind: "numeric",
    canonicalUnit: "L/MWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region", "facility"],
    supportedUnits: ["L/MWh", "m3/MWh"],
  },
  {
    id: "water-consumption",
    category: "environment",
    definition: "Volume of water withdrawn and not returned to the source.",
    valueKind: "numeric",
    canonicalUnit: "L/MWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region", "facility"],
    supportedUnits: ["L/MWh", "m3/MWh"],
  },
  {
    id: "material-requirements",
    category: "environment",
    definition:
      "Total mass of critical materials required for plant construction and operation.",
    valueKind: "numeric",
    canonicalUnit: "t/TWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["t/TWh", "kg/MWh"],
  },
  {
    id: "mining-intensity",
    category: "environment",
    definition: "Ore and rock moved per unit of energy produced.",
    valueKind: "numeric",
    canonicalUnit: "t/TWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["t/TWh", "kg/MWh"],
  },
  {
    id: "waste-volume",
    category: "environment",
    definition: "Volume of hazardous or operational waste generated.",
    valueKind: "numeric",
    canonicalUnit: "m3/MWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["m3/MWh"],
  },
  {
    id: "waste-persistence",
    category: "environment",
    definition:
      "Categorical scale of how long hazardous waste remains biologically toxic.",
    valueKind: "categorical",
    rangeSemantics: "categorical",
    geographySupport: ["global"],
  },

  // ====================
  // RELIABILITY AND GRID
  // ====================
  {
    id: "capacity-factor",
    category: "reliability",
    definition:
      "Ratio of actual electrical output to maximum possible output over a period.",
    valueKind: "numeric",
    canonicalUnit: "%",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region", "grid", "facility"],
    supportedUnits: ["%", "ratio"],
  },
  {
    id: "dispatchability",
    category: "reliability",
    definition: "Ability of the power source to be turned on or off on demand.",
    valueKind: "categorical",
    rangeSemantics: "categorical",
    geographySupport: ["global", "grid"],
  },
  {
    id: "variability",
    category: "reliability",
    definition:
      "Inherent variability in power generation due to external forces.",
    valueKind: "categorical",
    rangeSemantics: "categorical",
    geographySupport: ["global", "grid"],
  },
  {
    id: "firm-capacity",
    category: "reliability",
    definition:
      "Percentage of capacity guaranteed to be available at peak load.",
    valueKind: "numeric",
    canonicalUnit: "%",
    rangeSemantics: "point-or-range",
    geographySupport: ["grid", "country", "region"],
    supportedUnits: ["%", "ratio"],
  },
  {
    id: "storage-dependence",
    category: "reliability",
    definition:
      "Degree to which the technology relies on external energy storage for firm operation.",
    valueKind: "categorical",
    rangeSemantics: "categorical",
    geographySupport: ["global", "grid"],
  },

  // ====================
  // ECONOMICS
  // ====================
  {
    id: "capital-cost",
    category: "economics",
    definition: "Overnight capital cost of construction.",
    valueKind: "numeric",
    canonicalUnit: "USD/kW",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["USD/kW"],
  },
  {
    id: "operating-cost",
    category: "economics",
    definition: "Fixed and variable operation and maintenance costs.",
    valueKind: "numeric",
    canonicalUnit: "USD/MWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["USD/MWh"],
  },
  {
    id: "fuel-cost",
    category: "economics",
    definition: "Cost of fuel per unit of electricity generated.",
    valueKind: "numeric",
    canonicalUnit: "USD/MWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["USD/MWh"],
  },
  {
    id: "lcoe",
    category: "economics",
    definition: "Levelized Cost of Energy over the plant lifetime.",
    valueKind: "numeric",
    canonicalUnit: "USD/MWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["USD/MWh"],
  },
  {
    id: "construction-duration",
    category: "economics",
    definition:
      "Typical time required from project start to commercial operation.",
    valueKind: "numeric",
    canonicalUnit: "months",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["months", "years"],
  },
  {
    id: "plant-lifetime",
    category: "economics",
    definition: "Expected operational lifetime of the facility.",
    valueKind: "numeric",
    canonicalUnit: "years",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["years"],
  },
  {
    id: "decommissioning-cost",
    category: "economics",
    definition: "Cost to safely decommission the plant and restore the site.",
    valueKind: "numeric",
    canonicalUnit: "USD/kW",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["USD/kW"],
  },
  {
    id: "financing-sensitivity",
    category: "economics",
    definition: "Sensitivity of LCOE to changes in discount rates.",
    valueKind: "categorical",
    rangeSemantics: "categorical",
    geographySupport: ["global"],
  },

  // ====================
  // HUMAN IMPACT
  // ====================
  {
    id: "mortality",
    category: "human-impact",
    definition:
      "Mortality rate per unit of electricity, including accidents and pollution.",
    valueKind: "numeric",
    canonicalUnit: "deaths/TWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["deaths/TWh", "deaths/PWh"],
  },
  {
    id: "air-pollution",
    category: "human-impact",
    definition:
      "Mortality or morbidity directly attributed to air pollution from operations.",
    valueKind: "numeric",
    canonicalUnit: "deaths/TWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["deaths/TWh", "deaths/PWh"],
  },
  {
    id: "occupational-impacts",
    category: "human-impact",
    definition:
      "Occupational hazard rate in mining, construction, and operation.",
    valueKind: "numeric",
    canonicalUnit: "deaths/TWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["deaths/TWh", "deaths/PWh"],
  },
  {
    id: "accident-risk",
    category: "human-impact",
    definition: "Scale and frequency of severe acute accidents.",
    valueKind: "categorical",
    rangeSemantics: "categorical",
    geographySupport: ["global"],
  },
  {
    id: "displacement",
    category: "human-impact",
    definition: "Likelihood and scale of population displacement.",
    valueKind: "categorical",
    rangeSemantics: "categorical",
    geographySupport: ["global"],
  },

  // ====================
  // ENERGY SECURITY
  // ====================
  {
    id: "fuel-energy-density",
    category: "energy-security",
    definition: "Energy released per unit mass of fuel.",
    valueKind: "numeric",
    canonicalUnit: "MJ/kg",
    rangeSemantics: "point-or-range",
    geographySupport: ["global"],
    supportedUnits: ["MJ/kg"],
  },
  {
    id: "fuel-stockpiling",
    category: "energy-security",
    definition: "Typical duration of fuel supply that can be stored on-site.",
    valueKind: "numeric",
    canonicalUnit: "months",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["months", "years"],
  },
  {
    id: "import-dependency",
    category: "energy-security",
    definition:
      "Percentage of fuel or critical components that must be imported.",
    valueKind: "numeric",
    canonicalUnit: "%",
    rangeSemantics: "point-or-range",
    geographySupport: ["country", "region"],
    supportedUnits: ["%", "ratio"],
  },
  {
    id: "supply-chain-concentration",
    category: "energy-security",
    definition:
      "Concentration of critical supply chain components in a single country or region.",
    valueKind: "numeric",
    canonicalUnit: "%",
    rangeSemantics: "point-or-range",
    geographySupport: ["global"],
    supportedUnits: ["%", "ratio"],
  },

  // ====================
  // TECHNICAL
  // ====================
  {
    id: "power-density",
    category: "technical",
    definition: "Electrical power generated per unit of land or spatial area.",
    valueKind: "numeric",
    canonicalUnit: "W/m2",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region", "facility"],
    supportedUnits: ["W/m2"],
  },
  {
    id: "thermal-efficiency",
    category: "technical",
    definition: "Percentage of thermal energy converted to electricity.",
    valueKind: "numeric",
    canonicalUnit: "%",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region", "facility"],
    supportedUnits: ["%", "ratio"],
  },
  {
    id: "refueling-cycle",
    category: "technical",
    definition: "Typical duration between necessary refueling outages.",
    valueKind: "numeric",
    canonicalUnit: "months",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "facility"],
    supportedUnits: ["months", "years"],
  },
  {
    id: "typical-capacity",
    category: "technical",
    definition: "Typical nameplate capacity of a single generating unit.",
    valueKind: "numeric",
    canonicalUnit: "MW",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country", "region"],
    supportedUnits: ["MW", "GW", "kW", "W"],
  },
];
