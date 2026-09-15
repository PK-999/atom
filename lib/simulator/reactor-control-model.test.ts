import { describe, expect, it } from "vitest";
import {
  calculateReactorCoreState,
  REACTOR_SPEC,
} from "./reactor-control-model";

describe("reactor-control-model", () => {
  it("provides standard commercial reactor specifications", () => {
    expect(REACTOR_SPEC.nominalThermalPowerMwt).toBe(3000);
    expect(REACTOR_SPEC.nominalElectricalPowerMwe).toBe(1000);
    expect(REACTOR_SPEC.dopplerCoeffPcmPerC).toBeLessThan(0); // must be negative for safety
    expect(REACTOR_SPEC.moderatorCoeffPcmPerC).toBeLessThan(0); // must be negative
  });

  it("calculates nominal equilibrium state at critical rod position", () => {
    const state = calculateReactorCoreState({
      rodInsertionPercent: 52.0,
      coolantFlowPercent: 100,
      isScrammed: false,
      scramElapsedSeconds: 0,
    });

    expect(state.status).toBe("nominal");
    expect(state.thermalPowerMwt).toBeGreaterThan(2500);
    expect(state.electricalPowerMwe).toBeGreaterThan(800);
    expect(state.isDecayHeatOnly).toBe(false);
    expect(state.xenonReactivityPcm).toBeLessThan(0);
    expect(state.xenonStatus).toBe("equilibrium");
  });

  it("triggers SCRAM and correctly models immediate fission halt and residual decay heat", () => {
    const scramState = calculateReactorCoreState({
      rodInsertionPercent: 52.0,
      coolantFlowPercent: 100,
      isScrammed: true,
      scramElapsedSeconds: 0,
    });

    expect(scramState.status).toBe("scrammed");
    expect(scramState.electricalPowerMwe).toBe(0);
    expect(scramState.isDecayHeatOnly).toBe(true);
    // Residual decay heat at t=0 is ~6.5% of 3000 MWt (~195 MWt)
    expect(scramState.decayHeatMwt).toBeGreaterThan(150);
    expect(scramState.decayHeatMwt).toBeLessThan(250);
    expect(scramState.keff).toBeLessThan(0.97);
    expect(scramState.reactivityPcm).toBeLessThan(-3000);
    expect(scramState.xenonReactivityPcm).toBeLessThan(0);
    expect(scramState.xenonStatus).toBe("building-peak");
  });

  it("models decay heat attenuation over time after SCRAM", () => {
    const t0 = calculateReactorCoreState({
      rodInsertionPercent: 100,
      coolantFlowPercent: 100,
      isScrammed: true,
      scramElapsedSeconds: 0,
    });

    const t3600 = calculateReactorCoreState({
      rodInsertionPercent: 100,
      coolantFlowPercent: 100,
      isScrammed: true,
      scramElapsedSeconds: 3600,
    });

    expect(t3600.decayHeatMwt).toBeLessThan(t0.decayHeatMwt);
  });

  it("flags safety warnings on low coolant flow or elevated temperature", () => {
    const flowWarning = calculateReactorCoreState({
      rodInsertionPercent: 30, // high power
      coolantFlowPercent: 30, // throttled pumps
      isScrammed: false,
      scramElapsedSeconds: 0,
    });

    expect(["flow-warning", "thermal-warning"]).toContain(flowWarning.status);
    expect(flowWarning.statusMessage).toContain("WARNING");
  });
});
