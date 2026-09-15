/**
 * Reactor Core Dynamics & Control Rod Physics Model
 * Grounded in Lamarsh & Baratta, "Introduction to Nuclear Engineering",
 * and standard PWR/BWR operational safety physics (Way-Wigner decay heat equation).
 */

import { z } from "zod";

export const REACTOR_SPEC = {
  name: "Generic 1,000 MWe Light Water Reactor",
  nominalThermalPowerMwt: 3000,
  nominalElectricalPowerMwe: 1000,
  thermalEfficiency: 0.333,
  nominalCoolantFlowKgPerSec: 16000,
  coolantInletTempC: 290,
  nominalCoolantOutletTempC: 326,
  nominalFuelTempC: 650,
  maxSafeFuelTempC: 1200,
  /** Doppler temperature coefficient in pcm/°C (strictly negative) */
  dopplerCoeffPcmPerC: -2.5,
  /** Moderator temperature coefficient in pcm/°C (negative in operating window) */
  moderatorCoeffPcmPerC: -15.0,
  /** Critical rod insertion position % under nominal equilibrium conditions */
  nominalCriticalRodPercent: 52.0,
  /** Delayed neutron fraction beta */
  beta: 0.0065,
  /** Equilibrium Xenon-135 negative reactivity worth in pcm at 100% full power */
  equilibriumXenonWorthPcm: -2800,
} as const;

export const ReactorControlInputSchema = z.object({
  /** Control rod insertion: 0% = fully withdrawn, 100% = fully inserted (core shut) */
  rodInsertionPercent: z.number().min(0).max(100).default(52.0),
  /** Primary coolant pump speed %: 20% (natural circulation floor) to 100% (full forced) */
  coolantFlowPercent: z.number().min(20).max(100).default(100),
  /** Whether emergency SCRAM has been triggered */
  isScrammed: z.boolean().default(false),
  /** Elapsed seconds since SCRAM (if isScrammed is true) */
  scramElapsedSeconds: z.number().min(0).default(0),
});

export type ReactorControlInput = z.infer<typeof ReactorControlInputSchema>;

export interface ReactorOperationalState {
  thermalPowerMwt: number;
  electricalPowerMwe: number;
  capacityFactorPercent: number;
  fuelTemperatureC: number;
  coolantOutletTempC: number;
  reactivityPcm: number;
  keff: number;
  xenonReactivityPcm: number;
  xenonStatus: "equilibrium" | "building-peak" | "decaying" | "depleted";
  status:
    | "nominal"
    | "subcritical"
    | "supercritical"
    | "scrammed"
    | "thermal-warning"
    | "flow-warning";
  statusMessage: string;
  isDecayHeatOnly: boolean;
  decayHeatMwt: number;
}

/**
 * Calculates real-time reactor core parameters based on control rod position,
 * coolant flow rate, and SCRAM status.
 */
