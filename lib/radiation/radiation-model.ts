import {
  type RadiationScenario,
  type RadiationQuantity,
  type ScenarioCategory,
  RadiationScenarioSchema,
} from "./schemas";

/**
 * 1 Sv = 1,000 mSv = 1,000,000 µSv
 * 1 mSv = 1,000 µSv
 */
export const SV_TO_MILLISV = 1_000;
export const MILLISV_TO_MICROSV = 1_000;
export const SV_TO_MICROSV = 1_000_000;

export function toMicroSieverts(
  value: number,
  unit: "Sv" | "mSv" | "µSv" | "uSv",
): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(
      `Radiation dose value must be a non-negative finite number, received: ${value}`,
    );
  }

  switch (unit) {
    case "Sv":
      return value * SV_TO_MICROSV;
    case "mSv":
      return value * MILLISV_TO_MICROSV;
    case "µSv":
    case "uSv":
      return value;
    default:
      throw new Error(`Unsupported dose unit for conversion to µSv: ${unit}`);
  }
}

export function fromMicroSieverts(
  microSv: number,
  targetUnit: "Sv" | "mSv" | "µSv",
): number {
  if (!Number.isFinite(microSv) || microSv < 0) {
    throw new Error(
      `Dose in µSv must be a non-negative finite number, received: ${microSv}`,
    );
  }

  switch (targetUnit) {
    case "Sv":
      return microSv / SV_TO_MICROSV;
    case "mSv":
      return microSv / MILLISV_TO_MICROSV;
    case "µSv":
      return microSv;
  }
}

export function formatDose(doseMicroSv: number): {
  microSv: string;
  milliSv: string;
  sv: string;
  bestFormatted: string;
} {
  if (!Number.isFinite(doseMicroSv) || doseMicroSv < 0) {
    return {
      microSv: "0 µSv",
      milliSv: "0 mSv",
      sv: "0 Sv",
      bestFormatted: "0 µSv",
    };
  }

  const mSv = doseMicroSv / 1_000;
  const sv = doseMicroSv / 1_000_000;

  let best: string;
  if (doseMicroSv === 0) {
    best = "0 µSv";
  } else if (doseMicroSv < 1_000) {
    best = `${Number(doseMicroSv.toFixed(1))} µSv`;
  } else if (mSv < 1_000) {
    best = `${Number(mSv.toFixed(2))} mSv`;
  } else {
    best = `${Number(sv.toFixed(2))} Sv`;
  }

  return {
    microSv: `${doseMicroSv.toLocaleString()} µSv`,
    milliSv: `${mSv.toLocaleString(undefined, { maximumFractionDigits: 3 })} mSv`,
    sv: `${sv.toLocaleString(undefined, { maximumFractionDigits: 4 })} Sv`,
    bestFormatted: best,
  };
}

/**
 * Validates whether two quantities can be physically compared or converted.
 * IMPORTANT: Absorbed dose (Gy) cannot be converted to effective dose (Sv)
 * without an explicit biological/radiation weighting model.
 * Activity (Bq) measures decay events and cannot be converted to dose without geometry/nuclide intake factors.
 */
export function canConvertQuantities(
  from: RadiationQuantity,
  to: RadiationQuantity,
): boolean {
  if (from === to) return true;
  // Distinct quantities cannot be converted directly without external physical models
  return false;
}

/**
 * Computes a percentage (0% to 100%) on a logarithmic scale from minDose to maxDose.
 * Safely handles 0 µSv without evaluating log(0) (which returns -Infinity).
 */
export function calculateLogPosition(
  doseMicroSv: number,
  minDoseMicroSv = 0.1,
  maxDoseMicroSv = 10_000_000,
): number {
  if (!Number.isFinite(doseMicroSv) || doseMicroSv <= 0) {
    return 0; // Dedicated zero position, NEVER evaluate Math.log10(0)
  }

  const safeMin = Math.max(minDoseMicroSv, 0.01);
  const safeDose = Math.max(doseMicroSv, safeMin);
  const logMin = Math.log10(safeMin);
  const logMax = Math.log10(maxDoseMicroSv);
  const logVal = Math.log10(safeDose);

  const percent = ((logVal - logMin) / (logMax - logMin)) * 100;
  return Math.min(100, Math.max(0, percent));
}

