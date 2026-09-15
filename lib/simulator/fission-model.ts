/**
 * Nuclear Fission & Chain Reaction Physics Model
 * Grounded in Lamarsh & Baratta, "Introduction to Nuclear Engineering" (3rd Ed.),
 * and IAEA Nuclear Data Services (NDS) evaluated cross-section libraries (ENDF/B-VIII.0).
 */

import { z } from "zod";

/**
 * Standard physical constants for U-235 thermal neutron fission
 */
export const FISSION_PHYSICS_CONSTANTS = {
  /** Energy released per U-235 fission event in MeV (~200 MeV) */
  ENERGY_PER_FISSION_MEV: 200.0,
  /** Energy per fission in Joules: 200 MeV * 1.602176634e-13 J/MeV */
  ENERGY_PER_FISSION_JOULES: 3.204353e-11,
  /** Average number of prompt neutrons released per thermal fission of U-235 (nu) */
  AVERAGE_NEUTRONS_PER_FISSION: 2.43,
  /** Delayed neutron fraction for U-235 thermal fission (beta) */
  DELAYED_NEUTRON_FRACTION_BETA: 0.0065,
  /** Average prompt neutron generation lifetime in seconds (l*) for light water reactor */
  PROMPT_NEUTRON_LIFETIME_SEC: 1.0e-4,
  /** Weighted mean decay constant for delayed neutron precursors (lambda_d) in s^-1 */
  DELAYED_PRECURSOR_LAMBDA_SEC: 0.08,
  /** U-235 thermal fission cross section (at 0.0253 eV) in barns */
  THERMAL_FISSION_CROSS_SECTION_BARNS: 585.0,
  /** Fast fission cross section (at 1 MeV) in barns */
  FAST_FISSION_CROSS_SECTION_BARNS: 1.2,
} as const;

export const FissionSimulationConfigSchema = z.object({
  /** U-235 enrichment percentage: 0.7% (natural) to 20% (LEU limit) */
  enrichmentPercent: z.number().min(0.7).max(20.0).default(4.5),
  /** Moderator density fraction: 0 (dry core/void) to 1.0 (optimal light water) */
  moderatorDensity: z.number().min(0).max(1.0).default(0.9),
  /** Control rod insertion percentage: 0% (fully withdrawn) to 100% (fully inserted) */
  controlRodInsertionPercent: z.number().min(0).max(100).default(50),
  /** Boron absorber concentration in ppm (0 to 2000 ppm) */
  boronConcentrationPpm: z.number().min(0).max(2500).default(500),
});

export type FissionSimulationConfig = z.infer<
  typeof FissionSimulationConfigSchema
>;

export type CriticalityState =
  "subcritical" | "critical" | "supercritical" | "prompt-critical";

export interface FissionStateCalculation {
  keff: number;
  reactivityRho: number;
  reactivityDollars: number;
  criticalityState: CriticalityState;
  thermalFissionProbability: number;
  promptMultiplication: number;
  description: string;
}

/**
 * Calculates effective neutron multiplication factor (k_eff)
 * and criticality state from reactor core parameters.
 *
 * Physics formulation:
 * - Fissile enrichment provides excess neutron yield eta * f.
 * - Moderator density slows fast 2 MeV fission neutrons to 0.025 eV thermal neutrons,
 *   where U-235 fission cross section is ~500x higher. In a light water reactor,
 *   loss of moderator (void) causes negative reactivity (passive inherent safety).
 * - Control rods (silver-indium-cadmium or boron carbide) insert strong thermal neutron capture.
 * - Soluble boron in primary coolant provides uniform chemical shim absorption.
 */
