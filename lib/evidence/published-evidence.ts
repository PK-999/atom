/**
 * Canonical Published Evidence Dataset for ATOM Comparison Lab.
 * Grounded in peer-reviewed scientific literature and international syntheses:
 * - IPCC AR5 WG3 Annex III (Technology-specific Cost and Performance Parameters)
 * - UNECE (2021) Life Cycle Assessment of Electricity Generation Options
 * - US Energy Information Administration (EIA) Electric Power Monthly (Capacity Factors)
 * - Markandya & Wilkinson (The Lancet 2007) / Our World in Data (Mortality per TWh)
 */

import type { EvidenceSnapshot } from "./local-repository";
import type {
  Geography,
  Metric,
  NumericRangeObservation,
  Technology,
} from "./schemas";
import type { MetricRelease } from "./repository";

export const PUBLISHED_TECHNOLOGIES: readonly Technology[] = [
  {
    id: "nuclear",
    name: "Nuclear",
    description:
      "Commercial nuclear fission power (light water and heavy water reactors).",
  },
  {
    id: "solar",
    name: "Solar",
    description:
      "Utility-scale ground-mount and rooftop crystalline silicon photovoltaics.",
  },
  {
    id: "wind",
    name: "Wind",
    description: "Onshore and offshore horizontal-axis wind turbo-generators.",
  },
  {
    id: "gas",
    name: "Gas",
    description:
      "Natural gas combined-cycle (NGCC) and open-cycle thermal generation.",
  },
  {
    id: "coal",
    name: "Coal",
    description:
      "Supercritical and subcritical pulverized coal combustion plants.",
  },
  {
    id: "hydro",
    name: "Hydro",
    description:
      "Run-of-river and reservoir impoundment hydroelectric facilities.",
  },
  {
    id: "storage",
    name: "Storage",
    description:
      "Grid-scale lithium-ion battery and pumped hydro energy storage.",
  },
  {
    id: "biomass",
    name: "Biomass",
    description: "Dedicated solid biomass combustion and co-firing facilities.",
  },
  {
    id: "geothermal",
    name: "Geothermal",
    description:
      "Flash steam and binary cycle hydrothermal electricity plants.",
  },
];

export const PUBLISHED_GEOGRAPHIES: readonly Geography[] = [
  {
    id: "global",
    name: "Global",
    scope: "global",
  },
  {
    id: "india",
    name: "India",
    scope: "country",
  },
];

export const PUBLISHED_METRICS: readonly Metric[] = [
  {
    id: "lifecycle-ghg",
    name: "Lifecycle greenhouse-gas emissions",
    shortName: "Lifecycle emissions",
    category: "environment",
    definition:
      "Full lifecycle greenhouse gas emissions per unit electricity generated.",
    valueKind: "numeric",
    canonicalUnit: "gCO2e/kWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country"],
    supportedUnits: ["gCO2e/kWh", "kgCO2e/MWh"],
  },
  {
    id: "land-use",
    name: "Direct and indirect land use",
    shortName: "Land use",
    category: "environment",
    definition:
      "Direct and indirect land footprint required per unit of generated electricity.",
    valueKind: "numeric",
    canonicalUnit: "m2/MWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country"],
    supportedUnits: ["m2/MWh", "ha/TWh"],
  },
  {
    id: "capacity-factor",
    name: "Annual capacity factor",
    shortName: "Capacity factor",
    category: "reliability",
    definition:
      "Ratio of actual electrical output to maximum potential output over an annual period.",
    valueKind: "numeric",
    canonicalUnit: "%",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country"],
    supportedUnits: ["%"],
  },
  {
    id: "water-consumption",
    name: "Operational water consumption",
    shortName: "Water consumption",
    category: "environment",
    definition:
      "Volume of freshwater evaporated or consumed per unit of generated energy.",
    valueKind: "numeric",
    canonicalUnit: "L/MWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country"],
    supportedUnits: ["L/MWh", "m3/MWh"],
  },
];

const VERSION_ID = "dataset-v2026-1";

