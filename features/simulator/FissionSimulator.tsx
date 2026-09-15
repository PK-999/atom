"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  calculateEffectiveMultiplication,
  FISSION_PHYSICS_CONSTANTS,
  type FissionSimulationConfig,
} from "@/lib/simulator/fission-model";
import styles from "./FissionSimulator.module.css";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isThermal: boolean;
  age: number;
}

interface FissionFlash {
  id: number;
  x: number;
  y: number;
  radius: number;
}

type ViewMode = "core-lattice" | "atomic-split";
type AtomicStage = "approach" | "capture" | "necking" | "scission";

export function FissionSimulator() {
  const [complexity] = useComplexityPreference("curious");
  const [viewMode, setViewMode] = useState<ViewMode>("core-lattice");
  const [atomicStage, setAtomicStage] = useState<AtomicStage>("approach");

  const [config, setConfig] = useState<FissionSimulationConfig>({
    enrichmentPercent: 4.5,
    moderatorDensity: 0.9,
    controlRodInsertionPercent: 50,
    boronConcentrationPpm: 500,
  });

  const [neutrons, setNeutrons] = useState<Particle[]>([]);
  const [flashes, setFlashes] = useState<FissionFlash[]>([]);
  const [fissionCount, setFissionCount] = useState(0);
  const [energyJoules, setEnergyJoules] = useState(0);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const nextParticleId = useRef(1);
  const nextFlashId = useRef(1);

  const physics = useMemo(() => {
    return calculateEffectiveMultiplication(config);
  }, [config]);

  // Fire a single source neutron into the core
  const handleFireNeutron = useCallback(() => {
    const id = nextParticleId.current++;
    setNeutrons((prev) => [
      ...prev.slice(-35),
      {
        id,
        x: 15 + Math.random() * 20,
        y: 50 + Math.random() * 180,
        vx: Math.random() * 3.5 + 2.5,
        vy: (Math.random() - 0.5) * 3,
        isThermal: false,
        age: 0,
      },
    ]);
  }, []);

  const handleReset = () => {
    setNeutrons([]);
    setFlashes([]);
    setFissionCount(0);
    setEnergyJoules(0);
    setIsAutoRunning(false);
    setAtomicStage("approach");
  };

  // Step atomic split animation
  const handleAtomicStep = (stage: AtomicStage) => {
    setAtomicStage(stage);
    if (stage === "scission") {
      setFissionCount((c) => c + 1);
      setEnergyJoules(
        (j) => j + FISSION_PHYSICS_CONSTANTS.ENERGY_PER_FISSION_JOULES,
      );
    }
  };

  // Particle animation and interaction loop
  useEffect(() => {
    const timer = setInterval(() => {
      setNeutrons((prev) => {
        if (prev.length === 0 && !isAutoRunning) return prev;

        const updated: Particle[] = [];
        let newFissions = 0;

        prev.forEach((p) => {
          const nx = p.x + p.vx;
          const ny = p.y + p.vy;

          // Wall bounces
          let nvx = p.vx;
          let nvy = p.vy;
          if (nx < 15 || nx > 485) nvx = -nvx;
          if (ny < 15 || ny > 285) nvy = -nvy;

          // Thermalization via moderator
          const isThermal =
            p.isThermal || Math.random() < config.moderatorDensity * 0.42;

          // Absorption by control rods
          const inRodZone = ny < config.controlRodInsertionPercent * 2.7;
          if (inRodZone && Math.random() < 0.28) {
            // Captured by Ag-In-Cd / B4C rod
            return;
          }

          // Fission interaction check
          const fissileTargetMet =
            Math.random() < (config.enrichmentPercent / 100) * 0.16;
          if (isThermal && fissileTargetMet) {
            newFissions++;
            const fid = nextFlashId.current++;
            setFlashes((f) => [
              ...f.slice(-8),
              { id: fid, x: nx, y: ny, radius: 10 },
            ]);

            // Generate prompt neutrons (avg 2.43)
            const numNew = Math.random() < 0.43 ? 3 : 2;
            for (let i = 0; i < numNew; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 3.5 + 2.5;
              updated.push({
                id: nextParticleId.current++,
                x: nx,
                y: ny,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                isThermal: false,
                age: 0,
              });
            }
            return;
          }

          if (p.age < 120) {
            updated.push({
              ...p,
              x: nx,
              y: ny,
              vx: nvx,
              vy: nvy,
              isThermal,
              age: p.age + 1,
            });
          }
        });

        if (newFissions > 0) {
          setFissionCount((c) => c + newFissions);
          setEnergyJoules(
            (j) =>
              j +
              newFissions * FISSION_PHYSICS_CONSTANTS.ENERGY_PER_FISSION_JOULES,
          );
        }

        // If auto-running and neutrons died down, seed occasionally
        if (isAutoRunning && updated.length < 4 && Math.random() < 0.35) {
          updated.push({
            id: nextParticleId.current++,
            x: 25,
            y: 150,
            vx: 3.5,
            vy: (Math.random() - 0.5) * 2.5,
            isThermal: false,
            age: 0,
          });
        }

        return updated.slice(-45);
      });

      // Decay flashes
      setFlashes((prev) =>
        prev
          .map((f) => ({ ...f, radius: f.radius + 2.5 }))
          .filter((f) => f.radius < 32),
      );
    }, 45);

    return () => clearInterval(timer);
  }, [config, isAutoRunning]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon} aria-hidden="true">
            ⚛
          </span>
          Nuclear Fission Chain Reaction Simulator
        </h3>
        <p className={styles.description}>
          {complexity === "beginner"
            ? "See how neutrons split Uranium atoms to release energy! Control rods absorb neutrons to slow it down, while water slows neutrons so they can split more atoms."
            : complexity === "geeky"
              ? "Point kinetics simulation of ²³⁵U thermal fission. Demonstrates the four-factor formula components, delayed neutron fraction β = 0.0065, negative moderator void reactivity, and the transition across prompt-critical thresholds."
              : "Explore how thermal neutron capture in Uranium-235 sustains a chain reaction. Adjust fuel enrichment, moderator water density, and control rods to observe subcritical, critical, and supercritical states."}
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
            k_eff = {physics.keff.toFixed(4)} ({physics.criticalityState})
          </span>
        </div>

        {complexity === "beginner" && (
          <div>
            <div className={styles.levelBannerTitle}>
              💧 The Wobbling Water Drop Analogy
            </div>
            <p className={styles.levelBannerText}>
              Imagine a heavy uranium nucleus like a wobbling drop of water
              holding 235 tiny balls. When a slow-moving neutron taps it, the
              drop wobbles violently, pinches in the middle, and snaps into two
              smaller drops! It pops out 2 or 3 new neutrons and a big burst of
              heat that we use to boil water into steam.
            </p>
          </div>
        )}

        {complexity === "explorer" && (
          <div>
            <div className={styles.levelBannerTitle}>
              ⚙️ How a Chain Reaction Sustains Power
            </div>
            <p className={styles.levelBannerText}>
              When one ²³⁵U atom absorbs a slow neutron, it undergoes fission
              into two lighter atoms (like Barium and Krypton) and releases an
              average of 2.43 new fast neutrons. Light water slows these fast
              neutrons down so they can be captured by other uranium atoms,
              keeping clean, emission-free electricity flowing continuously.
            </p>
          </div>
        )}

        {complexity === "curious" && (
          <div>
            <div className={styles.levelBannerTitle}>
              📐 Mass Defect (E = mc²) & Fission Energetics
            </div>
            <p className={styles.levelBannerText}>
              The sum of the rest masses of the fission fragments and prompt
              neutrons is slightly less than the initial mass of the ²³⁵U
              nucleus plus incident neutron. This missing mass (Δm ≈ 0.215 u)
              converts directly into ~200 MeV (3.2 × 10⁻¹¹ Joules) of energy per
              fission: ~168 MeV kinetic energy of fragments, ~5 MeV prompt
              neutrons, ~8 MeV prompt gammas, and ~19 MeV delayed beta/neutrino
              decay.
            </p>
            <div className={styles.levelBannerFormula}>
              <span>
                ²³⁵U + n_th → ²³⁶U* → ¹⁴¹Ba + ⁹²Kr + 3n + 200 MeV (Δm · c²)
              </span>
            </div>
          </div>
        )}

        {complexity === "deep-dive" && (
          <div>
            <div className={styles.levelBannerTitle}>
              ⚖️ The Four-Factor Formula & Control Rod Worth
            </div>
            <p className={styles.levelBannerText}>
              Core neutron economy is governed by k_inf = η · f · p · ε. In our
              light water lattice, thermal utilization f is modulated by boron
              concentration and Ag-In-Cd / B₄C control rods. Delayed neutrons (β
              = 0.0065) from precursors like ⁸⁷Br and ¹³⁷I extend the effective
              neutron generation lifetime from 10⁻⁴ s to ~0.08 s, providing
              stable operational control margin.
            </p>
            <div className={styles.levelBannerFormula}>
              <span>
                k_eff = k_inf · P_NL = (η · f · p · ε) · P_NL | β_eff = 0.0065 |
                ρ = (k - 1)/k
              </span>
            </div>
          </div>
        )}

        {complexity === "geeky" && (
          <div>
            <div className={styles.levelBannerTitle}>
              🔬 Point Kinetics, Prompt Criticality ($1.00) & Doppler Safety
            </div>
            <p className={styles.levelBannerText}>
              When reactivity exceeds the delayed neutron fraction (ρ ≥ β, or
              $1.00), the core becomes prompt-critical, governed by prompt
              lifetime l* ≈ 10⁻⁴ s rather than delayed precursor mean decay.
              Commercial PWR/BWR designs guarantee inherent safety via negative
              fuel temperature Doppler broadening in ²³⁸U resonances at 6.67 eV
              (α_T ≈ -2.5 × 10⁻⁵ Δk/k/°C) and negative moderator void
              coefficient.
            </p>
            <div className={styles.levelBannerFormula}>
              <span>
                {
                  "dn/dt = [(ρ - β)/l*] · n + Σ λ_i C_i | Prompt limit: ρ < β ($1.00) | α_Doppler < 0"
                }
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.mainGrid}>
        {/* Visual Chamber Area */}
        <div className={styles.stageCard}>
          <div className={styles.stageHeader}>
            <div className={styles.viewToggleGroup}>
              <button
                type="button"
                className={`${styles.viewToggleButton} ${viewMode === "core-lattice" ? styles.viewToggleButtonActive : ""}`}
                onClick={() => setViewMode("core-lattice")}
              >
                ⚛️ Reactor Core Lattice
              </button>
              <button
                type="button"
                className={`${styles.viewToggleButton} ${viewMode === "atomic-split" ? styles.viewToggleButtonActive : ""}`}
                onClick={() => setViewMode("atomic-split")}
              >
                🔬 Atomic Nucleus Split (Bohr-Wheeler)
              </button>
            </div>

            <span
              className={`${styles.criticalityBadge} ${
                physics.criticalityState === "prompt-critical"
                  ? styles.criticalityPromptCritical
                  : physics.criticalityState === "supercritical"
                    ? styles.criticalitySupercritical
                    : physics.criticalityState === "critical"
                      ? styles.criticalityCritical
                      : styles.criticalitySubcritical
              }`}
            >
              {physics.criticalityState}
            </span>
          </div>

          <div className={styles.canvasWrapper}>
            {viewMode === "core-lattice" ? (
              <svg
                className={styles.latticeSvg}
                viewBox="0 0 500 300"
                role="img"
                aria-label="Fission chamber showing fuel rods, control rods, and free neutrons"
              >
                <defs>
                  {/* Cherenkov Blue Radiation Ambient Glow */}
                  <radialGradient id="cherenkovGlow" cx="50%" cy="50%" r="65%">
                    <stop
                      offset="0%"
                      stopColor="#0284c7"
                      stopOpacity={0.25 + (fissionCount % 10) * 0.05}
                    />
                    <stop offset="45%" stopColor="#0369a1" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#030812" stopOpacity="0" />
                  </radialGradient>

                  {/* 3D Cylindrical Zircaloy Fuel Cladding Shading */}
                  <linearGradient
                    id="zircaloyClad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="25%" stopColor="#64748b" />
                    <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>

                  {/* Ceramic UO2 Fuel Pellet Texture */}
                  <linearGradient
                    id="uo2Pellet"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="50%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#020617" />
                  </linearGradient>

                  {/* Boron Carbide Control Rod Metal Shading */}
                  <linearGradient
                    id="controlRodShading"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="35%" stopColor="#94a3b8" />
                    <stop offset="60%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>

                  {/* 3D Sphere Filter for Neutrons */}
                  <radialGradient
                    id="fastNeutronGlow"
                    cx="35%"
                    cy="35%"
                    r="65%"
                  >
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="40%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#854d0e" />
                  </radialGradient>

                  <radialGradient
                    id="thermalNeutronGlow"
                    cx="35%"
                    cy="35%"
                    r="65%"
                  >
                    <stop offset="0%" stopColor="#e0f2fe" />
                    <stop offset="40%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </radialGradient>
                </defs>

                {/* Light Water Moderator Coolant Base */}
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="300"
                  fill="#030b17"
                  opacity={0.5 + config.moderatorDensity * 0.4}
                />

                {/* Pulsating Cherenkov Radiation Glow */}
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="300"
                  fill="url(#cherenkovGlow)"
                />

                {/* Fuel Assemblies (Zircaloy Pin Bundles) */}
                {[55, 125, 195, 265, 335, 405, 455].map((x) => (
                  <g key={`fuel-bundle-${x}`}>
                    {/* Cladding Tube */}
                    <rect
                      x={x}
                      y="20"
                      width="20"
                      height="260"
                      rx="4"
                      fill="url(#zircaloyClad)"
                      stroke="#0f172a"
                      strokeWidth="1"
                    />
                    {/* Interior UO2 Ceramic Pellets */}
                    {[40, 75, 110, 145, 180, 215, 250].map((py) => (
                      <rect
                        key={`pellet-${x}-${py}`}
                        x={x + 3}
                        y={py}
                        width="14"
                        height="26"
                        rx="2"
                        fill="url(#uo2Pellet)"
                        stroke="#1e293b"
                        strokeWidth="0.5"
                      />
                    ))}
                  </g>
                ))}

                {/* Control Rod Drive Assembly & Absorber Rods (B4C) */}
                {[90, 160, 230, 300, 370, 430].map((x) => {
                  const insertionY = config.controlRodInsertionPercent * 2.6;
                  return (
                    <g key={`rod-assembly-${x}`}>
                      {/* Guide Thimble Dash Lines */}
                      <line
                        x1={x + 6}
                        y1="20"
                        x2={x + 6}
                        y2="280"
                        stroke="#1e293b"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                      {/* Drive Mechanism Shaft */}
                      <rect
                        x={x + 4}
                        y="0"
                        width="4"
                        height={insertionY}
                        fill="#64748b"
                      />
                      {/* Absorber Rod (Ag-In-Cd / B4C) */}
                      <rect
                        x={x + 1}
                        y="0"
                        width="10"
                        height={insertionY}
                        rx="3"
                        fill="url(#controlRodShading)"
                        stroke="#0f172a"
                        strokeWidth="1"
                      />
                      {/* Bullet Nose Cap */}
                      <circle cx={x + 6} cy={insertionY} r="5" fill="#334155" />
                    </g>
                  );
                })}

                {/* Fission Kinetic Flashes */}
                {flashes.map((f) => (
                  <g key={`flash-${f.id}`}>
                    <circle
                      cx={f.x}
                      cy={f.y}
                      r={f.radius}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      opacity={(32 - f.radius) / 32}
                    />
                    <circle
                      cx={f.x}
                      cy={f.y}
                      r={f.radius * 0.5}
                      fill="#ffffff"
                      opacity={(32 - f.radius) / 32}
                    />
                  </g>
                ))}

                {/* Free Fast & Thermalized Neutrons */}
                {neutrons.map((n) => (
                  <g key={`neutron-${n.id}`}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.isThermal ? 4.5 : 3.5}
                      fill={
                        n.isThermal
                          ? "url(#thermalNeutronGlow)"
                          : "url(#fastNeutronGlow)"
                      }
                      stroke={n.isThermal ? "#38bdf8" : "#fef08a"}
                      strokeWidth="1"
                    />
                    {/* Velocity Trail */}
                    <line
                      x1={n.x}
                      y1={n.y}
                      x2={n.x - n.vx * 3}
                      y2={n.y - n.vy * 3}
                      stroke={n.isThermal ? "#38bdf8" : "#fbbf24"}
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  </g>
                ))}
              </svg>
            ) : (
              /* Microscopic Atomic Split (Bohr-Wheeler Liquid Drop View) */
              <svg
                className={styles.latticeSvg}
                viewBox="0 0 500 300"
                role="img"
                aria-label="Atomic nucleus split showing Uranium-235 absorbing neutron, deforming, and splitting into Barium-141 and Krypton-92"
              >
                <defs>
                  {/* 3D Proton Sphere (Red with Specular Highlight) */}
                  <radialGradient id="protonSphere" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="35%" stopColor="#ef4444" />
                    <stop offset="85%" stopColor="#991b1b" />
                    <stop offset="100%" stopColor="#450a0a" />
                  </radialGradient>

                  {/* 3D Neutron Sphere (Blue with Specular Highlight) */}
                  <radialGradient id="neutronSphere" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#bfdbfe" />
                    <stop offset="35%" stopColor="#3b82f6" />
                    <stop offset="85%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#172554" />
                  </radialGradient>

                  {/* Kinetic Energy Shockwave Burst */}
                  <radialGradient id="shockwaveBurst" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#030812" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="500" height="300" fill="#040914" />

                {/* Stage 1: Approach */}
                {atomicStage === "approach" && (
                  <g>
                    {/* U-235 Stable Target Nucleus */}
                    <g transform="translate(270, 150)">
                      <circle
                        r="56"
                        fill="rgba(56, 189, 248, 0.08)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />
                      {/* Nucleons (Protons & Neutrons densely packed) */}
                      {[
                        [-25, -20],
                        [0, -32],
                        [24, -22],
                        [-32, 2],
                        [-8, -6],
                        [16, 2],
                        [35, 6],
                        [-22, 26],
                        [4, 25],
                        [26, 28],
                        [-12, 12],
                        [8, -18],
                        [-35, -12],
                        [32, -10],
                      ].map(([nx, ny], idx) => (
                        <circle
                          key={`nuc-${idx}`}
                          cx={nx}
                          cy={ny}
                          r="12"
                          fill={
                            idx % 2 === 0
                              ? "url(#protonSphere)"
                              : "url(#neutronSphere)"
                          }
                        />
                      ))}
                      <text
                        x="0"
                        y="5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="14"
                        fontWeight="bold"
                        filter="drop-shadow(0 2px 4px black)"
                      >
                        ²³⁵U (92p + 143n)
                      </text>
                    </g>

                    {/* Incoming Thermal Neutron */}
                    <g transform="translate(70, 150)">
                      <circle
                        cx="0"
                        cy="0"
                        r="10"
                        fill="url(#neutronSphere)"
                        stroke="#38bdf8"
                        strokeWidth="2"
                      />
                      <line
                        x1="0"
                        y1="0"
                        x2="-40"
                        y2="0"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeDasharray="6,3"
                      />
                      <text
                        x="0"
                        y="-18"
                        textAnchor="middle"
                        fill="#38bdf8"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        Thermal Neutron (0.025 eV)
                      </text>
                    </g>
                  </g>
                )}

                {/* Stage 2: Capture into Excited Compound Nucleus */}
                {atomicStage === "capture" && (
                  <g transform="translate(250, 150)">
                    {/* Compound Nucleus Oscillation Aura */}
                    <circle
                      r="72"
                      fill="rgba(245, 158, 11, 0.15)"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="65"
                      ry="50"
                      fill="rgba(56, 189, 248, 0.15)"
                    />
                    {[
                      [-30, -18],
                      [-5, -26],
                      [28, -20],
                      [-40, 2],
                      [-14, -4],
                      [14, 0],
                      [42, 4],
                      [-26, 22],
                      [2, 22],
                      [30, 22],
                      [-14, 10],
                      [6, -14],
                      [-38, -8],
                      [34, -8],
                      [0, 0],
                    ].map(([nx, ny], idx) => (
                      <circle
                        key={`cap-${idx}`}
                        cx={nx}
                        cy={ny}
                        r="12"
                        fill={
                          idx % 2 === 0
                            ? "url(#protonSphere)"
                            : "url(#neutronSphere)"
                        }
                      />
                    ))}
                    <text
                      x="0"
                      y="6"
                      textAnchor="middle"
                      fill="#fef08a"
                      fontSize="15"
                      fontWeight="bold"
                      filter="drop-shadow(0 2px 4px black)"
                    >
                      ²³⁶U* (Excited Compound)
                    </text>
                  </g>
                )}

                {/* Stage 3: Necking (Bohr-Wheeler Liquid Drop Scission Point) */}
                {atomicStage === "necking" && (
                  <g transform="translate(250, 150)">
                    {/* Dumbbell / Peanut Necking Contour */}
                    <path
                      d="M -75 -40 C -30 -35, -20 -10, 0 -8 C 20 -10, 30 -35, 75 -40 C 110 -40, 120 40, 75 40 C 30 35, 20 10, 0 8 C -20 10, -30 35, -75 40 C -110 40, -120 -40, -75 -40 Z"
                      fill="rgba(56, 189, 248, 0.18)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    {/* Left lobe */}
                    {[
                      [-70, -15],
                      [-50, -22],
                      [-72, 12],
                      [-48, 8],
                      [-30, -5],
                      [-35, 16],
                    ].map(([nx, ny], idx) => (
                      <circle
                        key={`l-${idx}`}
                        cx={nx}
                        cy={ny}
                        r="11"
                        fill={
                          idx % 2 === 0
                            ? "url(#protonSphere)"
                            : "url(#neutronSphere)"
                        }
                      />
                    ))}
                    {/* Right lobe */}
                    {[
                      [70, -15],
                      [50, -22],
                      [72, 12],
                      [48, 8],
                      [30, -5],
                      [35, 16],
                    ].map(([nx, ny], idx) => (
                      <circle
                        key={`r-${idx}`}
                        cx={nx}
                        cy={ny}
                        r="11"
                        fill={
                          idx % 2 === 0
                            ? "url(#protonSphere)"
                            : "url(#neutronSphere)"
                        }
                      />
                    ))}
                    <text
                      x="0"
                      y="-35"
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      Scission Necking (Coulomb Repulsion)
                    </text>
                  </g>
                )}

                {/* Stage 4: Scission Split & Prompt Neutron Ejection */}
                {atomicStage === "scission" && (
                  <g>
                    {/* Central Energy Shockwave */}
                    <circle
                      cx="250"
                      cy="150"
                      r="75"
                      fill="url(#shockwaveBurst)"
                    />

                    {/* Barium-141 Fragment flying Left */}
                    <g transform="translate(130, 150)">
                      <circle
                        r="44"
                        fill="rgba(52, 211, 153, 0.15)"
                        stroke="#34d399"
                        strokeWidth="2"
                      />
                      {[
                        [-15, -12],
                        [10, -18],
                        [-18, 12],
                        [12, 14],
                        [0, 0],
                        [-8, -2],
                      ].map(([nx, ny], idx) => (
                        <circle
                          key={`ba-${idx}`}
                          cx={nx}
                          cy={ny}
                          r="11"
                          fill={
                            idx % 2 === 0
                              ? "url(#protonSphere)"
                              : "url(#neutronSphere)"
                          }
                        />
                      ))}
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="bold"
                      >
                        ¹⁴¹Ba (56p)
                      </text>
                      <text
                        x="0"
                        y="24"
                        textAnchor="middle"
                        fill="#34d399"
                        fontSize="11"
                      >
                        ~86 MeV Kinetic
                      </text>
                    </g>

                    {/* Krypton-92 Fragment flying Right */}
                    <g transform="translate(370, 150)">
                      <circle
                        r="38"
                        fill="rgba(251, 146, 60, 0.15)"
                        stroke="#fb923c"
                        strokeWidth="2"
                      />
                      {[
                        [-12, -10],
                        [8, -14],
                        [-14, 10],
                        [10, 12],
                        [0, 0],
                      ].map(([nx, ny], idx) => (
                        <circle
                          key={`kr-${idx}`}
                          cx={nx}
                          cy={ny}
                          r="11"
                          fill={
                            idx % 2 === 0
                              ? "url(#protonSphere)"
                              : "url(#neutronSphere)"
                          }
                        />
                      ))}
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="bold"
                      >
                        ⁹²Kr (36p)
                      </text>
                      <text
                        x="0"
                        y="24"
                        textAnchor="middle"
                        fill="#fb923c"
                        fontSize="11"
                      >
                        ~82 MeV Kinetic
                      </text>
                    </g>

                    {/* 3 Prompt Neutrons Released (2 MeV Each) */}
                    <g transform="translate(250, 65)">
                      <circle
                        r="8"
                        fill="url(#fastNeutronGlow)"
                        stroke="#fef08a"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="25"
                        stroke="#fef08a"
                        strokeWidth="2"
                        strokeDasharray="4,2"
                      />
                      <text
                        x="0"
                        y="-12"
                        textAnchor="middle"
                        fill="#fef08a"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        n (2 MeV)
                      </text>
                    </g>
                    <g transform="translate(230, 235)">
                      <circle
                        r="8"
                        fill="url(#fastNeutronGlow)"
                        stroke="#fef08a"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="0"
                        y1="0"
                        x2="15"
                        y2="-20"
                        stroke="#fef08a"
                        strokeWidth="2"
                        strokeDasharray="4,2"
                      />
                      <text
                        x="0"
                        y="20"
                        textAnchor="middle"
                        fill="#fef08a"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        n (2 MeV)
                      </text>
                    </g>
                    <g transform="translate(275, 235)">
                      <circle
                        r="8"
                        fill="url(#fastNeutronGlow)"
                        stroke="#fef08a"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="0"
                        y1="0"
                        x2="-15"
                        y2="-20"
                        stroke="#fef08a"
                        strokeWidth="2"
                        strokeDasharray="4,2"
                      />
                      <text
                        x="0"
                        y="20"
                        textAnchor="middle"
                        fill="#fef08a"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        n (2 MeV)
                      </text>
                    </g>
                  </g>
                )}
              </svg>
            )}
          </div>

          {/* Atomic view step controls */}
          {viewMode === "atomic-split" && (
            <div className={styles.atomicTimeline}>
              <button
                type="button"
                className={`${styles.timelineStepButton} ${atomicStage === "approach" ? styles.timelineStepButtonActive : ""}`}
                onClick={() => handleAtomicStep("approach")}
              >
                1. Neutron Approach
              </button>
              <button
                type="button"
                className={`${styles.timelineStepButton} ${atomicStage === "capture" ? styles.timelineStepButtonActive : ""}`}
                onClick={() => handleAtomicStep("capture")}
              >
                2. ²³⁶U* Capture
              </button>
              <button
                type="button"
                className={`${styles.timelineStepButton} ${atomicStage === "necking" ? styles.timelineStepButtonActive : ""}`}
                onClick={() => handleAtomicStep("necking")}
              >
                3. Liquid Necking
              </button>
              <button
                type="button"
                className={`${styles.timelineStepButton} ${atomicStage === "scission" ? styles.timelineStepButtonActive : ""}`}
                onClick={() => handleAtomicStep("scission")}
              >
                4. Fission Split!
              </button>
            </div>
          )}

          <div className={styles.stageControls}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleFireNeutron}
            >
              <span>💥</span> Fire Source Neutron
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsAutoRunning(!isAutoRunning)}
            >
              {isAutoRunning ? "⏸ Pause Auto-Pulse" : "▶ Start Auto-Pulse"}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleReset}
            >
              🔄 Reset Chamber
            </button>
          </div>

          <div className={styles.statusExplainer}>
            <strong>Core Status:</strong> {physics.description}
          </div>
        </div>

        {/* Control Panel & Physics Sliders */}
        <div className={styles.controlPanelCard}>
          <h4 className={styles.controlPanelTitle}>
            ⚙️ Reactivity & Core Controls
          </h4>

          {/* Enrichment Slider */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>²³⁵U Fuel Enrichment</span>
              <span className={styles.sliderValue}>
                {config.enrichmentPercent.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="20.0"
              step="0.1"
              value={config.enrichmentPercent}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  enrichmentPercent: parseFloat(e.target.value),
                }))
              }
              className={styles.slider}
              aria-label="Uranium 235 Fuel Enrichment Percentage"
            />
            <p className={styles.sliderHint}>
              Commercial power reactors operate between 3% and 5% Low-Enriched
              Uranium (LEU).
            </p>
          </div>

          {/* Control Rods Slider */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>Control Rod Insertion</span>
              <span className={styles.sliderValue}>
                {config.controlRodInsertionPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={config.controlRodInsertionPercent}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  controlRodInsertionPercent: parseInt(e.target.value, 10),
                }))
              }
              className={styles.slider}
              aria-label="Control Rod Insertion Percentage"
            />
            <p className={styles.sliderHint}>
              Absorbs thermal neutrons via Ag-In-Cd or B₄C. 100% = full
              shutdown.
            </p>
          </div>

          {/* Moderator Density Slider */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>
                Light Water Moderator Density
              </span>
              <span className={styles.sliderValue}>
                {(config.moderatorDensity * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={config.moderatorDensity}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  moderatorDensity: parseFloat(e.target.value),
                }))
              }
              className={styles.slider}
              aria-label="Moderator Density Fraction"
            />
            <p className={styles.sliderHint}>
              Loss of water coolant reduces moderation, causing subcritical
              shutdown (inherent safety).
            </p>
          </div>

          {/* Boron Concentration Slider */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>
                Soluble Boron Chemical Shim
              </span>
              <span className={styles.sliderValue}>
                {config.boronConcentrationPpm} ppm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={config.boronConcentrationPpm}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  boronConcentrationPpm: parseInt(e.target.value, 10),
                }))
              }
              className={styles.slider}
              aria-label="Boron Concentration in parts per million"
            />
            <p className={styles.sliderHint}>
              Chemical shim dissolved in primary coolant for long-term fuel
              burnup reactivity compensation.
            </p>
          </div>

          {/* Real-time Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Multiplication (k_eff)</span>
              <span className={styles.metricValue}>
                {physics.keff.toFixed(4)}
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Reactivity ($)</span>
              <span className={styles.metricValue}>
                {physics.reactivityDollars.toFixed(2)} $
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Fission Events</span>
              <span className={styles.metricValue}>{fissionCount}</span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Energy Output</span>
              <span className={styles.metricValue}>
                {(
                  fissionCount *
                  FISSION_PHYSICS_CONSTANTS.ENERGY_PER_FISSION_MEV
                ).toLocaleString()}{" "}
                MeV
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabular Accessible View */}
      <div className={styles.accessibleTableWrapper}>
        <div className={styles.tableSummaryTitle}>
          Accessible Core State Summary Table
        </div>
        <table className={styles.accessibleTable}>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Current Setting / Value</th>
              <th>Reference Range</th>
              <th>Scientific Significance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Multiplication Factor (k_eff)</td>
              <td>{physics.keff.toFixed(4)}</td>
              <td>0.9500 – 1.0500</td>
              <td>Ratio of neutrons produced to neutrons absorbed + leaked</td>
            </tr>
            <tr>
              <td>Criticality State</td>
              <td>{physics.criticalityState}</td>
              <td>Subcritical / Critical / Supercritical</td>
              <td>
                Determines whether fission power is dropping, constant, or
                rising
              </td>
            </tr>
            <tr>
              <td>Fuel Enrichment</td>
              <td>{config.enrichmentPercent.toFixed(1)}%</td>
              <td>3.0% – 5.0% U-235</td>
              <td>Commercial Light Water Reactor LEU fuel specification</td>
            </tr>
            <tr>
              <td>Total Energy Harvested</td>
              <td>{energyJoules.toExponential(3)} Joules</td>
              <td>~3.204 × 10⁻¹¹ J / fission</td>
              <td>
                Direct conversion of mass defect to kinetic energy & radiation
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