export function calculateEffectiveMultiplication(
  config: FissionSimulationConfig,
): FissionStateCalculation {
  const validated = FissionSimulationConfigSchema.parse(config);
  const {
    enrichmentPercent,
    moderatorDensity,
    controlRodInsertionPercent,
    boronConcentrationPpm,
  } = validated;

  // 1. Base infinite multiplication factor k_inf governed by enrichment
  // Natural uranium (0.7%) cannot achieve criticality in light water.
  // 3-5% LEU gives k_inf ~ 1.25 to 1.35 in optimal geometry.
  const baseKinf = 0.65 + (enrichmentPercent / 5.0) * 0.65;

  // 2. Moderator slowing-down efficiency (resonance escape & thermalization)
  // Optimal moderation is near 0.9 - 1.0. If density drops towards 0 (voiding),
  // thermalization collapses, driving k_eff far below 1 (inherent negative void coefficient).
  const moderationFactor = Math.sin(
    (Math.PI / 2) * Math.min(1.0, moderatorDensity * 1.1),
  );

  // 3. Control rod absorption factor
  // 0% inserted = 0 worth subtracted. 100% inserted = strong negative reactivity (~ -0.25 to -0.30 delta k).
  const rodWorth = (controlRodInsertionPercent / 100.0) * 0.35;

  // 4. Boron chemical shim absorption
  const boronWorth = (boronConcentrationPpm / 1000.0) * 0.08;

  // 5. Leakage factor (non-leakage probability P_NL ~ 0.96 in large power reactor)
  const nonLeakageProb = 0.96;

  // Effective multiplication factor k_eff
  const rawKeff =
    (baseKinf * moderationFactor - rodWorth - boronWorth) * nonLeakageProb;
  const keff = Math.max(0.01, Math.round(rawKeff * 10000) / 10000);

  // Reactivity rho = (k - 1) / k
  const reactivityRho = Math.round(((keff - 1.0) / keff) * 100000) / 100000;

  // Reactivity in dollars ($) = rho / beta
  const beta = FISSION_PHYSICS_CONSTANTS.DELAYED_NEUTRON_FRACTION_BETA;
  const reactivityDollars = Math.round((reactivityRho / beta) * 100) / 100;

  // Criticality classification
  let criticalityState: CriticalityState;
  let description: string;

  if (reactivityDollars >= 1.0) {
    criticalityState = "prompt-critical";
    description =
      "Supercritical on prompt neutrons alone (rho >= beta). Extremely rapid microsecond power ramp; prevented in commercial power reactors by core design and control limits.";
  } else if (keff > 1.002) {
    criticalityState = "supercritical";
    description =
      "Delayed supercritical (0 < rho < beta). Reactor power increases at a rate governed by delayed neutron precursors (seconds to minutes), allowing stable operator and computer control.";
  } else if (keff >= 0.998) {
    criticalityState = "critical";
    description =
      "Exactly critical (k_eff = 1.000). Fission rate and thermal power remain in steady-state equilibrium. Each fission produces exactly one neutron that causes a subsequent fission.";
  } else {
    criticalityState = "subcritical";
    description =
      "Subcritical (k_eff < 1.000). Neutron population and fission rate decay exponentially unless an external neutron source is present.";
  }

  const thermalFissionProbability = Math.min(
    1.0,
    Math.round(moderatorDensity * (enrichmentPercent / 5.0) * 0.85 * 100) / 100,
  );

  return {
    keff,
    reactivityRho,
    reactivityDollars,
    criticalityState,
    thermalFissionProbability,
    promptMultiplication:
      FISSION_PHYSICS_CONSTANTS.AVERAGE_NEUTRONS_PER_FISSION,
    description,
  };
}

/**
 * Step forward the point kinetics neutron population over time deltaT
 * using simplified prompt + single-delayed-group point kinetics.
 */
export function stepNeutronKinetics(
  currentNeutrons: number,
  precursorConcentration: number,
  keff: number,
  deltaTSeconds: number = 0.1,
): {
  nextNeutrons: number;
  nextPrecursors: number;
  fissionsInStep: number;
  energyReleasedJoules: number;
} {
  const beta = FISSION_PHYSICS_CONSTANTS.DELAYED_NEUTRON_FRACTION_BETA;
  const lambda = FISSION_PHYSICS_CONSTANTS.DELAYED_PRECURSOR_LAMBDA_SEC;
  const lStar = FISSION_PHYSICS_CONSTANTS.PROMPT_NEUTRON_LIFETIME_SEC;

  // Reactivity rho
  const rho = (keff - 1.0) / Math.max(0.01, keff);

  // Point kinetics rates:
  // dn/dt = ((rho - beta) / l*) * n + lambda * C
  // dC/dt = (beta / l*) * n - lambda * C
  const promptRate = (rho - beta) / lStar;
  const dn_dt = promptRate * currentNeutrons + lambda * precursorConcentration;
  const dC_dt =
    (beta / lStar) * currentNeutrons - lambda * precursorConcentration;

  // Numerical integration with numerical damping for UI stability
  const nextN = Math.max(
    0,
    currentNeutrons + dn_dt * Math.min(deltaTSeconds, 0.02),
  );
  const nextC = Math.max(
    0,
    precursorConcentration + dC_dt * Math.min(deltaTSeconds, 0.02),
  );

  // Fissions during step
  const fissionsInStep = Math.max(
    0,
    Math.round(((currentNeutrons * deltaTSeconds) / lStar) * 0.05),
  );
  const energyReleasedJoules =
    fissionsInStep * FISSION_PHYSICS_CONSTANTS.ENERGY_PER_FISSION_JOULES;

  return {
    nextNeutrons: Math.round(nextN),
    nextPrecursors: Math.round(nextC),
    fissionsInStep,
    energyReleasedJoules,
  };
}
