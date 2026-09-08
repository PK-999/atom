import { NationalProfileSchema, type NationalProfile } from "./schemas";

export const INDIA_PROFILE_DATA: NationalProfile = {
  id: "india",
  countryCode: "IN",
  countryName: "India",
  overview:
    "India is the world's third-largest electricity producer. Its power system is transitioning rapidly, balancing substantial base-load coal reliance with aggressive solar deployment and an expanding domestic nuclear program centered on indigenous 700 MWe Pressurized Heavy Water Reactors (PHWRs) and long-term thorium utilization.",
  domesticPolicy:
    "India's nuclear strategy is structured by its unique resource endowment: modest domestic uranium reserves (~1-2% of global supply) alongside vast coastal monazite beach sand deposits containing ~25-30% of global thorium reserves. The nation pursues a closed three-stage fuel cycle to unlock domestic thorium energy self-sufficiency.",
  reactorFleetSummary:
    "NPCIL operates a fleet of 24 commercial reactors (~8,180 MWe) comprising indigenous 220 MWe and standardized 700 MWe PHWRs, imported VVER-1000 pressurized water reactors at Kudankulam, and legacy boiling water reactors at Tarapur. Ten additional indigenous 700 MWe PHWRs have been sanctioned in fleet mode.",
  mix: {
    year: 2024,
    reportingPeriod: "Fiscal Year 2023-24 (April 2023 – March 2024)",
    totalCapacityGw: 442.8,
    totalGenerationTwh: 1739.0,
    isComplete: true,
    source: {
      id: "cea-power-executive-2024",
      title: "Executive Summary of Power Sector (March 2024)",
      publisher:
        "Central Electricity Authority (CEA), Ministry of Power, Government of India",
      asOf: "2024-03-31",
      url: "https://cea.nic.in/executive-summary/?lang=en",
    },
    entries: [
      {
        source: "Coal & Lignite",
        capacityGw: 217.5,
        capacitySharePercent: 49.12,
        generationTwh: 1294.0,
        generationSharePercent: 74.41,
        color: "#475569",
      },
      {
        source: "Solar PV",
        capacityGw: 81.8,
        capacitySharePercent: 18.47,
        generationTwh: 116.0,
        generationSharePercent: 6.67,
        color: "#f59e0b",
      },
      {
        source: "Wind Power",
        capacityGw: 45.9,
        capacitySharePercent: 10.37,
        generationTwh: 83.0,
        generationSharePercent: 4.77,
        color: "#06b6d4",
      },
      {
        source: "Large Hydro",
        capacityGw: 46.9,
        capacitySharePercent: 10.59,
        generationTwh: 134.0,
        generationSharePercent: 7.71,
        color: "#3b82f6",
      },
      {
        source: "Gas & Bio & Other",
        capacityGw: 42.5,
        capacitySharePercent: 9.6,
        generationTwh: 64.2,
        generationSharePercent: 3.69,
        color: "#8b5cf6",
      },
      {
        source: "Nuclear",
        capacityGw: 8.18,
        capacitySharePercent: 1.85,
        generationTwh: 47.8,
        generationSharePercent: 2.75,
        color: "#10b981",
      },
    ],
  },
  threeStageProgram: [
    {
      stageNumber: 1,
      name: "Stage 1: Pressurized Heavy Water Reactors (PHWR)",
      reactorTech: "Heavy water moderated and cooled natural uranium reactors",
      inputFuel: "Natural Uranium (0.7% U-235, 99.3% U-238)",
      outputFuel: "Plutonium-239 in spent fuel + Depleted Uranium",
      status: "Commercial & Standardized (Fleet Mode)",
      description:
        "Standardized indigenous 220 MWe and 700 MWe PHWRs utilize domestic and imported natural uranium without requiring isotope enrichment facilities. Fission in natural uranium breeds fissile Plutonium-239, which is extracted via chemical reprocessing to seed Stage 2.",
      keyMilestone:
        "Commercial operation of first two indigenous 700 MWe units (Kakrapar 3 & 4) in 2023–2024.",
    },
    {
      stageNumber: 2,
      name: "Stage 2: Fast Breeder Reactors (FBR)",
      reactorTech: "Liquid sodium cooled unmoderated fast neutron reactors",
      inputFuel: "Plutonium-239 + Uranium-238 MOX (Mixed Oxide) fuel",
      outputFuel: "Uranium-233 bred from Thorium-232 blankets + Excess Pu-239",
      status: "Commissioning Prototype (PFBR 500 MWe)",
      description:
        "Fast neutron spectrum reactors multiply fissile inventory by breeding more fissile plutonium than they consume from U-238, while simultaneously irradiating surrounding thorium blanket assemblies to breed fissile Uranium-233 for Stage 3.",
      keyMilestone:
        "Core loading commenced for 500 MWe Prototype Fast Breeder Reactor (PFBR) at Kalpakkam in 2024.",
    },
    {
      stageNumber: 3,
      name: "Stage 3: Advanced Thorium Reactors (AHWR)",
      reactorTech:
        "Thermal breeder reactors & Molten Salt Thorium Reactors (MSR)",
      inputFuel: "Thorium-232 + Bred Uranium-233",
      outputFuel: "Sustained U-233 / closed thorium-uranium fuel cycle",
      status: "Advanced Engineering & Critical Facility Research",
      description:
        "Self-sustaining thermal breeder reactors utilizing India's vast monazite thorium reserves (estimated at >300,000 tonnes of thorium). Once initiated with bred U-233, these reactors operate on domestic thorium for centuries with minimal actinide waste.",
      keyMilestone:
        "Critical facility operational at BARC; Advanced Heavy Water Reactor (AHWR 300-LEU/Th) conceptual design completed.",
    },
  ],
  fleetStatus: {
    operatingReactors: 24,
    operatingCapacityMw: 8180,
    underConstructionReactors: 8,
    underConstructionCapacityMw: 6800,
    plannedSanctionedReactors: 10,
    standardPhwrDesignMw: 700,
  },
  scenarios2050: [
    {
      targetYear: 2032,
      targetCapacityGw: 22.4,
      projectedGenerationSharePercent: 6.0,
      basisAndAssumptions:
        "Official DAE sanctioned target based on active construction of 8 units + fleet-mode construction of 10 standardized 700 MWe PHWRs across Gorakhpur, Chutka, Mahi Banswara, and Kaiga.",
      source:
        "Department of Atomic Energy (DAE) 2031-32 Capacity Target Declaration",
    },
    {
      targetYear: 2047,
      targetCapacityGw: 100.0,
      projectedGenerationSharePercent: 12.5,
      basisAndAssumptions:
        "Long-term Net Zero 2070 scenario developed by BARC/DAE combining scaled series PHWRs, SMRs for industrial captive power/hydrogen, imported LWRs, and commercial FBR deployment.",
      source:
        "BARC / DAE Perspective Planning for Net Zero Carbon Economy by 2070",
    },
  ],
  citations: [
    {
      id: "cea-exec-summary-2024",
      title: "Executive Summary of Power Sector",
      publisher: "Central Electricity Authority (CEA)",
      asOf: "2024-03-31",
      url: "https://cea.nic.in",
    },
    {
      id: "dae-annual-report-2024",
      title: "Department of Atomic Energy Annual Report 2023-24",
      publisher: "Department of Atomic Energy, Government of India",
      asOf: "2024-03-31",
      url: "https://dae.gov.in",
    },
    {
      id: "npcil-fleet-status-2024",
      title: "Plants in Operation & Under Construction",
      publisher: "Nuclear Power Corporation of India Limited (NPCIL)",
      asOf: "2024-04-01",
      url: "https://www.npcil.nic.in",
    },
  ],
};

// Validate profile on import
export const VALIDATED_INDIA_PROFILE =
  NationalProfileSchema.parse(INDIA_PROFILE_DATA);

export function getIndiaProfile(): NationalProfile {
  return VALIDATED_INDIA_PROFILE;
}
