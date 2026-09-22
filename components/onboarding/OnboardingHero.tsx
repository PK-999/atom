"use client";

import Link from "next/link";
import { useId } from "react";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  COMPLEXITY_LEVELS,
  COMPLEXITY_LABELS,
  type ComplexityLevel,
} from "@/lib/preferences/complexity-preference";
import styles from "./OnboardingHero.module.css";

interface LevelPreview {
  audience: string;
  topic: string;
  explanation: string;
}

const LEVEL_PREVIEWS: Record<ComplexityLevel, LevelPreview> = {
  beginner: {
    audience: "Kids & First-Time Learners",
    topic: "Concept: How Nuclear Energy Works",
    explanation:
      "Splitting an atom is like opening a tiny energy treasure chest! Inside each uranium pellet is enough clean power to light up your home for years without smoke or smog.",
  },
  explorer: {
    audience: "Curious Students & Everyday Readers",
    topic: "Concept: How Nuclear Energy Works",
    explanation:
      "Nuclear reactors use controlled chain reactions where neutrons split heavy uranium atoms, releasing heat that boils water into steam to spin a power turbine.",
  },
  curious: {
    audience: "Informed Citizens & Critical Thinkers",
    topic: "Concept: How Nuclear Energy Works",
    explanation:
      "Induced fission of U-235 releases ~200 MeV per atom. ATOM compares lifecycle emissions, land intensity, and historical safety records with peer-reviewed empirical evidence.",
  },
  "deep-dive": {
    audience: "Engineers & STEM Enthusiasts",
    topic: "Concept: How Nuclear Energy Works",
    explanation:
      "Thermal neutron absorption creates excited compound nuclei; prompt fission yields ~165 MeV kinetic fragment energy, with negative temperature reactivity coefficients ensuring passive stability.",
  },
  geeky: {
    audience: "Nuclear Researchers & Data Geeks",
    topic: "Concept: How Nuclear Energy Works",
    explanation:
      "Cross-section resonance integrals govern thermal utilization factor f; delayed neutron precursors (β_eff ≈ 0.0065) establish control margins against prompt supercritical kinetics.",
  },
};

export function OnboardingHero() {
  const [level, setLevel] = useComplexityPreference("curious");
  const sliderId = useId();

  const currentIndex = COMPLEXITY_LEVELS.indexOf(level);
  const currentPreview = LEVEL_PREVIEWS[level];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10) - 1;
    if (idx >= 0 && idx < COMPLEXITY_LEVELS.length) {
      setLevel(COMPLEXITY_LEVELS[idx]);
    }
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div
        className={styles.atomStage}
        aria-hidden="true"
        data-testid="atom-stage"
      >
        <svg className={styles.atomGraphic} viewBox="0 0 320 320">
          <defs>
            <radialGradient id="nucleus-glow">
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className={styles.field} cx="160" cy="160" r="118" />
          <g className={styles.orbitOne}>
            <ellipse
              className={styles.orbit}
              cx="160"
              cy="160"
              rx="116"
              ry="43"
            />
            <circle className={styles.electron} cx="276" cy="160" r="7" />
          </g>
          <g className={styles.orbitTwo}>
            <ellipse
              className={styles.orbit}
              cx="160"
              cy="160"
              rx="116"
              ry="43"
            />
            <circle className={styles.electronAlt} cx="44" cy="160" r="7" />
          </g>
          <g className={styles.orbitThree}>
            <ellipse
              className={styles.orbit}
              cx="160"
              cy="160"
              rx="116"
              ry="43"
            />
            <circle className={styles.electron} cx="276" cy="160" r="7" />
          </g>
          <circle className={styles.nucleusGlow} cx="160" cy="160" r="48" />
          <circle className={styles.proton} cx="148" cy="151" r="13" />
          <circle className={styles.neutron} cx="169" cy="145" r="13" />
          <circle className={styles.neutron} cx="151" cy="173" r="13" />
          <circle className={styles.proton} cx="174" cy="169" r="13" />
        </svg>
      </div>
      <div className={styles.badge}>
        <span aria-hidden="true">⚛</span>
        <span>Evidence-First Interactive Energy Platform</span>
      </div>

      <h1 id="hero-heading" className={styles.title}>
        Understand nuclear energy through{" "}
        <span className={styles.gradientText}>scientific evidence</span>.
      </h1>

      <p className={styles.subtitle}>
        ATOM does not ask you to trust us. ATOM provides the empirical data,
        peer-reviewed methodologies, and interactive models for you to form your
        own opinion.
      </p>

      {/* Interactive Level Slider Card */}
      <div id="reading-depth" className={styles.sliderCard}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>Choose Your Reading Depth</span>
          <span className={styles.currentLevelBadge}>
            Level {currentIndex + 1}: {COMPLEXITY_LABELS[level]}
          </span>
        </div>

        <div className={styles.sliderWrapper}>
          <label htmlFor={sliderId} className="sr-only">
            Complexity Level: {COMPLEXITY_LABELS[level]}
          </label>
          <input
            id={sliderId}
            type="range"
            min="1"
            max="5"
            step="1"
            value={currentIndex + 1}
            onChange={handleSliderChange}
            className={styles.rangeInput}
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={currentIndex + 1}
            aria-valuetext={COMPLEXITY_LABELS[level]}
          />
          <div className={styles.levelTicks}>
            {COMPLEXITY_LEVELS.map((lvl, idx) => (
              <button
                key={lvl}
                type="button"
                className={`${styles.levelTick} ${
                  lvl === level ? styles.levelTickActive : ""
                }`}
                onClick={() => setLevel(lvl)}
              >
                {idx + 1}. {COMPLEXITY_LABELS[lvl]}
              </button>
            ))}
          </div>
        </div>

        {/* Live Content Preview */}
        <div className={styles.previewBox}>
          <span className={styles.previewAudience}>
            Designed for: {currentPreview.audience}
          </span>
          <div className={styles.previewTopic}>{currentPreview.topic}</div>
          <p className={styles.previewText}>{currentPreview.explanation}</p>
        </div>

        {/* CTA Launchers */}
        <div className={styles.ctaWrapper}>
          <Link href="/explore" className={styles.primaryBtn}>
            <span>Enter ATOM as {COMPLEXITY_LABELS[level]}</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/compare" className={styles.secondaryBtn}>
            <span>Open Energy Comparison Lab</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