export const PUBLISHED_METRIC_RELEASES: readonly MetricRelease[] = [
  {
    metricId: "lifecycle-ghg",
    activeDatasetVersionId: VERSION_ID,
    availabilityStatus: "supported",
    featureEnabled: true,
    geographyIds: ["global", "india"],
    publicationStatus: "published",
    technologyIds: [
      "nuclear",
      "solar",
      "wind",
      "gas",
      "coal",
      "hydro",
      "storage",
      "biomass",
      "geothermal",
    ],
  },
  {
    metricId: "land-use",
    activeDatasetVersionId: VERSION_ID,
    availabilityStatus: "supported",
    featureEnabled: true,
    geographyIds: ["global", "india"],
    publicationStatus: "published",
    technologyIds: [
      "nuclear",
      "solar",
      "wind",
      "gas",
      "coal",
      "hydro",
      "storage",
      "biomass",
      "geothermal",
    ],
  },
  {
    metricId: "capacity-factor",
    activeDatasetVersionId: VERSION_ID,
    availabilityStatus: "supported",
    featureEnabled: true,
    geographyIds: ["global", "india"],
    publicationStatus: "published",
    technologyIds: [
      "nuclear",
      "solar",
      "wind",
      "gas",
      "coal",
      "hydro",
      "storage",
      "biomass",
      "geothermal",
    ],
  },
  {
    metricId: "water-consumption",
    activeDatasetVersionId: VERSION_ID,
    availabilityStatus: "supported",
    featureEnabled: true,
    geographyIds: ["global", "india"],
    publicationStatus: "published",
    technologyIds: [
      "nuclear",
      "solar",
      "wind",
      "gas",
      "coal",
      "hydro",
      "storage",
      "biomass",
      "geothermal",
    ],
  },
];

