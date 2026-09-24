"use client";
import Link from "next/link";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  COMPLEXITY_LEVELS,
  COMPLEXITY_LABELS,
} from "@/lib/preferences/complexity-preference";
import { EnergyJourney } from "@/features/exhibits/EnergyJourney";
import styles from "./OnboardingHero.module.css";
export function OnboardingHero() {
  const [level, setLevel] = useComplexityPreference("curious");
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          A little curiosity. A bigger perspective.
        </p>
        <h1 id="hero-heading">
          Small atoms.
          <br />
          <span>Big questions.</span>
        </h1>
        <p className={styles.subtitle}>
          Explore nuclear energy, try the science, and follow the evidence. From
          your first atom to the choices that shape our electricity.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/learn">
            Start exploring →
          </Link>
          <Link className={styles.secondary} href="/compare">
            Compare energy
          </Link>
        </div>
        <details className={styles.depth} id="reading-depth">
          <summary>Reading depth · {COMPLEXITY_LABELS[level]}</summary>
          <p>
            Choose how much detail you want. Your experiment stays the same.
          </p>
          <div className={styles.levels}>
            {COMPLEXITY_LEVELS.map((value, index) => (
              <button
                type="button"
                key={value}
                aria-pressed={level === value}
                onClick={() => setLevel(value)}
              >
                {index + 1}. {COMPLEXITY_LABELS[value]}
              </button>
            ))}
          </div>
        </details>
      </div>
      <EnergyJourney />
    </section>
  );
}