// Canonical reviewed scenarios vetted against UNSCEAR, ICRP, IAEA, and NCRP
const RAW_SCENARIOS: readonly RadiationScenario[] = [
  {
    id: "banana-intake",
    title: "Eating One Banana",
    category: "everyday",
    quantity: "effective-dose",
    value: 0.1,
    unit: "µSv",
    doseMicroSv: 0.1,
    context: "Natural dietary ingestion of Potassium-40 (K-40)",
    description:
      "Bananas naturally contain potassium, including radioactive potassium-40. Biological homeostasis quickly regulates potassium levels in the human body.",
    source: {
      name: "EPA / NCRP",
      publicationYear: 2009,
      reportTitle:
        "Ionizing Radiation Exposure of the Population of the United States",
    },
    reviewStatus: "reviewed",
  },
  {
    id: "dental-xray",
    title: "Dental Radiograph (X-ray)",
    category: "medical",
    quantity: "effective-dose",
    value: 5,
    unit: "µSv",
    doseMicroSv: 5,
    context: "Single dental bitewing diagnostic exposure",
    description:
      "Modern digital dental radiographs target small localized tissue with highly focused, low-energy diagnostic X-rays.",
    source: {
      name: "ADA / NCRP",
      publicationYear: 2012,
      reportTitle:
        "Dental Radiographic Examinations: Recommendations for Patient Selection and Limiting Radiation Exposure",
    },
    reviewStatus: "reviewed",
  },
  {
    id: "flight-transcontinental",
    title: "Transcontinental Flight (NY to LA)",
    category: "everyday",
    quantity: "effective-dose",
    value: 40,
    unit: "µSv",
    doseMicroSv: 40,
    context:
      "Cosmic radiation exposure during 6-hour commercial cruise at 35,000 ft",
    description:
      "Earth's atmosphere absorbs cosmic rays; at high cruising altitudes, thinner air shielding increases natural cosmic radiation exposure.",
    source: {
      name: "FAA / Federal Aviation Administration",
      publicationYear: 2003,
      reportTitle: "What Aircrews Should Know About Cosmic Radiation",
    },
    reviewStatus: "reviewed",
  },
  {
    id: "chest-xray",
    title: "Standard Chest X-Ray",
    category: "medical",
    quantity: "effective-dose",
    value: 100,
    unit: "µSv",
    doseMicroSv: 100,
    context: "Single posteroanterior (PA) chest examination (~0.1 mSv)",
    description:
      "A conventional two-dimensional diagnostic chest X-ray provides quick structural imaging of the lungs and heart at very modest radiation doses.",
    source: {
      name: "UNSCEAR",
      publicationYear: 2008,
      reportTitle: "Sources and Effects of Ionizing Radiation (Annex A)",
    },
    reviewStatus: "reviewed",
  },
  {
    id: "annual-background-global",
    title: "Annual Global Natural Background",
    category: "everyday",
    quantity: "effective-dose",
    value: 2400,
    unit: "µSv",
    doseMicroSv: 2400,
    context: "Global average cumulative annual exposure (~2.4 mSv/year)",
    description:
      "Received by all human beings from cosmic rays, terrestrial radionuclides in soil/rock, and inhaled radon gas (which accounts for ~50% of the natural total).",
    source: {
      name: "UNSCEAR",
      publicationYear: 2008,
      reportTitle:
        "Report to the General Assembly: Sources and Effects of Ionizing Radiation",
    },
    reviewStatus: "reviewed",
  },
  {
    id: "ct-scan-chest",
    title: "Chest CT Scan",
    category: "medical",
    quantity: "effective-dose",
    value: 7000,
    unit: "µSv",
    doseMicroSv: 7000,
    context: "Single helical computed tomography examination (~7 mSv)",
    description:
      "CT scans use rotating X-ray emitters to reconstruct high-resolution 3D cross-sections of internal organs, delivering higher doses than 2D radiographs.",
    source: {
      name: "NCRP",
      publicationYear: 2009,
      reportTitle:
        "NCRP Report No. 160: Ionizing Radiation Exposure of the Population of the United States",
    },
    reviewStatus: "reviewed",
  },
  {
    id: "worker-annual-limit",
    title: "Radiation Worker Annual Dose Limit",
    category: "occupational",
    quantity: "effective-dose",
    value: 20000,
    unit: "µSv",
    doseMicroSv: 20000,
    context:
      "International standard occupational limit (20 mSv/year averaged over 5 years)",
    description:
      "ICRP and IAEA regulatory limit for nuclear facility operators, radiochemists, and industrial radiographers to prevent stochastic health effects.",
    source: {
      name: "ICRP",
      publicationYear: 2007,
      reportTitle:
        "The 2007 Recommendations of the International Commission on Radiological Protection (Publication 103)",
    },
    reviewStatus: "reviewed",
  },
  {
    id: "emergency-responder-limit",
    title: "Emergency Lifesaving Worker Limit",
    category: "safety-limit",
    quantity: "effective-dose",
    value: 250000,
    unit: "µSv",
    doseMicroSv: 250000,
    context:
      "Maximum international guideline for informed volunteers performing lifesaving actions (250 mSv)",
    description:
      "Established by the IAEA and ICRP for catastrophic accident response (such as critical containment cooling or casualty rescue) where benefits outweigh risks.",
    source: {
      name: "IAEA",
      publicationYear: 2014,
      reportTitle:
        "Radiation Protection and Safety of Radiation Sources: International Basic Safety Standards (GSR Part 3)",
    },
    reviewStatus: "reviewed",
  },
  {
    id: "acute-sickness-threshold",
    title: "Acute Radiation Sickness Threshold",
    category: "acute-severe",
    quantity: "effective-dose",
    value: 1000000,
    unit: "µSv",
    doseMicroSv: 1000000,
    context:
      "Onset of acute clinical symptoms from short-term whole-body exposure (~1 Sv / 1,000 mSv)",
    description:
      "The threshold for deterministic tissue reactions including temporary reduction in white blood cell counts, nausea, and fatigue. Not observed in normal operations.",
    source: {
      name: "CDC / Radiation Emergencies",
      publicationYear: 2018,
      reportTitle: "Acute Radiation Syndrome: A Fact Sheet for Clinicians",
    },
    reviewStatus: "reviewed",
  },
  {
    id: "lethal-dose-50",
    title: "Lethal Dose (LD50/30)",
    category: "acute-severe",
    quantity: "effective-dose",
    value: 4000000,
    unit: "µSv",
    doseMicroSv: 4000000,
    context:
      "Acute whole-body dose lethal to 50% of an exposed population within 30 days without medical care (~4 Sv)",
    description:
      "Causes severe hematopoietic bone marrow failure. With modern supportive medical treatment (stem cell therapy, sterile environments), the LD50 shifts higher.",
    source: {
      name: "UNSCEAR / US NRC",
      publicationYear: 2016,
      reportTitle: "Biological Effects of Radiation, NUREG/BR-0216",
    },
    reviewStatus: "reviewed",
  },
];

// Validate all scenarios against schema at module initialization
export const REVIEWED_RADIATION_SCENARIOS: readonly RadiationScenario[] =
  RAW_SCENARIOS.map((s) => RadiationScenarioSchema.parse(s));

export function getRadiationScenarios(
  category?: ScenarioCategory,
): readonly RadiationScenario[] {
  if (!category) {
    return REVIEWED_RADIATION_SCENARIOS;
  }
  return REVIEWED_RADIATION_SCENARIOS.filter((s) => s.category === category);
}

export function getScenarioById(id: string): RadiationScenario | null {
  return REVIEWED_RADIATION_SCENARIOS.find((s) => s.id === id) ?? null;
}