export function calculateReactorCoreState(
  input: ReactorControlInput,
): ReactorOperationalState {
  const validated = ReactorControlInputSchema.parse(input);
  const {
    rodInsertionPercent,
    coolantFlowPercent,
    isScrammed,
    scramElapsedSeconds,
  } = validated;

  if (isScrammed) {
    // SCRAM condition: Control rods drop via gravity into core.
    // Prompt fission collapses to zero in <2 seconds.
    // Residual decay heat follows standard Way-Wigner / ANS-5.1 decay heat curve.
    // P_decay(t) ~ P0 * 0.065 * (t + 1)^(-0.2)
    const decayFraction =
      0.065 * Math.pow(Math.max(1, scramElapsedSeconds + 1), -0.2);
    const decayHeatMwt =
      Math.round(REACTOR_SPEC.nominalThermalPowerMwt * decayFraction * 10) / 10;
    const thermalPowerMwt = decayHeatMwt;
    const electricalPowerMwe = 0; // Turbine tripped on reactor trip

    const flowRatio = coolantFlowPercent / 100;
    const coolantDeltaT =
      (decayHeatMwt / REACTOR_SPEC.nominalThermalPowerMwt) * (36 / flowRatio);
    const coolantOutletTempC =
      Math.round((REACTOR_SPEC.coolantInletTempC + coolantDeltaT) * 10) / 10;
    const fuelTemperatureC =
      Math.round((coolantOutletTempC + (decayHeatMwt / 3000) * 320) * 10) / 10;

    // Post-shutdown Xenon-135 dynamics (I-135 decay without neutron burnup creates Xenon pit):
    const hoursSinceScram = scramElapsedSeconds / 3600;
    let xenonReactivityPcm = -2800;
    let xenonStatus: ReactorOperationalState["xenonStatus"] = "building-peak";
    if (hoursSinceScram <= 10) {
      xenonReactivityPcm = Math.round(-2800 - 1500 * (hoursSinceScram / 10));
      xenonStatus = "building-peak";
    } else if (hoursSinceScram <= 48) {
      const decayProgress = (hoursSinceScram - 10) / 38;
      xenonReactivityPcm = Math.round(-4300 * (1 - decayProgress));
      xenonStatus = "decaying";
    } else {
      xenonReactivityPcm = 0;
      xenonStatus = "depleted";
    }

    return {
      thermalPowerMwt,
      electricalPowerMwe,
      capacityFactorPercent: 0,
      fuelTemperatureC,
      coolantOutletTempC,
      reactivityPcm: -4500, // Deep negative shutdown reactivity
      keff: 0.957,
      xenonReactivityPcm,
      xenonStatus,
      status: "scrammed",
      statusMessage: `REACTOR SCRAMMED: Control rods fully inserted. Prompt fission halted. Removing ${decayHeatMwt} MWt residual decay heat via emergency core cooling.`,
      isDecayHeatOnly: true,
      decayHeatMwt,
    };
  }

  // Normal / Regulated Operating Regime
  // 1. Reactivity worth of control rods (rod worth curve: sigmoid or linear approximation)
  // At nominal critical position (~52%), reactivity offset is zero.
  const rodReactivityDeltaPcm =
    (REACTOR_SPEC.nominalCriticalRodPercent - rodInsertionPercent) * 25.0;

  // 2. Power determination based on rod insertion
  // At nominal critical position (52%), power = 1.0 (3000 MWt).
  // Withdrawing towards 0% allows up to 1.15x design overpower margin.
  // Inserting past 52% drops power down to subcritical levels (0.02x at 100%).
  let targetPowerRatio: number;
  if (rodInsertionPercent <= REACTOR_SPEC.nominalCriticalRodPercent) {
    const fractionAboveCritical =
      (REACTOR_SPEC.nominalCriticalRodPercent - rodInsertionPercent) /
      REACTOR_SPEC.nominalCriticalRodPercent;
    targetPowerRatio = 1.0 + 0.15 * fractionAboveCritical;
  } else {
    const fractionBelowCritical =
      (rodInsertionPercent - REACTOR_SPEC.nominalCriticalRodPercent) /
      (100.0 - REACTOR_SPEC.nominalCriticalRodPercent);
    targetPowerRatio = Math.max(0.02, 1.0 - 0.98 * fractionBelowCritical);
  }

  const thermalPowerMwt = Math.round(
    REACTOR_SPEC.nominalThermalPowerMwt * targetPowerRatio,
  );
  const electricalPowerMwe = Math.round(
    thermalPowerMwt * REACTOR_SPEC.thermalEfficiency,
  );
  const capacityFactorPercent = Math.round(
    (thermalPowerMwt / REACTOR_SPEC.nominalThermalPowerMwt) * 100,
  );

  // 3. Thermal hydraulic temperatures
  const flowFraction = Math.max(0.2, coolantFlowPercent / 100.0);
  const coreDeltaT =
    (thermalPowerMwt / REACTOR_SPEC.nominalThermalPowerMwt / flowFraction) *
    36.0;
  const coolantOutletTempC =
    Math.round((REACTOR_SPEC.coolantInletTempC + coreDeltaT) * 10) / 10;
  const fuelDeltaT =
    (thermalPowerMwt / REACTOR_SPEC.nominalThermalPowerMwt) * 350.0;
  const fuelTemperatureC =
    Math.round((coolantOutletTempC + fuelDeltaT) * 10) / 10;

  // 4. Inherent feedback reactivity
  const dopplerFeedback =
    (fuelTemperatureC - REACTOR_SPEC.nominalFuelTempC) *
    REACTOR_SPEC.dopplerCoeffPcmPerC;
  const moderatorFeedback =
    (coolantOutletTempC - REACTOR_SPEC.nominalCoolantOutletTempC) *
    REACTOR_SPEC.moderatorCoeffPcmPerC;
  const netReactivityPcm = Math.round(
    rodReactivityDeltaPcm + dopplerFeedback + moderatorFeedback,
  );

  // k_eff = 1 / (1 - rho) where rho = pcm / 1e5
  const rho = netReactivityPcm / 100000;
  const keff = Math.round((1 / (1 - rho)) * 10000) / 10000;

  // 5. Determine status and safety warnings
  let status: ReactorOperationalState["status"] = "nominal";
  let statusMessage =
    "Core operating in stable thermal equilibrium with negative reactivity feedback.";

  if (fuelTemperatureC >= 1000) {
    status = "thermal-warning";
    statusMessage =
      "THERMAL WARNING: Fuel cladding approaching temperature design limit. Insert control rods or increase coolant flow.";
  } else if (coolantFlowPercent < 45 && thermalPowerMwt > 1500) {
    status = "flow-warning";
    statusMessage =
      "FLOW WARNING: Coolant flow rate insufficient for current thermal power level. Risk of departure from nucleate boiling (DNB).";
  } else if (rodInsertionPercent < 40) {
    status = "supercritical";
    statusMessage =
      "SUPERCRITICAL: Power rising. Doppler resonance absorption and moderator heating provide negative feedback damping.";
  } else if (rodInsertionPercent > 65) {
    status = "subcritical";
    statusMessage =
      "SUBCRITICAL: Core throttled down. Fission rate declining towards shutdown level.";
  }

  const xenonReactivityPcm = Math.round(
    REACTOR_SPEC.equilibriumXenonWorthPcm *
      (thermalPowerMwt / REACTOR_SPEC.nominalThermalPowerMwt),
  );

  return {
    thermalPowerMwt,
    electricalPowerMwe,
    capacityFactorPercent,
    fuelTemperatureC,
    coolantOutletTempC,
    reactivityPcm: netReactivityPcm,
    keff,
    xenonReactivityPcm,
    xenonStatus: "equilibrium",
    status,
    statusMessage,
    isDecayHeatOnly: false,
    decayHeatMwt: 0,
  };
}
