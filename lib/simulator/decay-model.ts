/**
 * Radioactive Decay & Half-Life Physics Model
 * Grounded in IAEA Nuclear Data Services and Evaluated Nuclear Structure Data File (ENSDF).
 */

import { z } from "zod";

export interface RadioisotopeInfo {
  id: string;
  name: string;
  symbol: string;
  halfLifeSeconds: number;
  halfLifeDisplay: string;
  halfLifeUnit: "days" | "years";
  decayMode: "beta-gamma" | "beta" | "alpha-gamma";
  decayModeDisplay: string;
  daughterProduct: string;
  primaryRadiation: string;
  description: string;
  color: string;
  halfLifeTimeValue: number;
}

export const RADIOISOTOPES: Record<string, RadioisotopeInfo> = {
  "I-131": {
    id: "I-131",
    name: "Iodine-131",
    symbol: "¹³¹I",
    halfLifeSeconds: 8.0252 * 86400,
    halfLifeDisplay: "8.02 days",
    halfLifeUnit: "days",
    halfLifeTimeValue: 8.02,
    decayMode: "beta-gamma",
    decayModeDisplay: "Beta minus (β⁻) + Gamma (γ)",
    daughterProduct: "Xenon-131 (¹³¹Xe, stable)",
    primaryRadiation: "β⁻ (606 keV max), γ (364 keV)",
    description:
      "A volatile fission product produced during reactor operation. Due to its affinity for the human thyroid gland, potassium iodide (KI) tablets are stocked in emergency zones to saturate thyroid receptors and prevent radioiodine uptake.",
    color: "#a78bfa", // purple-400
  },
  "Co-60": {
    id: "Co-60",
    name: "Cobalt-60",
    symbol: "⁶⁰Co",
    halfLifeSeconds: 5.2714 * 365.25 * 86400,
    halfLifeDisplay: "5.27 years",
    halfLifeUnit: "years",
    halfLifeTimeValue: 5.27,
    decayMode: "beta-gamma",
    decayModeDisplay: "Beta minus (β⁻) + Gamma (γ)",
    daughterProduct: "Nickel-60 (⁶⁰Ni, stable)",
    primaryRadiation: "β⁻ (318 keV), γ (1.17 & 1.33 MeV cascade)",
    description:
      "Artificially synthesized via neutron activation of Cobalt-59 in research reactors. Extensively utilized in gamma knife stereotactic radiosurgery for brain tumors, medical equipment sterilization, and industrial non-destructive radiography.",
    color: "#38bdf8", // sky-400
  },
  "Cs-137": {
    id: "Cs-137",
    name: "Cesium-137",
    symbol: "¹³⁷Cs",
    halfLifeSeconds: 30.08 * 365.25 * 86400,
    halfLifeDisplay: "30.08 years",
    halfLifeUnit: "years",
    halfLifeTimeValue: 30.08,
    decayMode: "beta-gamma",
    decayModeDisplay: "Beta minus (β⁻) + Gamma (γ)",
    daughterProduct: "Barium-137m (¹³⁷ᵐBa → ¹³⁷Ba stable)",
    primaryRadiation: "β⁻ (512 keV), γ (662 keV isomeric transition)",
    description:
      "A major medium-lived fission product (yield ~6.2%). Along with Sr-90, it dominates the radiotoxicity and decay heat of spent nuclear fuel for the first 300 years following discharge from the reactor.",
    color: "#fb923c", // orange-400
  },
  "Sr-90": {
    id: "Sr-90",
    name: "Strontium-90",
    symbol: "⁹⁰Sr",
    halfLifeSeconds: 28.9 * 365.25 * 86400,
    halfLifeDisplay: "28.90 years",
    halfLifeUnit: "years",
    halfLifeTimeValue: 28.9,
    decayMode: "beta",
    decayModeDisplay: "Pure Beta minus (β⁻)",
    daughterProduct: "Yttrium-90 (⁹⁰Y, t½=64h → ⁹⁰Zr stable)",
    primaryRadiation: "β⁻ (546 keV, daughter β⁻ 2.28 MeV)",
    description:
      "Chemically homologous to calcium, strontium-90 deposits preferentially in bones and teeth if ingested, causing localized bone marrow dose. It is a key metric tracked in environmental biosurveillance.",
    color: "#f43f5e", // rose-500
  },
  "C-14": {
    id: "C-14",
    name: "Carbon-14",
    symbol: "¹⁴C",
    halfLifeSeconds: 5730 * 365.25 * 86400,
    halfLifeDisplay: "5,730 years",
    halfLifeUnit: "years",
    halfLifeTimeValue: 5730,
    decayMode: "beta",
    decayModeDisplay: "Soft Beta minus (β⁻)",
    daughterProduct: "Nitrogen-14 (¹⁴N, stable)",
    primaryRadiation: "β⁻ (156 keV max, mean 49 keV)",
    description:
      "Produced in Earth's upper atmosphere by cosmic neutron bombardment of nitrogen (¹⁴N + n → ¹⁴C + p). The cornerstone of archaeological radiocarbon dating of historical biological artifacts up to ~50,000 years old.",
    color: "#34d399", // emerald-400
  },
  "U-235": {
    id: "U-235",
    name: "Uranium-235",
    symbol: "²³⁵U",
    halfLifeSeconds: 7.04e8 * 365.25 * 86400,
    halfLifeDisplay: "704 million years",
    halfLifeUnit: "years",
    halfLifeTimeValue: 704000000,
    decayMode: "alpha-gamma",
    decayModeDisplay: "Alpha (α) + Gamma (γ)",
    daughterProduct: "Thorium-231 (²³¹Th, Actinium series)",
    primaryRadiation: "α (4.40 MeV, 4.37 MeV), γ (185 keV)",
    description:
      "The only naturally occurring fissile nuclide on Earth. Its 704-million-year half-life explains why natural uranium today contains only 0.72% U-235 (down from ~3.7% when Earth formed 4.5 billion years ago, when natural reactors like Oklo could operate).",
    color: "#eab308", // yellow-500
  },
  "Ra-226": {
    id: "Ra-226",
    name: "Radium-226",
    symbol: "²²⁶Ra",
    halfLifeSeconds: 1600 * 365.25 * 86400,
    halfLifeDisplay: "1,600 years",
    halfLifeUnit: "years",
    halfLifeTimeValue: 1600,
    decayMode: "alpha-gamma",
    decayModeDisplay: "Alpha (α) + Gamma (γ)",
    daughterProduct: "Radon-222 (²²²Rn, noble gas)",
    primaryRadiation: "α (4.78 MeV), γ (186 keV)",
    description:
      "Historically discovered by Marie and Pierre Curie in pitchblende. An intermediate daughter of Uranium-238 that defined the original Curie unit of radioactivity (1 Ci = 3.7 × 10¹⁰ Bq, the activity of 1 gram of Ra-226).",
    color: "#06b6d4", // cyan-500
  },
  "Rn-222": {
    id: "Rn-222",
    name: "Radon-222",
    symbol: "²²²Rn",
    halfLifeSeconds: 3.8235 * 86400,
    halfLifeDisplay: "3.82 days",
    halfLifeUnit: "days",
    halfLifeTimeValue: 3.82,
    decayMode: "alpha-gamma",
    decayModeDisplay: "Alpha (α) + Gamma (γ)",
    daughterProduct: "Polonium-218 (²¹⁸Po → ²¹⁴Pb → ²¹⁴Bi → ²⁰⁶Pb)",
    primaryRadiation: "α (5.49 MeV), γ (510 keV)",
    description:
      "A naturally occurring radioactive noble gas produced by the decay of Radium-226 in soils and rock. Because it is chemically inert and gaseous, it can seep through foundation cracks into basements, making it the primary source of natural background radiation exposure for humans globally (~1.26 mSv/year).",
    color: "#a855f7", // purple-500
  },
};