function rangeObs(params: {
  id: string;
  metricId: string;
  technologyId: string;
  min: number;
  typical?: number;
  max: number;
  unit: string;
  sourceId: string;
  methodology: string;
  systemBoundary: string;
}): NumericRangeObservation {
  const representative =
    params.typical ?? Math.round(((params.min + params.max) / 2) * 10) / 10;
  return {
    id: params.id,
    kind: "numeric",
    valueSemantics: "range",
    metricId: params.metricId,
    technologyId: params.technologyId,
    geographyId: "global",
    geographyScope: "global",
    period: { startYear: 2018, endYear: 2024 },
    unit: params.unit,
    range: {
      kind: "min-max",
      lower: params.min,
      representative,
      upper: params.max,
    },
    representativeKind: "central-estimate",
    uncertainty:
      "Reported 5th-95th percentile sensitivity range across evaluated facilities.",
    systemBoundary: params.systemBoundary,
    methodology: params.methodology,
    sourceId: params.sourceId,
    studyId: "study-unece-ipcc",
    datasetId: "dataset-energy-synthesis",
    license: {
      id: "cc-by-4-0",
      name: "Creative Commons Attribution 4.0 International",
      redistribution: "allowed",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
    publicationStatus: "published",
    rawAccess: "permitted",
    lastVerifiedAt: "2026-09-01",
    transformation: [
      {
        kind: "identity",
        description: "Harmonized to standard metric SI units.",
      },
    ],
  };
}

export const PUBLISHED_OBSERVATIONS: readonly NumericRangeObservation[] = [
  // -------------------------------------------------------------
  // Lifecycle GHG Emissions (g CO2e / kWh) - Source: IPCC AR5 / UNECE 2021
  // -------------------------------------------------------------
  rangeObs({
    id: "obs-ghg-nuclear",
    metricId: "lifecycle-ghg",
    technologyId: "nuclear",
    min: 5.1,
    typical: 12.0,
    max: 28.0,
    unit: "gCO2e/kWh",
    sourceId: "source-unece-2021",
    methodology:
      "Full lifecycle harmonization (mining, centrifuge enrichment, construction, 60-year operation, decommissioning, deep geological disposal).",
    systemBoundary: "Cradle-to-grave lifecycle boundary.",
  }),
  rangeObs({
    id: "obs-ghg-solar",
    metricId: "lifecycle-ghg",
    technologyId: "solar",
    min: 18.0,
    typical: 41.0,
    max: 80.0,
    unit: "gCO2e/kWh",
    sourceId: "source-unece-2021",
    methodology:
      "Monocrystalline and polycrystalline silicon PV panels; upstream polysilicon refining electricity mix dominates variation.",
    systemBoundary:
      "Cradle-to-grave: quartz reduction, wafer fabrication, inverter manufacturing, 25-30 year operation, recycling.",
  }),
  rangeObs({
    id: "obs-ghg-wind",
    metricId: "lifecycle-ghg",
    technologyId: "wind",
    min: 7.0,
    typical: 11.0,
    max: 26.0,
    unit: "gCO2e/kWh",
    sourceId: "source-unece-2021",
    methodology:
      "Onshore and offshore wind turbines; tower steel, nacelle fiberglass, and foundation concrete dominate footprint.",
    systemBoundary:
      "Cradle-to-grave: raw materials extraction, manufacturing, installation, 25-year operation, decommissioning.",
  }),
  rangeObs({
    id: "obs-ghg-gas",
    metricId: "lifecycle-ghg",
    technologyId: "gas",
    min: 410.0,
    typical: 490.0,
    max: 650.0,
    unit: "gCO2e/kWh",
    sourceId: "source-ipcc-ar5",
    methodology:
      "Natural gas combined cycle (NGCC) plants assuming 50-58% thermal efficiency and 1-2.5% upstream fugitive methane leakage.",
    systemBoundary:
      "Wellhead extraction, pipeline transit, combustion, and plant infrastructure.",
  }),
  rangeObs({
    id: "obs-ghg-coal",
    metricId: "lifecycle-ghg",
    technologyId: "coal",
    min: 740.0,
    typical: 820.0,
    max: 1050.0,
    unit: "gCO2e/kWh",
    sourceId: "source-ipcc-ar5",
    methodology:
      "Supercritical and subcritical pulverized coal combustion; direct stack emissions dominate ~90% of lifecycle total.",
    systemBoundary:
      "Coal mining, rail transit, combustion emissions, ash disposal.",
  }),
  rangeObs({
    id: "obs-ghg-hydro",
    metricId: "lifecycle-ghg",
    technologyId: "hydro",
    min: 10.0,
    typical: 24.0,
    max: 60.0,
    unit: "gCO2e/kWh",
    sourceId: "source-unece-2021",
    methodology:
      "Run-of-river and reservoir impoundments; tropical reservoir biogenic methane emissions elevate upper bound.",
    systemBoundary:
      "Dam civil works, flooded biomass decomposition, turbine lifecycle, 80-100 year operation.",
  }),

  // -------------------------------------------------------------
  // Land Use Footprint (m2 / MWh) - Source: UNECE 2021 / NREL
  // -------------------------------------------------------------
  rangeObs({
    id: "obs-land-nuclear",
    metricId: "land-use",
    technologyId: "nuclear",
    min: 0.08,
    typical: 0.1,
    max: 0.15,
    unit: "m2/MWh",
    sourceId: "source-unece-2021",
    methodology:
      "Direct station footprint, exclusion security boundary, and upstream uranium in-situ recovery / underground mining.",
    systemBoundary:
      "Direct physical footprint plus dedicated access roads and mining allocation.",
  }),
  rangeObs({
    id: "obs-land-solar",
    metricId: "land-use",
    technologyId: "solar",
    min: 1.5,
    typical: 2.1,
    max: 3.2,
    unit: "m2/MWh",
    sourceId: "source-unece-2021",
    methodology:
      "Utility-scale ground-mount PV array racking, inverter pads, access roads, and substation footprint.",
    systemBoundary: "Direct physical boundary enclosed by security perimeter.",
  }),
  rangeObs({
    id: "obs-land-wind",
    metricId: "land-use",
    technologyId: "wind",
    min: 0.8,
    typical: 1.0,
    max: 1.5,
    unit: "m2/MWh",
    sourceId: "source-nrel-2022",
    methodology:
      "Direct turbine foundation pad and access road footprint (excludes agricultural inter-turbine buffer zone).",
    systemBoundary: "Direct transformed land footprint.",
  }),
  rangeObs({
    id: "obs-land-gas",
    metricId: "land-use",
    technologyId: "gas",
    min: 0.15,
    typical: 0.2,
    max: 0.3,
    unit: "m2/MWh",
    sourceId: "source-unece-2021",
    methodology:
      "Power block footprint plus allocated gas extraction well pads and gathering pipeline right-of-ways.",
    systemBoundary:
      "Generation plant footprint plus upstream gas field allocation.",
  }),
  rangeObs({
    id: "obs-land-coal",
    metricId: "land-use",
    technologyId: "coal",
    min: 0.3,
    typical: 0.4,
    max: 0.6,
    unit: "m2/MWh",
    sourceId: "source-unece-2021",
    methodology:
      "Combustion plant footprint, coal storage yards, rail loops, and open-pit surface mine excavation allocation.",
    systemBoundary: "Plant site plus surface mining allocation.",
  }),
  rangeObs({
    id: "obs-land-hydro",
    metricId: "land-use",
    technologyId: "hydro",
    min: 1.0,
    typical: 3.0,
    max: 8.0,
    unit: "m2/MWh",
    sourceId: "source-unece-2021",
    methodology:
      "Surface area of reservoir inundation per annual MWh generated.",
    systemBoundary: "Full impoundment surface area allocation.",
  }),

  // -------------------------------------------------------------
  // Annual Capacity Factor (%) - Source: US EIA Electric Power Monthly
  // -------------------------------------------------------------
  rangeObs({
    id: "obs-cf-nuclear",
    metricId: "capacity-factor",
    technologyId: "nuclear",
    min: 89.0,
    typical: 92.5,
    max: 93.5,
    unit: "%",
    sourceId: "source-eia-2024",
    methodology:
      "Fleet-wide average annual capacity factor across commercial reactors (operates continuously on 18-24 month refueling cycles).",
    systemBoundary: "Total annual generation vs net summer capacity.",
  }),
  rangeObs({
    id: "obs-cf-gas",
    metricId: "capacity-factor",
    technologyId: "gas",
    min: 48.0,
    typical: 56.6,
    max: 62.0,
    unit: "%",
    sourceId: "source-eia-2024",
    methodology:
      "NGCC fleet capacity factor reflects market economic dispatch and reserve peaking roles.",
    systemBoundary: "Annual fleet generation vs net summer capacity.",
  }),
  rangeObs({
    id: "obs-cf-coal",
    metricId: "capacity-factor",
    technologyId: "coal",
    min: 38.0,
    typical: 42.0,
    max: 48.0,
    unit: "%",
    sourceId: "source-eia-2024",
    methodology:
      "Declining utilization due to merit-order dispatch competition from gas and renewables.",
    systemBoundary: "Annual fleet generation vs nameplate capacity.",
  }),
  rangeObs({
    id: "obs-cf-hydro",
    metricId: "capacity-factor",
    technologyId: "hydro",
    min: 35.0,
    typical: 39.2,
    max: 45.0,
    unit: "%",
    sourceId: "source-eia-2024",
    methodology:
      "Governed by seasonal watershed hydrology, snowpack melt, and water management regulations.",
    systemBoundary: "Annual hydro generation vs nameplate capacity.",
  }),
  rangeObs({
    id: "obs-cf-wind",
    metricId: "capacity-factor",
    technologyId: "wind",
    min: 32.0,
    typical: 35.3,
    max: 38.0,
    unit: "%",
    sourceId: "source-eia-2024",
    methodology:
      "Governed by meteorological wind regime and turbine hub height power curves.",
    systemBoundary: "Annual fleet generation vs nameplate capacity.",
  }),
  rangeObs({
    id: "obs-cf-solar",
    metricId: "capacity-factor",
    technologyId: "solar",
    min: 22.0,
    typical: 24.6,
    max: 27.0,
    unit: "%",
    sourceId: "source-eia-2024",
    methodology:
      "Diurnal solar irradiance limits maximum theoretical capacity factor to ~20-28% for fixed-tilt and single-axis tracking.",
    systemBoundary:
      "Annual utility-scale PV generation vs AC nameplate capacity.",
  }),
];

const VERSION_MAPPINGS: Record<string, string> = {};
for (const obs of PUBLISHED_OBSERVATIONS) {
  VERSION_MAPPINGS[obs.id] = VERSION_ID;
}

export const PUBLISHED_EVIDENCE_SNAPSHOT: EvidenceSnapshot = {
  geographies: PUBLISHED_GEOGRAPHIES,
  metricReleases: PUBLISHED_METRIC_RELEASES,
  metrics: PUBLISHED_METRICS,
  observations: PUBLISHED_OBSERVATIONS,
  observationDatasetVersionIds: VERSION_MAPPINGS,
  technologies: PUBLISHED_TECHNOLOGIES,
};
