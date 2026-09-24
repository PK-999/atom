"use client";
import { useCallback, useMemo, useState } from "react";
import {
  RADIOISOTOPES,
  calculateRemainingFraction,
} from "@/lib/simulator/decay-model";
import { sampleDecayPopulation } from "@/lib/exhibits/decay-population";
import { usePlayback } from "@/lib/exhibits/use-playback";
import { playCue } from "@/lib/audio/sound-controller";
import { ExhibitFrame } from "@/features/exhibits/ExhibitFrame";
import styles from "@/features/exhibits/ExhibitFrame.module.css";
export function DecaySimulator() {
  const [isotopeId, setIsotope] = useState("Cs-137"),
    [time, setTime] = useState(0),
    [seed, setSeed] = useState(42);
  const step = useCallback(() => {
    setTime((t) => Math.min(10, t + 1));
    playCue();
  }, []);
  const { target, playing, setPlaying, speed, setSpeed, prefersReducedMotion } =
    usePlayback(step, time === 10);
  const population = useMemo(
    () => sampleDecayPopulation(100, time, seed),
    [time, seed],
  );
  const observed = population.filter(Boolean).length;
  const isotope = RADIOISOTOPES[isotopeId];
  return (
    <div ref={target}>
      <ExhibitFrame
        title="Radioactive Decay & Half-Life Simulator"
        exhibit="decay"
        limitation="Seeded independent-decay model v1 with a sample of 100 parent atoms. The smooth expectation is N₀ × 2^(−t/T½). The sampled population fluctuates. Daughter decay chains, detector response, dose, biological effects and spent-fuel management are not modeled."
      >
        <p>
          Will exactly half of a small sample decay after one half-life? Compare
          one repeatable sample with the mathematical expectation.
        </p>
        <div className={styles.controls}>
          <label>
            Isotope
            <select
              value={isotopeId}
              onChange={(e) => {
                setIsotope(e.target.value);
                setTime(0);
                setPlaying(false);
              }}
            >
              {Object.values(RADIOISOTOPES).map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.symbol})
                </option>
              ))}
            </select>
          </label>
          <label>
            Sample seed
            <input
              type="number"
              min="1"
              max="9999"
              value={seed}
              onChange={(e) => {
                setSeed(
                  Math.max(
                    1,
                    Math.min(9999, Math.trunc(Number(e.target.value) || 1)),
                  ),
                );
                setTime(0);
                setPlaying(false);
              }}
            />
          </label>
        </div>
        <p>
          {isotope.name} · Half-life: {isotope.halfLifeDisplay}. Time here is
          measured in multiples of this isotope’s half-life.
        </p>
        <div className={styles.stage}>
          <svg
            viewBox="0 0 560 280"
            role="img"
            aria-label={`${observed} parent atoms remain; ${100 - observed} have decayed after ${time} half-lives.`}
          >
            {population.map((alive, index) => (
              <g key={index}>
                <circle
                  cx={28 + (index % 20) * 26}
                  cy={45 + Math.floor(index / 20) * 42}
                  r="8"
                  fill={alive ? "var(--atom-energy-nuclear)" : "none"}
                  stroke={
                    alive
                      ? "var(--atom-energy-nuclear)"
                      : "var(--atom-text-muted)"
                  }
                  strokeWidth="2"
                />
                {!alive && (
                  <path
                    d={`M${23 + (index % 20) * 26},${40 + Math.floor(index / 20) * 42}l10,10`}
                    stroke="var(--atom-text-muted)"
                  />
                )}
              </g>
            ))}
            <text x="24" y="260" fill="currentColor" fontSize="14">
              Filled: parent atom · Slashed ring: decayed atom
            </text>
          </svg>
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            disabled={prefersReducedMotion || time === 10}
            onClick={() => setPlaying(!playing)}
          >
            {playing && time < 10 ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            disabled={time === 10}
            onClick={() => {
              setPlaying(false);
              step();
            }}
          >
            Advance 1 Half-Life
          </button>
          <button
            type="button"
            onClick={() => {
              setTime(0);
              setPlaying(false);
            }}
          >
            Reset sample
          </button>
          <label>
            Speed
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value="0.5">0.5×</option>
              <option value="1">1×</option>
              <option value="2">2×</option>
            </select>
          </label>
        </div>
        <p aria-live="polite">
          <strong>
            {time.toFixed(1)} t½ · Observed: {observed} atoms · Expected:{" "}
            {(100 * calculateRemainingFraction(time)).toFixed(1)} atoms
          </strong>
        </p>
        <p>
          Expected values describe many repeated samples. Your sample uses seed{" "}
          {seed}; Reset repeats the same outcomes. Change the seed to try
          another sample.
        </p>
        {prefersReducedMotion && (
          <p>
            Reduced motion is on. Use Advance 1 Half-Life for manual
            exploration.
          </p>
        )}
        <details>
          <summary>Accessible Decay Milestone Table</summary>
          <table>
            <caption>
              Expected parent population, starting with 100 atoms
            </caption>
            <thead>
              <tr>
                <th>Half-lives</th>
                <th>Expected atoms</th>
                <th>Observed atoms</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5].map((t) => (
                <tr key={t}>
                  <th scope="row">{t} t½</th>
                  <td>{(100 * calculateRemainingFraction(t)).toFixed(2)}</td>
                  <td>
                    {sampleDecayPopulation(100, t, seed).filter(Boolean).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
        <p>
          <a href="/radiation">
            Explore radiation quantities and source context →
          </a>
        </p>
      </ExhibitFrame>
    </div>
  );
}