export const DecaySimulationConfigSchema = z.object({
  isotopeId: z.string().refine((id) => id in RADIOISOTOPES, {
    message: "Invalid isotope ID",
  }),
  initialNucleiCount: z.number().int().min(10).max(5000).default(100),
  elapsedHalfLives: z.number().min(0).max(10).default(0),
});

export type DecaySimulationConfig = z.infer<typeof DecaySimulationConfigSchema>;

export interface DecayCurvePoint {
  halfLives: number;
  elapsedTimeDisplay: string;
  fractionRemaining: number;
  remainingNuclei: number;
  decayedNuclei: number;
  activityFraction: number;
}

/**
 * Calculates the exact remaining fraction according to exponential decay:
 * N(t) / N0 = (1/2)^(t / T_1/2) = e^(-lambda * t)
 */
export function calculateRemainingFraction(halfLivesElapsed: number): number {
  if (halfLivesElapsed < 0) return 1.0;
  return Math.pow(0.5, halfLivesElapsed);
}

/**
 * Generates an accessible, mathematically exact series of data points
 * along the exponential decay curve from 0 to 5 half-lives.
 */
export function generateDecayCurve(
  isotopeId: string,
  initialCount: number = 100,
  maxHalfLives: number = 5,
  stepsPerHalfLife: number = 4,
): DecayCurvePoint[] {
  const isotope = RADIOISOTOPES[isotopeId] ?? RADIOISOTOPES["Cs-137"];
  const totalSteps = Math.round(maxHalfLives * stepsPerHalfLife);
  const points: DecayCurvePoint[] = [];

  for (let i = 0; i <= totalSteps; i++) {
    const halfLives = Math.round((i / stepsPerHalfLife) * 100) / 100;
    const fraction = calculateRemainingFraction(halfLives);
    const remaining = Math.round(initialCount * fraction);
    const decayed = initialCount - remaining;

    const actualTime = halfLives * isotope.halfLifeTimeValue;
    const timeDisplay =
      actualTime >= 1000000
        ? `${(actualTime / 1000000).toFixed(1)}M ${isotope.halfLifeUnit}`
        : `${actualTime.toFixed(actualTime < 10 ? 2 : 1)} ${isotope.halfLifeUnit}`;

    points.push({
      halfLives,
      elapsedTimeDisplay: timeDisplay,
      fractionRemaining: Math.round(fraction * 10000) / 10000,
      remainingNuclei: remaining,
      decayedNuclei: decayed,
      activityFraction: Math.round(fraction * 10000) / 10000,
    });
  }

  return points;
}

/**
 * Simulates stochastic / probabilistic decay for N discrete atoms over a time step.
 * Uses binomial sampling based on decay probability p = 1 - 2^(-delta_half_lives).
 */
export function simulateDiscreteDecay(
  currentRemaining: number,
  deltaHalfLives: number,
): { newlyDecayed: number; updatedRemaining: number } {
  if (currentRemaining <= 0 || deltaHalfLives <= 0) {
    return { newlyDecayed: 0, updatedRemaining: currentRemaining };
  }

  const decayProb = 1.0 - Math.pow(0.5, deltaHalfLives);

  // For small lattice counts (e.g. 100), stochastic sampling gives a realistic educational demonstration
  let decayed = 0;
  for (let i = 0; i < currentRemaining; i++) {
    if (Math.random() < decayProb) {
      decayed++;
    }
  }

  const updated = Math.max(0, currentRemaining - decayed);
  return { newlyDecayed: decayed, updatedRemaining: updated };
}
