"use client";

import React, { useMemo, useState } from "react";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import type { GridScenario } from "../../lib/simulator/schemas";
import {
  simulateAnnualGrid,
  DEFAULT_PRESET_SCENARIOS,
  getDefaultScenario,
} from "../../lib/simulator/grid-model";
import { isLeapYear, getHoursForYear } from "../../lib/simulator/schemas";
import styles from "./GridSimulator.module.css";

export function GridSimulator({
  initialScenario = getDefaultScenario(),
}: {
  initialScenario?: GridScenario;
}) {
  const [scenario, setScenario] = useState<GridScenario>(initialScenario);

  const [complexity] = useComplexityPreference("curious");
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  const simulationResult = useMemo(() => {
    try {
      return simulateAnnualGrid(scenario);
    } catch {
      return null;
    }
  }, [scenario]);

  const hourlyDispatch = useMemo(() => {
    const avgDemandMw = scenario.annualDemandMwh / scenario.hoursPerYear;
    const demandShape = [
      0.72, 0.68, 0.65, 0.64, 0.66, 0.72, 0.85, 1.05, 1.15, 1.18, 1.19, 1.2,
      1.18, 1.16, 1.15, 1.14, 1.18, 1.28, 1.35, 1.32, 1.22, 1.08, 0.92, 0.8,
    ];

    const nuclearSource = scenario.sources.find((s) => s.id === "nuclear");
    const solarSource = scenario.sources.find((s) => s.id === "solar");
    const windSource = scenario.sources.find((s) => s.id === "wind");
    const hydroSource = scenario.sources.find((s) => s.id === "hydro");

    const nuclearMw =
      (nuclearSource?.capacityMw ?? 0) * (nuclearSource?.capacityFactor ?? 0.9);
    const windCap = windSource?.capacityMw ?? 0;
    const windCf = windSource?.capacityFactor ?? 0.35;
    const solarCap = solarSource?.capacityMw ?? 0;
    const solarCf = solarSource?.capacityFactor ?? 0.25;
    const hydroCap = hydroSource?.capacityMw ?? 0;
    const hydroCf = hydroSource?.capacityFactor ?? 0.4;

    const hours = Array.from({ length: 24 }, (_, h) => {
      const demand = avgDemandMw * demandShape[h];
      const nuclear = nuclearMw;
      const solarFactor =
        h >= 6 && h <= 18
          ? Math.pow(Math.sin((Math.PI * (h - 6)) / 12), 2) * 3.4
          : 0;
      const solar = solarCap * solarCf * solarFactor;
      const windFactor = 1.0 + 0.35 * Math.cos((2 * Math.PI * h) / 24);
      const wind = windCap * windCf * windFactor;
      const deficitBeforeHydro = Math.max(0, demand - (nuclear + solar + wind));
      const hydro = Math.min(
        hydroCap,
        deficitBeforeHydro > 0 ? deficitBeforeHydro : hydroCap * hydroCf * 0.4,
      );

      const totalGen = nuclear + solar + wind + hydro;
      const net = totalGen - demand;

      return {
        hour: h,
        demand: Math.round(demand),
        nuclear: Math.round(nuclear),
        solar: Math.round(solar),
        wind: Math.round(wind),
        hydro: Math.round(hydro),
        totalGen: Math.round(totalGen),
        net: Math.round(net),
      };
    });

    const maxVal = Math.max(
      ...hours.map((h) => Math.max(h.demand, h.totalGen)),
      100,
    );
    const deficitHours = hours.filter((h) => h.net < -50).length;

    return { hours, maxVal, deficitHours };
  }, [scenario]);

  const handlePresetChange = (presetId: string) => {
    const selected = DEFAULT_PRESET_SCENARIOS[presetId];
    if (selected) {
      setScenario(selected);
    }
  };

  const handleReset = () => {
    setScenario(getDefaultScenario());
  };

  const handleYearChange = (year: number) => {
    const hours = getHoursForYear(year);
    setScenario((prev) => ({
      ...prev,
      year,
      hoursPerYear: hours,
    }));
  };

  const handleDemandChange = (demandMwh: number) => {
    const valid = Math.max(0, Number.isFinite(demandMwh) ? demandMwh : 0);
    setScenario((prev) => ({
      ...prev,
      annualDemandMwh: valid,
    }));
  };

  const handleCapacityChange = (sourceId: string, capacityMw: number) => {
    const valid = Math.max(0, Number.isFinite(capacityMw) ? capacityMw : 0);
    setScenario((prev) => ({
      ...prev,
      sources: prev.sources.map((s) =>
        s.id === sourceId ? { ...s, capacityMw: valid } : s,
      ),
    }));
  };

  const handleCapacityFactorChange = (
    sourceId: string,
    capacityFactorPercent: number,
  ) => {
    const clamped = Math.min(
      1,
      Math.max(
        0,
        (Number.isFinite(capacityFactorPercent) ? capacityFactorPercent : 0) /
          100,
      ),
    );
    setScenario((prev) => ({
      ...prev,
      sources: prev.sources.map((s) =>
        s.id === sourceId ? { ...s, capacityFactor: clamped } : s,
      ),
    }));
  };

  const isLeap = isLeapYear(scenario.year);

  return (
    <article className={styles.container} aria-labelledby="simulator-heading">
      <header className={styles.header}>
        <span className={styles.badge}>Interactive Tool · Grid Literacy</span>
        <h1 id="simulator-heading" className={styles.title}>
          Annual Electricity Grid Simulator
        </h1>
        <p className={styles.lead}>
          Explore how varying generation capacities and capacity factors
          determine annual energy balance. Observe firsthand why 100% annual
          energy equivalence does not equate to instantaneous real-time grid
          reliability.
        </p>

        {/* Preset & Calendar Controls */}
        <div className={styles.presetBar}>
          <div className={styles.yearInputGroup}>
            <label htmlFor="preset-select" className={styles.presetLabel}>
              Load Scenario:
            </label>
            <select
              id="preset-select"
              className={styles.presetSelect}
              value={scenario.id in DEFAULT_PRESET_SCENARIOS ? scenario.id : ""}
              onChange={(e) => handlePresetChange(e.target.value)}
            >
              {Object.values(DEFAULT_PRESET_SCENARIOS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className={styles.btnReset}
          >
            Reset Defaults
          </button>

          <div className={styles.calendarRow}>
            <div className={styles.yearInputGroup}>
              <label htmlFor="calendar-year" className={styles.presetLabel}>
                Year:
              </label>
              <input
                id="calendar-year"
                type="number"
                min="1950"
                max="2100"
                value={scenario.year}
                onChange={(e) =>
                  handleYearChange(parseInt(e.target.value, 10) || 2025)
                }
                className={styles.yearInput}
              />
            </div>
            <span className={styles.leapTag}>
              {scenario.hoursPerYear} Hours{" "}
              {isLeap ? "(Leap Year)" : "(Standard Year)"}
            </span>
          </div>
        </div>
      </header>

      {/* Metrics Summary */}
      {simulationResult && (
        <div
          className={styles.metricsGrid}
          role="region"
          aria-label="Simulation Summary Metrics"
        >
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Annual Demand</div>
            <div className={styles.metricValue}>
              {(simulationResult.totalDemandMwh / 1_000_000).toFixed(2)} TWh
            </div>
            <div className={styles.metricSub}>
              {simulationResult.totalDemandMwh.toLocaleString()} MWh
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Annual Generation</div>
            <div className={styles.metricValue}>
              {(simulationResult.totalGenerationMwh / 1_000_000).toFixed(2)} TWh
            </div>
            <div className={styles.metricSub}>
              {simulationResult.totalGenerationMwh.toLocaleString()} MWh
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Annual Energy Coverage</div>
            <div className={styles.metricValue}>
              {simulationResult.annualEnergyCoveragePercent !== null
                ? `${simulationResult.annualEnergyCoveragePercent.toFixed(1)}%`
                : "N/A"}
            </div>
            <div className={styles.metricSub}>
              min(Gen/Demand, 1) · Gross Energy Balance
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Net Balance</div>
            {simulationResult.surplusMwh > 0 ? (
              <>
                <div className={`${styles.metricValue} ${styles.surplusValue}`}>
                  +{(simulationResult.surplusMwh / 1_000_000).toFixed(2)} TWh
                </div>
                <div className={styles.metricSub}>Annual Energy Surplus</div>
              </>
            ) : simulationResult.shortfallMwh > 0 ? (
              <>
                <div
                  className={`${styles.metricValue} ${styles.shortfallValue}`}
                >
                  -{(simulationResult.shortfallMwh / 1_000_000).toFixed(2)} TWh
                </div>
                <div className={styles.metricSub}>Annual Energy Shortfall</div>
              </>
            ) : (
              <>
                <div className={styles.metricValue}>0.00 TWh</div>
                <div className={styles.metricSub}>Exact Annual Balance</div>
              </>
            )}
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Grid Carbon Intensity</div>
            <div
              className={`${styles.metricValue} ${
                simulationResult.weightedCarbonIntensityGPerKwh <= 50
                  ? styles.cleanCarbonValue
                  : simulationResult.weightedCarbonIntensityGPerKwh <= 150
                    ? styles.moderateCarbonValue
                    : styles.highCarbonValue
              }`}
            >
              {simulationResult.weightedCarbonIntensityGPerKwh} gCO₂e/kWh
            </div>
            <div className={styles.metricSub}>
              {(
                simulationResult.totalAnnualCarbonEmissionsTonnes / 1000
              ).toFixed(1)}{" "}
              kt CO₂e/yr · IPCC/UNECE LCA
            </div>
          </div>
        </div>
      )}

      {/* Visual 24-Hour Dispatch & Power Flow Engine */}
      <div className={styles.visualDispatchSection}>
        <div className={styles.visualDispatchCard}>
          <div className={styles.visualHeader}>
            <div>
              <h3 className={styles.visualTitle}>
                <span aria-hidden="true">📈</span> Real-Time 24-Hour Electricity
                Dispatch Profile
              </h3>
              <p className={styles.visualSubtitle}>
                Observe how generation sources dynamically stack against hourly
                city demand across morning, solar noon, and the evening peak.
              </p>
            </div>
            <div
              className={`${styles.gridStatusBadge} ${
                hourlyDispatch.deficitHours > 0
                  ? styles.gridStatusDeficit
                  : simulationResult && simulationResult.surplusMwh > 0
                    ? styles.gridStatusSurplus
                    : styles.gridStatusStable
              }`}
            >
              <span aria-hidden="true">
                {hourlyDispatch.deficitHours > 0 ? "⚠️" : "⚡"}
              </span>
              <span>
                {hourlyDispatch.deficitHours > 0
                  ? `${hourlyDispatch.deficitHours} Hours with Capacity Deficit (Blackout Risk)`
                  : "100% Hourly Demand Met Reliably"}
              </span>
            </div>
          </div>

          {/* SVG 24-Hour Dispatch Chart */}
          <div className={styles.dispatchSvgWrapper}>
            <svg
              className={styles.dispatchSvg}
              viewBox="0 0 800 240"
              role="img"
              aria-label="24-Hour Electricity Dispatch Chart showing Demand vs Nuclear, Solar, Wind, and Hydro generation"
            >
              <defs>
                <linearGradient id="nuclearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="hydroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1="50"
                y1="200"
                x2="780"
                y2="200"
                stroke="#334155"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="120"
                x2="780"
                y2="120"
                stroke="#1e293b"
                strokeDasharray="4 4"
              />
              <line
                x1="50"
                y1="40"
                x2="780"
                y2="40"
                stroke="#1e293b"
                strokeDasharray="4 4"
              />

              <text x="40" y="44" fill="#64748b" fontSize="10" textAnchor="end">
                {Math.round(hourlyDispatch.maxVal).toLocaleString()} MW
              </text>
              <text
                x="40"
                y="124"
                fill="#64748b"
                fontSize="10"
                textAnchor="end"
              >
                {Math.round(hourlyDispatch.maxVal / 2).toLocaleString()} MW
              </text>
              <text
                x="40"
                y="204"
                fill="#64748b"
                fontSize="10"
                textAnchor="end"
              >
                0 MW
              </text>

              {/* Hourly Stacked Bars / Areas */}
              {hourlyDispatch.hours.map((h, i) => {
                const x = 55 + i * 30;
                const barWidth = 22;

                const nucH = (h.nuclear / hourlyDispatch.maxVal) * 160;
                const hydH = (h.hydro / hourlyDispatch.maxVal) * 160;
                const wndH = (h.wind / hourlyDispatch.maxVal) * 160;
                const solH = (h.solar / hourlyDispatch.maxVal) * 160;

                const nucY = 200 - nucH;
                const hydY = nucY - hydH;
                const wndY = hydY - wndH;
                const solY = wndY - solH;

                const demandY = 200 - (h.demand / hourlyDispatch.maxVal) * 160;

                return (
                  <g
                    key={`h-${h.hour}`}
                    onMouseEnter={() => setHoveredHour(h.hour)}
                    onMouseLeave={() => setHoveredHour(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Nuclear Baseload */}
                    {nucH > 0 && (
                      <rect
                        x={x}
                        y={nucY}
                        width={barWidth}
                        height={nucH}
                        fill="url(#nuclearGrad)"
                        rx="2"
                      />
                    )}
                    {/* Hydro */}
                    {hydH > 0 && (
                      <rect
                        x={x}
                        y={hydY}
                        width={barWidth}
                        height={hydH}
                        fill="url(#hydroGrad)"
                        rx="2"
                      />
                    )}
                    {/* Wind */}
                    {wndH > 0 && (
                      <rect
                        x={x}
                        y={wndY}
                        width={barWidth}
                        height={wndH}
                        fill="url(#windGrad)"
                        rx="2"
                      />
                    )}
                    {/* Solar */}
                    {solH > 0 && (
                      <rect
                        x={x}
                        y={solY}
                        width={barWidth}
                        height={solH}
                        fill="url(#solarGrad)"
                        rx="2"
                      />
                    )}

                    {/* Hourly Demand Marker (Red Dot & Line) */}
                    <circle
                      cx={x + barWidth / 2}
                      cy={demandY}
                      r="4"
                      fill="#f43f5e"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />

                    {/* X-axis Hour Label */}
                    {i % 3 === 0 && (
                      <text
                        x={x + barWidth / 2}
                        y="218"
                        fill="#94a3b8"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {h.hour}:00
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Demand Trend Polyline */}
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4 2"
                points={hourlyDispatch.hours
                  .map((h, i) => {
                    const x = 55 + i * 30 + 11;
                    const y = 200 - (h.demand / hourlyDispatch.maxVal) * 160;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            </svg>

            {/* Legend & Hover Info */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                marginTop: "0.75rem",
                fontSize: "0.85rem",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: "#818cf8",
                    }}
                  />
                  Nuclear (Baseload)
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: "#fbbf24",
                    }}
                  />
                  Solar (Midday)
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: "#34d399",
                    }}
                  />
                  Wind (Variable)
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: "#38bdf8",
                    }}
                  />
                  Hydro (Dispatchable)
                </span>
                <span
                  className={styles.demandCurveLabel}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#f43f5e",
                    }}
                  />
                  City Demand Curve
                </span>
              </div>

              {hoveredHour !== null && (
                <div
                  style={{
                    fontWeight: 600,
                    fontFamily: "monospace",
                  }}
                >
                  Hour {hoveredHour}:00 — Demand:{" "}
                  {hourlyDispatch.hours[hoveredHour].demand.toLocaleString()} MW
                  | Gen:{" "}
                  {hourlyDispatch.hours[hoveredHour].totalGen.toLocaleString()}{" "}
                  MW (
                  {hourlyDispatch.hours[hoveredHour].net >= 0
                    ? `+${hourlyDispatch.hours[hoveredHour].net} MW Surplus`
                    : `${hourlyDispatch.hours[hoveredHour].net} MW Deficit`}
                  )
                </div>
              )}
            </div>
          </div>

          {/* Power Flow Network Diagram */}
          <div className={styles.powerFlowWrapper}>
            <svg
              className={styles.powerFlowSvg}
              viewBox="0 0 800 180"
              role="img"
              aria-label="Power flow diagram showing generators sending electricity to the city"
            >
              {/* Generator Icons on Left */}
              <g transform="translate(40, 20)">
                <rect
                  x="0"
                  y="0"
                  width="140"
                  height="30"
                  rx="6"
                  fill="#1e1b4b"
                  stroke="#818cf8"
                  strokeWidth="1.5"
                />
                <text
                  x="10"
                  y="20"
                  fill="#c7d2fe"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ⚛ Nuclear Station
                </text>
              </g>
              <g transform="translate(40, 58)">
                <rect
                  x="0"
                  y="0"
                  width="140"
                  height="30"
                  rx="6"
                  fill="#451a03"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                />
                <text
                  x="10"
                  y="20"
                  fill="#fef3c7"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ☀️ Solar Array
                </text>
              </g>
              <g transform="translate(40, 96)">
                <rect
                  x="0"
                  y="0"
                  width="140"
                  height="30"
                  rx="6"
                  fill="#064e3b"
                  stroke="#34d399"
                  strokeWidth="1.5"
                />
                <text
                  x="10"
                  y="20"
                  fill="#d1fae5"
                  fontSize="12"
                  fontWeight="bold"
                >
                  💨 Wind Turbines
                </text>
              </g>
              <g transform="translate(40, 134)">
                <rect
                  x="0"
                  y="0"
                  width="140"
                  height="30"
                  rx="6"
                  fill="#0c4a6e"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <text
                  x="10"
                  y="20"
                  fill="#e0f2fe"
                  fontSize="12"
                  fontWeight="bold"
                >
                  💧 Hydro Dam
                </text>
              </g>

              {/* Flow Lines to Central Substation */}
              <line
                x1="180"
                y1="35"
                x2="380"
                y2="85"
                stroke="#818cf8"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              <line
                x1="180"
                y1="73"
                x2="380"
                y2="85"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              <line
                x1="180"
                y1="111"
                x2="380"
                y2="85"
                stroke="#34d399"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              <line
                x1="180"
                y1="149"
                x2="380"
                y2="85"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="6 4"
              />

              {/* Central Grid Substation */}
              <g transform="translate(380, 55)">
                <rect
                  x="0"
                  y="0"
                  width="120"
                  height="60"
                  rx="10"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  filter="drop-shadow(0 0 10px #0284c7)"
                />
                <text
                  x="60"
                  y="28"
                  fill="#38bdf8"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ⚡ SUBSTATION
                </text>
                <text
                  x="60"
                  y="46"
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                >
                  500 kV Backbone
                </text>
              </g>

              {/* High Voltage Line from Substation to City */}
              <line
                x1="500"
                y1="85"
                x2="620"
                y2="85"
                stroke="#38bdf8"
                strokeWidth="5"
                strokeDasharray="8 4"
              />

              {/* Metropolitan City Node */}
              <g transform="translate(620, 35)">
                <rect
                  x="0"
                  y="0"
                  width="140"
                  height="100"
                  rx="12"
                  fill="#0b1329"
                  stroke={
                    hourlyDispatch.deficitHours > 0 ? "#f43f5e" : "#34d399"
                  }
                  strokeWidth="2"
                  filter={
                    hourlyDispatch.deficitHours > 0
                      ? "drop-shadow(0 0 12px #f43f5e)"
                      : "drop-shadow(0 0 15px #34d399)"
                  }
                />
                <text
                  x="70"
                  y="32"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  🏙️ METRO CITY
                </text>
                <text
                  x="70"
                  y="54"
                  fill={hourlyDispatch.deficitHours > 0 ? "#f43f5e" : "#34d399"}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {hourlyDispatch.deficitHours > 0
                    ? "DEFICIT ALERT"
                    : "100% POWERED"}
                </text>
                <text
                  x="70"
                  y="74"
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {Math.round(scenario.annualDemandMwh / 1_000_000)} TWh / year
                </text>
              </g>
            </svg>
          </div>

          {/* Level-Adaptive Pedagogical Insight Banner */}
          <div className={styles.levelInsightCard}>
            <div className={styles.levelInsightHeader}>
              <span>{complexity.toUpperCase()} MODE INSIGHT</span>
              <span>
                Level{" "}
                {complexity === "beginner"
                  ? "1"
                  : complexity === "explorer"
                    ? "2"
                    : complexity === "curious"
                      ? "3"
                      : complexity === "deep-dive"
                        ? "4"
                        : "5"}
              </span>
            </div>
            <p className={styles.levelInsightBody}>
              {complexity === "beginner"
                ? "Think of the power grid like water pipes for a giant city. Everyone expects light bulbs to turn on instantly, but solar only works when the sun is shining! Nuclear power is like an unstoppable water fountain that runs day and night."
                : complexity === "explorer"
                  ? "Annual energy balance is not real-time balance. Generating 100% of your annual electricity with solar alone still leaves you with a 12-hour blackout every night unless you build massive battery storage."
                  : complexity === "curious"
                    ? "Notice how the generation curve dips and surges throughout the day. At 12:00 noon, solar floods the grid. But by 19:00, solar vanishes precisely as families return home and electricity demand reaches its highest peak of the day. Without firm clean baseload like nuclear or hydro, fossil gas peakers are fired up to prevent blackouts."
                    : complexity === "deep-dive"
                      ? "Loss of Load Expectation (LOLE) and Capacity Credit: Firm dispatchable thermal generators (Nuclear, NGCC) exhibit capacity factors >90% and capacity credits near 95%. In contrast, solar and wind experience diminishing Effective Load Carrying Capability (ELCC) as their grid penetration increases due to diurnal correlation and weather lulls (Dunkelflaute)."
                      : "Rotational Inertia, Frequency Dynamics & System Operability: Synchronous turbine-generators in nuclear and hydro stations provide physical kinetic inertia (H ≈ 4–6 s) that inherently resists frequency deviations (Δf from 50/60 Hz). Inverter-based resources (IBR) lack physical inertia; a high-renewable grid without firm synchronous generation requires synthetic fast frequency response (FFR) and synchronous condensers to prevent catastrophic RoCoF (Rate of Change of Frequency) cascade trips."}
            </p>
          </div>
        </div>
      </div>

      {/* Demand Setting */}
      <section
        className={styles.section}
        aria-labelledby="demand-section-title"
      >
        <h2 id="demand-section-title" className={styles.sectionTitle}>
          1. Grid Annual Electricity Demand
        </h2>
        <div className={styles.demandCard}>
          <div className={styles.demandHeader}>
            <span className={styles.demandTitle}>Total Annual System Load</span>
            <span className={styles.demandTwh}>
              {(scenario.annualDemandMwh / 1_000_000).toFixed(1)} TWh/year
            </span>
          </div>
          <div className={styles.demandControlRow}>
            <input
              type="range"
              min="0"
              max="150000000"
              step="1000000"
              value={scenario.annualDemandMwh}
              onChange={(e) => handleDemandChange(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Annual Demand Slider in MWh"
            />
            <input
              type="number"
              min="0"
              max="500000000"
              step="500000"
              value={scenario.annualDemandMwh}
              onChange={(e) =>
                handleDemandChange(parseFloat(e.target.value) || 0)
              }
              className={styles.numInput}
              aria-label="Annual Demand Numeric Input in MWh"
            />
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>MWh</span>
          </div>
        </div>
      </section>

      {/* Generation Sources Controls */}
      <section
        className={styles.section}
        aria-labelledby="sources-section-title"
      >
        <h2 id="sources-section-title" className={styles.sectionTitle}>
          2. Generation Sources Capacity & Capacity Factor
        </h2>
        <div className={styles.sourcesList}>
          {scenario.sources.map((source) => {
            const breakdown = simulationResult?.sourcesBreakdown.find(
              (b) => b.id === source.id,
            );
            return (
              <div key={source.id} className={styles.sourceCard}>
                <div className={styles.sourceHeader}>
                  <div className={styles.sourceTitleGroup}>
                    <span
                      className={styles.sourcePill}
                      style={{ backgroundColor: source.color || "#64748b" }}
                      aria-hidden="true"
                    />
                    <h3 className={styles.sourceName}>{source.name}</h3>
                    <span
                      className={`${styles.typeBadge} ${
                        source.isDispatchable
                          ? styles.dispatchable
                          : styles.variable
                      }`}
                    >
                      {source.isDispatchable
                        ? "Firm Dispatchable"
                        : "Variable Renewable"}
                    </span>
                  </div>
                  {breakdown && (
                    <div className={styles.sourceOutputStat}>
                      {(breakdown.annualGenerationMwh / 1_000_000).toFixed(2)}{" "}
                      TWh ({breakdown.generationSharePercent.toFixed(1)}% of
                      gen)
                    </div>
                  )}
                </div>

                <div className={styles.controlGrid}>
                  {/* Capacity Control */}
                  <div className={styles.controlCol}>
                    <div className={styles.controlLabel}>
                      <span>Installed Capacity:</span>
                      <strong>{source.capacityMw.toLocaleString()} MW</strong>
                    </div>
                    <div className={styles.controlInputs}>
                      <input
                        type="range"
                        min="0"
                        max="30000"
                        step="100"
                        value={source.capacityMw}
                        onChange={(e) =>
                          handleCapacityChange(
                            source.id,
                            parseFloat(e.target.value),
                          )
                        }
                        className={styles.slider}
                        aria-label={`${source.name} Capacity Slider in MW`}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100000"
                        step="50"
                        value={source.capacityMw}
                        onChange={(e) =>
                          handleCapacityChange(
                            source.id,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className={styles.numInput}
                        aria-label={`${source.name} Capacity Numeric Input in MW`}
                      />
                    </div>
                  </div>

                  {/* Capacity Factor Control */}
                  <div className={styles.controlCol}>
                    <div className={styles.controlLabel}>
                      <span>Annual Capacity Factor:</span>
                      <strong>
                        {(source.capacityFactor * 100).toFixed(0)}%
                      </strong>
                    </div>
                    <div className={styles.controlInputs}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={Math.round(source.capacityFactor * 100)}
                        onChange={(e) =>
                          handleCapacityFactorChange(
                            source.id,
                            parseFloat(e.target.value),
                          )
                        }
                        className={styles.slider}
                        aria-label={`${source.name} Capacity Factor Slider`}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={Math.round(source.capacityFactor * 100)}
                        onChange={(e) =>
                          handleCapacityFactorChange(
                            source.id,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className={styles.numInput}
                        aria-label={`${source.name} Capacity Factor Numeric Input`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Generation Mix Breakdown Table & Visual Bar */}
      {simulationResult && (
        <section
          className={styles.section}
          aria-labelledby="breakdown-section-title"
        >
          <h2 id="breakdown-section-title" className={styles.sectionTitle}>
            3. Generation Mix Breakdown
          </h2>

          {/* Stacked visualization bar */}
          <div
            className={styles.stackedBarContainer}
            role="img"
            aria-label="Annual Generation Mix Proportions"
          >
            {simulationResult.sourcesBreakdown.map((item) => (
              <div
                key={item.id}
                className={styles.stackedSegment}
                style={{
                  width: `${item.generationSharePercent}%`,
                  backgroundColor: item.color || "#64748b",
                }}
                title={`${item.name}: ${item.generationSharePercent.toFixed(1)}%`}
              />
            ))}
          </div>

          <div className={styles.tableCard}>
            <table
              className={styles.table}
              aria-label="Annual Generation Simulation Breakdown Table"
            >
              <thead>
                <tr>
                  <th scope="col">Technology</th>
                  <th scope="col">Grid Role</th>
                  <th scope="col">Capacity (MW)</th>
                  <th scope="col">Capacity Factor</th>
                  <th scope="col">Annual Gen (TWh)</th>
                  <th scope="col">Gen Share (%)</th>
                </tr>
              </thead>
              <tbody>
                {simulationResult.sourcesBreakdown.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span
                        className={styles.sourcePill}
                        style={{
                          backgroundColor: row.color || "#64748b",
                          display: "inline-block",
                          marginRight: "0.5rem",
                          verticalAlign: "middle",
                        }}
                        aria-hidden="true"
                      />
                      <strong>{row.name}</strong>
                    </td>
                    <td>
                      {row.isDispatchable
                        ? "Firm Dispatchable"
                        : "Variable Renewable"}
                    </td>
                    <td>{row.capacityMw.toLocaleString()} MW</td>
                    <td>{(row.capacityFactor * 100).toFixed(1)}%</td>
                    <td>{(row.annualGenerationMwh / 1_000_000).toFixed(2)}</td>
                    <td>{row.generationSharePercent.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <strong>Total Fleet</strong>
                  </td>
                  <td>—</td>
                  <td>
                    <strong>
                      {simulationResult.sourcesBreakdown
                        .reduce((sum, s) => sum + s.capacityMw, 0)
                        .toLocaleString()}{" "}
                      MW
                    </strong>
                  </td>
                  <td>—</td>
                  <td>
                    <strong>
                      {(
                        simulationResult.totalGenerationMwh / 1_000_000
                      ).toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <strong>100.0%</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}

      {/* Section 4: Critical Educational Callout */}
      <section
        className={styles.disclaimerBox}
        role="region"
        aria-labelledby="disclaimer-title"
      >
        <div id="disclaimer-title" className={styles.disclaimerTitle}>
          <span>⚠️</span>
          <span>
            Core Concept: Annual Energy Balance ≠ Real-Time Hourly Reliability
          </span>
        </div>
        <p>
          A common energy literacy mistake is assuming that generating 100% of
          annual electricity demand means a grid is reliable and blackout-free.
          Annual electricity simulation evaluates total MWh produced over{" "}
          {scenario.hoursPerYear} hours. However, real-world power grids operate
          on millisecond-to-hourly balance. A grid with 100% annual energy
          coverage can still face severe hourly blackouts due to fundamental
          physics:
        </p>

        <div className={styles.educationGrid}>
          <div className={styles.educationCard}>
            <div className={styles.educationCardTitle}>
              1. Hourly Intermittency & The &quot;Dunkelflaute&quot;
            </div>
            <p>
              Solar PV produces 0 MW at night and peaks at midday. Wind energy
              varies with weather systems and can drop to near zero for
              consecutive days across entire continents (termed{" "}
              <em>Dunkelflaute</em> or dark doldrums).
            </p>
          </div>

          <div className={styles.educationCard}>
            <div className={styles.educationCardTitle}>
              2. Instantaneous Peak Demand
            </div>
            <p>
              System demand spikes during freezing winter evenings or extreme
              summer heatwaves. Meeting peak demand requires firm, immediately
              dispatchable capacity, regardless of annual averages.
            </p>
          </div>

          <div className={styles.educationCard}>
            <div className={styles.educationCardTitle}>
              3. Mechanical Grid Inertia & Frequency
            </div>
            <p>
              Large spinning turbines in nuclear, hydro, and thermal generators
              provide physical kinetic inertia, naturally resisting sudden grid
              frequency deviations (50/60 Hz). Solar and wind connect via
              inverters with zero inherent mechanical inertia.
            </p>
          </div>

          <div className={styles.educationCard}>
            <div className={styles.educationCardTitle}>
              4. Seasonal Storage Requirements
            </div>
            <p>
              Surplus energy produced during sunny summer days cannot be easily
              transferred to dark winter months without massive multi-week
              energy storage (e.g. hydrogen or synthetic fuels), which incurs
              high round-trip efficiency losses (~50–65%).
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
