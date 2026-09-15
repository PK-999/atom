"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  calculateReactorCoreState,
  REACTOR_SPEC,
  type ReactorControlInput,
} from "@/lib/simulator/reactor-control-model";
import styles from "./ReactorControlSimulator.module.css";

export function ReactorControlSimulator() {
  const [complexity] = useComplexityPreference("curious");

  const [input, setInput] = useState<ReactorControlInput>({
    rodInsertionPercent: 52.0,
    coolantFlowPercent: 100,
    isScrammed: false,
    scramElapsedSeconds: 0,
  });

  const [tripLogs, setTripLogs] = useState<string[]>([
    "T-00:00:00: Reactor synchronized to 400kV transmission grid. Automatic thermal equilibrium nominal.",
  ]);

  // Timer for SCRAM decay heat progression
  useEffect(() => {
    if (!input.isScrammed) return;

    const timer = setInterval(() => {
      setInput((prev) => {
        if (!prev.isScrammed) return prev;
        return {
          ...prev,
          scramElapsedSeconds: prev.scramElapsedSeconds + 5,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [input.isScrammed]);

  const state = useMemo(() => {
    return calculateReactorCoreState(input);
  }, [input]);

  // Trigger emergency SCRAM
  const handleScram = () => {
    setInput((prev) => ({
      ...prev,
      isScrammed: true,
      rodInsertionPercent: 100,
      scramElapsedSeconds: 0,
    }));
    setTripLogs((prev) => [
      `[SAFETY TRIP] Emergency SCRAM actuated. Magnetic clutches de-energized, control rods gravity-inserted. Turbine tripped. Residual decay heat removal active.`,
      ...prev,
    ]);
  };

  // Reset / Cold Restart Reactor
  const handleRestart = () => {
    setInput({
      rodInsertionPercent: 52.0,
      coolantFlowPercent: 100,
      isScrammed: false,
      scramElapsedSeconds: 0,
    });
    setTripLogs((prev) => [
      `[OPERATOR] Cold restart sequence completed. Safety interlocks cleared. Rod bank reset to 52.0% critical position.`,
      ...prev,
    ]);
  };

  const cherenkovOpacity = input.isScrammed
    ? 0.12
    : Math.min(
        0.95,
        0.15 +
          (state.thermalPowerMwt / REACTOR_SPEC.nominalThermalPowerMwt) * 0.8,
      );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon} aria-hidden="true">
            🎛️
          </span>
          Commercial Reactor Core & Control Rod Simulator
        </h3>
        <p className={styles.description}>
          {complexity === "beginner"
            ? "Take the controls of a 1,000 MW nuclear power station! Control rods soak up neutrons like sponges to control the heat. If anything goes wrong, hit the big red SCRAM button to drop all rods instantly!"
            : complexity === "geeky"
              ? "Thermo-hydraulic and reactivity balance for a 3,000 MWt PWR core. Solves coupled Doppler resonance absorption (α_fuel = -2.5 pcm/°C), moderator temperature feedback (α_mod = -15 pcm/°C), and ANS-5.1/Way-Wigner decay heat post-SCRAM."
              : "Operate a commercial light-water reactor core. Regulate thermal power output by adjusting control rod insertion and coolant flow, or trigger an emergency SCRAM to inspect residual decay heat dynamics."}
        </p>
      </div>

      {/* Level-Customized Pedagogical Insight Banner */}
      <div className={styles.levelBanner}>
        <div className={styles.levelBannerHeader}>
          <span className={styles.levelBannerBadge}>
            Level{" "}
            {complexity === "beginner"
              ? "1 · Beginner"
              : complexity === "explorer"
                ? "2 · Explorer"
                : complexity === "curious"
                  ? "3 · Curious"
                  : complexity === "deep-dive"
                    ? "4 · Deep Dive"
                    : "5 · Geeky"}
          </span>
          <span className={styles.sliderValue}>
            Thermal Power: {state.thermalPowerMwt.toLocaleString()} MWt (
            {((state.thermalPowerMwt / 3000) * 100).toFixed(0)}%)
          </span>
        </div>

        {complexity === "beginner" && (
          <div>
            <div className={styles.levelBannerTitle}>
              🫖 The Giant Clean Tea Kettle
            </div>
            <p className={styles.levelBannerText}>
              A nuclear reactor works just like a giant, super-clean tea kettle!
              Inside, ceramic uranium fuel pellets make water blazing hot
              without burning any coal or gas. The steam rushes through giant
              turbine blades to power whole cities. Control rods are like magic
              safety brakes: drop them into the core and the nuclear reaction
              stops in under 2 seconds!
            </p>
          </div>
        )}

        {complexity === "explorer" && (
          <div>
            <div className={styles.levelBannerTitle}>
              🔄 Primary Coolant Loop & Control Rod Balance
            </div>
            <p className={styles.levelBannerText}>
              In a Pressurized Water Reactor (PWR), primary water is kept under
              155 atmospheres of intense pressure so it stays liquid even at
              326°C. High-flow coolant pumps circulate 16,000 kg of water per
              second through 50,000 fuel rods. Moving the control rod banks up
              or down fine-tunes thermal power with millimeter precision.
            </p>
          </div>
        )}

        {complexity === "curious" && (
          <div>
            <div className={styles.levelBannerTitle}>
              ⚡ Thermal Conversion & Way-Wigner Decay Heat Law
            </div>
            <p className={styles.levelBannerText}>
              Nuclear reactors produce 3,000 MW of thermal heat, yielding 1,000
              MW of electrical power at 33.3% Carnot efficiency. When an
              emergency SCRAM drops control rods, the fission chain reaction
              halts instantly. However, accumulated radioactive fission products
              continue decaying, generating ~6.5% (~195 MWt) residual decay
              heat, which requires emergency cooling systems (ECCS) to prevent
              overheating.
            </p>
            <div className={styles.levelBannerFormula}>
              <span>
                P_decay(t) = P_0 · 0.065 · (t + 1)^(-0.2) | 3,000 MWt → 1,000
                MWe (η = 33.3%)
              </span>
            </div>
          </div>
        )}

        {complexity === "deep-dive" && (
          <div>
            <div className={styles.levelBannerTitle}>
              🛡️ Inherent Safety: Doppler & Moderator Reactivity Coefficients
            </div>
            <p className={styles.levelBannerText}>
              Commercial LWR cores are engineered with strictly negative
              reactivity feedback. As fuel heats up, Doppler broadening of ²³⁸U
              absorption resonances at 6.67 eV captures more neutrons (α_fuel =
              -2.5 pcm/°C). As coolant warms, its density drops, reducing
              moderation (α_mod = -15 pcm/°C). If core power spikes, these
              physical laws automatically throttle reactivity back down without
              human intervention.
            </p>
            <div className={styles.levelBannerFormula}>
              <span>
                {
                  "Δρ_total = Δρ_rods + α_Doppler · ΔT_fuel + α_mod · ΔT_coolant | α_Doppler < 0, α_mod < 0"
                }
              </span>
            </div>
          </div>
        )}

        {complexity === "geeky" && (
          <div>
            <div className={styles.levelBannerTitle}>
              🔬 Point Kinetics, ANS-5.1 Decay Heat & DNBR Margin Limits
            </div>
            <p className={styles.levelBannerText}>
              A reactor trip introduces -4,500 pcm of negative shutdown
              reactivity. The prompt jump causes prompt neutron flux to drop by
              a factor of β/(β - ρ) in ~10⁻⁴ s, leaving delayed neutron
              precursor groups and fission product decay (ANS-5.1 standard).
              Thermal margin is strictly governed by Departure from Nucleate
              Boiling Ratio (DNBR &gt; 1.30) to prevent boiling crisis along
              zircaloy fuel pin surfaces.
            </p>
            <div className={styles.levelBannerFormula}>
              <span>
                {
                  'DNBR = q"_crit / q"_actual > 1.30 | Δρ_scram = -4,500 pcm | Prompt drop: n₁/n₀ ≈ β/(β - ρ)'
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Safety Annunciator Status Banner */}
      <div
        className={`${styles.annunciatorBanner} ${
          state.status === "scrammed"
            ? styles.annunciatorScrammed
            : state.status === "thermal-warning" ||
                state.status === "flow-warning"
              ? styles.annunciatorWarning
              : state.status === "supercritical"
                ? styles.annunciatorSupercritical
                : state.status === "subcritical"
                  ? styles.annunciatorSubcritical
                  : styles.annunciatorNominal
        }`}
        role="alert"
      >
        <span aria-hidden="true">
          {state.status === "scrammed"
            ? "🚨"
            : state.status === "thermal-warning" ||
                state.status === "flow-warning"
              ? "⚠️"
              : "✅"}
        </span>
        <span>{state.statusMessage}</span>
      </div>

      <div className={styles.mainGrid}>
        {/* Core Vessel Schematic */}
        <div className={styles.stageCard}>
          <div className={styles.coreSvgWrapper}>
            <svg
              className={styles.coreSvg}
              viewBox="0 0 460 310"
              role="img"
              aria-label="Reactor pressure vessel schematic showing control rod drive mechanisms and active fuel zone"
            >
              <defs>
                {/* Metallic Forged Steel Vessel Wall Gradient */}
                <linearGradient
                  id="vesselWallGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="20%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="80%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                {/* Inner Stainless Steel Cladding Layer */}
                <linearGradient
                  id="innerCladGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="50%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                {/* Cherenkov Radiation Blue Optical Glow */}
                <radialGradient
                  id="cherenkovCorePool"
                  cx="50%"
                  cy="55%"
                  r="60%"
                >
                  <stop
                    offset="0%"
                    stopColor="#38bdf8"
                    stopOpacity={cherenkovOpacity}
                  />
                  <stop
                    offset="45%"
                    stopColor="#0284c7"
                    stopOpacity={cherenkovOpacity * 0.75}
                  />
                  <stop
                    offset="85%"
                    stopColor="#0369a1"
                    stopOpacity={cherenkovOpacity * 0.3}
                  />
                  <stop offset="100%" stopColor="#030812" stopOpacity="0" />
                </radialGradient>

                {/* Cold Leg Inlet Fluid Stream */}
                <linearGradient
                  id="coldLegGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                {/* Hot Leg Outlet Fluid Stream */}
                <linearGradient
                  id="hotLegGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>

              {/* CRDM (Control Rod Drive Mechanism) Top Nozzles */}
              {[190, 215, 240, 265].map((rx) => (
                <g key={`crdm-${rx}`}>
                  <rect
                    x={rx - 3}
                    y="4"
                    width="6"
                    height="32"
                    fill="#64748b"
                    stroke="#334155"
                    strokeWidth="1"
                  />
                  <rect
                    x={rx - 5}
                    y="2"
                    width="10"
                    height="5"
                    rx="1"
                    fill="#94a3b8"
                  />
                </g>
              ))}

              {/* Reactor Pressure Vessel (RPV) Outer Shell with Hemispherical Heads */}
              <path
                d="M 140 50 C 140 28, 320 28, 320 50 L 320 250 C 320 290, 140 290, 140 250 Z"
                fill="url(#vesselWallGrad)"
                stroke="#64748b"
                strokeWidth="2.5"
              />

              {/* Heavy Flange Stud Bolts */}
              {[134, 322].map((fx, i) => (
                <rect
                  key={`flange-${i}`}
                  x={fx}
                  y="46"
                  width="6"
                  height="12"
                  rx="2"
                  fill="#cbd5e1"
                  stroke="#334155"
                />
              ))}

              {/* Inner Vessel Cavity (Water Coolant Pool) */}
              <path
                d="M 152 52 C 152 38, 308 38, 308 52 L 308 248 C 308 280, 152 280, 152 248 Z"
                fill="#051020"
                stroke="url(#innerCladGrad)"
                strokeWidth="2"
              />

              {/* Downcomer Annulus (Coolant flow path along wall) */}
              <rect
                x="156"
                y="55"
                width="8"
                height="190"
                fill="rgba(56, 189, 248, 0.15)"
              />
              <rect
                x="296"
                y="55"
                width="8"
                height="190"
                fill="rgba(56, 189, 248, 0.15)"
              />

              {/* Core Barrel & Support Structure */}
              <rect
                x="168"
                y="85"
                width="124"
                height="155"
                rx="4"
                fill="#081426"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Cherenkov Radiation Blue Core Glow */}
              <rect
                x="170"
                y="87"
                width="120"
                height="150"
                rx="4"
                fill="url(#cherenkovCorePool)"
              />

              {/* Fuel Assemblies (Zircaloy Pin Bundles) */}
              {[178, 196, 214, 232, 250, 268].map((x) => (
                <g key={`core-fuel-${x}`}>
                  <rect
                    x={x}
                    y="100"
                    width="14"
                    height="128"
                    rx="2"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="1"
                  />
                  {/* Pellet Chamfer Lines */}
                  {[115, 135, 155, 175, 195].map((py) => (
                    <line
                      key={`pellet-line-${x}-${py}`}
                      x1={x + 2}
                      y1={py}
                      x2={x + 12}
                      y2={py}
                      stroke="#334155"
                      strokeWidth="1"
                    />
                  ))}
                </g>
              ))}

              {/* Control Rod Clusters (Descend from top into fuel) */}
              {[187, 205, 223, 241, 259].map((x) => {
                const rodY2 = 45 + (input.rodInsertionPercent / 100) * 175;
                return (
                  <g key={`core-rod-${x}`}>
                    {/* Drive Rod */}
                    <line
                      x1={x + 3}
                      y1="25"
                      x2={x + 3}
                      y2={rodY2}
                      stroke="#94a3b8"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    {/* Absorber Finger (Ag-In-Cd) */}
                    <line
                      x1={x + 3}
                      y1="25"
                      x2={x + 3}
                      y2={rodY2}
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                    <circle cx={x + 3} cy={rodY2} r="3" fill="#cbd5e1" />
                  </g>
                );
              })}

              {/* Cold Leg Inlet Nozzle (Left: 290°C Inflow) */}
              <g>
                <path
                  d="M 60 62 L 142 62 L 142 84 L 60 84 Z"
                  fill="url(#coldLegGrad)"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <path d="M 60 62 L 60 84" stroke="#0284c7" strokeWidth="4" />
                <text
                  x="75"
                  y="77"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="800"
                >
                  IN (290°C)
                </text>
                {/* Inflow Direction Arrow */}
                <path
                  d="M 125 73 L 135 73 L 131 69 M 135 73 L 131 77"
                  stroke="#ffffff"
                  strokeWidth="2"
                  fill="none"
                />
              </g>

              {/* Hot Leg Outlet Nozzle (Right: 326°C Outflow to Steam Generator) */}
              <g>
                <path
                  d="M 318 62 L 400 62 L 400 84 L 318 84 Z"
                  fill="url(#hotLegGrad)"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <path d="M 400 62 L 400 84" stroke="#f43f5e" strokeWidth="4" />
                <text
                  x="326"
                  y="77"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="800"
                >
                  OUT (326°C)
                </text>
                {/* Outflow Direction Arrow */}
                <path
                  d="M 380 73 L 392 73 L 387 69 M 392 73 L 387 77"
                  stroke="#ffffff"
                  strokeWidth="2"
                  fill="none"
                />
              </g>

              {/* Lower Core Plate & Inlet Plenum */}
              <rect
                x="160"
                y="240"
                width="140"
                height="8"
                rx="2"
                fill="#334155"
              />
              <text
                x="230"
                y="270"
                fill="#64748b"
                fontSize="9"
                textAnchor="middle"
                fontWeight="bold"
              >
                Lower Plenum Flow Distribution
              </text>
            </svg>
          </div>

          {/* Heavy-duty Industrial Emergency SCRAM Section */}
          <div className={styles.scramSection}>
            <div className={styles.scramHeaderBar}>
              <p className={styles.scramHeading}>
                <span>🚨</span> Safety Control Rod Axe Man (SCRAM)
              </p>
              <span className={styles.scramStatusText}>
                {input.isScrammed ? "CORE TRIPPED" : "SYSTEM ARMED"}
              </span>
            </div>

            <button
              type="button"
              className={styles.scramButton}
              onClick={handleScram}
              disabled={input.isScrammed}
            >
              <span>🚨</span> TRIGGER EMERGENCY SCRAM
            </button>

            {input.isScrammed && (
              <button
                type="button"
                className={styles.restartButton}
                onClick={handleRestart}
              >
                🔄 Cold Restart & Reset Core Trip
              </button>
            )}
          </div>
        </div>

        {/* Operator Controls & Thermohydraulic Readouts */}
        <div className={styles.controlCard}>
          <h4 className={styles.title} style={{ fontSize: "1.1rem" }}>
            Operator Consoles & Controls
          </h4>

          {/* Rod Insertion Slider */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>
                Control Rod Bank Insertion
              </span>
              <span className={styles.sliderValue}>
                {input.rodInsertionPercent.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={input.rodInsertionPercent}
              disabled={input.isScrammed}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  rodInsertionPercent: parseFloat(e.target.value),
                }))
              }
              className={styles.slider}
              aria-label="Control Rod Bank Insertion Percentage"
            />
            <p className={styles.sliderHint}>
              Nominal critical equilibrium position is ~52%. Withdrawing rods
              increases core power.
            </p>
          </div>

          {/* Coolant Flow Slider */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>
                Primary Coolant Pump Flow
              </span>
              <span className={styles.sliderValue}>
                {input.coolantFlowPercent}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={input.coolantFlowPercent}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  coolantFlowPercent: parseInt(e.target.value, 10),
                }))
              }
              className={styles.slider}
              aria-label="Primary Coolant Pump Flow Percentage"
            />
            <p className={styles.sliderHint}>
              Forced circulation extracts fission heat and transfers it to the
              steam generator.
            </p>
          </div>

          {/* Live Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Thermal Power</span>
              <span className={styles.metricValue}>
                {state.thermalPowerMwt.toLocaleString()} MWt
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Electrical Output</span>
              <span className={styles.metricValue}>
                {state.electricalPowerMwe.toLocaleString()} MWe
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Fuel Centerline Temp</span>
              <span className={styles.metricValue}>
                {state.fuelTemperatureC.toFixed(0)} °C
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Coolant Outlet Temp</span>
              <span className={styles.metricValue}>
                {state.coolantOutletTempC.toFixed(1)} °C
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Net Reactivity</span>
              <span className={styles.metricValue}>
                {state.reactivityPcm} pcm
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Multiplication (k_eff)</span>
              <span className={styles.metricValue}>
                {state.keff.toFixed(4)}
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Xenon-135 Worth</span>
              <span className={styles.metricValue}>
                {state.xenonReactivityPcm} pcm
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Xenon State</span>
              <span
                className={styles.metricValue}
                style={{ fontSize: "0.95rem" }}
              >
                {state.xenonStatus === "equilibrium"
                  ? "Equilibrium"
                  : state.xenonStatus === "building-peak"
                    ? "Peak Building"
                    : state.xenonStatus === "decaying"
                      ? "Decaying"
                      : "Depleted"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Tabular View */}
      <div className={styles.accessibleTableWrapper}>
        <div className={styles.tableSummaryTitle}>
          Accessible Operational Telemetry Table
        </div>
        <table className={styles.accessibleTable}>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Current Reading</th>
              <th>Nominal Operating Limit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Thermal Power</td>
              <td>{state.thermalPowerMwt} MWt</td>
              <td>3,000 MWt (Max 3,450 MWt)</td>
              <td>
                {state.isDecayHeatOnly
                  ? "Residual Decay Heat"
                  : "Fission Power"}
              </td>
            </tr>
            <tr>
              <td>Electrical Power</td>
              <td>{state.electricalPowerMwe} MWe</td>
              <td>1,000 MWe (33.3% Net Efficiency)</td>
              <td>
                {state.electricalPowerMwe > 0
                  ? "Grid Synced"
                  : "Turbine Tripped"}
              </td>
            </tr>
            <tr>
              <td>Fuel Temperature</td>
              <td>{state.fuelTemperatureC} °C</td>
              <td>Nominal 650 °C (Max 1,200 °C cladding limit)</td>
              <td>
                {state.fuelTemperatureC < 1000
                  ? "Safe Margin"
                  : "Thermal Alert"}
              </td>
            </tr>
            <tr>
              <td>Coolant Outlet</td>
              <td>{state.coolantOutletTempC} °C</td>
              <td>Nominal 326 °C</td>
              <td>Sub-cooled pressurized liquid</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sequence of Events & Safety Trip Log */}
      <div className={styles.eventLogWrapper}>
        <div className={styles.eventLogHeader}>
          <span className={styles.eventLogTitle}>
            <span>📋</span> Sequence of Events & Trip Log
          </span>
          <span className={styles.eventLogCount}>
            {tripLogs.length} Events Recorded
          </span>
        </div>
        <div
          className={styles.eventLogList}
          role="log"
          aria-label="Reactor Trip and Event Log"
        >
          {tripLogs.map((entry, idx) => (
            <div key={`log-${idx}`} className={styles.eventLogItem}>
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
