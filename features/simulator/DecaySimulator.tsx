"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import { useMotionPreferences } from "@/lib/accessibility/motion";
import {
  RADIOISOTOPES,
  generateDecayCurve,
  calculateRemainingFraction,
  simulateDiscreteDecay,
  type RadioisotopeInfo,
} from "@/lib/simulator/decay-model";
import styles from "./DecaySimulator.module.css";

const TOTAL_ATOMS = 100;

export function DecaySimulator() {
  const [complexity] = useComplexityPreference("curious");
  const { shouldAnimate } = useMotionPreferences();
  const [selectedIsotopeId, setSelectedIsotopeId] = useState("Cs-137");
  const [halfLivesElapsed, setHalfLivesElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [geigerPulse, setGeigerPulse] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.5);

  const playGeigerClick = useCallback(() => {
    if (!isAudioEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.012);
      gain.gain.setValueAtTime(audioVolume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    } catch {
      // AudioContext blocked by browser policy or unsupported in test env
    }
  }, [isAudioEnabled, audioVolume]);

  // Discrete state of the 100 atoms: true = parent (undecayed), false = daughter (decayed)
  const [atomStates, setAtomStates] = useState<boolean[]>(() =>
    Array(TOTAL_ATOMS).fill(true),
  );

  const isotope: RadioisotopeInfo =
    RADIOISOTOPES[selectedIsotopeId] ?? RADIOISOTOPES["Cs-137"];

  // Exponential decay curve points (0 to 5 half lives)
  const curvePoints = useMemo(() => {
    return generateDecayCurve(selectedIsotopeId, TOTAL_ATOMS, 5, 4);
  }, [selectedIsotopeId]);

  const remainingCount = useMemo(() => {
    return atomStates.filter(Boolean).length;
  }, [atomStates]);

  const decayedCount = TOTAL_ATOMS - remainingCount;

  // Geiger Counter Activity CPM (Counts Per Minute) calculation
  const cpmValue = useMemo(() => {
    const baseCpm = 950;
    const jitter =
      remainingCount > 0 ? ((remainingCount * 17 + 5) % 19) - 9 : 0;
    return Math.round(baseCpm * (remainingCount / TOTAL_ATOMS) + jitter);
  }, [remainingCount]);

  const microSvPerHour = useMemo(() => {
    // Approx conversion: 120 CPM ~ 1 uSv/h for typical Cs-137 calibration
    return Math.max(0.08, cpmValue / 120).toFixed(2);
  }, [cpmValue]);

  // Handle switching isotope
  const handleSelectIsotope = (id: string) => {
    setSelectedIsotopeId(id);
    setHalfLivesElapsed(0);
    setAtomStates(Array(TOTAL_ATOMS).fill(true));
    setIsPlaying(false);
  };

  // Reset sample back to 100% parent
  const handleReset = () => {
    setHalfLivesElapsed(0);
    setAtomStates(Array(TOTAL_ATOMS).fill(true));
    setIsPlaying(false);
  };

  // Advance by 1 discrete half-life
  const advanceHalfLife = useCallback(
    (deltaHalfLives: number = 1.0) => {
      setHalfLivesElapsed((prev) =>
        Math.min(10, Math.round((prev + deltaHalfLives) * 100) / 100),
      );

      // Flash Geiger LED pulse & audio click
      setGeigerPulse(true);
      playGeigerClick();
      setTimeout(() => setGeigerPulse(false), 200);

      setAtomStates((prev) => {
        const remainingIndices = prev
          .map((isParent, idx) => (isParent ? idx : -1))
          .filter((idx) => idx !== -1);

        if (remainingIndices.length === 0) return prev;

        const { newlyDecayed } = simulateDiscreteDecay(
          remainingIndices.length,
          deltaHalfLives,
        );

        // Randomly pick which atoms decay
        const shuffled = [...remainingIndices].sort(() => Math.random() - 0.5);
        const toDecay = new Set(shuffled.slice(0, newlyDecayed));

        return prev.map((isParent, idx) =>
          toDecay.has(idx) ? false : isParent,
        );
      });
    },
    [playGeigerClick],
  );

  // Automatic playback timer
  useEffect(() => {
    if (!isPlaying || !shouldAnimate) return;

    const intervalMs = playbackSpeed === 1 ? 1200 : 600;
    const timer = setInterval(() => {
      setHalfLivesElapsed((prev) => {
        if (prev >= 6.0) {
          setIsPlaying(false);
          return prev;
        }
        advanceHalfLife(0.5);
        return prev;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, advanceHalfLife, shouldAnimate]);

  // SVG Chart path calculation
  const chartPath = useMemo(() => {
    return curvePoints
      .map((p, idx) => {
        const x = 30 + (p.halfLives / 5) * 250;
        const y = 180 - p.fractionRemaining * 150;
        return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [curvePoints]);

  const currentMarkerX = 30 + (Math.min(5, halfLivesElapsed) / 5) * 250;
  const theoreticalFraction = calculateRemainingFraction(halfLivesElapsed);
  const currentMarkerY = 180 - theoreticalFraction * 150;

  // Real-world elapsed time display
  const totalElapsedRealTime = halfLivesElapsed * isotope.halfLifeTimeValue;
  const timeDisplay =
    totalElapsedRealTime >= 1000000
      ? `${(totalElapsedRealTime / 1000000).toFixed(1)} Million ${isotope.halfLifeUnit}`
      : `${totalElapsedRealTime.toFixed(totalElapsedRealTime < 10 ? 2 : 1)} ${isotope.halfLifeUnit}`;

  // Needle angle for analog Geiger dial: -50 deg (0 CPM) to +50 deg (1000 CPM)
  const needleAngle = useMemo(() => {
    const fraction = Math.min(1.0, Math.max(0.0, cpmValue / 1000));
    return -50 + fraction * 100;
  }, [cpmValue]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon} aria-hidden="true">
            ⏱
          </span>
          Radioactive Decay & Half-Life Simulator
        </h3>
        <p className={styles.description}>
          {complexity === "beginner"
            ? "Radioactive atoms decay naturally over time. Each 'half-life', exactly half of the remaining atoms transform into a stable daughter atom. Watch how 100 atoms shrink step by step!"
            : complexity === "geeky"
              ? "Empirical validation of Rutherford-Soddy exponential decay law: N(t) = N₀ · e^(-λt). Demonstrates stochastic Poisson disintegration across individual nuclei and the resulting macroscopic half-life invariance."
              : "Explore radioactive decay across key isotopes. Observe how random atomic disintegrations combine into a predictable exponential decay curve over successive half-lives."}
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
          <span className={styles.stageMeta}>
            Activity: {remainingCount}% of Initial ({cpmValue} CPM)
          </span>
        </div>

        {complexity === "beginner" && (
          <div>
            <div className={styles.levelBannerTitle}>
              🍪 The Vanishing Cookie Jar Metaphor
            </div>
            <p className={styles.levelBannerText}>
              Imagine you have a jar with 100 cookies, and every hour you eat
              exactly half of whatever cookies are left. After 1 hour, you have
              50 cookies. After 2 hours, you have 25 cookies. After 3 hours, you
              have 12 cookies. The jar never goes to zero in one big drop; it
              halves over and over. That&apos;s exactly how radioactive
              half-life works!
            </p>
          </div>
        )}

        {complexity === "explorer" && (
          <div>
            <div className={styles.levelBannerTitle}>
              🛡️ Short vs Long Half-Lives & Radiation Safety
            </div>
            <p className={styles.levelBannerText}>
              Isotopes with very short half-lives (like Iodine-131, 8 days)
              decay rapidly, releasing their energy intensely over days to weeks
              before becoming harmless Xenon. Isotopes with very long half-lives
              (like Uranium-235, 704 million years) decay so slowly that a
              sample in your hand emits only a tiny number of disintegrations
              per second.
            </p>
          </div>
        )}

        {complexity === "curious" && (
          <div>
            <div className={styles.levelBannerTitle}>
              ⚡ The Exponential Law & Nuclear Transmutation
            </div>
            <p className={styles.levelBannerText}>
              Radioactive decay follows N(t) = N₀ · e^(-λt) = N₀ · (1/2)^(t /
              t½). During decay, a nucleus undergoes transmutation: Cesium-137
              (55 protons) emits a beta-minus particle (β⁻ electron) and an
              antineutrino, turning a neutron into a proton to become
              Barium-137m (56 protons), which emits a 662 keV gamma ray to reach
              stable ground state.
            </p>
            <div className={styles.levelBannerFormula}>
              <span>
                ¹³⁷Cs (55p, 82n) → ¹³⁷ᵐBa (56p, 81n) + e⁻ + ν̄_e + γ (662 keV) |
                t½ = 30.08 years
              </span>
            </div>
          </div>
        )}

        {complexity === "deep-dive" && (
          <div>
            <div className={styles.levelBannerTitle}>
              📊 Decay Constant (λ) & Geiger-Müller Ionization Physics
            </div>
            <p className={styles.levelBannerText}>
              The fundamental rate constant is λ = ln(2) / t½. Sample activity
              A(t) = λ · N(t) is measured in Becquerels (1 Bq = 1 dps). The
              Geiger-Müller tube operates in the Geiger plateau (~900V): an
              incident particle ionizes argon gas, initiating a Townsend
              avalanche across the central anode wire that registers as a
              discrete electrical pulse (CPM).
            </p>
            <div className={styles.levelBannerFormula}>
              <span>
                A(t) = -dN/dt = λ N(t) | λ = ln(2)/T_1/2 | Specific Activity: a
                = λ · (N_A / M)
              </span>
            </div>
          </div>
        )}

        {complexity === "geeky" && (
          <div>
            <div className={styles.levelBannerTitle}>
              🔬 Bateman Equations, Secular Equilibrium & Quantum Tunneling
            </div>
            <p className={styles.levelBannerText}>
              {
                "Multi-nuclide decay chains obey the coupled differential Bateman equations: dN_i/dt = λ_(i-1) N_(i-1) - λ_i N_i. When a parent has a much longer half-life than its daughter (e.g. ⁹⁰Sr → ⁹⁰Y), the chain enters secular equilibrium where daughter activity matches parent activity (A_daughter = A_parent). Alpha decay rates obey the Gamow model of quantum barrier penetration through the Coulomb barrier."
              }
            </p>
            <div className={styles.levelBannerFormula}>
              <span>
                {
                  "dN_i/dt = λ_(i-1) N_(i-1) - λ_i N_i | Secular equilibrium: λ₁N₁ ≈ λ₂N₂ | P_tunnel = exp(-2G)"
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Isotope Selection Pills */}
      <div
        className={styles.isotopeBar}
        role="tablist"
        aria-label="Select Radioisotope"
      >
        {Object.values(RADIOISOTOPES).map((iso) => {
          const isActive = iso.id === selectedIsotopeId;
          return (
            <button
              key={iso.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.isotopePill} ${isActive ? styles.isotopePillActive : ""}`}
              onClick={() => handleSelectIsotope(iso.id)}
            >
              <span>{iso.symbol}</span>
              <span>{iso.name}</span>
              <small>({iso.halfLifeDisplay})</small>
            </button>
          );
        })}
      </div>

      <div className={styles.mainGrid}>
        {/* Atomic Lattice View */}
        <div className={styles.stageCard}>
          <div className={styles.stageHeader}>
            <h4 className={styles.stageTitle}>
              Sample Lattice (100 Atoms of {isotope.symbol})
            </h4>
            <span className={styles.stageMeta}>
              {remainingCount} Parent / {decayedCount} Daughter
            </span>
          </div>

          {/* Interactive Geiger-Müller Survey Meter Visual */}
          <div className={styles.geigerMeterCard}>
            <div className={styles.geigerDialContainer}>
              <svg
                className={styles.geigerSvg}
                viewBox="0 0 140 75"
                role="img"
                aria-label="Analog Geiger meter gauge"
              >
                <defs>
                  <linearGradient
                    id="meterDialGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="60%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                {/* Dial Arc Scale */}
                <path
                  d="M 20 65 A 50 50 0 0 1 120 65"
                  fill="none"
                  stroke="url(#meterDialGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Scale ticks */}
                {[0, 250, 500, 750, 1000].map((tick, i) => {
                  const angle = (-50 + (i / 4) * 100) * (Math.PI / 180);
                  const x1 = 70 + Math.sin(angle) * 44;
                  const y1 = 65 - Math.cos(angle) * 44;
                  const x2 = 70 + Math.sin(angle) * 52;
                  const y2 = 65 - Math.cos(angle) * 52;
                  return (
                    <line
                      key={`tick-${tick}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                    />
                  );
                })}
                {/* Needle pivoting from center bottom */}
                <g transform={`rotate(${needleAngle}, 70, 65)`}>
                  <line
                    x1="70"
                    y1="65"
                    x2="70"
                    y2="18"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="70" cy="65" r="4" fill="#cbd5e1" />
                </g>
                <text
                  x="70"
                  y="73"
                  fill="#94a3b8"
                  fontSize="8"
                  textAnchor="middle"
                >
                  CPM × 100
                </text>
              </svg>
            </div>

            <div className={styles.geigerDigitalReadout}>
              <span className={styles.geigerBrand}>ATOM-GM 2026 SURVEYOR</span>
              <span className={styles.geigerValue}>
                {cpmValue} <span className={styles.geigerUnit}>CPM</span>
              </span>
              <span className={styles.geigerUnit}>
                Rate: ~{microSvPerHour} μSv/h
              </span>
              <div className={styles.geigerIndicator}>
                <span
                  className={`${styles.geigerLed} ${geigerPulse ? styles.geigerLedActive : ""}`}
                />
                <span>{geigerPulse ? "DETECTION" : "MONITORING"}</span>
              </div>
            </div>

            <div className={styles.geigerAudioSection}>
              <button
                type="button"
                className={`${styles.audioToggleButton} ${isAudioEnabled ? styles.audioToggleActive : ""}`}
                onClick={() => setIsAudioEnabled((prev) => !prev)}
                aria-label={
                  isAudioEnabled
                    ? "Mute Geiger audio clicks"
                    : "Enable Geiger audio clicks"
                }
                aria-pressed={isAudioEnabled}
              >
                {isAudioEnabled ? "🔊 Audio On" : "🔇 Audio Muted"}
              </button>
              {isAudioEnabled && (
                <label className={styles.volumeSlider}>
                  <span className="sr-only">Geiger Clicker Volume</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={audioVolume}
                    onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                    aria-label="Geiger Clicker Volume"
                    className={styles.volumeSlider}
                  />
                </label>
              )}
            </div>
          </div>

          <div
            className={styles.latticeWrapper}
            role="img"
            aria-label={`100 atom lattice showing ${remainingCount} undecayed parent atoms and ${decayedCount} decayed daughter atoms`}
          >
            {atomStates.map((isParent, idx) => (
              <div
                key={`atom-${idx}`}
                className={`${styles.atomNode} ${
                  isParent ? styles.atomParent : styles.atomDaughter
                }`}
                style={{
                  background: isParent
                    ? `radial-gradient(circle at 35% 35%, #ffffff 0%, ${isotope.color} 50%, #7c2d12 100%)`
                    : undefined,
                  border: isParent ? `1px solid ${isotope.color}` : undefined,
                }}
                title={
                  isParent
                    ? `${isotope.name} (Parent)`
                    : `${isotope.daughterProduct}`
                }
              />
            ))}
          </div>

          <div className={styles.decayControls}>
            <button
              type="button"
              className={styles.stepButton}
              onClick={() => advanceHalfLife(1.0)}
            >
              <span>⏩</span> Advance 1 Half-Life (50%)
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? "⏸ Pause" : "▶ Play Real-Time"}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
            >
              Speed: {playbackSpeed}x
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleReset}
            >
              🔄 Reset Sample
            </button>
          </div>

          {/* Scientific Context Dossier */}
          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>
              {isotope.name} ({isotope.symbol}) — Scientific Dossier
            </div>
            <div>
              <strong>Decay Mode:</strong> {isotope.decayModeDisplay} →{" "}
              {isotope.daughterProduct}
            </div>
            <div>
              <strong>Primary Radiation:</strong> {isotope.primaryRadiation}
            </div>
            <div>
              <strong>Half-Life:</strong> {isotope.halfLifeDisplay} (λ ={" "}
              {(Math.LN2 / isotope.halfLifeSeconds).toExponential(3)} s⁻¹)
            </div>
            <p style={{ margin: "0.25rem 0 0 0" }}>{isotope.description}</p>
          </div>
        </div>

        {/* Exponential Curve & Metrics */}
        <div className={styles.curveCard}>
          <h4 className={styles.stageTitle}>
            Exponential Decay Curve (N / N₀)
          </h4>

          <div className={styles.chartSvgWrapper}>
            <svg
              className={styles.chartSvg}
              viewBox="0 0 320 200"
              role="img"
              aria-label="Exponential decay curve chart showing fraction remaining against half-lives"
            >
              {/* Axes and Grid Lines */}
              <line
                x1="30"
                y1="180"
                x2="290"
                y2="180"
                stroke="#334155"
                strokeWidth="1"
              />
              <line
                x1="30"
                y1="30"
                x2="30"
                y2="180"
                stroke="#334155"
                strokeWidth="1"
              />

              {/* 50%, 25%, 12.5% Grid Guidelines */}
              <line
                x1="30"
                y1="105"
                x2="290"
                y2="105"
                stroke="#1e293b"
                strokeDasharray="3 3"
              />
              <line
                x1="30"
                y1="142.5"
                x2="290"
                y2="142.5"
                stroke="#1e293b"
                strokeDasharray="3 3"
              />
              <text x="25" y="108" fill="#64748b" fontSize="8" textAnchor="end">
                50%
              </text>
              <text x="25" y="145" fill="#64748b" fontSize="8" textAnchor="end">
                25%
              </text>
              <text x="25" y="34" fill="#64748b" fontSize="8" textAnchor="end">
                100%
              </text>

              {/* X-axis tick marks for 1 to 5 half-lives */}
              {[1, 2, 3, 4, 5].map((hl) => {
                const tx = 30 + (hl / 5) * 250;
                return (
                  <g key={`tick-${hl}`}>
                    <line x1={tx} y1="180" x2={tx} y2="185" stroke="#64748b" />
                    <text
                      x={tx}
                      y="194"
                      fill="#94a3b8"
                      fontSize="8"
                      textAnchor="middle"
                    >
                      {hl} t½
                    </text>
                  </g>
                );
              })}

              {/* Theoretical Exponential Decay Curve */}
              <path
                d={chartPath}
                fill="none"
                stroke={isotope.color}
                strokeWidth="2.5"
                opacity="0.85"
              />

              {/* Current Position Marker */}
              <circle
                cx={currentMarkerX}
                cy={currentMarkerY}
                r="5"
                fill="#ffffff"
                stroke={isotope.color}
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Half-Lives Elapsed</span>
              <span className={styles.metricValue}>
                {halfLivesElapsed.toFixed(1)} t½
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Elapsed Time</span>
              <span className={styles.metricValue}>{timeDisplay}</span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>Sample Undecayed</span>
              <span className={styles.metricValue}>
                {((remainingCount / TOTAL_ATOMS) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Tabular Summary */}
      <div className={styles.accessibleTableWrapper}>
        <div className={styles.tableSummaryTitle}>
          Accessible Decay Milestone Table
        </div>
        <table className={styles.accessibleTable}>
          <thead>
            <tr>
              <th>Half-Life Period</th>
              <th>Theoretical Fraction</th>
              <th>Expected Atoms Remaining</th>
              <th>Actual Observed Sample</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0 t½ (Initial Start)</td>
              <td>100.0%</td>
              <td>100 / 100</td>
              <td>100 atoms</td>
            </tr>
            <tr>
              <td>1 t½ (1st Half-Life)</td>
              <td>50.0%</td>
              <td>50 / 100</td>
              <td>
                {halfLivesElapsed >= 1 ? `${remainingCount} atoms` : "Pending"}
              </td>
            </tr>
            <tr>
              <td>2 t½ (2nd Half-Life)</td>
              <td>25.0%</td>
              <td>25 / 100</td>
              <td>
                {halfLivesElapsed >= 2 ? `${remainingCount} atoms` : "Pending"}
              </td>
            </tr>
            <tr>
              <td>3 t½ (3rd Half-Life)</td>
              <td>12.5%</td>
              <td>12 / 100</td>
              <td>
                {halfLivesElapsed >= 3 ? `${remainingCount} atoms` : "Pending"}
              </td>
            </tr>
            <tr>
              <td>4 t½ (4th Half-Life)</td>
              <td>6.25%</td>
              <td>6 / 100</td>
              <td>
                {halfLivesElapsed >= 4 ? `${remainingCount} atoms` : "Pending"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
